const DOMParser = require('xmldom').DOMParser;
const xpath = require('xpath');
const crypto = require('crypto');
const canonicalize = require('./canonicalizer');

function addError(errorList, newError) {
  if (!errorList) {
    errorList = [];
  }
  if (newError) {
    errorList.push(newError);
  }
  return errorList;
}

function checkErrorsCanonicalizationMethodAlgorithm(signedInfoNode) {
  const canonicalizationMethod = signedInfoNode
      .getElementsByTagName('CanonicalizationMethod')[0];
  const canonicalizationMethodAlgorithm = canonicalizationMethod
      .getAttribute('Algorithm');
  if (canonicalizationMethodAlgorithm
      !== "http://www.w3.org/2001/10/xml-exc-c14n#") {
    return `Canonicalization Method Algorithm ${ canonicalizationMethodAlgorithm } is not supported.`;
  }
}

function checkErrorsSignatureMethodAlgorithm(signedInfoNode) {
  const signatureMethod = signedInfoNode
      .getElementsByTagName('SignatureMethod')[0];
  const signatureMethodAlgorithm = signatureMethod
      .getAttribute('Algorithm');
  if (signatureMethodAlgorithm
      !== "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256") {
    return `Signature Method Algorithm ${ signatureMethodAlgorithm } is not supported.`;
  }
}

async function verifyReferencedNode(referencedNode, ref) {
  let errors = [];
  let handledNode = referencedNode.cloneNode(true);
  handledNode.removeAttribute('id');
  handledNode.removeAttribute('Id');
  handledNode.removeAttribute('ID');
  const transformsNode = ref.getElementsByTagName('Transforms')[0];
  const transformNodes = transformsNode.getElementsByTagName('Transform');

  for (let transformsNode of Array.from(transformNodes)) {
    let transformAlgorithm = transformsNode.getAttribute('Algorithm');
    switch (transformAlgorithm) {
      case 'http://www.w3.org/2000/09/xmldsig#enveloped-signature':
        const signatureNode = handledNode.getElementsByTagName('Signature')[0];
        signatureNode.parentNode.removeChild(signatureNode);
        const sgntrNode = handledNode.getElementsByTagName('Sgntr')[0];
        while (sgntrNode.hasChildNodes()) {
          sgntrNode.removeChild(sgntrNode.firstChild);
        }
        break;
      case 'http://www.w3.org/2001/10/xml-exc-c14n#':
        handledNode = await canonicalize(handledNode);
        break;
      default:
        addError(errors,
            `Transform Algorithm ${ transformAlgorithm } is not supported`);
    }
  }

  let hash = crypto.createHash('SHA256');
  hash.update(handledNode);
  let referencedNodeDigest = hash.digest('base64');
  console.log(referencedNodeDigest);
}

module.exports = async function verifyXmlSignature(xml, certPem, keyPem,
    options) {
  let errors = [];
  let doc = new DOMParser().parseFromString(xml);

  const signatureNode = xpath.select1('//*[local-name(.)=\'Signature\']', doc);
  if (!signatureNode) {
    addError(errors, "Could not find 'Signature' node on the XML document");
    return;
  }
  const signedInfoNode = signatureNode.getElementsByTagName('SignedInfo')[0];
  if (!signedInfoNode) {
    addError(errors, "Could not find 'SignedInfo' node on the XML document");
    return;
  }

  errors = addError(errors,
      checkErrorsCanonicalizationMethodAlgorithm(signedInfoNode));
  errors = addError(errors,
      checkErrorsSignatureMethodAlgorithm(signedInfoNode));

  const references = signedInfoNode.getElementsByTagName('Reference');
  for (let ref of Array.from(references)) {
    const uri = ref.getAttribute('URI');
    console.info('Node for uri: ' + uri);
    const referencedNode = xpath.select1(
        `//*[@id=\'${ uri }\' or @Id=\'${ uri }\' or @ID=\'${ uri }\']`, doc);

    errors = addError(errors,
        await verifyReferencedNode(referencedNode, ref));
  }

  return errors;
};

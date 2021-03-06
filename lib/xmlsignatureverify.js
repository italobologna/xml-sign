const DOMParser = require('xmldom').DOMParser;
const xpath = require('xpath');
const crypto = require('crypto');
const canonicalize = require('./canonicalize');
const { removeNsIfNeeded, canonicalizeAndVerify } = require('./xmlcrypto');
const { getReferencedNode } = require('./reference');

function addError(errorList, newError) {
  if (!errorList) {
    errorList = [];
  }
  if (newError) {
    if (Array.isArray(newError)) {
      errorList.push(...newError);
    } else {
      errorList.push(newError);
    }
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
  let refNodeId;
  if (!refNodeId) {
    refNodeId = handledNode.getAttribute('id');
    handledNode.removeAttribute('id');
  }
  if (!refNodeId) {
    refNodeId = handledNode.getAttribute('Id');
    handledNode.removeAttribute('Id');
  }
  if (!refNodeId) {
    refNodeId = handledNode.getAttribute('ID');
    handledNode.removeAttribute('ID');
  }

  const transformsNode = ref.getElementsByTagName('Transforms')[0];
  const transformNodes = transformsNode.getElementsByTagName('Transform');

  for (let transformsNode of Array.from(transformNodes)) {
    let transformAlgorithm = transformsNode.getAttribute('Algorithm');
    switch (transformAlgorithm) {
      case 'http://www.w3.org/2000/09/xmldsig#enveloped-signature':
        const signatureNode = handledNode.getElementsByTagName('Signature')[0];
        signatureNode.parentNode.removeChild(signatureNode);
        // Erase white spaces if present on Sgntr node
        const sgntrNode = handledNode.getElementsByTagName('Sgntr')[0];
        if (sgntrNode) {
          while (sgntrNode.hasChildNodes()) {
            sgntrNode.removeChild(sgntrNode.firstChild);
          }
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

  handledNode = removeNsIfNeeded(referencedNode, handledNode);
  const calculatedNodeDigest = crypto.createHash('SHA256')
      .update(handledNode)
      .digest('base64');
  const refNodes = ref.getElementsByTagName('DigestValue');
  const refDigest = refNodes[0] && refNodes[0].childNodes ?
      refNodes[0].childNodes[0].toString() : '';
  if (refDigest.toString() !== calculatedNodeDigest.toString()) {
    addError(errors,
        `Calculated digest ${ calculatedNodeDigest } is different than present digest ${ refDigest } for node with id ${ refNodeId }`);
  }
  return errors;
}

module.exports = async function verifyXmlSignature(xml, certPem) {
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

  // Verifies digest for the references
  const references = signedInfoNode.getElementsByTagName('Reference');
  for (const ref of Array.from(references)) {
    const path = getReferencedNode(ref, signatureNode);
    const referencedNode = xpath.select1(path, doc);
    errors = addError(errors, await verifyReferencedNode(referencedNode, ref));
  }

  // Verifies the SignedInfo and the Signature Value
  const signatureValueNode = signatureNode.getElementsByTagName(
      'SignatureValue');
  const signatureValue =
      signatureValueNode.length && signatureValueNode[0].childNodes.length
          ? signatureValueNode[0].childNodes[0].toString() : '';
  const signatureVerification = await canonicalizeAndVerify(signedInfoNode,
      signatureValue, certPem);
  if (!signatureVerification) {
    errors = addError(errors,
        'Signature for the \'SignedInfo\' node does not match');
  }

  return errors;
};

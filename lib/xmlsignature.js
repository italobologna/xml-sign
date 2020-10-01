const DOMParser = require('xmldom').DOMParser;
const XMLSerializer = require('xmldom').XMLSerializer;
const xpath = require('xpath');
const { generateReference } = require('./reference');
const { generateTransformsList } = require('./transforms');
const SignatureNode = require('./signaturenode');

module.exports = async function signXml(xml, certPem, keyPem, options) {
  try {
    // Transform the XMl into a document object
    let doc = new DOMParser().parseFromString(xml);

    // Node to add the signature information
    const signatureLocation = options.signatureLocation;
    const nodeToAddSignature = xpath.select1(signatureLocation, doc);
    const signatureNode = new SignatureNode(certPem, keyPem);

    for (const location of options.elementsToSign) {
      console.info(`Working on the node: ${ location }`);
      let nodeToSign = xpath.select1(location, doc);
      if (!nodeToSign) {
        console.warn(`Could not find ${ location } to sign on the xml`);
        return;
      }

      let reference = generateReference(nodeToSign, location);
      let transforms = generateTransformsList(nodeToSign, location);
      await signatureNode.signNode(reference.uri, nodeToSign, transforms);
      if (reference?.id && !nodeToSign.getAttribute('id')) {
        nodeToSign.setAttribute('id', reference.id);
      }
    }

    nodeToAddSignature.appendChild(await signatureNode.getNode());
    return new XMLSerializer().serializeToString(doc);
  } catch (e) {
    console.error(e);
  }
};

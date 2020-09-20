const DOMParser = require('xmldom').DOMParser;
const XMLSerializer = require('xmldom').XMLSerializer;
const xpath = require('xpath');
const SignatureNode = require("./src/main/signaturenode");
const uuid = require('uuid');
const canonicalizeAndHash = require('./src/main/canonicalizeandhash');

async function signXml(xml, cert, options) {
  try {

    // Transform the XMl into a document object
    let doc = new DOMParser().parseFromString(xml);

    // Node to add the signature information
    const signatureLocation = options.signatureLocation;
    const nodeToAddSignature = xpath.select1(signatureLocation, doc);
    const signatureNode = new SignatureNode(cert);

    // Gets the specified value from the object
    for (const location of options.elementsToSign) {
      console.info(`Working on the node: ${ location }`);
      let nodeToSign = xpath.select1(location, doc);
      if (!nodeToSign) {
        console.warn(`Could not find ${ location } to sign on the xml`);
        return;
      }

      let digest = await canonicalizeAndHash(nodeToSign);

      let reference;
      let attributeNodeId = nodeToSign.getAttribute('id');
      if (location === signatureLocation) {
        reference = '';
      } else if (attributeNodeId) {
        reference = attributeNodeId
      } else {
        reference = uuid.v4();
        nodeToSign.setAttribute('id', reference);
      }
      signatureNode.addReference(reference, digest);
    }

    nodeToAddSignature.appendChild(await signatureNode.getNode())
    return new XMLSerializer().serializeToString(doc);
  } catch (e) {
    console.error(e);
  }
}

module.exports = signXml;
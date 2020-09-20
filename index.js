const DOMParser = require('xmldom').DOMParser;
const XMLSerializer = require('xmldom').XMLSerializer;
const xpath = require('xpath');
const canonicalize = require('./src/main/canonicalizer');
const crypto = require('crypto');
const SignatureNode = require("./src/main/signaturenode");

async function signXml(xml, options) {
  try {

    // Transform the XMl into a document object
    let doc = new DOMParser().parseFromString(xml);

    // Node to add the signature information
    const signatureLocation = options.signatureLocation;
    const nodeToAddSignature = xpath.select1(signatureLocation, doc);
    const signatureNode = new SignatureNode();

    // Gets the specified value from the object
    for (const location of options.elementsToSign) {
      console.info(`Working on the node: ${ location }`);
      let nodeToSign = xpath.select1(location, doc);
      if (!nodeToSign) {
        console.warn(`Could not find ${ location } to sign on the xml`);
        return;
      }

      let canonicalizedNode = await canonicalize(nodeToSign);
      let hash = crypto.createHash('SHA256');
      hash.update(canonicalizedNode);
      let digest = hash.digest('base64');
      let reference = location === signatureLocation ? '' : 'xpto'
      signatureNode.addReference(reference, digest);
    }
    nodeToAddSignature.appendChild(signatureNode.getNode())
    return new XMLSerializer().serializeToString(doc);
  } catch (e) {
    console.error(e);
  }
}

module.exports = signXml;
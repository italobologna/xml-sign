const DOMParser = require('xmldom').DOMParser;
const getCertificateData = require("./getcertificatedata");
const createKeyInfoNode = require("./keyinfo");
const canonicalizeAndHash = require("./xmlcrypto").canonicalizeAndHash;
const canonicalizeAndSign = require("./xmlcrypto").canonicalizeAndSign;
const { transform } = require('./constants');

module.exports = class SignatureNode {
  constructor(certPem, keyPem, signatureNameSpaceInfo,
      canonicalizationMethodInfo, signatureMethodInfo) {
    this.signatureNameSpace = signatureNameSpaceInfo
        || "http://www.w3.org/2000/09/xmldsig#";
    this.canonicalizationMethod = canonicalizationMethodInfo
        || "http://www.w3.org/2001/10/xml-exc-c14n#";
    this.signatureMethod = signatureMethodInfo
        || "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256";

    this.references = [];
    this.keyInfoData = getCertificateData(certPem);
    this.keyPem = keyPem;
  }

  async signNode(ref, node, transforms) {
    let digest;
    for (const t of transforms) {
      if (t === transform.c14n) {
        digest = await canonicalizeAndHash(node);
      }
    }
    this.addReference(ref, digest, transforms);
  }

  addReference(ref, digest, transforms) {
    this.references.push([ref, digest, transforms]);
  }

  async getNode() {
    let domParser = new DOMParser();

    // @formatter:off
    let keyInfoNodeString = createKeyInfoNode(this.keyInfoData.keyId,
        this.keyInfoData.issuerName, this.keyInfoData.serialNumber);

    let keyInfoNode = domParser.parseFromString(keyInfoNodeString);
    let keyInfoDigest = await canonicalizeAndHash(keyInfoNode);
    this.addReference(this.keyInfoData.keyId, keyInfoDigest);

    let signatureNodeString =
        `<Signature xmlns="${ this.signatureNameSpace }">` +
          `<SignedInfo>` +
            `<CanonicalizationMethod Algorithm="${ this.canonicalizationMethod }"/>` +
            `<SignatureMethod Algorithm="${ this.signatureMethod }"/>` +
            `${ getReferencesNode(this.references) }` +
          `</SignedInfo>` +
          // `<SignatureValue/>` +
          // `${ keyInfoNodeString }` +
        `</Signature>`
    // @formatter:on

    // Generates the signature node
    let signatureNode = domParser
        .parseFromString(signatureNodeString,"text/xml");

    // Adds the key info node to the signature
    let signatureNodeToAddChildren = signatureNode.getElementsByTagName('Signature')[0];
    signatureNodeToAddChildren.appendChild(keyInfoNode);

    // Signs the SignedInfoNode
    let signedInfoNode = signatureNode.getElementsByTagName('SignedInfo')[0];
    let signatureValue = await canonicalizeAndSign(signedInfoNode,
        this.keyPem);

    let signatureValueElement = signatureNode.createElement('SignatureValue');
    let signatureValueNode = signatureNode.createTextNode(signatureValue);
    signatureValueElement.appendChild(signatureValueNode);
    signatureNodeToAddChildren.appendChild(signatureValueElement);

    return signatureNode;
  }
};

function getReferencesNode(references) {
  if (!Array.isArray(references) || !references.length) {
    return '';
  }

  return references.map(params => createReferenceNode(params)).join('');
}

function createReferenceNode([reference, digest, transformsInfo],
    transformAlgorithmInfo, digestMethodAlgorithmInfo) {
  let uriAttribute = reference !== undefined ? ` URI="${ reference }"` : '';
  let transforms = transformsInfo;
  if (!Array.isArray(transforms) || !transforms.length) {
    transforms = [transform.c14n];
  }
  let digestMethodAlgorithm = digestMethodAlgorithmInfo
      || 'http://www.w3.org/2001/04/xmlenc#sha256';

  // @formatter:off
  return `<Reference ${ uriAttribute }>` +
            `<Transforms>` +
              createTransformsList(transforms) +
            `</Transforms>` +
            `<DigestMethod Algorithm="${ digestMethodAlgorithm }"/>` +
            `<DigestValue>${ digest }</DigestValue>` +
          `</Reference>`;
  // @formatter:on
}

function createTransformsList(transformAlgorithms) {
  return transformAlgorithms
      .map(transformAlgorithm =>
          `<Transform Algorithm="${ transformAlgorithm }"/>`)
      .join("");
}
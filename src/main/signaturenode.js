const DOMParser = require('xmldom').DOMParser;

module.exports = class SignatureNode {
  constructor(signatureNameSpaceInfo, canonicalizationMethodInfo,
      signatureMethodInfo) {
    this.signatureNameSpace = signatureNameSpaceInfo
        || "http://www.w3.org/2000/09/xmldsig#";
    this.canonicalizationMethod = canonicalizationMethodInfo
        || "http://www.w3.org/2001/10/xml-exc-c14n#";
    this.signatureMethod = signatureMethodInfo
        || "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256";

    this.references = [];
  }

  addReference(ref, digest) {
    this.references.push([ref, digest]);
  }

  getNode() {
    let signatureValue = "";
    // @formatter:off
    let signatureNodeString =
        `<Signature xmlns="${ this.signatureNameSpace }">` +
          `<SignedInfo>` +
            `<CanonicalizationMethod Algorithm="${ this.canonicalizationMethod }"/>` +
            `<SignatureMethod Algorithm="${ this.signatureMethod }"/>` +
            `${ getReferencesNode(this.references) }` +
          `</SignedInfo>` +
          `<SignatureValue>${ signatureValue }</SignatureValue>` +
        `</Signature>`
    // @formatter:on
    return new DOMParser().parseFromString(signatureNodeString, "text/xml");
  }
};

function getReferencesNode(references) {
  if (!Array.isArray(references) || !references.length) {
    return '';
  }

  return references.map(params => createReferenceNode(params)).join('');
}

function createReferenceNode([reference, digest],
    transformAlgorithmInfo, digestMethodAlgorithmInfo) {
  let uriAttribute = reference !== undefined ? ` URI="${ reference }"` : '';
  let transformAlgorithm = transformAlgorithmInfo
      || 'http://www.w3.org/2000/09/xmldsig#enveloped-signature';
  let digestMethodAlgorithm = digestMethodAlgorithmInfo
      || 'http://www.w3.org/2001/04/xmlenc#sha256';

  // @formatter:off
  return `<Reference ${ uriAttribute }>` +
            `<Transforms>` +
              `<Transform Algorithm="${ transformAlgorithm }"/>` +
            `</Transforms>` +
            `<DigestMethod Algorithm="${ digestMethodAlgorithm }"/>` +
            `<DigestValue>${ digest }</DigestValue>` +
          `</Reference>`;
  // @formatter:on
}
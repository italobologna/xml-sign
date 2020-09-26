const uuid = require('uuid');

const PATH_APPHDR = '//*[local-name(.)=\'AppHdr\']';
const DOCUMENT_PATH = '//*[local-name(.)=\'Document\']';
const generateReferenceObj = (uri, id) => {
  return { uri, id };
};

module.exports.generateReference = function (nodeToSign, location) {
  if (location === PATH_APPHDR) {
    return generateReferenceObj('', null);
  } else if (location === DOCUMENT_PATH) {
    return generateReferenceObj(null, null);
  } else {
    let reference;
    let attributeNodeId = nodeToSign.getAttribute('id');
    if (attributeNodeId) {
      reference = attributeNodeId;
    } else {
      reference = uuid.v4();
    }

    return generateReferenceObj(reference, reference);
  }
};

module.exports.getReferencedNode = function (referenceNode) {
  if (!referenceNode.hasAttribute('URI')) {
    return DOCUMENT_PATH;
  }
  const uri = referenceNode.getAttribute('URI');
  if (uri === '') {
    return PATH_APPHDR;
  } else {
    return `//*[@id=\'${ uri }\' or @Id=\'${ uri }\' or @ID=\'${ uri }\']`;
  }
};

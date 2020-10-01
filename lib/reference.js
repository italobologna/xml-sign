const uuid = require('uuid');

const PATH_APPHDR = '//*[local-name(.)=\'AppHdr\']';
const DOCUMENT_PATH = '//*[local-name(.)=\'Document\']';
const ROOT_PATH = '/*';
const generateReferenceObj = (uri, id) => {
  return { uri, id };
};

module.exports.generateReference = function (nodeToSign, location) {
  if (location === PATH_APPHDR || location === ROOT_PATH) {
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

module.exports.getReferencedNode = function (referenceNode, signatureNode) {
  if (!referenceNode.hasAttribute('URI')) {
    return DOCUMENT_PATH;
  }
  const uri = referenceNode.getAttribute('URI');
  if (uri === '') {
    let referencedNode = signatureNode.parentNode;
    if (referencedNode.parentNode && referencedNode.parentNode.tagName) {
      referencedNode = referencedNode.parentNode;
    }
    return `//*[local-name(.)='${ referencedNode.tagName }']`;
  } else {
    return `//*[@id=\'${ uri }\' or @Id=\'${ uri }\' or @ID=\'${ uri }\']`;
  }
};

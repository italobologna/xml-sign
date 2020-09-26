const transformFunctions = {
  c14n: 'http://www.w3.org/2001/10/xml-exc-c14n#',
  envelopedSignature: 'http://www.w3.org/2000/09/xmldsig#enveloped-signature'
};

module.exports.transform = transformFunctions;

module.exports.generateTransformsList = function
    generateTransformsList(nodeToSign, location) {
  if (location === '//*[local-name(.)=\'AppHdr\']') {
    return [
      transformFunctions.envelopedSignature,
      transformFunctions.c14n
    ];
  }
  return [
      transformFunctions.c14n
  ];
};
const signXml = require('./lib/xmlsignature')
const verifyXml = require('./lib/xmlsignatureverify')

module.exports.signXml = signXml;
module.exports.verifyXml = verifyXml;
module.exports.signIso = (xml, certPem, keyPem) => signXml(xml, certPem, keyPem, {
  signatureLocation: '//*[local-name(.)=\'Sgntr\']',
  elementsToSign: [
    '//*[local-name(.)=\'AppHdr\']',
    '//*[local-name(.)=\'Document\']'
  ]
});
module.exports.verifyIso = (xml, certPem) => verifyXml(xml, certPem);
module.exports.signDict = (xml, certPem, keyPem) => signXml(xml, certPem, keyPem, {
  signatureLocation: '//*[local-name(.)=\'Sgntr\']',
  elementsToSign: [
    '//*[local-name(.)=\'Document\']'
  ]
});
module.exports.verifyDict = (xml, certPem) => verifyXml(xml, certPem);

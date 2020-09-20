const pki = require('node-forge').pki;

function getCertificateData(certPem) {
  const cert = pki.certificateFromPem(certPem);
  const issuerName = cert.subject.attributes
      .map(attr => [attr.shortName, attr.value].join('='))
      .join(', ');
  const keyId = cert.extensions.filter(
      ext => ext.name === 'subjectKeyIdentifier').map(
      ext => ext.subjectKeyIdentifier)[0];
  const serialNumber = cert.serialNumber;
  return {
    keyId,
    issuerName,
    serialNumber
  }
}

module.exports = getCertificateData;
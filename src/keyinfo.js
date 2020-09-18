function createKeyInfo(keyId, issuerName, hexSerialNumber) {
  //x509.readCertPEM(certString);
  //O id de KeyInfo deve ser x509.getExtAuthorityKeyIdentifier().kid.hex

  // @formatter:off
  return `<KeyInfo Id=${ keyId }><X509Data><X509IssuerSerial><X509IssuerName>${ issuerName }</X509IssuerName><X509SerialNumber>${ hexSerialNumber }</X509SerialNumber></X509IssuerSerial></X509Data></KeyInfo>`;
  // @formatter:on
}

module.exports = createKeyInfo;
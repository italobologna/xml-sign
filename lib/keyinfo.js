module.exports = function createKeyInfo(issuerName, hexSerialNumber) {
  return `<KeyInfo>` +
        `<X509Data>` +
          `<X509IssuerSerial>` +
            `<X509IssuerName>${ issuerName }</X509IssuerName>` +
            `<X509SerialNumber>${ hexSerialNumber }</X509SerialNumber>` +
          `</X509IssuerSerial>` +
        `</X509Data>` +
      `</KeyInfo>`;
}
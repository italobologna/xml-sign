const assert = require('assert');
const fs = require('fs');
const createKeyInfo = require("../../lib/getcertificatedata");

describe('test extract information from certificate', function () {

  let cert = fs.readFileSync('./test/resources/cert.pem').toString();

  it('can generate information for the key info tag', function () {
    let extractedInformation = createKeyInfo(cert);
    assert.deepStrictEqual(extractedInformation.issuerName, 'C=BR, ST=SP, L=Sao Paulo, O=UL, OU=UL, CN=SPI - Banco Central do Brasil, E=email@email.com');
    assert.deepStrictEqual(extractedInformation.keyId, '6d47973eeda325341810305855d6f96dc373fb4f');
    assert.deepStrictEqual(extractedInformation.serialNumber, '2904e64229c8ccbea34e723b84026e2c9a0e0ec6');
  });
});

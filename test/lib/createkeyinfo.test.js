const assert = require('assert');
const fs = require('fs');
const createKeyInfo = require("../../lib/getcertificatedata");

describe('test extract information from certificate', function () {

  let cert = fs.readFileSync('./test/resources/cert.pem').toString();

  it('can generate information for the key info tag', function () {
    let extractedInformation = createKeyInfo(cert);
    assert.deepStrictEqual(extractedInformation.issuerName, 'C=BR, ST=SAOPAULO, L=Osasco, O=Avengers, OU=PTT, CN=Italo, E=email@email.com');
    assert.deepStrictEqual(extractedInformation.keyId, '4e5b2c37cf49b836a3d21077247e27862f9db380');
    assert.deepStrictEqual(extractedInformation.serialNumber, '6e31836d5e322ae0b6c9e053720e5b85addf8928');
  });
});

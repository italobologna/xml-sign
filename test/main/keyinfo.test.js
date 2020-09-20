const keyInfo = require('../../src/main/keyinfo');
const assert = require('assert');

describe('key info tag generation tests', function () {

  const keyId = 'a1';
  const issuerName = 'issuerName'
  const hexSerialNumber = '0123456789ABCDEFFEDCBA9876543210'

  it('Should generate the proper key info with information', function () {
    let res = keyInfo(keyId, issuerName, hexSerialNumber);
    console.log(res);
    assert.deepStrictEqual(res,
        `<KeyInfo Id=${ keyId }><X509Data><X509IssuerSerial><X509IssuerName>${ issuerName }</X509IssuerName><X509SerialNumber>${ hexSerialNumber }</X509SerialNumber></X509IssuerSerial></X509Data></KeyInfo>`);
  });
});

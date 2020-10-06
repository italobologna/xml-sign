const keyInfo = require('../../lib/keyinfo');
const assert = require('assert');

describe('key info tag generation tests', function () {

  const issuerName = 'issuerName'
  const hexSerialNumber = '0123456789ABCDEFFEDCBA9876543210'

  it('Should generate the proper key info with information', function () {
    let res = keyInfo(issuerName, hexSerialNumber);
    assert.deepStrictEqual(res,
        `<KeyInfo><X509Data><X509IssuerSerial><X509IssuerName>${ issuerName }</X509IssuerName><X509SerialNumber>${ hexSerialNumber }</X509SerialNumber></X509IssuerSerial></X509Data></KeyInfo>`);
  });
});

const { signIso, verifyIso, signDict, verifyDict } = require('../index');
const fs = require('fs');
const assert = require('assert');

describe('Index Functions', function () {

  let xml = fs.readFileSync('./test/resources/toSign.xml').toString();
  let certPem = fs.readFileSync('./test/resources/cert.pem').toString();
  let keyPem = fs.readFileSync('./test/resources/private-key.pem').toString();

  it('Given the sign iso call, '
      + 'can sign the XML function as ISO20022', async function () {
    let expected = fs.readFileSync(
        './test/resources/expectedSignatureIso.xml').toString();
    let res = await signIso(xml, certPem, keyPem);
    assert.deepStrictEqual(expected, res);
  });

  it('Given the verify iso call, '
      + 'can verify the XML function as ISO20022', async function () {
    let res = await verifyIso(xml, certPem);
    assert.deepStrictEqual(0, res.length);
  });

  it('Given the sign DICT call, '
      + 'can sign the XML function as DICT specification', async function () {
    let expected = fs.readFileSync(
        './test/resources/expectedSignatureIso.xml').toString();
    let res = await signDict(xml, certPem, keyPem);
    assert.deepStrictEqual(expected, res);
  });

  it('Given the verify DICT call, '
      + 'can verify the XML function as DICT specification', async function () {
    let res = await verifyDict(xml, certPem);
    assert.deepStrictEqual(0, res.length);
  });
});
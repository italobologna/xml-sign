const fs = require('fs');
const assert = require('assert');
const { signIso, verifyIso, signDict, verifyDict } = require('../index');

describe('Index Functions', function () {

  let certPem = fs.readFileSync('./test/resources/cert.pem').toString();
  let keyPem = fs.readFileSync('./test/resources/private-key.pem').toString();

  it('Given the sign iso call, '
      + 'can sign the XML function as ISO20022', async function () {
    let xmlIso = fs.readFileSync('./test/resources/toSign.xml').toString();
    let res = await signIso(xmlIso, certPem, keyPem);

    let expected = fs.readFileSync(
        './test/resources/expectedSignatureIso.xml').toString();
    assert.deepStrictEqual(expected, res);
  });

  it('Given the verify iso call, '
      + 'can verify the XML function as ISO20022', async function () {
    let signedIso = fs.readFileSync('./test/resources/signedIso.xml').toString();

    let res = await verifyIso(signedIso, certPem);

    assert.deepStrictEqual(0, res.length);
  });

  it('Given the sign DICT call, '
      + 'can sign the XML function as DICT specification', async function () {
    let xmlDict = fs.readFileSync('./test/resources/CreateEntryRequest.xml').toString();

    let res = await signDict(xmlDict, certPem, keyPem);

    let expected = fs.readFileSync(
        './test/resources/CreateEntryRequestSigned.xml').toString();
    assert.deepStrictEqual(expected, res);
  });

  it('Given the verify DICT call, '
      + 'can verify the XML function as DICT specification', async function () {
    let signedDict = fs.readFileSync('./test/resources/CreateEntryRequestSigned.xml').toString();

    let res = await verifyDict(signedDict, certPem);

    assert.deepStrictEqual(0, res.length);
  });
});
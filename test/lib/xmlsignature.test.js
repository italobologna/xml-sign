const fs = require('fs');
const assert = require('assert');
const signXml = require('../../lib/xmlsignature');

describe('XML Signature', function () {

  let xml = fs.readFileSync('./test/resources/toSign.xml').toString();
  let certPem = fs.readFileSync('./test/resources/cert.pem').toString();
  let keyPem = fs.readFileSync('./test/resources/private-key.pem').toString();

  it('Given the method parameters, '
      + 'can sign the XML successfully', async function () {
    const res = await signXml(xml, certPem, keyPem, {
      signatureLocation: '//*[local-name(.)=\'Sgntr\']',
      elementsToSign: [
        '//*[local-name(.)=\'AppHdr\']',
        '//*[local-name(.)=\'Document\']'
      ]
    });

    let expected = fs
        .readFileSync('./test/resources/expectedSignatureIso.xml')
        .toString().replace(/[\r\n]+/g,"\n");
    assert.deepStrictEqual(res.replace(/[\r\n]+/g,"\n"), expected);
  });
});

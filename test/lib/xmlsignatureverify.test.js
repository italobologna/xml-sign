const verify = require('../../lib/xmlsignatureverify');
const fs = require('fs');
const assert = require("assert");

describe('XML Signature Verification', function () {

  let xml = fs.readFileSync('./test/resources/signed.xml').toString();
  let certPem = fs.readFileSync('./test/resources/cert.pem').toString();
  let keyPem = fs.readFileSync('./test/resources/private-key.pem').toString();

  it('Given the method parameters, can sign the XML successfully',
      async function () {
        let res = await verify(xml, certPem, keyPem, {
          signatureLocation: '//*[local-name(.)=\'Sgntr\']',
          elementsToSign: [
            '//*[local-name(.)=\'AppHdr\']',
            '//*[local-name(.)=\'Document\']'
          ]
        })
        assert.deepStrictEqual(0, res.length)
        console.log(res);
      });
});

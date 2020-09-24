const signXml = require('../../lib/xmlsignature');
const fs = require('fs');

describe('XML Signature', function () {

  let xml = fs.readFileSync('./test/resources/toSign.xml').toString();
  let certPem = fs.readFileSync('./test/resources/cert.pem').toString();
  let keyPem = fs.readFileSync('./test/resources/private-key.pem').toString();

  it('Given the method parameters, can sign the XML successfully',
      async function () {
        let res = await signXml(xml, certPem, keyPem, {
          signatureLocation: '//*[local-name(.)=\'Sgntr\']',
          elementsToSign: [
            '//*[local-name(.)=\'AppHdr\']',
            '//*[local-name(.)=\'Document\']'
          ]
        });
        if (res) fs.writeFileSync('./signed.xml', res);
      });
});

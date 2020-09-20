const signXml = require('../../index');
const fs = require('fs');

describe('Testing', function () {

  let xml = fs.readFileSync('./test/resources/pacs008.xml').toString();
  let cert = fs.readFileSync('./test/resources/cert.pem').toString();

  it('Can do things', async function () {
    let res = await signXml(xml, cert, {
      signatureLocation: '//*[local-name(.)=\'Sgntr\']',
      elementsToSign: [
        '//*[local-name(.)=\'AppHdr\']',
        '//*[local-name(.)=\'Document\']'
      ]
    });
    fs.writeFileSync('./signed.xml', res);
  });
});

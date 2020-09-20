const signXml = require('../../index');
const fs = require('fs');

describe('Testing', function () {

  let xml = fs.readFileSync('./test/resources/pacs008.xml').toString();

  it('Can do things', async function () {
    let res = await signXml(xml, {
      signatureLocation: '//*[local-name(.)=\'AppHdr\']',
      elementsToSign: [
        '//*[local-name(.)=\'AppHdr\']',
        '//*[local-name(.)=\'Document\']'
      ]
    });
    console.log(res);
    fs.writeFileSync('./signed.xml', res);
  });
});

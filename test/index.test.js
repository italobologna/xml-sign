const signXml = require('./../index');
const fs = require('fs');

describe('Testing', function () {

  let xml = fs.readFileSync('./test/resources/pacs008.xml').toString();

  it('Can do things', function () {
    console.log(xml);
    console.log(signXml());
  });
});




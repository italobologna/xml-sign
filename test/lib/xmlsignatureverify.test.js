const verify = require('../../lib/xmlsignatureverify');
const fs = require('fs');
const assert = require("assert");

describe('XML Signature Verification', function () {

  let xml = fs.readFileSync('./test/resources/signed.xml').toString();
  let certPem = fs.readFileSync('./test/resources/cert.pem').toString();

  it('Given the method parameters, can sign the XML successfully',
      async function () {
        let res = await verify(xml, certPem);
        assert.deepStrictEqual(0, res.length);
      });
});

const assert = require("assert");
const fs = require('fs');
const XMLSerializer = require('xmldom').XMLSerializer;
const SignatureNode = require('../../lib/signaturenode');

describe('Signature Node Tests', function () {

  let certPem = fs.readFileSync('./test/resources/cert.pem').toString();
  let keyPem = fs.readFileSync('./test/resources/private-key.pem').toString();

  it('Can have the signature node', async function () {
    let signatureNode = new SignatureNode(certPem, keyPem);
    let signatureXmlString = new XMLSerializer()
        .serializeToString(await signatureNode.getNode());

    // @formatter:off
    assert.deepStrictEqual(signatureXmlString,
        '<Signature xmlns="http://www.w3.org/2000/09/xmldsig#"><SignedInfo><CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/><SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/><Reference URI="6d47973eeda325341810305855d6f96dc373fb4f"><Transforms><Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/></Transforms><DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><DigestValue>RGIx8ANv1sfYqhp2/feeKu40qxaNVwKnA15c3/ONnmg=</DigestValue></Reference></SignedInfo><KeyInfo Id="6d47973eeda325341810305855d6f96dc373fb4f"><X509Data><X509IssuerSerial><X509IssuerName>C=BR, ST=SP, L=Sao Paulo, O=UL, OU=UL, CN=SPI - Banco Central do Brasil, E=email@email.com</X509IssuerName><X509SerialNumber>2904e64229c8ccbea34e723b84026e2c9a0e0ec6</X509SerialNumber></X509IssuerSerial></X509Data></KeyInfo><SignatureValue>k+tzpPuYSb+sEvGysfcwD8lbQpKW8aKWQORrDrVigLdEA/Pb3E2EIwFGRqUs1DxdfhOLqNQYDSuqC7hMdQCtUvB99stZ1IJyfFAO0uvPW4zZ+EVBh4J0enBLZRQo2WDqa8C3tVmXvXQA2J/ATgjvoOAMgnx7/l+FmSKH8Igbpw3YWDbbMlMLGy9AF5ZziGcBXXnANDxsIV2QRtUfqyiEORqttD9OIE2hPRFN2H9D7YMKbQqVF1FtHkpNf5XN+XyWTGi3S2Eww2hxZsIBsncqjDQQWzS91BRRnSgCLLV2dhDzgD//Vht5m91WOblFvqVBBeym3cD9Qwi+k5ME0WcENg==</SignatureValue></Signature>');
    // @formatter:on
  });

  it('Can have the signature node with different attributes', async function () {
    let signatureNode = new SignatureNode(certPem, keyPem, '1', '2', '3');
    let signatureXmlString = new XMLSerializer()
        .serializeToString(await signatureNode.getNode());

    // @formatter:off
    assert.deepStrictEqual(signatureXmlString,
        '<Signature xmlns="1"><SignedInfo><CanonicalizationMethod Algorithm="2"/><SignatureMethod Algorithm="3"/><Reference URI="6d47973eeda325341810305855d6f96dc373fb4f"><Transforms><Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/></Transforms><DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><DigestValue>RGIx8ANv1sfYqhp2/feeKu40qxaNVwKnA15c3/ONnmg=</DigestValue></Reference></SignedInfo><KeyInfo Id="6d47973eeda325341810305855d6f96dc373fb4f"><X509Data><X509IssuerSerial><X509IssuerName>C=BR, ST=SP, L=Sao Paulo, O=UL, OU=UL, CN=SPI - Banco Central do Brasil, E=email@email.com</X509IssuerName><X509SerialNumber>2904e64229c8ccbea34e723b84026e2c9a0e0ec6</X509SerialNumber></X509IssuerSerial></X509Data></KeyInfo><SignatureValue>KE9iS8ys8Sidr0n+2gk7KTKebC2qiBZF1vy6xZ76ZrfTHPXOIsgkp3dwwLjtyjhrHXKv+d5Y4pJc6gSegEjZ57cieb4mvUkDQKD7WUxIG5Ec7/F4q82CEGWTUDvB6sMFot2b30+Glo4HT2sbxyLEhet6cNYU44xS/TwsaIIkENSdPRSww9fCdVas8PMhgf1b4XzBjMUn+WyK/0cqrUq64ia8Wu2rkxsFjjHInOrWniwqZ6no4BRzl2xx8M3D3+ISwckx9HuUaq2M8CHTGfiU57tmKJOlGIUopCCiernfk4aM+8A8d1KfJlHUvNKZkxu4jyZkbn2jHfvRSXlYx3ZtAQ==</SignatureValue></Signature>');
    // @formatter:on
  });

  it('Can have the signature node with reference', async function () {
    let signatureNode = new SignatureNode(certPem, keyPem);
    signatureNode.addReference('ref', 'digest')
    let signatureXmlString = new XMLSerializer()
        .serializeToString(await signatureNode.getNode());

    // @formatter:off
    assert.deepStrictEqual(signatureXmlString,
        '<Signature xmlns="http://www.w3.org/2000/09/xmldsig#">'
          + '<SignedInfo>'
            + '<CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>'
            + '<SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>'
            + '<Reference URI="ref">'
              + '<Transforms>'
                + '<Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>'
              + '</Transforms>'
              + '<DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>'
              + '<DigestValue>digest</DigestValue>'
            + '</Reference>'
            + '<Reference URI="6d47973eeda325341810305855d6f96dc373fb4f">'
              + '<Transforms>'
                + '<Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>'
              + '</Transforms>'
              + '<DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>'
              + '<DigestValue>RGIx8ANv1sfYqhp2/feeKu40qxaNVwKnA15c3/ONnmg=</DigestValue>'
            + '</Reference>'
          + '</SignedInfo>'
          + '<KeyInfo Id="6d47973eeda325341810305855d6f96dc373fb4f">'
            + '<X509Data>'
              + '<X509IssuerSerial>'
                + '<X509IssuerName>C=BR, ST=SP, L=Sao Paulo, O=UL, OU=UL, CN=SPI - Banco Central do Brasil, E=email@email.com</X509IssuerName>'
                + '<X509SerialNumber>2904e64229c8ccbea34e723b84026e2c9a0e0ec6</X509SerialNumber>'
              + '</X509IssuerSerial>'
            + '</X509Data>'
          + '</KeyInfo>'
          + '<SignatureValue>V2ZaNsc0W7cAlqCk/jg2voDoS6XyRQ7uVFPamd272kbaHUChFbnoAxNYS4Qg3czItyGtEeLe9fl8ym06Lh1TFk8AKdlEhUFbe+ne5sCF8U9u5rW6fRv6v9PHI/7WYbjKtFDj/khX+5BWsts7YItvUJBtp6OrKVnnPg4gEmGLIRMNEDgCEHEMR7I/P0KklQFmYL57GGTABkVLOQlq3DnmsEQTWHikzqnaDNDactMQ4cR6bH4l2K10VNow0WocnUziuGqLYfaA225pQHDkHHM1VQqaOG9CFiMc+jvgKt7jCDunjmNebOltla1JVEH4u+MVGPIKmMMvu7ZCPrZQLgCVHQ==</SignatureValue>'
        + '</Signature>');
    // @formatter:on
  });

  it('Can have the signature node with multiple reference', async function () {
    let signatureNode = new SignatureNode(certPem, keyPem);
    signatureNode.addReference('ref1', 'digest1');
    signatureNode.addReference('ref2', 'digest2');
    signatureNode.addReference('ref3', 'digest3');
    let signatureXmlString = new XMLSerializer()
        .serializeToString(await signatureNode.getNode());

    // @formatter:off
    assert.deepStrictEqual(signatureXmlString,
        '<Signature xmlns="http://www.w3.org/2000/09/xmldsig#">'
            + '<SignedInfo>'
              + '<CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>'
              + '<SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>'
              + '<Reference URI="ref1">'
                + '<Transforms>'
                  + '<Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>'
                + '</Transforms>'
                + '<DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>'
                + '<DigestValue>digest1</DigestValue>'
              + '</Reference>'
              + '<Reference URI="ref2">'
                + '<Transforms>'
                  + '<Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>'
                + '</Transforms>'
                + '<DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>'
                + '<DigestValue>digest2</DigestValue>'
              + '</Reference>'
              + '<Reference URI="ref3">'
                + '<Transforms>'
                  + '<Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>'
                + '</Transforms>'
                + '<DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>'
                + '<DigestValue>digest3</DigestValue>'
              + '</Reference>'
              + '<Reference URI="6d47973eeda325341810305855d6f96dc373fb4f">'
                + '<Transforms>'
                  + '<Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>'
                + '</Transforms>'
                + '<DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>'
                + '<DigestValue>RGIx8ANv1sfYqhp2/feeKu40qxaNVwKnA15c3/ONnmg=</DigestValue>'
              + '</Reference>'
            + '</SignedInfo>'
            + '<KeyInfo Id="6d47973eeda325341810305855d6f96dc373fb4f">'
              + '<X509Data>'
                + '<X509IssuerSerial>'
                  + '<X509IssuerName>C=BR, ST=SP, L=Sao Paulo, O=UL, OU=UL, CN=SPI - Banco Central do Brasil, E=email@email.com</X509IssuerName>'
                  + '<X509SerialNumber>2904e64229c8ccbea34e723b84026e2c9a0e0ec6</X509SerialNumber>'
                + '</X509IssuerSerial>'
              + '</X509Data>'
            + '</KeyInfo>'
            + '<SignatureValue>CgM6C6drPAV49SrvRofX7+a81m0UBGJ0/uF8H1+z6iiWB//3OrCWiDv+R6W/1eMPLXpE0/hL3CE31fyc8+PImfq09Rp3hGAtuRYmlVTjXnNpRuOx3NRCL2rO+/BDDzBEHX6HKThwTVDKMV/ieM/jHL8h9edGjdFNViB4VPdPCuYUhcGORuZVVLurcRIgqoh+fr+pYhFIQ1VCrRHnMNKC19JSEbFWEpERGHhizHqODhcTFxOG1MUAPUCr2/d905LVJZBQVzFhoXPqfrfQl9txRMsU8F43NUcgE081y8D1drLd+IUecNvyidanBq2KdlddoUQqCPiKqnTJapeQHShBLw==</SignatureValue>'
          + '</Signature>');
    // @formatter:on
  });
});
const SignatureNode = require('../../src/main/signaturenode');
const assert = require("assert");
const XMLSerializer = require('xmldom').XMLSerializer;

describe('Signature Node Tests', function () {

  it('Can have the signature node', function () {
    let signatureNode = new SignatureNode();
    let signatureXmlString = new XMLSerializer()
        .serializeToString(signatureNode.getNode());

    // @formatter:off
    assert.deepStrictEqual(signatureXmlString,
        '<Signature xmlns="http://www.w3.org/2000/09/xmldsig#">' +
            '<SignedInfo>' +
              '<CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>' +
              '<SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>' +
            '</SignedInfo>' +
          '<SignatureValue/>' +
        '</Signature>');
    // @formatter:on
  });

  it('Can have the signature node with different attributes', function () {
    let signatureNode = new SignatureNode('1', '2', '3');
    let signatureXmlString = new XMLSerializer()
        .serializeToString(signatureNode.getNode());

    // @formatter:off
    assert.deepStrictEqual(signatureXmlString,
        '<Signature xmlns="1">' +
            '<SignedInfo>' +
              '<CanonicalizationMethod Algorithm="2"/>' +
              '<SignatureMethod Algorithm="3"/>' +
            '</SignedInfo>' +
          '<SignatureValue/>' +
        '</Signature>');
    // @formatter:on
  });

  it('Can have the signature node with reference', function () {
    let signatureNode = new SignatureNode();
    signatureNode.addReference('ref', 'digest')
    let signatureXmlString = new XMLSerializer()
        .serializeToString(signatureNode.getNode());

    // @formatter:off
    assert.deepStrictEqual(signatureXmlString,
        '<Signature xmlns="http://www.w3.org/2000/09/xmldsig#">' +
          '<SignedInfo>' +
            '<CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>' +
            '<SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>' +
            '<Reference URI="ref">' +
              '<Transforms>' +
                '<Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>' +
              '</Transforms>' +
              '<DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>' +
              '<DigestValue>digest</DigestValue>' +
            '</Reference>' +
          '</SignedInfo>' +
          '<SignatureValue/>' +
        '</Signature>');
    // @formatter:on
  });

  it('Can have the signature node with multiple reference', function () {
    let signatureNode = new SignatureNode();
    signatureNode.addReference('ref1', 'digest1');
    signatureNode.addReference('ref2', 'digest2');
    signatureNode.addReference('ref3', 'digest3');
    let signatureXmlString = new XMLSerializer()
        .serializeToString(signatureNode.getNode());

    // @formatter:off
    assert.deepStrictEqual(signatureXmlString,
        '<Signature xmlns="http://www.w3.org/2000/09/xmldsig#">' +
          '<SignedInfo>' +
            '<CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>' +
            '<SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>' +
            '<Reference URI="ref1">' +
              '<Transforms>' +
                '<Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>' +
              '</Transforms>' +
              '<DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>' +
              '<DigestValue>digest1</DigestValue>' +
            '</Reference>' +
            '<Reference URI="ref2">' +
              '<Transforms>' +
                '<Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>' +
              '</Transforms>' +
              '<DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>' +
              '<DigestValue>digest2</DigestValue>' +
            '</Reference>' +
            '<Reference URI="ref3">' +
              '<Transforms>' +
                '<Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>' +
              '</Transforms>' +
              '<DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>' +
              '<DigestValue>digest3</DigestValue>' +
            '</Reference>' +
          '</SignedInfo>' +
          '<SignatureValue/>' +
        '</Signature>');
    // @formatter:on
  });
});
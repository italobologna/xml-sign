# xml-sign

The goal of this project is to allow XML files to be signed using a set of rules. 
As the main use case for this library is to help the signature process of ISO20022 messages and the 
Brazilian instant payment technology.

Prepared methods for this library includes:

## Usage

All the methods from this library handles with the string format of the XML.
The result of the sign methods are also a string with the content of the XML as its value.

```js
// Sample XML to be signed being read
const xmlIso = fs.readFileSync('xml-to-sign.xml').toString();
// Signed XML string value
const signedXml = await signIso(xmlIso, certPem, keyPem);
```

## Methods

### signIso

This method generates the signature for the document looking for the `AppHdr` and the `Document` 
tags on the xml and generates the sha256 digest for each of those elements after applying the 
canonicalization transformation. 

It also takes as the input the X509 certificate which is necessary for adding the certificate 
signature issue information. The certificate information is denoted on the XML as the `KeyInfo` tag.
This process will generate 3 references on the XML, the `AppHdr`, `Document` and `KeyInfo`, 
and include them on the `SignedInfo` tag which will have is signature value generated and 
applied to the `SignatureValue` tag, consolidating the document validity.

### verifyIso

As the signIso method complement, this method verifies for the present signature and applies the 
transformations as demanded on the XML signature reference tags, verifying the digest of each 
referenced tag and verifying the `SignatureValue`.

### signDict

This method has the same process of the signIso function, but instead of generating the digest 
reference for the AppHdr and the Document, this looks for the main XML tag and generates its digest.

As the signIso process, it will also use the X509 certificate to generate the `KeyInfo` tag and its 
reference.

Here, it is expected that the resulted XML is going to have two references, the main XML tag and 
the `KeyInfo`. As the signIso, the references will be placed on the `SignedInfo` tag which will 
be signed so the `SignatureValue` is generated, consolidating the document validity.  

### verifyDict

This process takes exactly the same process as the verifyIso.
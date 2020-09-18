const DOMParser = require('xmldom').DOMParser;
const xpath = require('xpath');
const c14n = require("xml-c14n")();

function signXml(xml, options, cb) {
  try {

    // Transform the XMl into a document object
    let doc = new DOMParser().parseFromString(xml);

    // Gets the specified value from the object
    // Needs a for loop
    let toSign = xpath.select1(options.toSign[0], doc);
    {
      // toSign element to string
      console.log(toSign.toString());

      var canonicaliser = c14n
          .createCanonicaliser("http://www.w3.org/2001/10/xml-exc-c14n#");
      // .createCanonicaliser("http://www.w3.org/2001/10/xml-exc-c14n#WithComments");
      canonicaliser.canonicalise(toSign,
          function (err, res) {
            if (err) {
              console.warn(err.stack);
              cb(err);
              return;
            }





            cb(null, res);
          });
    }
  } catch (e) {
    cb(e);
  }
}

module.exports = signXml;
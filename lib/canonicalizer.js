const c14n = require("xml-c14n")();

function canonicalize(node, algorithmInfo) {
  let algorithm = algorithmInfo || 'http://www.w3.org/2001/10/xml-exc-c14n#';
  return new Promise((resolve, reject) => {
    c14n.createCanonicaliser(algorithm)
        .canonicalise(node, function (err, res) {
          if (err) {
            console.warn(err.stack);
            reject(err);
            return;
          }
          resolve(res);
        });
  });
}

module.exports = canonicalize;
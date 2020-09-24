const canonicalize = require('./canonicalizer');
const crypto = require('crypto');

module.exports.canonicalizeAndHash = async function canonicalizeAndHash(node) {
  let canonicalizedNode = await canonicalize(node);
  // Why this is happening? I feel dead inside after doing this
  if (node.localName !== 'Document') {
    canonicalizedNode = canonicalizedNode.replace(/ xmlns=\"(.*?)\"/g, '');
  }
  let hash = crypto.createHash('SHA256');
  hash.update(canonicalizedNode);
  return hash.digest('base64');
};

module.exports.canonicalizeAndSign = async function canonicalizeAndSign(node, keyPem) {
  let canonicalizedNode = await canonicalize(node);
  let privateKey = crypto.createPrivateKey(keyPem);

  console.log(canonicalizedNode);

  let hash = crypto.createHash('SHA256');
  hash.update(canonicalizedNode);
  let digest1 = hash.copy().digest('base64');
  console.log(digest1);
  let digest2 = hash.copy().digest('hex');
  console.log(digest2);


  const signature = crypto.sign("sha256", Buffer.from(canonicalizedNode), {
    key: privateKey,
    padding: crypto.constants.RSA_PKCS1_PADDING,
  });

  let s = signature.toString("base64");
  console.log(s);
  return s;
};
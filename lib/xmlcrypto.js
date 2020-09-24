const canonicalize = require('./canonicalizer');
const crypto = require('crypto');

module.exports.removeNsIfNeeded = removeNsIfNeeded;
module.exports.canonicalizeAndHash = canonicalizeAndHash;
module.exports.canonicalizeAndSign = canonicalizeAndSign;

function removeNsIfNeeded(node, canonicalizedNode) {
  if (node.localName !== 'Document') {
    return canonicalizedNode.replace(/ xmlns="(.*?)"/g, '');
  }
  return canonicalizedNode;
}

async function canonicalizeAndHash(node) {
  let canonicalizedNode = await canonicalize(node);
  canonicalizedNode = removeNsIfNeeded(node, canonicalizedNode);
  let hash = crypto.createHash('SHA256');
  hash.update(canonicalizedNode);
  return hash.digest('base64');
}

async function canonicalizeAndSign(node, keyPem) {
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
}

const canonicalize = require('./canonicalizer');
const crypto = require('crypto');

module.exports = async function canonicalizeAndSign(node, privateKey) {
  let canonicalizedNode = await canonicalize(node);
  let hash = crypto.createHash('SHA256');
  hash.update(canonicalizedNode);
  return hash.digest('base64');
};
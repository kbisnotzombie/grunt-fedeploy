var crypto = require('crypto'),
    fs     = require('fs');

// Generates the md5 for the given file
exports.md5 = function(filepath) {
  var hash = crypto.createHash('md5');
  hash.update(fs.readFileSync(String(filepath), 'utf8'));
  return hash.digest('hex');
};

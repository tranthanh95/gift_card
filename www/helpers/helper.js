var bcrypt = require('bcrypt');

// Function hash password.
function hash_password(password, saltRounds) {
    var salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, saltRounds);
}

// Function compare password by hash.
function compare_password(password, hash) {
    // Load hash from your password DB.
    return bcrypt.compareSync(password, hash);
}

module.exports = {
    hash_password: hash_password,
    compare_password: compare_password
}
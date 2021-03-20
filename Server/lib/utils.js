const crypto = require('crypto');
const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const pathToKey = path.join(__dirname, '..', 'id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');

/**
 * This method uses the Crpyto Library to decrypt the password hash using the salt
 * Compares the decrypted hash and salt with provided user password
 * 
 * @param password plain text password provided by the user
 * @param hash password hash stored in the user database
 * @param salt password salt stored in the user database
 */
function validPassword(password, hash, salt) {
    var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
}

/**
 * This method uses the plain text password provided by the user and generates salt and hash values from it
 * These values will be stored in the user database in place of the plaintext password
 * 
 * @param password plain text password string provided by the user 
 */
function genPassword(password) {
    var salt = crypto.randomBytes(32).toString('hex');
    var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return {
      salt: salt,
      hash: genHash
    };
}

// hash details for payment method
function hashDetails(value){

  var hashValue = crypto.pbkdf2Sync(value, PRIV_KEY, 10000, 64, 'sha512').toString('hex');
  return hashValue;

}

/**
 * This method will issue a JsonWebToken (JWT) to the user
 * This is required to set the JWT Sub payload property to the database User ID
 * 
 * @param user the user mongoose schema object
 */
function issueJWT(user) {

    const _id = user._id;
    const expiresIn = '1d';
  
    const payload = {
      sub: _id,
      iat: Date.now()
    };

    const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256' });
    return {
      token: "Bearer " + signedToken,
      expires: expiresIn
    }
}


// Export all password values for authentication
module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;
module.exports.hashDetails = hashDetails;
module.exports.issueJWT = issueJWT;
/**
 * This module will generate public and private keypair values for Passport Authentication with Crypto
 * 
 */
 const crypto = require('crypto');
 const fs = require('fs');
 
 function genKeyPair() {
     
     // Generates crypto object with properties `privateKey` and `publicKey`
     const keyPair = crypto.generateKeyPairSync('rsa', {
         modulusLength: 4096, // standard for RSA keys
         publicKeyEncoding: {
             type: 'pkcs1', // Public Key Cryptography Standards 1 
             format: 'pem' // PEM: Common Formatting 
         },
         privateKeyEncoding: {
             type: 'pkcs1', // Public Key Cryptography Standards 1
             format: 'pem' // PEM: Common Formatting 
         }
     });
 
     // Create the public key file
     fs.writeFileSync(__dirname + '/id_rsa_pub.pem', keyPair.publicKey); 
     
     // Create the private key file
     fs.writeFileSync(__dirname + '/id_rsa_priv.pem', keyPair.privateKey);
 
 }
 
 // Generate the keypair
 genKeyPair();
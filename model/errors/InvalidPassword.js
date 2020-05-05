/* Erreur lancée lorsqu'un utilisateur qui veut se connecter entre un 
mauvais mot de passe */

'use strict';

// Fonction constructeur de l'erreur.
var InvalidPasswordError = function (login) {
    // Appeler le constructeur parent.
    Error.call(this);
    // Initialiser le message correspondant à cette erreur.
    this.message = "Invalid password for user " + login;
};

// Établir l'héritage InvalidPasswordError -> Error.
InvalidPasswordError.prototype = new Error();

// Corriger l'attribut 'constructor', car il pointe vers Error.
InvalidPasswordError.constructor = InvalidPasswordError;

module.exports = InvalidPasswordError;
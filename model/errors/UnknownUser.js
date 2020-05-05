/* Erreur lancée lorsque l'on recherche dans la base de données (collection
users) un utilisateur qui ne s'y trouve pas */

'use strict';

// Fonction constructeur de l'erreur.
var UnknownUserError = function (login) {
    // Appeler le constructeur parent.
    Error.call(this);
    // Initialiser le message correspondant à cette erreur.
    this.message = "Unknown user " + login;
};

// Établir l'héritage UnknownUserError -> Error.
UnknownUserError.prototype = new Error();

// Corriger l'attribut 'constructor', car il pointe vers Error.
UnknownUserError.constructor = UnknownUserError;

module.exports = UnknownUserError;
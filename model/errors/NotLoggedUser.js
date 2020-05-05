/* Erreur lancée lorsqu'un utilisateur non connecté veut utiliser une fonctionnalité 
réservée aux utilisateurs connectés */

'use strict';


var NotLoggedUserError = function (login) {
    Error.call(this);
    this.message = "Vous devez être connecté pour accéder à cette fonctionalité";
};


NotLoggedUserError.prototype = new Error();


NotLoggedUserError.constructor = NotLoggedUserError;

module.exports = NotLoggedUserError;
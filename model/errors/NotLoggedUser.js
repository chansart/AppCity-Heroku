/* Erreur lanc�e lorsqu'un utilisateur non connect� veut utiliser une fonctionnalit� 
r�serv�e aux utilisateurs connect�s */

'use strict';


var NotLoggedUserError = function (login) {
    Error.call(this);
    this.message = "Vous devez �tre connect� pour acc�der � cette fonctionalit�";
};


NotLoggedUserError.prototype = new Error();


NotLoggedUserError.constructor = NotLoggedUserError;

module.exports = NotLoggedUserError;
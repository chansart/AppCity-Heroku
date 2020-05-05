/* Erreur lancée lorsqu'un utilisateur ayant déjà soutenu un problème
(page soumissions) tente de le soutenir à nouveau */

'use strict';

// Fonction constructeur de l'erreur.
var LikedProblemYet = function (login) {
    // Appeler le constructeur parent.
    Error.call(this);
    // Initialiser le message correspondant à cette erreur.
    this.message = login + " has liked this submission";
};

// Établir l'héritage UnknownUserError -> Error.
LikedProblemYet.prototype = new Error();

// Corriger l'attribut 'constructor', car il pointe vers Error.
LikedProblemYet.constructor = LikedProblemYet;

module.exports = LikedProblemYet;
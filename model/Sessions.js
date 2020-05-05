/* objet sessions : cet objet repr�sente une session d'utilisateur et d�finit toutes les 
fonctions qui y sont li�es */

"use strict";

var assert = require('assert'),
    crypto = require('crypto'),
    UnknownSessionError = require('./errors/UnknownSession');

module.exports = function Sessions(db) {

    var sessions = db.collection("sessions");

    return {
		/* Cette fonction prend en argument le login de l'utilisateur et, lorsque l'utilisateur tente 
		de se connecter, supprime dans la base de donn�es (collection sessions) les pr�c�dentes sessions 
		de l'utilisateur au cas o� celui-ci ne les aurait pas fern�es */
		clearSession: function (username, done) {
			sessions.remove({'username': username}, function (error, sessions) {
				return done(error);
			});
		},
		/* Cette fonction prend en argument le login de l'utilisateur et cr�e une nouvelle
		session dans la base de donn�es (collection sessions) pour cet utilisateur lorsque celui-ci
		tente de se connecter */
        startSession: function (username, done) {
            var date = (new Date()).valueOf().toString(),
				random = Math.random().toString(),
				sessionId = crypto.createHash('sha1').update(date + random).digest('hex'),

            // Document de session pour la basse des données.
				session = { '_id': sessionId, 'username': username };

            // Ins�rer le document dans la DB.
			sessions.insert(session, function (error, result) {
                console.log("DB: inserted session " + sessionId);
                return done(error, sessionId);
            });
        },
		/* Cette fonction prend en argument le login de l'utilisateur et supprime la session de 
		l'utilisateur dans la base de donn�es (collection sessions) lorsque celui-ci
		se d�connecte */
        endSession: function (sessionId, done) {
            // Éliminer le document représentant la session.
            sessions.remove({ '_id' : sessionId }, function (error, count) {
                console.log("DB: removed session " + sessionId);
                return done(error);
            });
        },
		/* Cette fonction prend en argument l'id de la session en cours, recherche cette session
		dans la base de donn�es (collection sessions) et retourne le nom de l'utilisateur auquel
		appartient la sessions */
        getUsername: function (sessionId, done) {
            sessions.findOne({ '_id' : sessionId }, function (error, session) {
                if (error) { return done(error, null); }
                if (!session) { return done(new UnknownSessionError(sessionId), null); }
                return done(null, session.username);
            });
        },
		/* Cette fonction retourne sous forme de tableau la liste des utilisateurs ayant une session 
		ouverte sur l'application */
        getOnlineUsers: function (done) {
            sessions.find().toArray(function (error, onlineUsers) {
                if (error) { return done(error, null); }
                return done(error, onlineUsers);
            });
        }
    };
};

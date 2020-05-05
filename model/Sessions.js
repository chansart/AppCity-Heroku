/* objet sessions : cet objet représente une session d'utilisateur et définit toutes les 
fonctions qui y sont liées */

"use strict";

var assert = require('assert'),
    crypto = require('crypto'),
    UnknownSessionError = require('./errors/UnknownSession');

module.exports = function Sessions(db) {

    var sessions = db.collection("sessions");

    return {
		/* Cette fonction prend en argument le login de l'utilisateur et, lorsque l'utilisateur tente 
		de se connecter, supprime dans la base de données (collection sessions) les précédentes sessions 
		de l'utilisateur au cas où celui-ci ne les aurait pas fernées */
		clearSession: function (username, done) {
			sessions.remove({'username': username}, function (error, sessions) {
				return done(error);
			});
		},
		/* Cette fonction prend en argument le login de l'utilisateur et crée une nouvelle
		session dans la base de données (collection sessions) pour cet utilisateur lorsque celui-ci
		tente de se connecter */
        startSession: function (username, done) {
            var date = (new Date()).valueOf().toString(),
				random = Math.random().toString(),
				sessionId = crypto.createHash('sha1').update(date + random).digest('hex'),

            // Document de session pour la basse des donnÃ©es.
				session = { '_id': sessionId, 'username': username };

            // Insérer le document dans la DB.
			sessions.insert(session, function (error, result) {
                console.log("DB: inserted session " + sessionId);
                return done(error, sessionId);
            });
        },
		/* Cette fonction prend en argument le login de l'utilisateur et supprime la session de 
		l'utilisateur dans la base de données (collection sessions) lorsque celui-ci
		se déconnecte */
        endSession: function (sessionId, done) {
            // Ã‰liminer le document reprÃ©sentant la session.
            sessions.remove({ '_id' : sessionId }, function (error, count) {
                console.log("DB: removed session " + sessionId);
                return done(error);
            });
        },
		/* Cette fonction prend en argument l'id de la session en cours, recherche cette session
		dans la base de données (collection sessions) et retourne le nom de l'utilisateur auquel
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

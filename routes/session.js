/*
 * routes permettant la gestion des sessions utilisateurs 
 */

"use strict";

var User = require('../model/User'),
	Sessions = require('../model/Sessions'),
	InvalidPasswordError = require('../model/errors/InvalidPassword'),
	UnknownUserError = require('../model/errors/UnknownUser');

module.exports = function (app) {

	var db = app.get("db"),
		user = new User(db),
		sessions = new Sessions(db);
	return {
		/* Lorsqu'un utilisateur veut se connecter, on commence par supprimer les sessions encore ouvertes
		pour son login dans la base de données (collection sessions) */
		clearSessionsIfAny: function (req, res, next) {
			var username = req.body.username,
				password = req.body.password;
			user.validateLogin(username, password, function (error, user) {
				if (!error) {
					sessions.clearSession(username, function (error) {
						if (!error) {
							next();
						} else {
							next(error);
						}
					});
				} else {
					next();
				}
			});
		},
		/* route permettant la connection d'un utilisateur */
		login: function (req, res, next) {
			var username = req.body.username,
				password = req.body.password;
			console.log("Login: username: " + username + ", pass: " + password);
			user.validateLogin(username, password, function (error, user) {
				// si le login est valide ... 
				if (!error) {
					sessions.startSession(user._id, function (error, sessionId) {
						if (!error) {
							// redirection vers la page d'accueil
							res.cookie('session', sessionId);
							res.redirect("/?login=ok");
						} else {
							next(error);
						}
					});
				// si le login n'est pas valide ... 
				} else {
					// si utilisateur inconnu ... 
					if (error instanceof UnknownUserError) {
						//redirection vers la page d'accueil avec un message d'erreur 
						res.redirect("/?login=error");
					//si mot de passe invalide ... 
					} else if (error instanceof InvalidPasswordError) {
						//redirection vers la page d'accueil avec un message d'erreur
						res.redirect("/?login=error");
					} else {
						next(error); // passer erreur au gestionnaire suivant
					}
				}
			});
		},
		/* route permettant la déconnection d'un utilisateur */
		logout: function (req, res, next) {
			var sessionId = req.cookies.session;
			sessions.endSession(sessionId, function (error) {
				res.cookie('session', '');
				res.redirect('/');
			});
		}
	};
};

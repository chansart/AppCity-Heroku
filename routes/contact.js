/*
 * GET page "contact".
 */

"use strict";

var Sessions = require('../model/Sessions');
var User = require('../model/User');
var Message = require('../model/Message');

module.exports = function (app) {

	var db = app.get("db"),
		sessions = new Sessions(db),
		user = new User(db),
		message = new Message(db);

	return {
		root: {
			/* route principale pour l'affichage de la page contact */
			input: function (req, res, next) {
				var sessionId = req.cookies.session;
				sessions.getUsername(sessionId, function (error, username) {
					// si l'utilisateur est connecté ...
					if (!error && username) {
						user.isUserAdmin(username, function (error, adminTag) {
							// si l'utilisateur est administrateur.
							if (adminTag) {
								res.render("contact", {loginStatusIn: "in", userName: username, adminSection: adminTag});
							// si l'utilisateur n'est pas administrateur. 
							} else {
								res.render("contact", {loginStatusIn: "in", userName: username});
							}
						});
					// si l'utilisateur n'est pas connecté ...
					} else {
						res.render("contact", {loginStatusOut: "out"});
					}
				});
			},
			/* route utilisée si un utilisateur envoie un message via le formulaire de contact */
			perform: function (req, res, next) {
				var sessionId = req.cookies.session;
				sessions.getUsername(sessionId, function (error, username) {
					// si l'utilisateur est connecté ...
					if (!error && username) {
						// récupération des informations entrées par l'utilisateur ... 
						var subjectMsg = req.body.subjectMsg,
							contentMsg = req.body.contentMsg,
							idUser = username;
						// ajout du message à la base de données (collection messages)
						message.addMessage(subjectMsg, contentMsg, idUser, function (error) {
							console.log("inserted message");
							//redirection de l'utilisateur vers la page d'accueil
							res.redirect("/?msg=ok");
						});
					// si l'utilisateur n'est pas connecté. 
					} else {
						res.redirect("/?msg=notLoggedIn");
					}
				});
			}
		}
	};
};
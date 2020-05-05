/* GET page "aide" */

"use strict";

var User = require('../model/User');
var Sessions = require('../model/Sessions');

module.exports = function (app) {

	var db = app.get("db"),
		sessions = new Sessions(db),
		user = new User(db),
		users = db.collection("users");

	return {
		/* route principale pour afficher la page aide */
		root: function (req, res, next) {
			var sessionId = req.cookies.session;
			sessions.getUsername(sessionId, function (error, username) {
				// si l'utilisateur est connecté ... 
				if (!error && username) {
					user.isUserAdmin(username, function (error, adminTag) {
						// si l'utilisateur est administrateur. 
						if (adminTag) {
							res.render("aide", {loginStatusIn: "in", userName: username, adminSection: adminTag});
						// si l'utilisateur n'est pas administrateur.
						} else {
							res.render("aide", {loginStatusIn: "in", userName: username});
						}
					});
				// si l'utilisateur n'est pas connecté. 
				} else {
					res.render("aide", {loginStatusOut: "out"});
				}
			});
		},
		/* route employée si l'utilisateur utilise la fonctionnalité "récupérer mon mot de passe" */
		lostPassword: function (req, res, next) {
			//récupération des informations entrées par l'utilisateur. 
			var username = req.body.login,
				mail = req.body.mail,
				answer = {
					_id: username,
					mail: mail
				};
			// récupération de l'utilisateur dans la base de données (collection users) 
			users.findOne({'_id' : answer._id}, function (error, lostUser) {
				var sessionId = req.cookies.session;
				sessions.getUsername(sessionId, function (error, username) {
					// si l'utilisateur est connecté ... 
					if (!error && username) {
						user.isUserAdmin(username, function (error, adminTag) {
							// si l'utilisateur est administrateur. 
							if (adminTag) {
								res.render("aide", {loginStatusIn: "in", userName: username, adminSection: adminTag, loginMsg: "Vous êtes connecté(e) : rendez-vous sur votre espace personnel pour retrouver votre mot de passe."});
							// si l'utilisateur n'est pas administrateur. 
							} else {
								res.render("aide", {loginStatusIn: "in", userName: username, loginMsg: "Vous êtes connecté(e) : rendez-vous sur votre espace personnel pour retrouver votre mot de passe."});
							}
						});
					// si l'utilisateur n'est pas connecté.
					} else {
						// si les informations entrées par l'utilisateur concordent avec celles de la base de données ... 
						if (lostUser.mail === answer.mail) {
							console.log("Found profile");
							// envoi d'un mail contenant les infos de connection à l'utilisateur 
							user.sendLostPasswordMail(answer._id, function (error, user) {
								// redirection vers la page d'accueil
								res.redirect("/?sentPassword=ok");
							});
						// si les infos ne concordent pas ... 
						} else {
							console.log("Not found profile");
							// redirection vers la page d'aide avec un message d'erreur. 
							res.render("aide", {loginStatusOut: "out", loginMsg: "Votre profil ne semble pas exister dans notre base de données : veuillez vous en créer un."});
						}
					}
				});
			});
		}
	};
};
/*
 * GET page "espace_perso".
 */

"use strict";


var Problem = require('../model/Problem');
var Sessions = require('../model/Sessions');
var User = require('../model/User');

module.exports = function (app) {

	var db = app.get("db"),
		problems = new Problem(db),
		sessions = new Sessions(db),
		user = new User(db);

	return {
		/* route principale menant à la page "espace_perso" */
		root:  function (req, res, next) {
			var sessionId = req.cookies.session;
			sessions.getUsername(sessionId, function (error, username) {
				// si l'utilisateur est connecté
				if (!error && username) {
					user.getUserInfo(username, function (error, userInfo) {
						// on récupère dans la base de données les problèmes qu'il a soumis 
						problems.getProblemsByUser(username, function (error, soumissions) {
							var i,
								jsDate;
							for (i = 0; i < soumissions.length; i++) {
								jsDate = soumissions[i].date;
								soumissions[i].date = jsDate.getDate() + "/" + (jsDate.getMonth()+1);
							}
							// on récupère dans la base de données les problèmes qu'il a soutenu
							problems.getProblemsByLiker(username, function (error, likes) {
								for (i = 0; i < likes.length; i++) {
									jsDate = likes[i].date;
									likes[i].date = jsDate.getDate() + "/" + (jsDate.getMonth()+1);
								}
								user.isUserAdmin(username, function (error, adminTag) {
									// si l'utilisateur est administrateur
									if (adminTag) {
										res.render("espace_perso", {loginStatusIn: "in", userName: username, userInfo: userInfo, soumissions: soumissions, likes: likes, adminSection: adminTag});
									// si l'utilisateur n'est pas administrateur
									} else {
										res.render("espace_perso", {loginStatusIn: "in", userName: username, userInfo: userInfo, soumissions: soumissions, likes: likes});
									}
								});
							});
						});
					});
				// si l'utilisateur n'est pas connecté
				} else {
					res.render("accueil", {loginStatusOut: "out", loginMsg: "Merci de vous connecter pour avoir accès à l'espace perso"});
				}
			});
		}
	};
};
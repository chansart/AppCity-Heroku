/*
 * GET page accueil.
 */


"use strict";

var Sessions = require('../model/Sessions');
var Problem = require('../model/Problem');
var User = require('../model/User');
var Post = require('../model/Post');

module.exports = function (app) {

	var db = app.get("db"),
		sessions = new Sessions(db),
		problems = new Problem(db),
		user = new User(db),
		posts = new Post(db);

	return {
		/* route principale pour l'affichage de la page d'accueil */
		root:  function (req, res, next) {
			var sessionId = req.cookies.session;
			// Dans tous les cas on affiche les problèmes récents :
			problems.getProblems(10, function (error, soumissions) {
				if (error) { return next(error); }
				var i,
					jsDate;
				for (i = 0; i < soumissions.length; i++) {
					jsDate = soumissions[i].date;
					soumissions[i].date = jsDate.getDate() + "/" + (jsDate.getMonth()+1) ;
				}
				// Dans tous les cas, on récupère les posts récents :
				posts.getPosts(5, function (error, posts) {
					if (error) { return next(error); }
					for (i = 0; i < posts.length; i++) {
						jsDate = posts[i].date;
						posts[i].date = jsDate.getDate() + "/" + (jsDate.getMonth()+1);
					}

					// Ensuite on change la barre de navigation selon que l'utilisateur est connecté ou non, et un éventuel message si l'utilisateur a été redirigé.
					sessions.getUsername(sessionId, function (error, username) {
						// si l'utilisateur est connecté ... 
						if (!error && username) {
							user.isUserAdmin(username, function (error, adminTag) {
								// si l'utilisateur est administrateur ... 
								if (adminTag) {
									// si, depuis la page "contact", l'utilisateur a envoyé un message valide. 
									if (req.query.msg === "ok") {
										res.render("accueil", {loginStatusIn: "in", userName: username, soumissions: soumissions, posts: posts, adminSection: adminTag, loginMsg: "Merci pour votre message ! Nous vous répondrons dès que possible, via votre boîte mail."});
									// si l'utilisateur s'est connecté avec succès. 
									} else if (req.query.login === "ok") {
										res.render("accueil", {loginStatusIn: "in", userName: username, soumissions: soumissions, posts: posts, adminSection: adminTag, loginMsg: "Merci, vous êtes bien connecté."});
									//si l'utilisateur s'est simplement rendu sur la page d'accueil.
									} else {
										res.render("accueil", {loginStatusIn: "in", userName: username, soumissions: soumissions, posts: posts, adminSection: adminTag});
									}
								// si l'utilisateur n'est pas administrateur ... 
								} else {
									// si l'utilisateur s'est connecté avec succès.
									if (req.query.login === "ok") {
										res.render("accueil", {loginStatusIn: "in", userName: username, soumissions: soumissions, posts: posts, loginMsg: "Merci, vous êtes bien connecté."});
									// si, depuis la page "contact", l'utilisateur a envoyé un message valide. 
									} else if (req.query.msg === "ok") {
										res.render("accueil", {loginStatusIn: "in", userName: username, soumissions: soumissions, posts: posts, loginMsg: "Merci pour votre message ! Nous vous répondrons dès que possible, via votre boîte mail."});
									//si l'utilisateur s'est simplement rendu sur la page d'accueil.
									} else {
										res.render("accueil", {loginStatusIn: "in", userName: username, soumissions: soumissions, posts: posts});
									}
								}
							});
						// si l'utilisateur n'est pas connecté ... 
						} else {
							// si ses identifiants de connection sont incorrects. 
							if (req.query.login === "error") {
								res.render("accueil", {loginStatusOut: "out", soumissions: soumissions, posts: posts, loginMsg: "Impossible de se connecter : Vérifiez votre identifiant et votre mot de passe."});
							// si son inscription a été validée. 
							} else if (req.query.signup === "ok") {
								res.render("accueil", {loginStatusOut: "out", soumissions: soumissions, posts: posts, loginMsg: "Merci pour votre inscription ! Vous pouvez dès à présent vous connecter au site, à l'aide du petit formulaire situé en haut à droite de  l'écran. Vous trouverez également dans votre boîte mail un rappel de vos informations de connection. "});
							// si l'utilisateur veut soumettre un problème mais n'est pas connecté. 
							} else if (req.query.soumission === "notLoggedIn") {
								res.render("accueil", {loginStatusOut: "out", soumissions: soumissions, posts: posts, loginMsg: "Vous devez être connecté pour pouvoir soumettre un problème."});
							// si l'utilisateur veut contacter les administrateurs mais n'est pas connecté. 
							} else if (req.query.msg === "notLoggedIn") {
								res.render("accueil", {loginStatusOut: "out", soumissions: soumissions, posts: posts, loginMsg: "Vous devez être connecté pour pouvoir nous contacter via le formulaire de contact."});
							// si sa demande d'identifiants perdus a été acceptée. 
							} else if (req.query.sentPassword === "ok") {
								res.render("accueil", {loginStatusOut: "out", soumissions: soumissions, posts: posts, loginMsg: "Vos identifiants vous ont été envoyés par mail."});
							// si l'utilisateur non connecté veut simplement se rendre sur la page d'accueil. 
							} else {
								res.render("accueil", {loginStatusOut: "out", soumissions: soumissions, posts: posts});
							}
						}
					});
				});
			});
		}
	};
};
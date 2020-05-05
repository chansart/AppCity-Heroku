/*
 * GET page "soumissions".
 */

"use strict";

var Problem = require('../model/Problem'),
	LikedProblemYet = require('../model/errors/LikedProblemYet'),
	Sessions = require('../model/Sessions'),
	User = require('../model/User');

var assert = require('assert');


module.exports = function (app) {

	var db = app.get("db"),
		problem = new Problem(db),
		sessions = new Sessions(db),
		user = new User(db);

	return {
	/* Route principale menant à la page "soumissions" */
		root:  function (req, res, next) {
			var sessionId = req.cookies.session,
				jsDate,
				i;
			/* Récupère les problèmes à afficher dans le tableau */
			problem.getProblems(10, function (error, soumissions) {
				if (error) { return next(error); }

				for (i = 0; i < soumissions.length; i++) {
					jsDate = soumissions[i].date;
					soumissions[i].date = jsDate.getDate() + "/" + (jsDate.getMonth()+1) + "/" + jsDate.getFullYear();
				}
				sessions.getUsername(sessionId, function (error, username) {
					// si l'utilisateur est connecté ...
					if (!error && username) {
						user.isUserAdmin(username, function (error, adminTag) {
							// si l'utilisateur est administrateur ... 
							if (adminTag) {
								if (req.query.addProblem === "ok") {
								/* affiche la page soumissions après qu'un problème ait été soumis par un
								administrateur */
									res.render("soumissions", {
										loginStatusIn: "in",
										userName: username,
										adminSection: adminTag,
										loginMsg: "Merci pour votre soumission ! Celle-ci est en attente de validation.",
										soumissions: soumissions
									});
								}
								res.render("soumissions", {
								/* affiche la page soumissions */
									loginStatusIn: "in",
									userName: username,
									adminSection: adminTag,
									soumissions: soumissions
								});
							// si l'utilisateur n'est pas administrateur ... 
							} else if (req.query.addProblem === "ok") {
							/* affiche la page soumissions après qu'un problème ait été soumis par un
							administrateur */
								res.render("soumissions", {
									loginStatusIn: "in",
									userName: username,
									loginMsg: "Merci pour votre soumission ! Celle-ci est en attente de validation.",
									soumissions: soumissions
								});
							} else {
							/* affiche la page soumissions */
								res.render("soumissions", {
									loginStatusIn: "in",
									userName: username,
									soumissions: soumissions
								});
							}
						});
					//si l'utilisateur n'est pas connecté ... 
					} else {
						problem.getProblems(10, function (error, soumissions) {
							if (error) { return next(error); }
							var i,
								jsDate;
							for (i = 0; i < soumissions.length; i++) {
								jsDate = soumissions[i].date;
								soumissions[i].date = jsDate.getDate() + "/" + (jsDate.getMonth()+1) + "/" + jsDate.getFullYear();
							}
							res.render("soumissions", {
								loginStatusOut: "out",
								soumissions: soumissions
							});
						});
					}
				});
			});
		},
		perform: {
			addLike: function (req, res, next) {
			/* soutien à un problème */
				var sessionId = req.cookies.session;
				sessions.getUsername(sessionId, function (error, username) {
					// si l'utilisateur est connecté ... 
					if (!error && username) {
						var ID = req.query.probID;
						problem.addLike(ID, username, function (error, soumissions) {
							if (!error) {
							// ... et que le soutien est accepté ... 
								problem.getProblems(10, function (error, soumissions) {
									if (error) { return next(error); }
									var i,
										jsDate;
									for (i = 0; i < soumissions.length; i++) {
										jsDate = soumissions[i].date;
										soumissions[i].date = jsDate.getDate() + "/" + (jsDate.getMonth()+1) + "/" + jsDate.getFullYear();
									}
									user.isUserAdmin(username, function (error, adminTag) {
										// ... et que l'utilisateur est administrateur.
										if (adminTag) {
											res.render("soumissions", {
												loginStatusIn: "in",
												userName: username,
												loginMsg: "Merci pour votre soutien !",
												adminSection: adminTag,
												soumissions: soumissions
											});
										// ... et que l'utilisateur n'est pas administrateur. 
										} else {
											res.render("soumissions", {
												loginStatusIn: "in",
												userName: username,
												loginMsg: "Merci pour votre soutien !",
												soumissions: soumissions
											});
										}
									});
								});
							} else {
							// Si le soutien n'est pas accepté ...
								console.log("erreur");
								var likedProblem = {loginMsg: "Désolé, vous ne pouvez pas soutenir un problème que vous avez signalé ou déjà soutenu.", loginStatusIn: "in"  };
								if (error instanceof LikedProblemYet) {
									//... parce l'utilisateur a soumis ou déjà soutenu ce problème ... 
									problem.getProblems(10, function (error, soumissions) {
										if (error) { return next(error); }
										var i,
											jsDate;
										for (i = 0; i < soumissions.length; i++) {
											jsDate = soumissions[i].date;
											soumissions[i].date = jsDate.getDate() + "/" + (jsDate.getMonth()+1) + "/" + jsDate.getFullYear();
										}
										user.isUserAdmin(username, function (error, adminTag) {
											// ... et que l'utilisateur est administrateur. 
											if (adminTag) {
												res.render("soumissions", {
													loginStatusIn: "in",
													userName: username,
													loginMsg: likedProblem,
													soumissions: soumissions,
													adminSection: adminTag
												});
											// ... et que l'utilisateur n'est pas administrateur. 
											} else {
												res.render("soumissions", {
													loginStatusIn: "in",
													userName: username,
													loginMsg: likedProblem,
													soumissions: soumissions
												});
											}
										});
									});
								} else {
									next(error); // passer erreur au gestionnaire suivant
								}
							}
						});
					// si l'utilisateur n'est pas connecté ... 
					} else {
						problem.getProblems(10, function (error, soumissions) {
							if (error) { return next(error); }
							var i,
								jsDate;
							for (i = 0; i < soumissions.length; i++) {
								jsDate = soumissions[i].date;
								soumissions[i].date = jsDate.getDate() + "/" + (jsDate.getMonth()+1) + "/" + jsDate.getFullYear();
							}

							res.render("soumissions", {
								loginStatusOut: "out",
								loginMsg: "Vous devez être connecté pour pouvoir soutenir un problème.",
								soumissions: soumissions
							});
						});
					}
				});
			}
		}
	};
};
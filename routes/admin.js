/*
 * GET pages administrateur, à savoir "admin", "gestion_probs", "gestion_cat_prob", 
 "gestion_users", "gestion_msgs" et "gestion_blog".
 */

"use strict";

var Sessions = require('../model/Sessions'),
	Users = require('../model/User'),
	Problem = require('../model/Problem'),
	Post = require('../model/Post'),
	Message = require('../model/Message');

module.exports = function (app) {

	var db = app.get("db"),
		sessions = new Sessions(db),
		users = new Users(db),
		problems = new Problem(db),
		post = new Post(db),
		message = new Message(db);

	return {
		/* route permettant l'affiche de la page "admin", qui fait office d'accueil pour l'espace administrateurs. */
		root: function (req, res, next) {
			var sessionId = req.cookies.session;
			sessions.getUsername(sessionId, function (error, username) {
				// si l'utilisateur est connecté ... 
				if (!error && username) {
					users.isUserAdmin(username, function (error, adminTag) {
						// si l'utilisateur est administrateur ... 
						if (adminTag) {
							// Une fois les vérifications faites, on va récupérer la liste des utilisateurs connectés et des soumissions pour les afficher.
							problems.getProblems(100, function (error, soumissions) {
								if (error) { return next(error); }
								var i,
									jsDate;
								for (i = 0; i < soumissions.length; i++) {
									jsDate = soumissions[i].date;
									soumissions[i].date = jsDate.getDate() + "/" + (jsDate.getMonth()+1)+ "/" + jsDate.getFullYear();
								}
								//si un administrateur a répondu de manière valide depuis la page gestion_msgs à un message d'utilisateur. 
								if (req.query.sending === "ok") {
									sessions.getOnlineUsers(function (error, onlineUsers) {
										res.render("admin", {
											loginStatusIn: "in",
											userName: username,
											soumissions: soumissions,
											onlineUsers: onlineUsers,
											adminSection: adminTag,
											loginMsg: "Merci pour votre réponse !"
										});
									});
								}
								//si un administrateur se rend simplement sur la page admin. 
								sessions.getOnlineUsers(function (error, onlineUsers) {
									res.render("admin", {
										loginStatusIn: "in",
										userName: username,
										soumissions: soumissions,
										onlineUsers: onlineUsers,
										adminSection: adminTag
									});
								});
							});
						//si l'utilisateur n'est pas administrateur...
						} else {
							res.redirect("/?adminAttempt=fail");
						}
					});
				//si l'utilisateur n'est pas connecté ... 
				} else {
					res.redirect("/?adminAttempt=fail");
				}
			});
		},
		/* Route permettant l'affichage de la page gestion_probs */
		problems: {
			input: function (req, res, next) {
				var sessionId = req.cookies.session;
				sessions.getUsername(sessionId, function (error, username) {
					// si l'utilisateur est connecté ... 
					if (!error && username) {
						users.isUserAdmin(username, function (error, adminTag) {
							// si l'utilisateur est administrateur ...
							if (adminTag) {
								// Une fois les vérifications faites, on va récupérer la liste des utilisateurs connectés et des soumissions pour les afficher.
								problems.getAllProblems(100, function (error, soumissions) {
									if (error) { return next(error); }
									var i,
										jsDate;
									for (i = 0; i < soumissions.length; i++) {
										jsDate = soumissions[i].date;
										soumissions[i].date = jsDate.getDate() + "/" + (jsDate.getMonth()+1)+ "/" + jsDate.getFullYear();
									}
									//on affiche la page "gestion_probs".
									res.render("gestion_probs", {
										loginStatusIn: "in",
										userName: username,
										soumissions: soumissions,
										adminSection: adminTag,
										firstOrSecondProblemToSelect: "selectProblemToRegroup"
									});
								});
							// si l'utilisateur n'est pas administrateur ...
							} else {
								res.redirect("/?adminAttempt=fail");
							}
						});
					//si l'utilisateur n'est pas connecté ... 
					} else {
						res.redirect("/?adminAttempt=fail");
					}
				});
			},
			//route employée après un clic sur le bouton "supprimer (un problème)'
			removeAProblem: function (req, res, next) {
				var problemID = req.query.probID;
				// suppression du problème dans la base de données (collection problems)
				problems.removeProblem(problemID, function (error, done) {
					var backURL = req.header('Referer');
					res.redirect(backURL);
				});
			},
			// route employée après un clic sur le bouton "regrouper (des problèmes)"
			selectProblemToRegroup: function (req, res, next) {
				var sessionId = req.cookies.session;
				sessions.getUsername(sessionId, function (error, username) {
					// si l'utilisateur est connecté ... 
					if (!error && username) {
						users.isUserAdmin(username, function (error, adminTag) {
							// si l'utilisateur est administrateur ...
							if (adminTag) {
								// Une fois les vérifications faites, on va récupérer la liste des utilisateurs connectés et des soumissions pour les afficher.
								problems.getAllProblems(100, function (error, soumissions) {
									if (error) { return next(error); }
									var i,
										jsDate,
										ID = req.query.probID;
									for (i = 0; i < soumissions.length; i++) {
										jsDate = soumissions[i].date;
										soumissions[i].date = jsDate.getDate() + "/" + (jsDate.getMonth()+1) + "/" + jsDate.getFullYear();
									}
									// on récupère le problème à regrouper
									problems.getProblem(ID, function (error, problemSelected) {
										jsDate = problemSelected[0].date;
										problemSelected[0].date = jsDate.getDate() + "/" + (jsDate.getMonth()+1) + "/" + jsDate.getFullYear();
										// on affiche la page gestion_probs avec, dans le cadre supérieur, le problème à regrouper
										res.render("gestion_probs", {
											loginStatusIn: "in",
											userName: username,
											soumissions: soumissions,
											adminSection: adminTag,
											firstOrSecondProblemToSelect: "regroupProblems",
											firstProblemID: ID,
											firstProblemSelected: problemSelected
										});
									});
								});
							// si l'utilisateur n'est pas administrateur ... 
							} else {
								res.redirect("/?adminAttempt=fail");
							}
						});
					// si l'utilisateur n'est pas connecté.
					} else {
						res.redirect("/?adminAttempt=fail");
					}
				});
			},
			/* route employée pour regrouper les problèmes sélectionnés, à savoir celui affiché dans le cadre supérieur + un second
			sélectionné par un clic sur le bouton "regrouper" d'un autre problème de la liste */
			regroupProblems: function (req, res, next) {
				var probID1 = req.query.firstProbID,
					probID2 = req.query.probID;
				// si les problèmes sont les mêmes 
				if (probID2 === probID1) {
					res.redirect("/gestion_probs?problemsRegroup=same");
				// si les problèmes sont différents
				} else {
					problems.regroupProblems(probID1, probID2, function (error) {
						res.redirect("/gestion_probs?problemsRegroup=true");
					});
				}
			},
			// route employée au clic sur un bouton "transmettre (un problème)" ==> transmet la signalisation du problème au service Travaux
			signalProblems: function (req, res, next) {
				var problemID = req.query.probID;
				problems.sendSignalProblemMail(problemID, function (error, problem) {
					console.log("sent mail for problem " + problem.type);
					var backURL = req.header('Referer');
					res.redirect(backURL);
				});
			},
			// route employée lorsque l'on choisit un autre statut dans le menu déroulant et qu'on valide ce changement (bouton "V(alider)")
			updateProblemStatus: function (req, res, next) {
				var problemID = req.query.probID,
					newStatus = req.body.newStatus,
					backURL = req.header('Referer');
				console.log(problemID + "   " + newStatus);

				problems.updateProblemStatus(problemID, newStatus, function (error) {
					res.redirect(backURL);
				});
			}
		},
		//route permettant l'affichage de la page "gestion_cat_prob"
		problemCategories: {
			input: function (req, res, next) {
				var sessionId = req.cookies.session;
				sessions.getUsername(sessionId, function (error, username) {
					// si l'utilisateur est connecté ... 
					if (!error && username) {
						users.isUserAdmin(username, function (error, adminTag) {
							// si l'utilisateur est administrateur ...
							if (adminTag) {
								// récupération des catégories de problèmes déjà existantes dans la base de données
								problems.getProblemSections(function (error, categories) {
									res.render("gestion_cat_prob", {
										loginStatusIn: "in",
										userName: username,
										adminSection: adminTag,
										categoriesSoumissions: categories
									});
								});
							// si l'utilisateur n'est pas administrateur ...
							} else {
								res.redirect("/?adminAttempt=fail");
							}
						});
					// si l'utilisateur n'est pas connecté ...
					} else {
						res.redirect("/?adminAttempt=fail");
					}
				});
			},
			// route permettant de supprimer une catégorie de problèmes
			removeCategory: function (req, res, next) {
				var catID = req.query.catID;
				problems.removeSection(catID, function (error, done) {
					res.redirect("/gestion_cat_probs");
				});
			},
			// route permettant d'ajouter une catégorie de problèmes
			addCategory:  function (req, res, next) {
				var catID = req.body.catID;
				console.log(catID);
				problems.addSection(catID, function (error, done) {
					res.redirect("/gestion_cat_probs");
				});
			}
		},
		usersList: {
			// route permettant l'affichage de la page gestion_users
			input: function (req, res, next) {
				var sessionId = req.cookies.session;
				// on récupère la liste des utilisateurs inscrits sur l'application dans la base de données (collection users)
				users.getUsers(function (error, allUsers) {
					if (error) { return next(error); }
					console.log("Found " + allUsers.length + " users");
					sessions.getUsername(sessionId, function (error, username) {
						// si l'utilisateur est connecté ... 
						if (!error && username) {
							users.isUserAdmin(username, function (error, adminTag) {
								// si l'utilisateur est administrateur ...
								if (adminTag) {
									res.render("gestion_users", {
										loginStatusIn: "in",
										userName: username,
										allUsers: allUsers,
										adminSection: adminTag
									});
								// si l'utilisateur n'est pas administrateur ...
								} else {
									res.redirect("/?adminAttempt=fail");
								}
							});
						// si l'utilisateur n'est pas connecté ...
						} else {
							res.redirect("/?adminAttempt=fail");
						}
					});
				});
			},
			//route permettant de supprimer un utilisateur dans la base de données
			removeAUser: function (req, res, next) {
				var userID = req.query.userID;
				users.removeUser(userID, function (error, done) {
					var backURL = req.header('Referer');
					res.redirect(backURL);
				});
			}
		},
		blog: {
			// route permettant l'affichage de la page "gestion_blog"
			input: function (req, res, next) {
				var sessionId = req.cookies.session;
				// on récupère dans la base de données les 20 derniers posts
				post.getPosts(20, function (error, posts) {
					if (error) { return next(error); }
					var i,
						jsDate;
					for (i = 0; i < posts.length; i++) {
						jsDate = posts[i].date;
						posts[i].date = jsDate.getDate() + "/" + (jsDate.getMonth()+1);
					}
					sessions.getUsername(sessionId, function (error, username) {
						// si l'utilisateur est connecté ...
						if (!error && username) {
							users.isUserAdmin(username, function (error, adminTag) {
								// si l'utilisateur est administrateur ...
								if (adminTag) {
									// si l'ajout d'une nouvelle actualité a été effectué sans problèmes
									if (req.query.new_post === "ok") {
										res.render("gestion_blog", {
											loginStatusIn: "in",
											userName: username,
											posts: posts,
											adminSection: adminTag,
											loginMsg: "Merci pour l'ajout de cette nouvelle actualité !"
										});
									}
									// si l'utilisateur veut simplement accéder à la page gestion_blog
									res.render("gestion_blog", {
										loginStatusIn: "in",
										userName: username,
										posts: posts,
										adminSection: adminTag
									});
								// si l'utilisateur n'est pas administrateur ...
								} else {
									res.redirect("/?adminAttempt=fail");
								}
							});
						// si l'utilisateur n'est pas connecté ...
						} else {
							res.redirect("/?adminAttempt=fail");
						}
					});
				});
			},
			// route employée au clic sur le bouton "envoyer (un nouveau post)"
			addPost: function (req, res, next) {
				var sessionId = req.cookies.session;
				sessions.getUsername(sessionId, function (error, username) {
					// si l'utilisateur est connecté ...
					if (!error && username) {
						users.isUserAdmin(username, function (error, adminTag) {
							// si l'utilisateur est administrateur ...
							if (adminTag) {
								var title = req.body.title,
									content = req.body.content,
									idUser = username;
								//ajout du post à la base de données (collection posts)
								post.addPost(title, content, idUser, function (error) {
									console.log("Post inserted");
									res.redirect("/gestion_blog/?new_post=ok");
								});
							// si l'utilisateur n'est pas administrateur ...
							} else {
								res.redirect("/?adminAttempt=fail");
							}
						});
					// si l'utilisateur n'est pas connecté
					} else {
						res.redirect("/?adminAttempt=fail");
					}
				});
			}
		},
		messages: {
			// route permmettant l'affichage de la page "gestion_msgs"
			input: function (req, res, next) {
				var sessionId = req.cookies.session;
				message.getMessages(function (error, messages) {
					if (error) { return next(error); }
					var i,
						jsDate;
					for (i = 0; i < messages.length; i++) {
						jsDate = messages[i].date;
						messages[i].date = jsDate.getDate() + "/" + (jsDate.getMonth()+1);
					}
					sessions.getUsername(sessionId, function (error, username) {
						// si l'utilisateur est connecté ...
						if (!error && username) {
							users.isUserAdmin(username, function (error, adminTag) {
								// si l'utilisateur est administrateur ...
								if (adminTag) {
									res.render("gestion_msgs", {
										loginStatusIn: "in",
										userName: username,
										messages: messages,
										adminSection: adminTag
									});
								// si l'utilisateur n'est pas administrateur ...
								} else {
									res.redirect("/?adminAttempt=fail");
								}
							});
						// si l'utilisateur n'est pas connecté ...
						} else {
							res.redirect("/?adminAttempt=fail");
						}
					});
				});
			},
			// route employée au clic sur le bouton "afficher (un message)"
			select: function (req, res, next) {
				var sessionId = req.cookies.session,
					idMsg = req.query.idMsg;
				message.getMessage(idMsg, function (error, msg) {
					if (error) { return next(error); }
					// récupération des infos de l'utilisateur ayant envoyé le message sélectionné
					users.getUserInfo(msg.idUser, function (error, submitter) {
						message.getMessages(function (error, messages) {
							if (error) { return next(error); }
							var i,
								jsDate;
							for (i = 0; i < messages.length; i++) {
								jsDate = messages[i].date;
								messages[i].date = jsDate.getDate() + "/" + (jsDate.getMonth()+1);
							}
							sessions.getUsername(sessionId, function (error, username) {
								// si l'utilisateur est connecté ...
								if (!error && username) {
									users.isUserAdmin(username, function (error, adminTag) {
										// si l'utilisateur est administrateur ...
										if (adminTag) {
											res.render("gestion_msgs", {
												loginStatusIn: "in",
												userName: username,
												msg: msg,
												messages: messages,
												submitter: submitter,
												adminSection: adminTag
											});
										// si l'utilisateur n'est pas administrateur ...
										} else {
											res.redirect("/?adminAttempt=fail");
										}
									});
								// si l'utilisateur n'est pas connecté
								} else {
									res.redirect("/?adminAttempt=fail");
								}
							});
						});
					});
				});
			},
			// route employée au clic sur le bouton "répondre (au message)"
			reply: function (req, res, next) {
				// récupération des infos entrées par l'administrateur répondant au message
				var response = req.body.response,
					idMsg = req.query.idMsg,
					sessionId = req.cookies.session;

				message.getMessage(idMsg, function (error, msg) {
					if (error) { return next(error); }
					// envoi du mail de réponse
					message.sendContactMail(msg.idUser, msg.subjectMsg, msg.contentMsg, response, function (error) {
						message.removeMessage(msg._id, function (error) {
							res.redirect("/gestion_msgs?sending=ok");
						});
					});
				});
			}
		}
	};
};
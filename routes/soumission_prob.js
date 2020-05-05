/*
 * GET page "soumission_prob".
 */

"use strict";

var Problem = require('../model/Problem');
var Sessions = require('../model/Sessions');
var User = require('../model/User');
var fs = require('fs');

module.exports = function (app) {

	var db = app.get("db"),
		problem = new Problem(db),
		sessions = new Sessions(db),
		user = new User(db);

	return {
		root: {
			/* route principale pour l'affichage de la page "soumission_prob" */
			input: function (req, res, next) {
				var sessionId = req.cookies.session;
				sessions.getUsername(sessionId, function (error, username) {
					if (!error && username) {
					// si l'utilisateur est connecté ... 
						problem.getProblemSectionsGrid(function (error, sections) {

							user.isUserAdmin(username, function (error, adminTag) {
							// ... et qu'il est administrateur. 
								if (adminTag) {
									res.render("soumission_prob", {loginStatusIn: "in", userName: username, adminSection: adminTag, sections: sections});
							// ... et qu'il n'est pas administrateur. 
								} else {
									res.render("soumission_prob", {loginStatusIn: "in", userName: username, sections: sections});
								}
							});
						});
					} else {
					// si l'utilisateur n'est pas connecté. 
						res.redirect("/?soumission=notLoggedIn");
					}
				});
			},
			/* route suivie lorsque l'on soumet un problème */
			perform: function (req, res, next) {

				var sessionId = req.cookies.session;
				// récupération des informations entrées par l'utilisateur ... 
				sessions.getUsername(sessionId, function (error, username) {
					// si l'utilisateur est connecté. 
					if (!error && username) {
						var	picturePath,
							type = req.body.type,
							remarques = req.body.remarques,
							street = req.body.street,
							num = req.body.num,
							postcode = req.body.postcode,
							city = req.body.city,
							idUser = username,
							latitude = req.body.latitude,
							longitude = req.body.longitude,
							answer = {type: type, remarques: remarques, street: street, num: num, postcode: postcode, city: city, idUser: username, latitude: latitude, longitude: longitude, picturePath: picturePath, errors: {}},
							errors = answer.errors;
						if (req.files.picture.name) {
							picturePath = req.files.picture.path;
						}
						problem.getProblemSectionsGrid(function (error, sections) {

							user.isUserAdmin(username, function (error, adminTag) {
								// ... soumission du problème : ... 
								problem.addProblem(type, remarques, street, num, postcode, city, idUser, latitude, longitude, picturePath, function (error, problem) {
									// ... si la soumission contient une erreur (localisation hors commune ou adresse erronée) ... 
									if (error || !problem) {
										if (adminTag) {
											// ... et si l'utilisateur est administrateur. 
											res.render("soumission_prob", {loginStatusIn: "in", userName: username, adminSection: adminTag, sections: sections, loginMsg: "la localisation que vous avez indiquée ne se trouve pas dans la commune : veuillez vous adresser à l'administration communale adéquate ou entrer l'adresse exacte."});
										} else {
											// ... et si l'utilisateur n'est pas administrateur. 
											res.render("soumission_prob", {loginStatusIn: "in", userName: username, sections: sections, loginMsg: "la localisation que vous avez indiquée ne se trouve pas dans la commune : veuillez vous adresser à l'administration communale adéquate ou entrer l'adresse exacte du problème remarqué."});
										}
									// ... si la soumission ne contient pas d'erreur. 
									} else {
										res.redirect("/soumissions?addProblem=ok");
									}
								});
							});
						});
					// si l'utilisateur n'est pas connecté. 
					} else {
						res.redirect("/?soumission=notLoggedIn");
					}
				});
			}
		}
	};
};



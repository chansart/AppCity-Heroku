/*
 * GET page "inscription".
 */

"use strict";

var User = require('../model/User');

module.exports = function (app) {

	var db = app.get("db"),
		user = new User(db),
		users = db.collection("users");

	return {
		root: {
			/* Route principale menant à la page inscription */
			input: function (req, res, next) {
				res.render("inscription", {loginStatusOut: "out"});
			},
			/* Récupère les informations entrées par l'utilisateur en cours d'inscription 
			et les valide */
			validate: function (req, res, next) {
				var name = req.body.name,
					firstname = req.body.firstname,
					login = req.body.login,
					password = req.body.password,
					verify = req.body.verify,
					telephone = req.body.telephone,
					gsm = req.body.gsm,
					mail = req.body.mail,
					street = req.body.street,
					streetNb = req.body.streetNb,
					postCode = req.body.postCode,
					city = req.body.city,
					answer = {
						name: name,
						firstname: firstname,
						login: login,
						password: password,
						telephone: telephone,
						gsm: gsm,
						mail: mail,
						street: street,
						streetNb: streetNb,
						postCode: postCode,
						city: city,
						nb_soumissions: 0,
						nb_likes: 0,
						errors : {}
					},
                    usernameRE = /^[a-zA-Z0-9_-]{3,20}$/,
                    passwordRE = /^.{3,20}$/,
                    emailRE = /^[\S]+@[\S]+\.[\S]+$/,
                    errors = answer.errors;
				// vérifie que le login compte entre 3 et 20 caractères
                if (!usernameRE.test(login)) {
                    errors.login = "Login non valide : minimum 3 et maximum 20 caractères alphanumériques";
                }
				// vérifie que le mot de passe compte entre 3 et 20 caractères
                if (!passwordRE.test(password)) {
                    errors.password = "Mot de passe non valide :  minmum 3 et maximum 20 caractères";
                }
				// vérifie que mot de passe et deuxième entrée du mot de passe sont identiques
                if (password !== verify) {
                    errors.verify = "Les mots de passe ne correspondent pas";
                }
				// vérifie qu'une adresse mail a bien été entrée, et qu'elle est valide
                if (mail !== "") {
                    if (!emailRE.test(mail)) {
                        errors.mail = "Adresse email non valide";
                    }
                }
				// vérifie que l'adresse mail n'est pas déjà dans la base de données
				users.findOne({'mail': mail}, function (error, mail) {
					if (error) { return done(error, null); }
					if (mail) { errors.mail = "Votre adresse mail existe déjà dans notre base de données. Veuillez en choisir une autre."; }
					if (Object.keys(errors).length === 0) {
						// Validé : passer la requête au gestionnaire suivant.
						next();
					} else {
						// échec : retourner à  la page d'enregistrement.
						console.log(answer);
						res.render("inscription", answer);
					}
				});
            },
			/* les infos une fois validées sont encodées dans la base de données (collection users) */
			perform: function (req, res, next) {
				var name = req.body.name,
					firstname = req.body.firstname,
					login = req.body.login,
					password = req.body.password,
					telephone = req.body.telephone,
					gsm = req.body.gsm,
					mail = req.body.mail,
					street = req.body.street,
					streetNb = req.body.streetNb,
					postCode = req.body.postCode,
					city = req.body.city,
					answer = {
						name: name,
						firstname: firstname,
						_id: login,
						password: password,
						telephone: telephone,
						gsm: gsm,
						mail: mail,
						street: street,
						streetNb: streetNb,
						postCode: postCode,
						city: city,
						nb_soumissions: 0,
						nb_likes: 0
					};
				user.addUser(answer, function (error) {
					console.log("inscription OK");
					console.log("username :" + answer._id);
					// envoi à l'utilisateur d'un mail de confirmation d'inscription
					user.sendInscriptionMail(answer._id, function (error, user) {
						// redirection de l'utilisateur vers la page d'accueil
						
					});
					res.redirect("/?signup=ok");
				});
			}
		}
	};
};

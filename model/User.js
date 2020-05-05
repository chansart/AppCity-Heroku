/*
 * objet user : cet objet représente un utilisateur du site et les fonctions
	qui lui sont liées. 
 */


"use strict";

var assert = require('assert'),
	InvalidPasswordError = require('./errors/InvalidPassword'),
	UnknownUserError = require('./errors/UnknownUser'),
	nodemailer = require('nodemailer');

module.exports = function User(db) {

	var users = db.collection("users"),
		admins = db.collection("admins");

	return {
		/* Cette fonction prend en paramètre la variable "answer" qui contient les informations entrées
		par l'utilisateur sur la page "inscription", et, si ces informations sont valides, 
		entre des informations dans la base de données (collection users). */
		addUser: function (answer, done) {
			var item,
				entry = {};
			for (item in answer) {
				if (answer[item]) {
					entry[item] = answer[item];
				}
			}
			console.log(entry);
			users.insert(entry, function (error, result) {
				if (error) { return done(error, null); }
				console.log("DB: inserted user " + entry._id);
				return done(null, result[0]);
			});
		},
		/* Cette fonction prend en argument l'id (c'est-à-dire son login) d'un utilisateur et 
		supprime cet utilisateur de la base de données (collection users). */
		removeUser: function (ID, done) {
			var query = {'_id': ID};
			console.log(query);
			users.remove(query, function (error, items) {
				console.log(items);
				if (error) { return done(error, null); }
				return done(null);
			});
		},
		/* Cette fonction retourne sous forme de tableau tous les utilisateurs contenus dans la 
		base de données (collection users). */ 
		getUsers: function (done) {
			users.find().toArray(function (error, allUsers) {
				if (error) { return done(error, null); }
				return done(error, allUsers);
			});
		},
		/* Cette fonction prend en argument l'id d'un utilisateur (c'est-à-dire son login) et retourne
		cet utilisateur, s'il existe ; dans le cas contraire, on lance l'erreur UnknownUserError. */
		getUserInfo: function (username, done) {
			users.findOne({'_id': username}, function (error, userInfo) {
				if (error) { return done(error, null); }
				if (!userInfo) { return done(new UnknownUserError(username), null); }
				return done(null, userInfo);
			});
		},
		/* Cette fonction, lancée lorsqu'un utilisateur entre ses identifiants pour se connecter à 
		l'application, prend en argument l'id (c'est-à-dire le login) et le mot de passe entré lors de 
		la connection et vérifie que l'utilisateur existe bien dans la base de données (collection users) :
		si l'id n'existe pas, on lance l'erreur UnknownUserError ; si le mot de passe ne correspond pas
		à l'ID, on lance l'erreur InvalidPasswordError. */
		validateLogin: function (username, password, done) {
			users.findOne({ '_id' : username }, function (error, user) {
				if (error) { return done(error, null); }
				if (!user) { return done(new UnknownUserError(username), null); }
				if (user.password != password) { return done(new InvalidPasswordError(username), null); }
				return done(null, user); // réussi
			});
		},
		/* Une fois que l'utilisateur a entré toutes ses informations sur la page "inscription" et que 
		celles-ci ont été validées, cette fonction prend en argument l'id (c'est-à-dire le login) de 
		l'utilisateur et lui envoie un mail reprenant ses informations de connection (login et password). */
		sendInscriptionMail: function (username, done) {
			users.findOne({'_id' : username }, function (error, user) {
				if (error) { return done(error, null); }
				var smtpTransport = nodemailer.createTransport("SMTP", {
					service: "Gmail",
					auth: {
						user: "appcity277@gmail.com",
						pass: "appCity277LSINF"
					}
				}),
					mailOptions = {
						from: "AppCity <appcity277@gmail.com>", // sender address
						to: user.mail, // list of receivers
						subject: "Inscription confirmée", // Subject line
						text: "Bonjour " + user.firstname + ", \n Votre inscription sur notre application est confirmée. \n\n Vos informations personnelles sont les suivantes : \n\n - votre login : " + user._id + "; \n - votre mot de passe : " + user.password + "; \n\n Ces informations sont bien entendu confidentielles ! \n\n Pour tout renseignement supplémentaire sur notre application, n'hésitez pas à nous contacter à l'adresse mail suivante : appcity277@gmail.com, ou directement sur notre site : localhost:3000. \n\n Bonne contribution à la maintenance de notre commune ! \n\n L'équipe d'AppCity" // plaintext body
					//html: "<b>Inscription confirmée</b>" // html body
					};
				smtpTransport.sendMail(mailOptions, function (error, response) {
					if (error) {
						console.log(error);
					} else {
						console.log("Inscription message sent: " + response.message);
					}
					smtpTransport.close(); // shut down the connection pool, no more messages
					return done(null, response);
				});
			});
		},
		/* Cette fonction prend en argument l'id (c'est-à-dire le login) de l'utilisateur et lui envoie 
		un mail lui rappelant ses informations de connection (login et password). */
		sendLostPasswordMail: function (username, done) {
			users.findOne({'_id' : username }, function (error, user) {
				if (error) { return done(error, null); }
				var smtpTransport = nodemailer.createTransport("SMTP", {
					service: "Gmail",
					auth: {
						user: "appcity277@gmail.com",
						pass: "appCity277LSINF"
					}
				}),
					mailOptions = {
						from: "AppCity <appcity277@gmail.com>", // sender address
						to: user.mail, // list of receivers
						subject: "Vos informations personnelles sur AppCity", // Subject line
						text: "Bonjour " + user.firstname + ", \n\n Vos informations personnelles sont les suivantes : \n\n - votre login : " + user._id + "; \n - votre mot de passe : " + user.password + "; \n\n Conservez ces informations précieusement ! \n\n Pour tout renseignement supplémentaire sur notre application, n'hésitez pas à nous contacter à l'adresse mail suivante : appcity277@gmail.com, ou directement sur notre site : localhost:3000. \n\n Bonne contribution à la maintenance de notre commune ! \n\n L'équipe d'AppCity" // plaintext body
					//html: "<b>Inscription confirmée</b>" // html body
					};
				smtpTransport.sendMail(mailOptions, function (error, response) {
					if (error) {
						console.log(error);
					} else {
						console.log("LostPassword message sent: " + response.message);
					}
					smtpTransport.close(); // shut down the connection pool, no more messages
					return done(null, response);
				});
			});
		},
		/* Cette fonction prend en argument l'id (c'est-à-dire le login) de l'utilisateur et renvoie 
		true si cet utilisateur est administrateur ; false sinon. */
		isUserAdmin: function (username, done) {
			admins.findOne({ '_id' : username }, function (error, user) {
				if (error) { return done(error, null); }
				if (!user) { return done(new UnknownUserError(username), null); }
				if (user) {
					return done(null, "true");
				}
			});
		}
	};
};

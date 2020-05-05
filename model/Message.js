/* objet message d'utilisateur : l'utilisateur peut envoyer ces messages à partir de la page contact, 
	et ils sont traités par les administrateurs via la page gestion_msgs*/

var ObjectID = require('mongodb').ObjectID,
	nodemailer = require('nodemailer'),
	Users = require('./User');

module.exports = function Message(db) {
	"use strict";
	var messages = db.collection("messages"),
		users = db.collection("users");

    return {
		/*cette fonction prend en argument le sujet du message, le contenu du message
		et l'id de l'utilisateur l'ayant soumis, et entre le message dans la base de 
		données (collection "messages") */
        addMessage: function (subjectMsg, contentMsg, idUser, done) {
			var entry = {
				subjectMsg: subjectMsg,
				contentMsg: contentMsg,
				idUser: idUser,  //ID de l'utilisateur ayant soumis le problème
                date: new Date()
            };

			messages.insert(entry, function (error, result) {
				if (error) { return done(error, null); }
				console.log("DB: inserted user messages " + entry.subjectMsg);
				return done(null, result[0]);
			});
        },
		/* cette fonction récupère dans la base de données (collection "messages")
		les messages entrés par les utilisateurs et les renvoie dans un ordre 
		décroissant (par rapport à la date) */
		getMessages: function (done) {
			messages.find().sort('date', 1).toArray(function (error, items) {
				if (error) { return done(error, null); }
				console.log("Found " + items.length + " messages");
				return done(error, items);
			});
		},
		/* cette fonction prend en paramètre l'id d'un message et récupère ce message 
		dans la base de données (collection "messages")*/
		getMessage: function (idMsg, done) {
			messages.findOne({'_id': new ObjectID(idMsg)}, function (error, msg) {
				if (error) { return done(error, null); }
				console.log("Found message");
				return done(error, msg);
			});
		},
		/* cette fonction prend en argument le login de l'utilisateur ayant soumis le message, le 
		sujet du message et la réponse au message (entrée via la page gestion_msgs par un administrateur),
		et envoie cette réponse par mail à l'utilisateur */
		sendContactMail: function (username, subjectMsg, contentMsg, response, done) {
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
						from: "AppCity <appcity277@gmail.com>",
						to: user.mail + ", appcity277@gmail.com",
						subject: "Réponse : " + subjectMsg,
						text: "Bonjour " + user.firstname + ", \n\n Votre message : \n" + contentMsg + "\n\n Notre réponse : \n" + response + "\n\n L'équipe d'AppCity"
					};
				smtpTransport.sendMail(mailOptions, function (error, response) {
					if (error) {
						console.log(error);
					} else {
						console.log("Contact message sent: " + response.message);
					}
					smtpTransport.close();
					return done(null, response);
				});
			});
		},
		/* cette fonction prend en argument l'id d'un message et supprime ce message
		de la base de données (collection "messages") */
		removeMessage: function (idMsg, done) {
			var query = {"_id": new ObjectID(idMsg)};
			messages.remove(query, function (error, items) {
				if (error) { return done(error, null); }
				return done(null);
			});
		}
    };
};
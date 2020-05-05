/*
* Objet Problem : cet objet représente une soumission effectuée sur l'application et les méthodes
* qui lui sont liées. 
*/


"use strict";

var Sessions = require('./Sessions'),
	LikedProblemYet = require('./errors/LikedProblemYet'),
	geocoder = require('geocoder'),
	ObjectID = require('mongodb').ObjectID,
	nodemailer = require('nodemailer'),
	_ = require('underscore'),
	fs = require('fs');

module.exports = function Problem(db) {

	var problems = db.collection("problems"),
		sessions = new Sessions(db),
		sections = db.collection("problemSections"),
		users = db.collection("users");

	return {
		/* Cette fonction prend en paramètres les informations entrées par l'utilisateur concernant
		le problème remarqué, et les inclut dans la base de données (collection problems). */
		addProblem: function (type, remarques, street, num, postcode, city, idUser, latitude, longitude, picturePath, done) {

			var entry = {
					type: type,
					street: street,
					num: num,
					postcode: postcode,
					city: city,
					likes: 1,
					likers: [],
					status: "En attente",
					idUser: idUser,  //ID de l'utilisateur ayant soumis le problème
					latitude: latitude,
					longitude: longitude,
					date: new Date()
				},
				position = [];
			if (picturePath) {
				entry['hasPicture'] = "true";
			}

			if (remarques) {
				entry.remarques = remarques;
			}
			// SI l'utilisateur avait entré directement les coordonnées, on conserve celles ci, et on va tenter de récupérer l'adresse la plus proche à l'aide du geocoder de google Maps.
			if (latitude && longitude) {
				position[0] = latitude;
				position[1] = longitude;
				entry.position = position;

				// reverse geocoding :
				var lat = parseFloat(latitude),
					lng = parseFloat(longitude),
					i;
				geocoder.reverseGeocode(lat, lng, function (err, address) {
					if (err) { return done(err, null); }


					for (i = 0; i < address['results'][0]['address_components'].length; i++) {
						//console.log(address['results'][0]['address_components'][i]['types']);
						if (_.contains(address['results'][0]['address_components'][i]['types'], 'street_number')) {
							entry.num = address['results'][0]['address_components'][i]['long_name'];
						} else if (_.contains(address['results'][0]['address_components'][i]['types'], 'postal_code')) {
							entry.postcode = address['results'][0]['address_components'][i]['long_name'];
						} else if (_.contains(address['results'][0]['address_components'][i]['types'], 'route')) {
							entry.street = address['results'][0]['address_components'][i]['long_name'];
						} else if (_.contains(address['results'][0]['address_components'][i]['types'], 'locality')) {
							entry.city = address['results'][0]['address_components'][i]['long_name'];
						}
					}
					

					// on vérifie que le problème se situe bien dans la commune
					if (entry.postcode != 1348 && entry.postcode != 1340) {
						return done(err, null);
					}
					// on insère le problème dans la base de données (collection problems)
					problems.insert(entry, function (error, result) {
						if (error) { return done(error, null); }
						console.log("DB: inserted problem (address) : " + entry.type);
						// on trouve dans la base de données (collection users) l'utilisateur qui a soumis le problème
						users.findOne({'_id': entry.idUser}, function (error, user) {
							if (error) { return done(error, null); }
							// on update le nombre de ses soumissions (+1)
							users.update({'_id': entry.idUser}, {'$inc': {nb_soumissions: 1}}, function (error, updatedUser) {
								if (error) { return done(error, null); }
								console.log("updated nb_soumissions for user : " + entry.idUser);
								// S'il y a une photo avec le problme on enregistre celle-ci. On tire ici parti du caractère asynchrone de l'application : on attend pas que le transfert soit terminé pour poursuivre l'exécution.
								if (picturePath) {
									fs.readFile(picturePath, function (err, data) {
										if (!error) {
											var newPath = __dirname + "/../data/pictures/" + result[0]._id;
											fs.writeFile(newPath, data, function (error) {
												console.log(error);
											});
										}
									});
								}
								return done(null, updatedUser);
							});
						});
					});
				});
			// Autrement on utilise celles produites pas le geocoder de google Maps.
			} else {
				geocoder.geocode(street + " " +  num + "," + city, function (err, data) {
					var i;
					for (i = 0; i < data.results.length; i++) {
						position[0] = data.results[i].geometry.location.lat;
						position[1] = data.results[i].geometry.location.lng;
					}
					entry.position = position;
					// on vérifie que le problème se situe bien dans la commune couverte
					if (postcode != 1348 && entry.postcode != 1340) {
						return done(err, null);
					}
					// on insère le problème dans la base de données (collection problems)
					problems.insert(entry, function (error, result) {
						if (error) { return done(error, null); }
						console.log("DB: inserted problem (geocoding) : " + entry.type);
						// on trouve dans la base de données (collection users) l'utilisateur ayant soumis le problème
						users.findOne({'_id': entry.idUser}, function (error, user) {
							if (error) { return done(error, null); }
							//on update le nombre de ses soumissions
							users.update({'_id': entry.idUser}, {'$inc': {nb_soumissions: 1}}, function (error, updatedUser) {
								if (error) { return done(error, null); }
								console.log("updated nb_soumissions for user : " + entry.idUser);
								// S'il y a une photo avec le problme on enregistre celle-ci. On tire ici parti du caractère asynchrone de l'application : on attend pas que le transfert soit terminé pour poursuivre l'exécution.
								if (picturePath) {
									fs.readFile(picturePath, function (err, data) {
										if (!error) {
											var newPath = __dirname + "/../data/pictures/" + result[0]._id;
											fs.writeFile(newPath, data, function (error) {
												console.log(error);
											});
										}
									});
								}
								return done(null, updatedUser);
							});
						});
					});
				});
			}
		},
		// Récupération des problèmes qui ont été validés par un admin
		getProblems: function (count, done) {
			problems.find({"status": {$not: /En attente/}}).sort('date', -1).limit(count).toArray(function (error, items) {
				if (error) { return done(error, null); }
				return done(error, items);
			});
		},
		// récupération d'un problème présent dans la base de données (collection problems) 
		// grâce à son ID
		getProblem: function (ID, done) {
			ID = new ObjectID(ID);
			problems.find({"_id": ID}).toArray(function (error, item) {
				if (error) { return done(error, null); }
				return done(error, item);
			});
		},
		// Récupération de tous les problèmes par l'admin, entre autres pour les valider.
		getAllProblems: function (count, done) {
			problems.find().sort('date', -1).limit(count).toArray(function (error, items) {
				if (error) { return done(error, null); }
				console.log("Found " + items.length + " problems");
				return done(error, items);
			});
		},
		// Changement du statut du problème dans la base de données
		updateProblemStatus: function (problemID, status, done) {
			var mongoID = new ObjectID(problemID);
			problems.update({"_id": mongoID}, {$set: {"status": status} }, function (error, prob) {
				if (error) { return done(error, null); }
				return done(null, prob);
			});
		},
		// récupération de tous les problèmes soumis par un utilisateur 
		getProblemsByUser: function (userId, done) {
			problems.find({ idUser: userId}).sort('date', -1).toArray(function (error, items) {
				if (error) { return done(error, null); }
				console.log("Found " + items.length + " problems");
				return done(error, items);
			});
		},
		// récupération de tous les problèmes soutenus par un utilisateur
		getProblemsByLiker: function (userId, done) {
			problems.find({ likers: userId}).sort('date', -1).toArray(function (error, items) {
				if (error) { return done(error, null); }
				console.log("Found " + items.length + "problems");
				return done(error, items);
			});
		},
		// méthode permettant d'updater le nombre de likes d'un problème ainsi que le nombre de soutiens
		// de l'utilisateur ayant soutenu le problème
		addLike: function (ID, userId, done) {
			ID = new ObjectID(ID);
			var query = {'_id': ID},
			updating = { '$inc': {likes: 1}, '$push': {likers: userId}};
			problems.findOne({'$and': [{'_id': ID}, {likers: {$ne: userId}}, {idUser: {$ne: userId}}]}, function (error, prob) {
				if (error) { return done(new LikedProblemYet(userId), null); }
				if (!prob) { return done(new LikedProblemYet(userId), null); }
				problems.update(query, updating, function (error, my_prob) {
					if (error) { return done(error, null); }
					console.dir("addLike prob " + ID + " : incremented");
					users.findOne({'_id': userId}, function (error, user) {
						if (error) { return done(error, null); }
						users.update({'_id': userId}, {'$inc': {nb_likes: 1}}, function (error, updatedLikesUser) {
							if (error) { return done(error, null); }
							console.log("updated nb_likes for user : " + userId);
							return done(null, updatedLikesUser);
						});
					});
				});
			});
		},
		// méthode permettant le regroupement de deux problèmes par un administrateur
		regroupProblems: function (ID1, ID2, done) {
			ID1 = new ObjectID(ID1);
			ID2 = new ObjectID(ID2);
			problems.findOne({"_id": ID1}, function (error, item1) {
				if (error) { return done(error, null); }
				problems.findOne({"_id": ID2}, function (error, item2) {
					if (error) { return done(error, null); }


					item1.likes = item1.likes + item2.likes;
					item2.likers.push(item1.idUser);
					var newLikersObj = {},
						tempLikers = item1['likers'].concat(item2['likers']),
						i;

					for (i = 0; i < tempLikers.length ; i++) {
						if (tempLikers[i] in newLikersObj) {
							tempLikers.splice(i, 1);
						} else {
							newLikersObj[tempLikers[i]] = true;
						}
					}

					item1['likers'] = tempLikers;
					problems.save(item1, function (error, done) {
						if (error) { return (error, null); }
						problems.remove({"_id":ID2} , function (error, done) {
							if (error) { return (error, null); }
							return (null, null);
						});

					});

					return done(null);
				});
			});
		},
		// suppression d'un problème dans la base de données (collection problems)
		removeProblem: function (ID, done) {
			var query = {"_id": new ObjectID(ID)};
			console.log(query);
			problems.remove(query, function (error,items) {
				console.log(items);
				if (error) { return done(error, null); }
				return done(null);
			});
		},
		// méthode permettant l'envoi d'un mail au Service Travaux ; mail contenant le 
		// descriptif du problème à traiter
		sendSignalProblemMail: function (problemID, done) {
			problems.findOne({'_id': new ObjectID(problemID)}, function (error, problem) {
				if (error) { return done(error, null); }
				var smtpTransport = nodemailer.createTransport("SMTP", {
					service: "Gmail",
					auth: {
						user: "appcity277@gmail.com",
						pass: "appCity277LSINF"
					}
				});
				var mailOptions = {
					from: "AppCity <appcity277@gmail.com>", // sender address
					to: "serviceTravaux@gmail.com", // list of receivers
					subject: "Problème : " + problem.type, // Subject line
					text: "Bonjour, \n\n Veuillez prendre connaissance du problème suivant pour résolution : \n\n - type : " + problem.type + " ;\n - adresse : " + problem.street + ", " + problem.num + " ;\n - coordonnées géographiques : " + problem.position + " ; \n - remarques éventuelles : " + problem.remarques + " ; \n\n Merci de nous informer de la résolution de ce problème. \n\n Bonne contribution à la maintenance de notre commune ! \n\n L'équipe d'AppCity" // plaintext body
				};
				smtpTransport.sendMail(mailOptions, function (error, response) {
					if (error) {
						console.log(error);
					} else {
						console.log("Signal problem message sent");
					}
					smtpTransport.close(); // shut down the connection pool, no more messages
					problems.update({"_id": new ObjectID(problemID)}, {$set: {"status":"en cours de réparation"} }, function (error, prob) {
						if (error) { return done(error, null); }
						return done(null, prob);
					});
				});
			});
		},
		// récupération de la grille de catégories de problèmes
		getProblemSectionsGrid: function (done) {
			sections.find().toArray(function (error, items) {
				if (error) { return done(error, null); }

				var sectionsToReturn = {};
				sectionsToReturn[0] = [];
				sectionsToReturn[1] = [];
				sectionsToReturn[2] = [];
				sectionsToReturn[3] = [];
				var	j = 0,
					i;
				for (i = 0; i < items.length; i++) {
					sectionsToReturn[j].push(items[i]);
					j++;
					if (j > 3) {
						j = 0;
					}
				}
				return done(null, sectionsToReturn);
			});
		},
		// récupération des catégories de problèmes
		getProblemSections: function (done) {
			sections.find().toArray(function (error, items) {
				if (error) { return done(error, null); }
				return done(null, items);
			});
		},
		// suppression d'une catégorie de problèmes
		removeSection: function (catID, done) {
			sections.remove({"_id": catID}, function (error) {
				if (error) { return done(error, null); }
				return done(null);
			});
		},
		// ajout d'une catégorie de problèmes
		addSection: function (catID, done) {
			sections.save({"_id": catID}, function (error) {
				if (error) { return done(error, null); }
				return done(null);
			});
		}
	};
};



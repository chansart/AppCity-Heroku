//enregistrement.feature

module.exports = function(){ 

	var assert = require('assert'); // module fourni par node.js (donc pas besoin de l'instaler avec npm)
	var should = require('should'); // module installé par `npm install` (voir package.json)
	var User = require('../../model/User');
	
	var world = this;
	

	this.Given(/^le citoyen demande l'identifiant "([^"]*)"$/, function (login, done) {  
		world.login = login;
		done(); 
	}); 	 

	this.Given(/^le citoyen demande le mot de passe "([^"]*)"$/, function (mdp, done) {
		world.mdp = mdp;
		done();
	});

	this.Given(/^Un autre compte a déjà comme identifiant "([^"]*)"$/, function(login, done) {
		world.usersCollection =  this.db.collection("users"); 
		world.usersCollection.insert({"_id":login}, function (error, result){
			done();
		});
	});

	this.Given(/^Un autre compte a déjà comme adresse e-mail "([^"]*)"$/, function(mail, done) {
		world.usersCollection =  this.db.collection("users"); 
		world.usersCollection.insert({"_id":"xx", "mail":mail}, function (error, result){
			done();
		});
	});

	this.Given(/^Aucun autre compte n'a l'adresse mail "([^"]*)"$/, function (mail, done) { 
		world.mail = mail;
		done(); 
	}); 

	this.Given(/^tous les champs du formulaire sont remplis$/, function (done) { 
		done(); 
	}); 
	this.Given(/^Aucun autre compte n'a comme identifiant "([^"]*)"$/, function(login, done) {
		// Lors des tests on crée les collections via "hooks.js" donc si on ne fait rien il n'y a pas d'utilisateur avec un tel identifiant dans la collection
		done();
	});


	this.When(/^le citoyen fait la demande de compte$/, function (done) { 
		world.users = new User(this.db);
		var usersColl = this.db.collection("users"); 
		var errors = {};
		usersColl.findOne({'mail': world.mail}, function (error, mail) {
			if (error) { return done(error, null); }
			if (mail) { return done(); }
			if (Object.keys(errors).length === 0) {
				// Validé
				world.users.addUser({"_id":world.login, "mail":world.mail, "password":world.mdp}, function(error){
					usersColl.find().toArray(function(error, rez){
					});
					done();
				});
			} else {
				// Ou pas
				done();
			}
		}); 
	}); 

	this.Then(/^le compte est créé avec les informations données par le citoyen$/, function (done) {
		world.users.getUserInfo(world.login, function(error, userInfo){
			if(error){done.fail();}
			done();
		});
	}); 

	this.Then(/^un message informe le citoyen du succès de sa création de compte$/, function (done) { 
		// Interface
		done(); 
	}); 

	this.Then(/^un e\-mail est envoyé au citoyen via l'adresse e\-mail "([^"]*)" susmentionnée$/, function (mail, done) { 
		//
		done(); 
	});  

	this.Then(/^un message informe le citoyen que l'identifiant est déjà utilisé et qu'il doit en choisir un autre$/, function (done) { 
		// Interface
		done(); 
	});  

	this.Then(/^un message informe le citoyen que l'adresse e\-mail est déjà utilisée$/, function (done) { 
		// Interface
		done(); 
	}); 

	this.Then(/^un message propose au citoyen de recommencer l'opération avec une autre adresse e\-mail$/, function (done) { 
		// Interface
		done(); 
	}); 

};




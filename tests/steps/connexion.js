//Connexion.feature

module.exports = function(){

	var assert = require('assert'); 
	var should = require('should'); 
	var User = require('../../model/User');
	var Session = require('../../model/Sessions');

	var world = this;

	this.Given(/^L'utilisateur entre comme login "([^"]*)" et comme mot de passe "([^"]*)"$/, function (login, mdp, done) { 
		world.login = login;
		world.mdp = mdp;
		done();
	}); 

	this.Given(/^Le mot de passe "([^"]*)" correspond au login "([^"]*)"$/, function (mdp, login, done) {

		this.collectionUsers = this.db.collection("users");
		this.collectionUsers.insert({"_id":login, "password":mdp}, function (error, result){			
			done(); 
		});



	}); 

	this.Given(/^Le mot de passe "([^"]*)" ne correspond pas au login "([^"]*)"$/, function (mdp, login, done) { 
		
		this.collectionUsers = this.db.collection("users");
		this.collectionUsers.insert({"_id":login, "password":"xxx"}, function (error, result){
			done(); 
		});
	}); 

	this.When(/^L'utilisateur demande la connexion$/, function (done) { 
		var users = new User(this.db);
		var sessions = new Session(this.db);
		users.validateLogin(world.login, world.mdp, function(error, user){
			if(!error){
				sessions.startSession(world.login, function(error, sessionID){
					world.sessionID = sessionID;
					done(); 
				});
			}
			else{
				done(); 
			}
		});

	}); 

	this.Then(/^L'utilisateur passe en mode "([^"]*)"$/, function (status, done) { 
		var sessions = new Session(this.db);
		sessions.getUsername( world.sessionID,  function(error, username){
			if (!error){
				username.should.eql(world.login);
				done();
			}
			else{
				console.log(error);
				done.fail();
			}
		});
		
	}); 

	this.Then(/^Un message informe l'utilisateur qu'il est bien connecté$/, function (done) { 
		// Interface
		done(); 
	}); 

	this.Then(/^Un message informe l'utilisateur que la connexion a échoué car ses informations de connexion sont incorrectes$/, function (done) { 
		// Interface
		done(); 
	});


};
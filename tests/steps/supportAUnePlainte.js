//supportAUnePlainte.feature

module.exports = function(){


	var assert = require('assert'); // module fourni par node.js (donc pas besoin de l'instaler avec npm)
	var should = require('should'); // module installé par `npm install` (voir package.json)
	var User = require('../../model/User');
	var Sessions = require('../../model/Sessions');
	var Problem = require('../../model/Problem');
	var mongoID = require('mongodb').ObjectID;
	var world = this;
	


	this.Given(/^le citoyen s'est connecté grâce à son compte dont le login est "([^"]*)"$/, function (login, done) { 
		var sessions = new Sessions(this.db);
		world.login = login;
		sessions.startSession(world.login, function(error, sessionID){
			world.sessionID = sessionID;
		});
		
		done(); 
	}); 

	this.Given(/^la plainte porte l'ID "([^"]*)"$/, function (id, done) {
		world.probID = id;
		done(); 
	}); 

	this.Given(/^la plainte portant le numéro d'ID "([^"]*)" que le citoyen veut soutenir a été postée par le compte dont le login est "([^"]*)"$/, function (id, login, done) { 
		world.posterID = login;
		world.problemCollection = this.db.collection("problems");
		world.problemCollection.insert({"_id":new mongoID(world.probID), "idUser" : login, "likes":1, "likers":[]}, function (error, result) {
			if (error) {return done.fail();}
			done(); 	
		});
	}); 

	this.When(/^le citoyen apporte son soutien à la plainte d'ID "([^"]*)"$/, function (id, done) { 
		world.problems = new Problem(this.db);
		world.problems.addLike(world.probID, world.login, function(error, likes){
			done();
		});
	}); 

	this.Then(/^Le nombre de soutiens à la plainte d'ID "([^"]*)" augmente de (\d+)$/, function (id, likes, done) { 
		world.problemCollection.findOne({"_id": new mongoID(world.probID)}, function(error, problem){
			problem.likes.should.eql(2);
			problem.likers.should.containEql(world.login);
			done();
		});
		
	}); 

	this.Then(/^Un message informe le citoyen que soutient à la plainte a été accepté$/, function (done) { 
		// Interface
		done(); 
	}); 

	this.Then(/^Un message informe le citoyen qu'il ne peut pas apporter son soutien à ses propres plaintes$/, function (done) { 
		//Interface
		done(); 
	}); 

};


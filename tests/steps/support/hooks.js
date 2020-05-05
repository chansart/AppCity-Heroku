var mongo = require('mongodb').MongoClient;


var myHooks = function () {
//	Ce code s’exécute avant l’exécution de chaque scénario.
	this.Before(function (done) {
		var world = this; // sauver le world car on aura besoin le référencer
		mongo.connect('mongodb://localhost/tests', function(error, db) {
			if (error) throw error;
			world.db = db; // ici ‘this’ ne pointe pas vers le world; on utilise donc la variable ‘world’ qu’on a crée
			db.dropDatabase(function(error, result) {
				if (error) throw error;
				done();
			});
		});
	});

//	Ce code s’exécute après l’exécution de chaque scénario.
	this.After(function (done) {
		this.db.close(true, function(error, result) {
			if (error) throw error;
			done();
		});
	});

};

module.exports = myHooks;
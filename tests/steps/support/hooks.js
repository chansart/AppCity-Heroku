var mongo = require('mongodb').MongoClient;


var myHooks = function () {
//	Ce code s�ex�cute avant l�ex�cution de chaque sc�nario.
	this.Before(function (done) {
		var world = this; // sauver le world car on aura besoin le r�f�rencer
		mongo.connect('mongodb://localhost/tests', function(error, db) {
			if (error) throw error;
			world.db = db; // ici �this� ne pointe pas vers le world; on utilise donc la variable �world� qu�on a cr�e
			db.dropDatabase(function(error, result) {
				if (error) throw error;
				done();
			});
		});
	});

//	Ce code s�ex�cute apr�s l�ex�cution de chaque sc�nario.
	this.After(function (done) {
		this.db.close(true, function(error, result) {
			if (error) throw error;
			done();
		});
	});

};

module.exports = myHooks;
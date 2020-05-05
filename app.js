"use strict";

var express = require('express'),
    engines = require('consolidate'),
    path = require('path'),
    routes = require('./routes'),
    mongo = require('mongodb').MongoClient,
	mongoURL = process.env.MONGOHQ || 'mongodb://localhost/appCity';

mongo.connect(mongoURL, function(error, db) {

    if(error) throw error;

    var app = express();

    app.engine('html', engines.hogan);

    app.set('db', db);
    app.set('/', __dirname);
    app.set('port', process.env.PORT || 3000);
    app.set('view engine', 'html'); // associer extension .html au moteur de templates
    app.set('views', path.join(__dirname, 'views'));
	
    
    // Middleware pour afficher les requêtes à la console.
    app.use(express.logger('dev'));

    // Middleware pour supporter les cookies.
    app.use(express.cookieParser());

    // Middleware pour gérer les requêtes POST.
    app.use(express.bodyParser());

    routes(app);

    app.listen(app.get('port'));

    console.log('Listening on port %d', app.get('port'));
});
	

"use strict";

var express = require('express'),
    path = require('path');

module.exports = exports = function (app) {

    var handlers = {
            accueil: require('./accueil')(app),
            contact: require('./contact')(app),
            admin: require('./admin')(app),
            soumissions: require('./soumissions')(app),
            espace_perso: require('./espace_perso')(app),
            soumission_prob: require('./soumission_prob')(app),
			inscription: require('./inscription')(app),
			session: require('./session')(app),
			aide: require('./aide')(app)
		};
	//route vers l'accueil
    app.get('/', handlers.accueil.root);
	//routes pour la page soumissions
    app.get('/soumissions', handlers.soumissions.root);
    app.post('/addLike', handlers.soumissions.perform.addLike);
    //routes pour la page soumission_prob
    app.get('/soumission_prob', handlers.soumission_prob.root.input);
    app.post('/soumission_prob', handlers.soumission_prob.root.perform);
	//route pour la page espace_perso
    app.get('/espace_perso', handlers.espace_perso.root);
    //routes pour la page contact
    app.get('/contact', handlers.contact.root.input);
	app.post('/contact', handlers.contact.root.perform);
	//routes pour la page aide
	app.get('/aide', handlers.aide.root);
	app.post('/aide', handlers.aide.lostPassword);
    //routes pour les pages administration (gestion_probs, gestion_cet_prob, gestion_users, gestion_blog, gestion_msgs, admin)
	app.get('/admin', handlers.admin.root);
    app.post('/removeProb', handlers.admin.problems.removeAProblem);
    app.post('/selectProblemToRegroup', handlers.admin.problems.selectProblemToRegroup);
    app.post('/regroupProblems', handlers.admin.problems.regroupProblems);
	app.post('/signalProbs', handlers.admin.problems.signalProblems);
    app.post('/updateProbStatus', handlers.admin.problems.updateProblemStatus);
	app.get('/gestion_probs', handlers.admin.problems.input);
	app.get('/gestion_cat_probs', handlers.admin.problemCategories.input);
	app.post('/removeCat', handlers.admin.problemCategories.removeCategory);
	app.post('/addCat', handlers.admin.problemCategories.addCategory);
	app.get('/gestion_users', handlers.admin.usersList.input);
	app.post('/removeUser', handlers.admin.usersList.removeAUser);
	app.get('/gestion_blog', handlers.admin.blog.input);
	app.post('/gestion_blog', handlers.admin.blog.addPost);
	app.get('/gestion_msgs', handlers.admin.messages.input);
	app.post('/selectMsg', handlers.admin.messages.select);
	app.post('/replyMsg', handlers.admin.messages.reply);
	//routes pour la connection des utilisateurs
	app.post('/login', handlers.session.clearSessionsIfAny);
	app.post('/login', handlers.session.login);
	app.post('/logout', handlers.session.logout);
    //routes pour la page inscription
    app.get('/inscription', handlers.inscription.root.input);
    app.post('/inscription', handlers.inscription.root.validate);
    app.post('/inscription', handlers.inscription.root.perform);

    app.use(express.static(app.get("views")));
};
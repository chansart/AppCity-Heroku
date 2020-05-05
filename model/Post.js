/* objet post : représente un post apparaissant sur le blog de la page d'accueil
et les fonctions qui y sont liées */

"use strict";

module.exports = function Post(db) {

    var posts = db.collection("posts");

    return {
		/* Cette fonction prend en argument le titre du post, son contenu et l'id de l'administrateur
		l'ayant ajouté, et ajoute ces informations, ainsi que la date du post, à la base de données
		(collection posts) */
        addPost: function (title, content, idUser, done) {
            var entry = {
				title: title,
				content: content,
				idUser: idUser,  //ID de l'utilisateur ayant soumis le problème
                date: new Date()
            };

			posts.insert(entry, function (error, result) {
				if (error) { return done(error, null); }
				console.log("DB: inserted post " + entry.title);
				return done(null, result[0]);
			});
        },
		/* Cette fonction prend en argument un nombre x de posts à récupérer dans la base de
		données (collection posts) et renvoie, sous forme de tableau, les x posts les plus récents */
		getPosts: function (count, done) {
			posts.find().sort('date', -1).limit(count).toArray(function (error, items) {
				if (error) { return done(error, null); }
				console.log("Found " + items.length + " posts");
				return done(error, items);
			});
		}
    };
};
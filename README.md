# AppCity

## Usage

LANCER L'APPLICATION

- en ligne

	Entrez l'adresse http://appcity4olln.herokuapp.com/ dans votre navigateur. 
	
- en local
	Veillez à ce que la base de données MongoDB soit installée sur votre ordinateur.
	Lancez MongoDB. 
	
	Via l'invite de commandes, rendez-vous dans le répertoire du projet et exécutez les commandes
		npm install
		node app.js (ou npm start)
	
	Ouvrez votre navigateur et connectez-vous à l'adresse http://localhost:3000/	


UTILISER L'APPLICATION 

- en tant qu'administrateur
	Avant que tout utilisateur ne puisse accéder au site, il faut qu'un administrateur
	se crée manuellement un profil d'administrateur dans la base de données. 
	Pour cela :
	
	SI VOUS EMPLOYEZ LE SITE EN LIGNE
	rendez-vous sur la page https://app.mongohq.com/ ; connectez-vous grâce à l'email 
	appcity277@gmail.com et au mot de passe appCity277 ; sélectionnez sur l'écran d'accueil 
	la base de données appCity ; sélectionnez la collection admins ; cliquez sur le bouton
	"Add Document" en haut à droite de l'écran ; remplacez la valeur de l'_id par votre 
	nom d'utilisateur (entre guillemets) et cliquez sur "Save document". 
	
	rendez-vous sur la page d'accueil d'AppCity et inscrivez-vous avec le même nom d'utilisateur
	(login) que celui entré dans la collection admins. 
	
	SI VOUS EMPLOYEZ LE SITE EN LOCAL 
	Connectez-vous à MongoDB en ligne de commandes et exécutez les commandes suivantes : 
		use appCity (sélection de la base de données)
		db.admins.insert({'_id': '<votre_nom_d'utilisateur>'})
		
	Si vous souhaitez vérifier que votre insertion a bien été effectuée, exécutez la commande suivante : 
		db.admins.find({'_id': '<votre_nom_d'utilisateur>'})
		
	Dans une autre invite de commandes, lancez l'application en local comme expliqué ci-dessus,
	rendez-vous sur la page d'accueil de l'application et inscrivez-vous avec le même nom d'utilisateur
	(login) que celui entré dans la collection admins.
	
	DANS LES DEUX SITUATIONS
	Une fois ceci fait, connectez-vous à l'application grâce à vos identifiants, et rendez-vous sur la 
	page "Gestion des catégories de problèmes", sous l'onglet "Administration". Entrez-y les différentes
	catégories de problèmes que peuvent soumettre les utilisateurs. 
	
	Rem: vous pourrez modifier ces catégories par la suite. 
	
- en tant qu'utilisateur
	Si vous avez correctement suivi les instructions concernant le lancement de l'application, vous devriez
	pouvoir avoir accès à l'entièreté de ses fonctionnalités, moyennant une inscription (gratuite) pour certaines
	pages. 
	
TESTS
- BDD
	Via une invite de commande, entrez la commande suivante à partir du répertoire du projet :
		npm run-script bdd
		
- TDD





Created with [Nodeclipse v0.5](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))   

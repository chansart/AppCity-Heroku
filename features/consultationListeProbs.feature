Feature: consultation de la liste des problèmes soumis

Un uilisateur peut consulter une liste de problèmes préalablement soumis régulièrement actualisée. 

	Scenario: consultation de la liste générale avec profil de citoyen
	
		Given le citoyen possède un profil d'utilisateur de type "citoyen"
		When le citoyen est "connecté" au site grâce à ses identifiants
		And il va sur la page sur laquelle se trouve le tableau
		Then le citoyen a accès au tableau reprenant tous les problèmes soumis jusqu'à présent, et leur localisation
		And le tableau contient également l'état d'avancement de chaque problème soumis
		And le tableau contient la fonctionnalité "+1", permettant au citoyen d'appuyer un problème existant
		
	Scenario: consultation de la liste personnelle avec profil de citoyen
	
		Given le citoyen possède un profil d'utilisateur de type "user"
		When le citoyen est "connecté" au site grâce à ses identifiants
		And le citoyen se trouve sur la page Mon espace Perso
		Then le citoyen a accès au tableau reprenant tous les problèmes liés à son adresse mail "citoyen1@falsecity.be"
		And le tableau contient également les statuts de chaque problème soumis
		And le tableau contient aussi les problèmes auxquels le citoyen a apporté son soutien
		
	Scenario: consultation de la liste générale sans profil d'utilisateur
	
		Given le citoyen ne possède pas de profil d'utilisateur
		When le citoyen se rend sur la page du site
		And il va sur la page sur laquelle se trouve le tableau
		Then le citoyen a accès au tableau reprenant tous les problèmes soumis jusqu'à présent, et leur localisation
		And le tableau contient également l'état d'avancement de chaque problème soumis
		
	Scenario: consultation de la liste générale en tant que fonctionnaire
	
		Given le citoyen possède un profil d'utilisateur de type "fonctionnaire"
		When le fonctionnaire est "connecté" au site grâce à ses identifiants
		And il va sur la page sur laquelle se trouve le tableau
		Then le fonctionnaire a accès au tableau reprenant tous les problèmes soumis jusqu'à présent, et leur localisation
		And le tableau contient également l'état d'avancement de chaque problème soumis
		And le fonctionnaire peut modifier ces états d'avancement
		
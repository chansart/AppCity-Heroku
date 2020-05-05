@supported
Feature: Connexion au site
	Un utilisateur, citoyen ou fonctionnaire, peut se connecteur au site via son login et mot de passe

	Scenario: Les informations entrées sont correctes
		Given L'utilisateur entre comme login "JeanPol3" et comme mot de passe "IloveU"
		And Le mot de passe "IloveU" correspond au login "JeanPol3"
		When L'utilisateur demande la connexion
		Then L'utilisateur passe en mode "connecté"
		And Un message informe l'utilisateur qu'il est bien connecté
		
	Scenario: Les informations entrées sont incorrectes
		Given L'utilisateur entre comme login "JeanPol" et comme mot de passe "IDontLoveU"
		And Le mot de passe "IDontLoveU" ne correspond pas au login "JeanPol"
		When L'utilisateur demande la connexion
		Then Un message informe l'utilisateur que la connexion a échoué car ses informations de connexion sont incorrectes
		#Par mesure de sécurité on ne dit pas si le login existe ou pas.
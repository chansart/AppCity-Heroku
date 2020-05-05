Feature: Mise à jour de la page d'accueil
	Un fonctionnaire peut changer le contenu de la page d'accueil du site
	
	Background: 
		Given L'utilisateur est "connecté" au site avec le compte dont le login est "MrX"
	
	Scenario: L'utilisateur ajoute un article
		Given le compte dont le login est "MrX" est un compte de type "fonctionnaire"
		And l'article a le titre "InfrastructuresLoisirs"
		And la date de l'article est "27/3/2014"
		And le contenu de l'article est "blablabla"
		When L'utilisateur ajoute un article de la page d'accueil
		And l'article le plus récent apparait au sommet des autres articles
		
		
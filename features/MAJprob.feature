Feature: Mise à jour de l'état d'avancement d'un problème. 

	Un fonctionnaire peut mettre à jour l'état d'avancement d'un problème. 
	
	Background: 
		Given l'utilisateur est "connecté" au site avec le compte dont le login est "MrX"
		And "MrX" est un compte de type "fonctionnaire"
	
	Scenario: le traitement du problème est en cours
		Given le service travaux a signalé le début d'une intervention pour le problème dont l'ID est "54ghirk"
		When l'utilisateur clique sur le menu déroulant correspondant au problème dont l'ID est "54ghirk"
		And les trois statuts possibles apparaissent
		And l'utilisateur clique sur le statut "en cours"
		Then le statut du problème est mis à jour dans la base de données
		And le problème apparait comme "en cours" sur le site
		
	Scenario: le problème est résolu
		Given le service travaux a signalé la résolution du problème dont l'ID est "54ghirk"
		When l'utilisateur clique sur le menu déroulant correspondant au problème dont l'ID est "54ghirk"
		And les trois statuts possibles apparaissent
		And l'utilisateur clique sur le statut "résolu"
		Then le statut du problème est mis à jour dans la base de données
		And le problème apparait comme "résolu" sur le site
		And il est déplacé dans la partie "résolu" du tableau
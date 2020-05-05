Feature: Soumission d’un problème
	
	Les citoyens peuvent soumettre des problèmes liés à l'espace public à l'aide d'un formulaire.

	Background: 
		Given la catégorie du problème est "niddepoule"
		And l'utilisateur est "connecté" au site en tant que "citoyen"

	Scenario: première soumission d’un problème 			
		Given la localisation du problème est "rueloiseau175555FalseCity"
		And la catégorie "niddepoule" n'existe pas encore pour l'adresse "rueloiseau175555FalseCity"
		And l'adresse "rueloiseau175555FalseCity" est située dans la commune
		And tous les champs du formulaire sont remplis
		When le citoyen soumet le problème
		Then le problème est créé
		And il est ajouté à la liste de problème existant
		And le statut du problème est "signalé"
		And il a 1 like
		And le nouveau problème reçoit l’ID "54ghirk"
		And l’ID "54ghirk" est lié à l’adresse mail "citoyen@ville.be"
		And le citoyen reçoit un mail contenant cet ID
		
		
	Scenario: seconde soumission d’une même catégorie de problème de même localisation			
		Given la localisation du problème est "rueloiseau175555FalseCity"
		And la catégorie "niddepoule" existe déjà pour l'adresse "rueloiseau175555FalseCity"
		And l'adresse "rueloiseau175555FalseCity" est située dans la commune
		And tous les champs du formulaire sont remplis	
		When le citoyen soumet le problème
		Then le nombre de likes pour le problème dont l'ID est "54ghirk" augmente de 1
		And l’ID "54ghirk" est lié à l’adresse mail "citoyen2@ville.be"
		And le citoyen reçoit un mail contenant cet ID
		


	Scenario: seconde soumission d’une même catégorie de problème de localisation différente
		Given la localisation du problème est "ruedupiaf235555FalseCity"
		And la catégorie "niddepoule" n'existe pas encore pour l'adresse "ruedupiaf235555FalseCity"
		And l'adresse "ruedupiaf235555FalseCity" est située dans la commune
		And tous les champs du formulaire sont remplis
		When le citoyen soumet le problème
		Then le problème est créé
		And il est ajouté à la liste de problème existant
		And le statut du problème est "signalé"
		And il a 1 like
		And le nouveau problème reçoit l’ID "55ghirk"
		And l’ID "55ghirk" est lié à l’adresse mail "citoyen@ville.be"
		And le citoyen reçoit un mail contenant cet ID	
		
	Scenario: soumission d’un problème via un formulaire incomplet
		Given la localisation du problème est "rueloiseau175555FalseCity"
		And la catégorie "niddepoule" n'existe pas encore pour l'adresse "rueloiseau175555FalseCity"
		And l'adresse "rueloiseau175555FalseCity" est située dans la commune
		And tous les champs du formulaire ne sont pas remplis
		When le citoyen soumet le problème
		Then la soumission est refusée
		And un message d'erreur s'affiche
		And les champs non remplis sont signalés en rouge
		And le citoyen est invité à les remplir
		
		
	Scenario: soumission d’un problème hors zone
		Given la localisation du problème est "ruecanine585575WrongCity"
		And la catégorie "niddepoule" n'existe pas encore pour l'adresse "ruecanine585575WrongCity"
		And l'adresse "rue canine585575WrongCity" est située hors commune
		When le citoyen soumet le problème
		Then la soumission est refusée
		And un message d'erreur signalant que l’adresse entrée est hors commune et invitant le citoyen à vérifier l’adresse s'affiche


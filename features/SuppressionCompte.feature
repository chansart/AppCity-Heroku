Feature: Suppresion d'un compte citoyen par un fonctionnaire

	Un fonctionnaire peut supprimer le compte d'un utilisateur
	
	Scenario: 
		Given L'utilisateur est "connecté" en tant que "fonctionnaire"
		When l'utilisateur demande la suppression du compte de type "user" dont le login est "JeanPol3"
		Then le compte dont le login est "JeanPol3" est de type "supprimé"
		And les soumissions liées à son adresse mail sont dissociées de son adresse mail

		
Feature: Regroupement de deux problèmes par un fonctionnaire
	
	Scenario: Les deux problèmes ont le même statut
		Given L'utilisateur est "connecté" en tant que "fonctionnaire"
		And Le premier problème a l'ID "253" 
		And le second problème a l'ID "254"
		And le premier problème a comme statut "soumis"
		And le second problème a comme statut "soumis"
		And le premier problème a 21 likes
		And le second problème a 21 likes
		When l'utilisateur demande le regroupement des deux problèmes
		And l'utilisateur indique qu'il veut conserver le premier problème 
		Then le premier problème reçoit les 21 likes du second problème
		And le second problème est supprimé
		And l'adresse mail "citoyen1@falsecity.be" est liée à l'ID "253"
		And un mail informe l'utilisateur qui avait soumis le problème dont l'ID est 254 que sa soumission a été regroupée avec le problème dont l'ID est 253

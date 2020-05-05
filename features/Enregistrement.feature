@supported
Feature: Enregistrement (création d'un compte) d'un nouveau citoyen sur le site
	
	Un citoyen peut créer un compte via un formulaire sur le site. Un identifiant et un mot de passe sont associés à ce compte
	
	Background: 
		Given le citoyen demande l'identifiant "JeanPol3"
		And le citoyen demande le mot de passe "picka12"
		And tous les champs du formulaire sont remplis
	
	Scenario: L'identifiant souhaité n'est pas encore utilisé
		Given Aucun autre compte n'a comme identifiant "JeanPol3"
		And Aucun autre compte n'a l'adresse mail "jp3@skynet.be"
		When le citoyen fait la demande de compte
		Then le compte est créé avec les informations données par le citoyen
		And un message informe le citoyen du succès de sa création de compte
		And un e-mail est envoyé au citoyen via l'adresse e-mail "jp3@skynet.be" susmentionnée
	
	Scenario: L'identifiant souhaité est déjà utilisé
		Given Un autre compte a déjà comme identifiant "JeanPol3"
		And Aucun autre compte n'a l'adresse mail "jp3@skynet.be"
		When le citoyen fait la demande de compte
		Then un message informe le citoyen que l'identifiant est déjà utilisé et qu'il doit en choisir un autre
		
	Scenario: L'adresse e-mail correspond déjà à un autre compte utilisateur
		Given Aucun autre compte n'a comme identifiant "JeanPol3"
		And Un autre compte a déjà comme adresse e-mail "jp3@skynet.be"
		When le citoyen fait la demande de compte
		Then un message informe le citoyen que l'adresse e-mail est déjà utilisée
		And un message propose au citoyen de recommencer l'opération avec une autre adresse e-mail
		
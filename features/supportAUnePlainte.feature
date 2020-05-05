@supported
Feature: Soutien d'une plainte préexistante par un citoyen
	
	Un citoyen peut marquer son soutient à une plainte de la liste des plaintes en cours. 
	
	Background: 	
		Given le citoyen s'est connecté grâce à son compte dont le login est "JeanPol3"
		And la plainte porte l'ID "5370aa4c9f2f46d015a37311"
		
	Scenario: Le citoyen n'est pas celui qui a posté la plainte
		Given la plainte portant le numéro d'ID "5370aa4c9f2f46d015a37311" que le citoyen veut soutenir a été postée par le compte dont le login est "Benoit16"
		When le citoyen apporte son soutien à la plainte d'ID "5370aa4c9f2f46d015a37311"
		Then Le nombre de soutiens à la plainte d'ID "5370aa4c9f2f46d015a37311" augmente de 1
		And Un message informe le citoyen que soutient à la plainte a été accepté
		
	Scenario: Le citoyen est celui qui a posté la plainte
		Given la plainte portant le numéro d'ID "5370aa4c9f2f46d015a37311" que le citoyen veut soutenir a été postée par le compte dont le login est "JeanPol3"
		When le citoyen apporte son soutien à la plainte d'ID "5370aa4c9f2f46d015a37311"
		Then Un message informe le citoyen qu'il ne peut pas apporter son soutien à ses propres plaintes
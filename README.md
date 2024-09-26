# Gestion des Astreintes

## Description
Gestion des Astreintes est une application de gestion permettant l'enregistrement et l'authentification des collaborateurs et des secrétaires, ainsi que la gestion des horaires et des services associés. Elle offre des fonctionnalités de planification et de notification pour une meilleure organisation.

## Fonctionnalités

### Gestion des Collaborateurs
- Enregistrement et authentification des collaborateurs.
- Gestion des profils utilisateurs, incluant les informations de base et les préférences.

### Gestion des Secrétaires
- Création et gestion des secrétaires, y compris l'ajout, la modification, et la suppression des membres de service auxquels ils appartiennent.
- Enregistrement et authentification des secrétaires.

### Planification des Horaires
- Saisie et modification des astreintes manuellement ou automatiquement.
- Affichage d'un calendrier ou d'une grille des horaires.

### Gestion des Services
- Ajout, modification et suppression des services.
- Gestion des secrétaires responsables de chaque service.

### Exportation des Données
- Exportation des horaires et des informations des équipes vers des formats externes comme Excel pour le reporting et l'analyse.

### Notification par Email
- Envoi de notifications par email lors de l'ajout ou de la modification d'un agent, ainsi que pour notifier les agents assignés à une garde.

## Prérequis
- Java 11 ou supérieur
- Maven
- Spring Boot
- Base de données (MySQL, PostgreSQL, etc.)

## Installation

1. Clonez le dépôt:
   ```bash
   git clone https://github.com/NOUTAILAA/Gestion-Des-Astreintes.git
   cd Gestion-Des-Astreintes
   
2.Accédez au répertoire du backend:
cd ProjectStagee

3. Compilez le projet:
mvn clean install

4.Configurez votre base de données dans le fichier src/main/resources/application.properties.
5.Lancer l'app : mvn spring-boot:run

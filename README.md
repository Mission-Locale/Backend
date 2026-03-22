# 🚀 Mission Locale - Backend

Partie backend du projet de l'application web de la Mission Locale du Pays d'Aubagne.

## 📌 Sommaire

**[Initialisation](#-Initialisation)**


**Routes**

- [👥 Utilisateurs](#-utilisateurs)
- [🔐 Authentification](#-authentification)
- [🙋‍♂️ Profil](#-profil)
- [📂 Gestion des Documents](#-gestion-des-documents-incomplet)
- [🗓️ Gestion des Plannings](#️-gestion-des-plannings)
- [🗓 Gestion des Rendez-vous](#-gestion-des-rendez-vous)
- [👤 Gestion des conseillers](#-gestion-des-conseillers)
- [💬 Gestion des Messages](#-gestion-des-messages-inexistant)
- [🛠 Gestion des Ateliers et Events](#-gestion-des-ateliers-et-récurrences)

## 🛠 Initialisation
Liste des commandes pour initialiser et utiliser le projet:

**Clonez le projet**, executez: ```npm run init```,  
Créer le fichier ```.env``` (en prennant pour exemple ```exemple.env```) et configurer le,   
En cas de **modification des modèles prisma** executez: ```npm run migrate```.

### Manipulation développeur
Si vous avez besoin de ré-initialiser entièrement la base de donnée en environnement de développement après un reset des migrations, veuillez utilisez la commande ```npm run migrate reset```

## 👥 Utilisateurs
Gestion des **utilisateurs**

| Méthode    | Route                      | Auth           | Description                                                      |
| ---------- | -------------------------- | -------------- | ---------------------------------------------------------------- |
| **GET**    | `/users`                   | Admin          | 🔍 Récupérer la liste des utilisateurs _(filtrage & pagination)_ |
| **GET**    | `/users/me`                | Yes            | 🔎 Récupére l'utilisateur connecté                               |
| **GET**    | `/users/job-seeker/:id`    | Admin, Advisor | 🔎 Récupérer un demandeur d'emploi par son **ID** de rôle        |
| **GET**    | `/users/advisor/:id`       | Admin          | 🔎 Récupérer un conseiller par son **ID** de rôle                |
| **GET**    | `/users/administrator/:id` | Admin          | 🔎 Récupérer un administrateur par son **ID** de rôle            |
| **GET**    | `/users/:id`               | Admin          | 🔎 Récupérer un utilisateur par son **ID**                       |
| **PATCH**  | `/users/:id`               | Admin          | ✏️ Modifier un utilisateur                                       |
| **DELETE** | `/users/:id`               | Admin          | ❌ Supprimer un utilisateur                                      |

## 🔐 Authentification
Gestion de l'**authentification des utilisateurs** _(inscription, connexion, sécurité...)_.

| Méthode   | Route                             | Auth | Description                                                                                             |
| --------  | ----------------------------------| ---- | --------------------------------------------------------------------------------------------------------|
| **POST**  | `/auth/register`                  | No   | 📝 **Inscription** d’un nouvel utilisateur                                                              |
| **POST**  | `/auth/login`                     | No   | 🔑 **Connexion** & récupération du token **JWT**                                                        |
| **POST**  | `/auth/logout`                    | Yes  | 🚪 **Déconnexion** de l'utilisateur                                                                     |
| **GET**   | `/auth/force-logout`              | Yes  | 🚪 **Déconnexion** de l'utilisateur sur **tous ses appareils**                                          |
| **GET**   | `/auth/refresh`                   | No   | ♻️ **Rafraîchissement** du token **JWT**                                                                |
| **POST**  | `/auth/forgot-password`           | No   | 📨 **Envoi** un mail à l'utilisateur pour reinitialiser son mot de passe & créer le reset_token **JWT** |
| **POST**  | `/auth/reset-password`            | No   | ♻️ **Réinitialise** le mot de passe d'un utilisateur avec le reset_token **JWT**                        |
| **POST**  | `/auth/verify-reset-token`        | No   | 🔎 **Vérification** du token de reset password **JWT**                                                  |

## 🙋‍♂ Profil
Gestion du **profil utilisateur** _(actions personnelles, sans besoin d'accès admin)_.

| Méthode        | Route          | Auth | Description                                         |
| -------------- | -------------- | ---- | --------------------------------------------------- |
| **GET**        | `/profile`     | Yes  | 🆔 Récupérer **son propre profil**                  |
| **PATCH**      | `/profile`     | Yes  | ✍️ Modifier **son profil**                          |
| ~~**DELETE**~~ | ~~`/profile`~~ | Yes  | ~~🗑️ Supprimer **son propre compte**~~ (Inexistant) |

## 📂 Gestion des Documents (**Incomplet**)
Gestion des documents associés au profil utilisateur.  

| Méthode    | Route                    | Auth | Description                                                        |
| ---------- | ------------------------ | ---- | ------------------------------------------------------------------ |
| **GET**    | `/profile/documents`     | Yes  | 📄 Récupérer la liste des documents associés au profil utilisateur |
| **POST**   | `/profile/documents`     | Yes  | 📤 Ajouter un nouveau document au profil utilisateur               |
| **PATCH**  | `/profile/documents/:id` | Yes  | ✏️ Modifier un document spécifique du profil utilisateur (Not done yet) |
| **DELETE** | `/profile/documents/:id` | Yes  | 🗑️ Supprimer un document spécifique du profil utilisateur (Not done yet) |

## 🗓️ Gestion des Plannings
Gestion des calendriers et des évènements  
Ces derniers renvoie des évènement formatés pour full calendar

| Méthode    | Route                               | Auth  | Description                                                                        |
| ---------- | ----------------------------------- | ----- | ---------------------------------------------------------------------------------- |
| **GET**    | `/planning/registration`            | Admin | 🔍 Récupère le planning des **rendez-vous d'inscription** en cours et futures      |
| **GET**    | `/planning/me`                      | Yes   | 🔍 Récupérer le planning des **rendez-vous et ateliers** de l'utilisateur connecté (l'adminstrateur récupèrera le planning d'inscription) |
| **GET**    | `/planning/advisor/:advisorId`      | Admin | 🔍 Récupérer le planning des **rendez-vous et ateliers** du conseiller             |
| **GET**    | `/planning/job-seeker/:jobSeekerId` | Admin | 🔍 Récupérer le planning des **rendez-vous et ateliers** du demandeur d'emploi     |
| **GET**    | `/planning/free-appointments`       | No    | 🔍 Récupérer les **disponibilités** du calendrier d'inscription                    |

## 🗓 Gestion des Rendez-vous
Gestion de rendez-vous entre demandeurs et conseillers

| Méthode    | Route                                 | Auth                | Description                                                                |
| ---------- | ------------------------------------- | ------------------- | -------------------------------------------------------------------------- |
| **POST**   | `/appointments`                       | Advisor, Admin      | 📅 Enregistre un nouveau **rendez-vous**                                   |
| **GET**    | `/appointments`                       | Advisor, Job Seeker | 🔍 Récupérer la liste des **rendez-vous** de l'utilisateur                 |
| **GET**    | `/appointments/:id`                   | Yes                 | 🔎 Récupérer un **rendez-vous** spécifique par ID                          |
| **PATCH**  | `/appointments/:id`                   | Advisor, Admin      | ✏️ Modifier l'heure et la durée d'un **rendez-vous**                       |
| **PATCH**  | `/appointments/:id/cancel`            | Advisor, Admin      | ✏️ Annule un **rendez-vous**                                               |
| **PATCH**  | `/appointments/:id/assign/:advisorId` | Admin               | ✏️ Assigne un Conseiller à un **rendez-vous**                              |
| **DELETE** | `/appointments/:id`                   | Advisor, Admin      | ❌ Annuler ou supprimer un **rendez-vous**                                 |
| **GET**    | `/appointments/registration`          | Advisor, Admin      | 🔍 Récupère la liste des **rendez-vous d'inscription** en cours et futures |
| **POST**   | `/appointments/registration`          | No                  | 📅 Enregistre un nouveau **rendez-vous d'inscription**                     |

## 👤 Gestion des conseillers
Gestion des données du conseiller
| Méthode | Route                   | Auth    | Description                                                                              |
| ------- | ----------------------- | ------- | ---------------------------------------------------------------------------------------- |
| **GET** | `/advisors/job-seekers` | Advisor | 🔍 Récupérer la liste des **demandeurs d'emploi** assignés à ce conseiller _(filtrable)_ |


## 💬 Gestion des Messages (**Inexistant**)
Envoi de messages entre utilisateur et conseillé  

| Méthode    | Route           | Auth | Description                                                                     |
| ---------- | --------------- | ---- | ------------------------------------------------------------------------------- |
| **POST**   | `/messages`     |      | 📨 L'utilisateur envoie un **message** à son conseillé                          |
| **GET**    | `/messages`     |      | 🔍 Récupérer l'historique des **messages** entre l'utilisateur et son conseillé |
| **GET**    | `/messages/:id` |      | 🔎 Récupérer un **message** spécifique par ID                                   |
| **DELETE** | `/messages/:id` |      | 🗑️ Supprimer un **message** spécifique                                          |

## 🛠 Gestion des Ateliers et Récurrences

### Gestion des Ateliers (événements récurrents)

| Méthode    | Route                                                 | Auth           | Description                                                    |
| ---------- | ----------------------------------------------------- | -------------- | -------------------------------------------------------------- |
| **POST**   | `/workshops`                                          | Admin          | 📝 Créer un nouvel **atelier** (événement récurrent)           |
| **GET**    | `/workshops`                                          | No             | 🔍 Récupérer la liste de tous les **atelier**                  |
| **GET**    | `/workshops/:id`                                      | No             | 🔎 Récupérer un **atelier** spécifique par ID                  |
| **PATCH**  | `/workshops/:id`                                      | Admin          | ✏️ Modifier un **atelier**                                     |
| **DELETE** | `/workshops/:id`                                      | Admin          | 🗑️ Supprimer un **atelier**                                    |
| **GET**    | `/workshops/recurrences/:id`                          | No             | 🔎 Récupérer une **récurrence d'atelier** spécifique par ID    |
| **GET**    | `/workshops/recurrences/:id/registrations`            | No             | 🔎 Récupérer une liste/nombre de personnes inscrits à une **récurrence d'atelier** |
| **POST**   | `/workshops/recurrences/:id/register`                 | Yes            | 📝 Inscrire un **demandeur** à une **récurrence d'atelier**    |
| **POST**   | `/workshops/recurrences/:id/animators`                | Admin, Advisor | 📝 Ajouter un **conseiller** à une **récurrence d'atelier**    |
| **DELETE** | `/workshops/recurrences/:id/unregister/:jobSeekerId?` | Yes            | ❌ Désinscrire un **demandeur** d'une **récurrence d'atelier** |
| **DELETE** | `/workshops/recurrences/:id/animators/:advisorId?`    | Admin, Advisor | ❌ Retirer un **conseiller** d'une **récurrence d'atelier**    |

---

### Gestion des Events (instanciations des ateliers) (**Inexistant**)

| Méthode    | Route         | Auth | Description                                           |
| ---------- | ------------- | ---- | ----------------------------------------------------- |
| **POST**   | `/events`     |      | 📝 Créer un **événement** spécifique d'un **atelier** |
| **PATCH**  | `/events/:id` |      | ✏️ Modifier un **événement**                          |
| **DELETE** | `/events/:id` |      | 🗑️ Supprimer un **événement**                         |

**(TODO: Ajouter les chemins des articles)**
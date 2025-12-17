# 🚀 Mission Locale - Backend

Partie backend du projet de l'application web de la Mission Locale du Pays d'Aubagne.

## 📌 Sommaire

**[Initialisation](#-Initialisation)**


**Routes**

- [👥 Utilisateurs](#-utilisateurs)
- [🔐 Authentification](#-authentification)
- [🙋‍♂️ Profil](#-profil)
- [📂 Gestion des Documents](#-gestion-des-documents)
- [🗓 Gestion des Rendez-vous](#-gestion-des-rendez-vous)
- [💬 Gestion des Messages](#-gestion-des-messages)
- [🛠 Gestion des Ateliers et Events](#-gestion-des-ateliers-et-events)

## 🛠 Initialisation
Liste des commandes pour initialiser et utiliser le projet:

**Clonez le projet**, executez: ```npm run init```,  
Créer le fichier ```.env``` (en prennant pour exemple ```exemple.env```) et configurer le,   
En cas de **modification des modèles prisma** executez: ```npm run migrate```.

### Manipulation développeur
Si vous avez besoin de ré-initialiser entièrement la base de donnée en environnement de développement après un reset des migrations, veuillez utilisez la commande ```npm run migrate reset```

## 👥 Utilisateurs
CRUD pour la gestion des utilisateurs depuis un compte **admin**.

| Méthode    | Route        | Description                                                      |
| ---------- | ------------ | ---------------------------------------------------------------- |
| **GET**    | `/users`     | 🔍 Récupérer la liste des utilisateurs _(filtrage & pagination)_ |
| **GET**    | `/users/:id` | 🔎 Récupérer un utilisateur par son **ID**                       |
| **PATCH**  | `/users/:id` | ✏️ Modifier un utilisateur                                       |
| **DELETE** | `/users/:id` | ❌ Supprimer un utilisateur                                      |

## 🔐 Authentification
Gestion de l'**authentification des utilisateurs** _(inscription, connexion, sécurité...)_.

| Méthode  | Route                | Description                                                    |
| -------- | -------------------- | -------------------------------------------------------------- |
| **POST** | `/auth/register`     | 📝 **Inscription** d’un nouvel utilisateur                     |
| **POST** | `/auth/login`        | 🔑 **Connexion** & récupération du token **JWT**               |
| **POST** | `/auth/logout`       | 🚪 **Déconnexion** de l'utilisateur                            |
| **GET**  | `/auth/force-logout` | 🚪 **Déconnexion** de l'utilisateur sur **tous ses appareils** |
| **GET**  | `/auth/refresh`      | ♻️ **Rafraîchissement** du token **JWT**                       |

## 🙋‍♂ Profil

Gestion du **profil utilisateur** _(actions personnelles, sans besoin d'accès admin)_.

| Méthode    | Route      | Description                        |
| ---------- | ---------- | ---------------------------------- |
| **GET**    | `/profile` | 🆔 Récupérer **son propre profil** |
| **PATCH**  | `/profile` | ✍️ Modifier **son profil**         |
| ~~**DELETE**~~ | ~~`/profile`~~ | ~~🗑️ Supprimer **son propre compte**~~ (Inexistant) |

## 📂 Gestion des Documents (**Incomplet**)
Gestion des documents associés au profil utilisateur.  

| Méthode    | Route                    | Description                                                        |
| ---------- | ------------------------ | ------------------------------------------------------------------ |
| **GET**    | `/profile/documents`     | 📄 Récupérer la liste des documents associés au profil utilisateur |
| **POST**   | `/profile/documents`     | 📤 Ajouter un nouveau document au profil utilisateur               |
| **PATCH**  | `/profile/documents/:id` | ✏️ Modifier un document spécifique du profil utilisateur           |
| **DELETE** | `/profile/documents/:id` | 🗑️ Supprimer un document spécifique du profil utilisateur          |

## 🗓 Gestion des Rendez-vous (**Inexistant**)
Prise de rendez-vous entre utilisateurs et conseillers

| Méthode    | Route               | Description                                                                                            |
| ---------- | ------------------- | ------------------------------------------------------------------------------------------------------ |
| **POST**   | `/appointments`     | 📅 L'utilisateur prend un **rendez-vous** avec un conseillé                                            |
| **GET**    | `/appointments`     | 🔍 Récupérer la liste des **rendez-vous** de l'utilisateur (ou tous les rendez-vous si administrateur) |
| **GET**    | `/appointments/:id` | 🔎 Récupérer un **rendez-vous** spécifique par ID                                                      |
| **PATCH**  | `/appointments/:id` | ✏️ Modifier un **rendez-vous**                                                                         |
| **DELETE** | `/appointments/:id` | ❌ Annuler ou supprimer un **rendez-vous**                                                             |

## 💬 Gestion des Messages (**Inexistant**)
Envoi de messages entre utilisateur et conseillé  

| Méthode    | Route           | Description                                                                     |
| ---------- | --------------- | ------------------------------------------------------------------------------- |
| **POST**   | `/messages`     | 📨 L'utilisateur envoie un **message** à son conseillé                          |
| **GET**    | `/messages`     | 🔍 Récupérer l'historique des **messages** entre l'utilisateur et son conseillé |
| **GET**    | `/messages/:id` | 🔎 Récupérer un **message** spécifique par ID                                   |
| **DELETE** | `/messages/:id` | 🗑️ Supprimer un **message** spécifique                                          |

## 🛠 Gestion des Ateliers et Events

### Gestion des Ateliers (événements récurrents)

| Méthode    | Route                   | Description                                          |
| ---------- | ----------------------- | ---------------------------------------------------- |
| **POST**   | `/workshops`            | 📝 Créer un nouvel **atelier** (événement récurrent) |
| **GET**    | `/workshops`            | 🔍 Récupérer la liste de tous les **atelier**        |
| **GET**    | `/workshops/detail/:id` | 🔎 Récupérer un **atelier** spécifique par ID        |
| **PATCH**  | `/workshops/:id`        | ✏️ Modifier un **atelier**                           |
| **DELETE** | `/workshops/:id`        | 🗑️ Supprimer un **atelier**                          |

---

### Gestion des Events (instanciations des ateliers) (**Inexistant**)

| Méthode    | Route         | Description                                           |
| ---------- | ------------- | ----------------------------------------------------- |
| **POST**   | `/events`     | 📝 Créer un **événement** spécifique d'un **atelier** |
| **GET**    | `/events`     | 🔍 Récupérer la liste de tous les **événements**      |
| **GET**    | `/events/:id` | 🔎 Récupérer un **événement** spécifique par ID       |
| **PATCH**  | `/events/:id` | ✏️ Modifier un **événement**                          |
| **DELETE** | `/events/:id` | 🗑️ Supprimer un **événement**                         |

---

### Gestion des Inscriptions aux Events (**Inexistant**)

| Méthode    | Route                       | Description                                                        |
| ---------- | --------------------------- | ------------------------------------------------------------------ |
| **POST**   | `/events/:id/queue`         | 📝 S'inscrire à un **événement** spécifique                        |
| **GET**    | `/events/:id/queue`         | 🔍 Récupérer la liste des utilisateurs inscrits à un **événement** |
| **DELETE** | `/events/:id/queue/:userId` | ❌ Se désinscrire d'un **événement** spécifique                    |

**(TODO: Ajouter les chemins des articles)**
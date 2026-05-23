# 📱 Développement Mobile — Apache Cordova

> Projets réalisés dans le cadre du module de **Programmation Mobile**.  
> Chaque membre du groupe a développé une application mobile hybride avec Apache Cordova.

---

## 👥 Groupe

| Étudiant | Projet | Statut |
|---|---|---|
| Ibrahima FALL | 📒 Gestionnaire de contacts | ✅ Code disponible |
| Modou DELL | 🏋️ Calculateur IMC | ✅ Code disponible |
| DIENG | ✅ To Do List | 🎥 Vidéo démo disponible |

---

## 📂 Structure du dépôt

```
DEV_MOBILE_DELL_FALL_DIENG/
│
├── Gestionnaire de contacts/     → Application de gestion des contacts
│   ├── www/
│   │   ├── index.html
│   │   ├── css/style.css
│   │   └── js/app.js
│   ├── config.xml
│   ├── package.json
│   ├── package-lock.json
│   ├── .gitignore
│   └── README.md
│
├── Calculateur IMC/              → Application de calcul de l'IMC
│   ├── www/
│   │   ├── index.html
│   │   ├── css/index.css
│   │   └── js/index.js
│   ├── config.xml
│   ├── package.json
│   ├── package-lock.json
│   ├── .gitignore
│   └── README.md
│
└── TodoList/                     → Vidéo de démonstration
    └── demo.mp4
```

---

## 🛠️ Technologies communes

- **Apache Cordova 13** — framework mobile hybride
- **HTML5 / CSS3 / JavaScript** — développement frontend
- **Android SDK API 36** — plateforme cible
- **Gradle 8.14.2** — build system Android
- **localStorage** — persistance locale des données

---

## 🚀 Lancer un projet

```bash
# Entrer dans le dossier du projet
cd "Gestionnaire de contacts"
# ou
cd "Calculateur IMC"

# Installer les dépendances
npm install

# Ajouter la plateforme Android
cordova platform add android

# Build
cordova build android

# Lancer sur émulateur
cordova emulate android
```

---

## 📋 Présentation des projets

### 📒 Gestionnaire de contacts — Ibrahima FALL

Application permettant de gérer des contacts sur Android avec CRUD complet,
recherche dynamique, système de favoris, tri et synchronisation via export/import JSON.

→ [Voir le projet](./Gestionnaire%20de%20contacts)

---

### 🏋️ Calculateur IMC — Modou DELL

Application de calcul de l'Indice de Masse Corporelle avec affichage coloré
du résultat et interprétation médicale (insuffisance pondérale, normal, surpoids, obésité).

→ [Voir le projet](./Calculateur%20IMC)

---

### ✅ To Do List — DIENG

Application de gestion des tâches permettant d'ajouter, modifier, supprimer
et marquer des tâches comme complétées avec sauvegarde locale.

🎥 Démonstration disponible dans le dossier [`TodoList`](./TodoList).

---

## 📚 Contexte académique

**Module :** Programmation Mobile  
**Filière :** Master 2 Systèmes Réseaux et Télécommunications  
**École :** École Supérieure Polytechnique de Dakar — ESP/UCAD

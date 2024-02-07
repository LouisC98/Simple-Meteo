# Simple Meteo

Une application météo simple construite avec Vue.js, utilisant l'API Google Maps, Axios pour les requêtes HTTP, l'API open-meteo.com pour les données météorologiques.

## Fonctionnalités

- Affiche la météo en temps réel
- Utilise l'API Google Maps pour la localisation
- Interface utilisateur intuitive

## Installation et utilisation

### Prérequis

Assurez-vous d'avoir Node.js et npm installés sur votre machine.

### Installation

Clonez le dépôt :

```bash
git clone https://github.com/CLouis98/Simple-Meteo.git
cd Simple-Meteo
```

Installez les dépendances :
```bash
npm install 
```

### Développement
Pour démarrer le serveur de développement :
```bash
npm run dev 
```

### Build
Pour construire l’application pour la production :
```bash
npm run build 
```

### Configuration
Configurez vos variables d’environnement dans le fichier .env. Par exemple :

```dotenv
VITE_MAPS_KEY='VotreCléAPIGoogleMaps'
```

Remplacez 'VotreCléAPIGoogleMaps' par votre clé API Google Maps.

### Scripts disponibles
`dev`: Démarrer le serveur de développement Vite.
`build`: Construire le projet pour la production.
`preview`: Aperçu du build de production localement.
`lint`: Linter le projet.
`format`: Formater les fichiers avec Prettier.
# Carbon App - Projet IA

## Introduction
**Carbon App** est un projet scolaire qui permet de calculer l'empreinte carbone d'une personne à partir d'un fichier CSV. Ce fichier contient des données sur la consommation dans quatre catégories : électricité, voiture, nourriture et train. L'application affiche des graphiques (courbes, barres et camembert), des indicateurs clés (comme le total annuel des émissions), et donne un conseil pour réduire son impact environnemental. Ce projet a été réalisé dans le cadre de la résolution d'un thématique IA ajouté pour mon projet IA.

### Objectif du projet
L'objectif est de créer une application web simple qui :
- Lit un fichier CSV avec des données de consommation.
- Calcule les émissions de CO2 en fonction de facteurs d'émission.
- Affiche des résultats sous forme de graphiques et de statistiques.
- Propose un conseil personnalisé pour être plus écologique.

## Outils utilisés
Ce projet utilise les technologies suivantes :
- **Python** : Langage principal pour le backend.
- **Flask** : Framework pour créer l'application web.
- **Pandas** : Bibliothèque pour lire et traiter les fichiers CSV.
- **NumPy** : Pour les calculs numériques.
- **HTML/CSS/JavaScript** : Pour l'interface utilisateur.
- **Chart.js** : Pour afficher des graphiques (courbes, barres, camembert).
- **Bootstrap Icons** : Pour les icônes dans l'interface.
- **Gunicorn** : Serveur web pour un éventuel déploiement.

## Prérequis
Pour faire fonctionner ce projet, il faut :
- **Python 3.8** ou plus récent.
- Un navigateur web (comme Chrome ou Firefox).
- Les bibliothèques Python listées dans `requirements.txt` :
  - flask==2.3.3
  - flask-cors==4.0.0
  - pandas==2.1.0
  - numpy==1.26.0
  - gunicorn==21.2.0

## Installation
Suivez ces étapes pour installer et exécuter le projet :
1. Clonez le dépôt GitHub :
   ```
   git clone https://github.com/JXPM/carbon_app.git
   ```
2. Entrez dans le dossier du projet :
   ```
   cd carbon_app
   ```
3. Créez un environnement virtuel :
   ```
   python -m venv venv
   source venv/bin/activate  # Sous Linux/Mac
   venv\Scripts\activate     # Sous Windows
   ```
4. Installez les dépendances Python :
   ```
   pip install -r requirements.txt
   ```

## Comment utiliser Carbon App
1. Lancez l'application :
   ```
   python3 app.py
   ```
   Cela ouvre un serveur web sur `http://localhost:5000`.
2. Ouvrez votre navigateur et allez à `http://localhost:5000`.
3. Chargez un fichier CSV avec les colonnes suivantes :
   - `category` : `electricity`, `car`, `food` ou `train`.
   - `quantity` : La quantité consommée (un nombre).
   - `month` : Le mois (un nombre entre 1 et 12).
   Un fichier modèle est disponible dans `template.csv` ou téléchargeable depuis l'interface.
   Exemple :
   ```
   category,quantity,month
   electricity,100,1
   car,50,1
   food,10,1
   train,20,1
   ```
4. Après avoir chargé le fichier, l'application montre :
   - Des graphiques pour chaque catégorie (électricité : courbe, voiture/train : barres, nourriture : camembert).
   - Le total annuel des émissions (en kg CO2e).
   - La moyenne mensuelle des émissions.
   - Un potentiel d'amélioration (en %).
   - Un conseil pour réduire votre empreinte carbone.
5. Vous pouvez filtrer les résultats par mois avec le menu déroulant.

## Structure des fichiers
```
carbon_app/
│
├── data/
│   └── emission_factors.csv  # Contient les facteurs d'émission
├── static/
│   ├── script.js            # Code JavaScript pour les graphiques et l'interface
│   ├── styles.css           # Styles CSS pour rendre l'interface jolie
│   └── index.html           # Page principale de l'application
├── app.py                   # Code principal (backend) avec Flask
├── requirements.txt         # Liste des bibliothèques Python nécessaires
├── template.csv             # Modèle de fichier CSV pour les utilisateurs
└── README.txt               # Ce fichier
```

## Facteurs d'émission
Les émissions sont calculées avec les facteurs suivants (dans `data/emission_factors.csv`) :
- Électricité : 0.1 kg CO2e par unité
- Voiture : 0.2 kg CO2e par unité
- Nourriture : 1.5 kg CO2e par unité
- Train : 0.03 kg CO2e par unité

## Fonctionnement
1. **Backend (app.py)** : Lit le fichier CSV, vérifie son format, calcule les émissions par catégorie et par mois, et renvoie les résultats au frontend. donc un ETL utilisateur en semi-temps réel.
2. **Frontend (index.html, script.js, styles.css)** : Affiche une interface où l'utilisateur peut charger un fichier CSV, voir les graphiques, et filtrer par mois.
3. **Calculs** : Les émissions sont calculées en multipliant la quantité par le facteur d'émission. Un conseil est généré en fonction de la catégorie la plus émissive.
4. **Indicateurs** : Si les émissions annuelles sont inférieures à 360 kg CO2e, le statut est "bon" ; sinon, il est "mauvais".

## Limites
- Le fichier CSV doit avoir un format précis (colonnes `category`, `quantity`, `month`).
- Les mois doivent être entre 1 et 12.
- Les catégories sont limitées à `electricity`, `car`, `food`, `train`.

## Améliorations possibles
- Ajouter plus de catégories (ex. : avion, achats).
- Permettre l'upload de fichiers JSON ou Excel.
- Améliorer le design de l'interface avec plus de couleurs ou d'animations.

## Contribution
Ce projet est un travail scolaire, mais si vous voulez contribuer :
1. Forkez le dépôt sur GitHub.
2. Créez une branche :
   ```
   git checkout -b ma-modification
   ```
3. Faites vos modifications et commitez :
   ```
   git commit -m "Description des changements"
   ```
4. Poussez votre branche :
   ```
   git push origin ma-modification
   ```
5. Ouvrez une Pull Request sur GitHub.

## Remerciements
Merci à M. Yohann ZAPART et Mme Selina CHEGGOUR pour les conseils et à mes camarades pour leurs idées. Ce projet a été une super occasion d'approfondir mes compétences en Python, Flask et développement web !

## Contact
Pour des questions ou suggestions, ouvrez une issue sur GitHub (https://github.com/JXPM/carbon_app) ou contactez-moi (bilekouame04@gmail.com) .
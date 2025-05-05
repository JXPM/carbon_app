from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pandas as pd
import os

app = Flask(__name__, static_folder='static')
CORS(app)  # Permet les requêtes cross-origin

# Charger les facteurs d'émission
emission_factors = pd.read_csv('data/emission_factors.csv')

# Route pour servir la page principale (index.html)
@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

# Route pour servir les fichiers statiques (CSS, JS, favicon, etc.)
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

# Route pour traiter l'upload du fichier CSV
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'Aucun fichier fourni'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Aucun fichier sélectionné'}), 400

    # Sauvegarder temporairement le fichier
    file_path = 'temp.csv'
    file.save(file_path)

    try:
        # Lire le fichier CSV
        data = pd.read_csv(file_path)

        # Vérifier la structure du fichier
        if not all(col in data.columns for col in ['category', 'quantity']):
            return jsonify({'error': 'Le fichier doit contenir les colonnes "category" et "quantity"'}), 400

        # Calculer l'empreinte carbone
        total_emissions = 0
        breakdown = {}

        for _, row in data.iterrows():
            category = row['category']
            quantity = row['quantity']

            # Vérifier si la catégorie existe dans les facteurs d'émission
            if category not in emission_factors['category'].values:
                return jsonify({'error': f'Catégorie inconnue : {category}'}), 400

            factor = emission_factors[emission_factors['category'] == category]['factor'].iloc[0]
            emissions = quantity * factor
            total_emissions += emissions
            breakdown[category] = emissions

        # Supprimer le fichier temporaire
        os.remove(file_path)

        return jsonify({
            'total_emissions': round(total_emissions, 2),
            'breakdown': breakdown
        })

    except Exception as e:
        # Supprimer le fichier temporaire en cas d'erreur
        if os.path.exists(file_path):
            os.remove(file_path)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
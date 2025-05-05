from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pandas as pd
import os

app = Flask(__name__, static_folder='static')
CORS(app)

# Charger les facteurs d'émission
emission_factors = pd.read_csv('data/emission_factors.csv')

# Générer un conseil basé sur les résultats
def generate_advice(category_data):
    max_category = max(category_data, key=lambda k: sum(category_data[k].values()))
    max_emissions = sum(category_data[max_category].values())
    advice_dict = {
        'electricity': "Réduisez votre consommation d'électricité avec des appareils écoénergétiques.",
        'car': "Privilégiez les transports en commun ou le covoiturage.",
        'food': "Optez pour des produits locaux et moins de viande.",
        'train': "Continuez, votre empreinte est faible, essayez le télétravail."
    }
    advice = advice_dict.get(max_category, "Adoptez des gestes écoresponsables !")
    return f"Conseil : {advice} (Catégorie dominante : {max_category}, {max_emissions:.2f} kg CO2e)."

# Route pour servir la page principale
@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

# Route pour servir les fichiers statiques
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

    file_path = 'temp.csv'
    file.save(file_path)

    try:
        data = pd.read_csv(file_path)
        if not all(col in data.columns for col in ['category', 'quantity', 'month']):
            return jsonify({'error': 'Colonnes "category", "quantity" et "month" (1-12) requises'}), 400

        # Vérifier que month est entre 1 et 12
        if not all(1 <= month <= 12 for month in data['month']):
            return jsonify({'error': 'Les mois doivent être entre 1 et 12'}), 400

        # Initialiser les données annuelles par catégorie
        category_data = {'electricity': {}, 'car': {}, 'food': {}, 'train': {}}
        for _, row in data.iterrows():
            category = row['category']
            quantity = row['quantity']
            month = int(row['month'])
            if category not in emission_factors['category'].values:
                return jsonify({'error': f'Catégorie inconnue : {category}'}), 400
            factor = emission_factors[emission_factors['category'] == category]['factor'].iloc[0]
            emissions = quantity * factor
            category_data[category][month] = category_data[category].get(month, 0) + emissions

        # Calculer les totaux annuels
        annual_totals = {cat: sum(data.values()) for cat, data in category_data.items()}
        total_emissions = sum(annual_totals.values())
        annual_percentages = {cat: (val / total_emissions * 100) if total_emissions > 0 else 0 for cat, val in annual_totals.items()}

        # Moyenne mensuelle
        monthly_average = total_emissions / 12 if total_emissions > 0 else 0

        # Conseil
        advice_text = generate_advice(category_data)

        # Statut carbone (basé sur le total annuel)
        carbon_status = 'good' if total_emissions < 360 else 'bad'  # 30 kg/mois * 12

        # KPI supplémentaire
        improvement_potential = 20 if total_emissions > 360 else 5

        os.remove(file_path)

        return jsonify({
            'total_emissions': round(total_emissions, 2),
            'category_data': category_data,
            'annual_totals': annual_totals,
            'annual_percentages': annual_percentages,
            'monthly_average': round(monthly_average, 2),
            'advice': advice_text,
            'carbon_status': carbon_status,
            'improvement_potential': improvement_potential
        })

    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
document.getElementById('upload-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Réinitialiser les résultats et erreurs
    document.getElementById('results').style.display = 'none';
    document.getElementById('error').style.display = 'none';

    // Récupérer le fichier
    const fileInput = document.getElementById('file');
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    try {
        // Envoyer le fichier à l'API
        const response = await fetch('/upload', { // Changé de http://localhost:5000/upload à /upload
            method: 'POST',
            body: formData
        });
        const result = await response.json();

        if (response.ok) {
            // Afficher les résultats
            document.getElementById('total-emissions').textContent = result.total_emissions;
            document.getElementById('results').style.display = 'block';

            // Créer le graphique
            const ctx = document.getElementById('carbon-chart').getContext('2d');
            if (window.carbonChart) {
                window.carbonChart.destroy(); // Détruire le graphique précédent
            }
            window.carbonChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: Object.keys(result.breakdown),
                    datasets: [{
                        label: 'Émissions (kg CO2e)',
                        data: Object.values(result.breakdown),
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                        borderColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });
        } else {
            // Afficher l'erreur
            document.getElementById('error').textContent = result.error;
            document.getElementById('error').style.display = 'block';
        }
    } catch (error) {
        document.getElementById('error').textContent = 'Erreur lors du traitement du fichier';
        document.getElementById('error').style.display = 'block';
    }
});
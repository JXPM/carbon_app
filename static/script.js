document.getElementById('upload-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    document.getElementById('results').style.display = 'none';
    document.getElementById('error').style.display = 'none';
    document.getElementById('loading').style.display = 'block';
    document.getElementById('advice-text').textContent = '';
    document.getElementById('carbon-icon').className = '';

    const fileInput = document.getElementById('file');
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();

        document.getElementById('loading').style.display = 'none';

        if (response.ok) {
            updateDashboard(result);

            // Ajouter l'écouteur pour le filtre
            document.getElementById('month-filter').addEventListener('change', (e) => {
                updateDashboard(result, e.target.value);
            });

            document.getElementById('results').style.display = 'block';
        } else {
            document.getElementById('error').textContent = result.error;
            document.getElementById('error').style.display = 'block';
        }
    } catch (error) {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('error').textContent = 'Erreur lors du traitement';
        document.getElementById('error').style.display = 'block';
    }
});

function updateDashboard(result, monthFilter = 'all') {
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

    document.getElementById('total-emissions').textContent = result.total_emissions;
    document.getElementById('monthly-average').textContent = result.monthly_average;
    document.getElementById('improvement-potential').textContent = result.improvement_potential;
    document.getElementById('advice-text').textContent = result.advice;

    const carbonIcon = document.getElementById('carbon-icon');
    if (result.carbon_status === 'good') {
        carbonIcon.className = 'bi bi-check-circle-fill text-success';
        carbonIcon.setAttribute('aria-label', 'Faible');
    } else {
        carbonIcon.className = 'bi bi-exclamation-triangle-fill text-danger';
        carbonIcon.setAttribute('aria-label', 'Élevée');
    }

    const createChart = (id, type, data, label) => {
        const ctx = document.getElementById(id).getContext('2d');
        if (window[`chart_${id}`]) window[`chart_${id}`].destroy();

        let filteredData, labels;

        if (label === 'food' && type === 'doughnut') {
            // Camembert pour Nourriture : tous les mois, même si un mois spécifique est sélectionné
            filteredData = months.map(m => data[label]?.[m] || 0);
            labels = monthNames;

            // Déterminer les couleurs en fonction des valeurs
            const maxValue = Math.max(...filteredData, 1); // Éviter division par 0
            const colors = filteredData.map(value => {
                const intensity = value / maxValue;
                if (intensity < 0.3) return '#A7F3D0'; // Vert clair
                if (intensity < 0.6) return '#FECACA'; // Rose clair
                return '#FCA5A5'; // Rouge clair
            });

            window[`chart_${id}`] = new Chart(ctx, {
                type: type,
                data: {
                    labels: labels,
                    datasets: [{
                        label: label,
                        data: filteredData,
                        backgroundColor: colors,
                        borderColor: colors.map(color => color.replace('A5', '80')), // Bordures légèrement plus foncées
                        borderWidth: 1
                    }]
                },
                options: {
                    plugins: {
                        legend: { display: true, position: 'right' },
                        tooltip: { enabled: true },
                        datalabels: { // Afficher les valeurs sur le camembert
                            color: '#000',
                            formatter: (value) => value > 0 ? value.toFixed(2) : '',
                            font: { size: 12 }
                        }
                    }
                },
                plugins: [ChartDataLabels] // Nécessite le plugin ChartDataLabels
            });
        } else {
            // Autres graphiques (électricité, voiture, train)
            filteredData = monthFilter === 'all' ? months.map(m => data[label]?.[m] || 0) : [data[label]?.[parseInt(monthFilter)] || 0];
            labels = monthFilter === 'all' ? months : [parseInt(monthFilter)];

            window[`chart_${id}`] = new Chart(ctx, {
                type: type,
                data: {
                    labels: labels,
                    datasets: [{
                        label: label,
                        data: filteredData,
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'][Math.floor(Math.random() * 4)],
                        borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'][Math.floor(Math.random() * 4)],
                        borderWidth: 1,
                        fill: type === 'doughnut' ? false : true
                    }]
                },
                options: {
                    plugins: { legend: { display: false } },
                    scales: type === 'bar' || type === 'line' ? { y: { beginAtZero: true } } : {}
                }
            });
        }
    };

    createChart('chart-electricity', 'line', result.category_data, 'electricity');
    createChart('chart-car', 'bar', result.category_data, 'car');
    createChart('chart-food', 'doughnut', result.category_data, 'food');
    createChart('chart-train', 'bar', result.category_data, 'train');
}
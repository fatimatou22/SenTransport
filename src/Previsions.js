import { useState, useEffect } from 'react';
import './Previsions.css';

function Previsions() {
  const [previsions, setPrevisions] = useState([]);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    const API_KEY = process.env.REACT_APP_OWM_KEY;
    if (!API_KEY) {
      setErreur("Cle API manquante (.env)");
      return;
    }

    const url =
      'https://api.openweathermap.org/data/2.5/forecast'
      + '?q=Dakar&appid=' + API_KEY
      + '&units=metric&lang=fr&cnt=24';

    fetch(url)
      .then(r => {
        if (!r.ok) throw new Error("Erreur : " + r.status);
        return r.json();
      })
      .then(data => {
        // On garde 1 entrée par jour (toutes les 8 mesures = 24h)
        const parJour = data.list.filter((_, index) => index % 8 === 0).slice(0, 3);
        setPrevisions(parJour.map(item => ({
          date: new Date(item.dt * 1000).toLocaleDateString('fr-FR', {
            weekday: 'short', day: 'numeric', month: 'short'
          }),
          temperature: Math.round(item.main.temp),
          description: item.weather[0].description,
          icone: item.weather[0].icon,
          humidite: item.main.humidity,
        })));
      })
      .catch(err => setErreur(err.message));
  }, []);

  if (erreur) {
    return (
      <div className="previsions previsions-erreur">
        <p>Prévisions indisponibles</p>
      </div>
    );
  }

  if (previsions.length === 0) {
    return <div className="previsions">Chargement prévisions...</div>;
  }

  return (
    <div className="previsions">
      <h3 className="previsions-titre">Prévisions 3 prochains jours</h3>
      <div className="previsions-liste">
        {previsions.map((p, index) => (
          <div key={index} className="prevision-card">
            <p className="prevision-date">{p.date}</p>
            <img
              src={`https://openweathermap.org/img/wn/${p.icone}@2x.png`}
              alt={p.description}
              className="prevision-icone"
            />
            <p className="prevision-temp">{p.temperature}°C</p>
            <p className="prevision-desc">{p.description}</p>
            <p className="prevision-humidite">💧 {p.humidite}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Previsions;
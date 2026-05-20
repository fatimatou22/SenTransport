import { useState, useEffect } from 'react';
import './ListeIncidents.css';

function ListeIncidents() {
  const [incidents, setIncidents] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/incidents")
      .then(r => r.json())
      .then(data => {
        setIncidents(data);
        setChargement(false);
      })
      .catch(() => setChargement(false));
  }, []);

  if (chargement) {
    return <div className="liste-incidents">Chargement...</div>;
  }

  if (incidents.length === 0) {
    return (
      <div className="liste-incidents">
        <h3 className="liste-incidents-titre">Incidents signalés</h3>
        <p className="liste-incidents-vide">Aucun incident signalé.</p>
      </div>
    );
  }

  return (
    <div className="liste-incidents">
      <h3 className="liste-incidents-titre">
        Incidents signalés ({incidents.length})
      </h3>
      {incidents.map(incident => (
        <div key={incident.id} className="incident-card">
          <div className="incident-header">
            <span className="incident-ligne">Ligne {incident.ligne}</span>
            <span className="incident-lieu">📍 {incident.lieu}</span>
          </div>
          <p className="incident-description">{incident.description}</p>
        </div>
      ))}
    </div>
  );
}

export default ListeIncidents;
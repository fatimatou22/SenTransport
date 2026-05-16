import { useState, useEffect } from 'react';
import './DetailLigne.css';

function DetailLigne({ ligne }) {

  const [detail, setDetail] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    setChargement(true);
    setErreur(null);

    fetch("http://localhost:5000/lignes/" + ligne.id)
      .then(response => {
        if (!response.ok) {
          throw new Error("Erreur serveur : " + response.status);
        }
        return response.json();
      })
      .then(data => {
        setDetail(data);
        setChargement(false);
      })
      .catch(error => {
        setErreur(error.message);
        setChargement(false);
      });
  }, [ligne.id]);

  if (chargement) {
    return (
      <div className="detail-ligne">
        <p>Chargement des détails...</p>
      </div>
    );
  }

  if (erreur) {
    return (
      <div className="detail-ligne">
        <p>Erreur : {erreur}</p>
      </div>
    );
  }

  return (
    <div className="detail-ligne">
      <h3 className="detail-titre">
        Ligne {detail.numero} : {detail.depart} → {detail.arrivee}
      </h3>
      <p className="detail-info">
        {detail.arrets} arrets sur ce trajet
      </p>
      <div className="detail-arrets">
        <h4>Arrets principaux :</h4>
        <ul className="detail-liste">
          {detail.listeArrets.map((arret, index) => (
            <li key={index} className="detail-arret">
              <span className="arret-numero">{index + 1}</span>
              <span className="arret-nom">{arret}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DetailLigne;
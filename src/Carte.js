import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Carte.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const iconeBleu = new L.Icon({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const iconeOrange = L.divIcon({
  className: '',
  html: `<div style="
    width: 20px;
    height: 20px;
    background-color: orange;
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 0 6px rgba(0,0,0,0.5);
  "></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -10],
});

function CentrerCarte({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 15);
    }
  }, [position, map]);
  return null;
}

function calculerDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI/180) *
    Math.cos(lat2 * Math.PI/180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function Carte() {
  const [arrets, setArrets] = useState([]);
  const [positionUtilisateur, setPositionUtilisateur] = useState(null);
  const [arretProche, setArretProche] = useState(null);
  const [troisProches, setTroisProches] = useState([]);
  const [centrer, setCentrer] = useState(false);

  const DAKAR = [14.6928, -17.4467];

  useEffect(() => {
    fetch("http://localhost:5000/arrets")
      .then(r => r.json())
      .then(data => setArrets(data))
      .catch(err => console.error("Erreur arrets:", err));
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setPositionUtilisateur([
            pos.coords.latitude,
            pos.coords.longitude
          ]);
        },
        () => {
          setPositionUtilisateur([14.6928, -17.4467]);
        }
      );
    } else {
      setPositionUtilisateur([14.6928, -17.4467]);
    }
  }, []);

  useEffect(() => {
    if (positionUtilisateur && arrets.length > 0) {
      // Calculer distance pour tous les arrets
      const avecDistance = arrets.map(a => ({
        ...a,
        distance: calculerDistance(
          positionUtilisateur[0],
          positionUtilisateur[1],
          a.lat, a.lon
        )
      }));

      // Trier par distance
      avecDistance.sort((a, b) => a.distance - b.distance);

      // Les 3 plus proches
      const top3 = avecDistance.slice(0, 3);
      setTroisProches(top3);
      setArretProche(top3[0]);
    }
  }, [positionUtilisateur, arrets]);

  return (
    <div className="carte-container">
      <h2 className="carte-titre">Carte des arrets</h2>

      {troisProches.length > 0 && (
        <div className="trois-proches">
          <p><strong>3 arrêts les plus proches :</strong></p>
          <ul className="liste-proches">
            {troisProches.map((a, i) => (
              <li key={a.id} className={i === 0 ? 'premier' : ''}>
                {i + 1}. <strong>{a.nom}</strong> — {a.distance.toFixed(1)} km
                — Lignes : {a.lignes.join(", ")}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        className="btn-centrer"
        onClick={() => setCentrer(true)}
      >
        Centrer sur ma position
      </button>

      <MapContainer center={DAKAR} zoom={13} className="carte">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap"
        />
        {centrer && positionUtilisateur && (
          <CentrerCarte position={positionUtilisateur} />
        )}
        {arrets.map(a => (
          <Marker
            key={a.id}
            position={[a.lat, a.lon]}
            icon={arretProche && arretProche.id === a.id
              ? iconeOrange
              : iconeBleu}
          >
            <Popup>
              <strong>{a.nom}</strong><br />
              Lignes : {a.lignes.join(", ")}
              {arretProche && arretProche.id === a.id && (
                <><br /><em>Arret le plus proche !</em></>
              )}
            </Popup>
          </Marker>
        ))}
        {positionUtilisateur && (
          <Marker position={positionUtilisateur}>
            <Popup>Vous etes ici</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

export default Carte;
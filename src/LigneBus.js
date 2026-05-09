import './LigneBus.css';

function LigneBus({ numero, depart, arrivee, arrets, couleur, estSelectionnee, onClick }) {
  return (
    <div
      className={`ligne-bus ${estSelectionnee ? 'ligne-bus-active' : ''}`}
      onClick={onClick}
      style={{ borderLeftColor: couleur || '#0a6e31' }}
    >
      <div
        className="ligne-numero"
        style={{ backgroundColor: couleur || '#0a6e31' }}
      >
        {numero}
      </div>
      <div className="ligne-info">
        <span className="ligne-trajet">
          {depart} → {arrivee}
        </span>
        <span className="ligne-arrets">{arrets} arrets</span>
      </div>
    </div>
  );
}

export default LigneBus;
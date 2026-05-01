function StatReseau({ lignes }) {
  const totalLignes = lignes.length;
  const totalArrets = lignes.reduce((sum, l) => sum + l.arrets, 0);
  const ligneMax = lignes.reduce((max, l) => l.arrets > max.arrets ? l : max, lignes[0]);

  return (
    <div className="stat-reseau">
      <p>Nombre de lignes : {totalLignes}</p>
      <p>Total d'arrêts : {totalArrets}</p>
      <p>Ligne avec le plus d'arrêts : {ligneMax.numero} ({ligneMax.arrets} arrêts)</p>
    </div>
  );
}

export default StatReseau;
import './App.css';
import Header from './Header';

function App() {
  return (
    <div className="App">
      <Header />
      <main className="contenu">
        <div className="statistique">
          <h2>10 lignes</h2>
          <p>disponibles à Dakar</p>
        </div>

        <div className="statistique">
          <h2>150 arrêts</h2>
          <p>dans tout Dakar</p>
        </div>

        <div className="statistique">
          <h2>50 000 voyageurs</h2>
          <p>par jour</p>
        </div>
      </main>
    </div>
  );
}

export default App;
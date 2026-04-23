import './App.css';
import Header from './Header';
import Statistique from './Statistique';

function App() {
  return (
    <div className="App">
      <Header />
      <main className="contenu">
        <Statistique />
        <Statistique />
        <Statistique />
      </main>
    </div>
  );
}

export default App;
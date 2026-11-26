import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { CryptoDetailPage } from './pages/CryptoDetailPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <BrowserRouter>
      <a className="skip-link" href="#main-content">Saltar al contenido</a>
      <header className="site-header">
        <Link className="brand" to="/">Pulso Abierto</Link>
        <p>Consulta de información pública de criptomonedas.</p>
      </header>
      <main id="main-content" className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/criptomonedas/:id" element={<CryptoDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <footer>
        Fuente de datos: <a href="https://www.coingecko.com/" target="_blank" rel="noopener noreferrer">CoinGecko</a>.
      </footer>
    </BrowserRouter>
  );
}

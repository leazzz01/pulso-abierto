import { Link } from 'react-router-dom';
import { useFavoritesStore } from '../store/favoritesStore';
import type { CryptoCoin, Currency } from '../types/crypto';

interface CryptoCardProps {
  crypto: CryptoCoin;
  currency: Currency;
}

export function formatMoney(value: number | null, currency: Currency): string {
  return value === null ? 'No disponible' : new Intl.NumberFormat('es-AR', {
    style: 'currency', currency: currency.toUpperCase(), maximumFractionDigits: 2,
  }).format(value);
}

export function CryptoCard({ crypto, currency }: CryptoCardProps) {
  const favorite = useFavoritesStore((state) => state.favoriteIds.includes(crypto.id));
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  return (
    <article className="crypto-card">
      <div className="coin-heading">
        <img src={crypto.image} alt="" width="42" height="42" />
        <div><h3>{crypto.name}</h3><span>{crypto.symbol.toUpperCase()}</span></div>
      </div>
      <p className="price">{formatMoney(crypto.current_price, currency)}</p>
      <p>Variación en 24 h: {crypto.price_change_percentage_24h === null
        ? 'No disponible' : `${crypto.price_change_percentage_24h.toFixed(2)} %`}</p>
      <div className="card-actions">
        <Link to={`/criptomonedas/${encodeURIComponent(crypto.id)}?currency=${currency}`}
          aria-label={`Ver detalle de ${crypto.name}`}>
          Ver detalle<span className="sr-only"> de {crypto.name}</span>
        </Link>
        <button type="button" className="favorite" aria-pressed={favorite}
          aria-label={`${favorite ? 'Quitar' : 'Añadir'} ${crypto.name} ${favorite ? 'de' : 'a'} favoritos`}
          onClick={() => toggleFavorite(crypto.id)}>
          {favorite ? '★ Favorito' : '☆ Favorito'}
        </button>
      </div>
    </article>
  );
}

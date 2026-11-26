import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { formatMoney } from '../components/CryptoCard';
import { StatusMessage } from '../components/StatusMessage';
import { isCryptoId } from '../data/cryptocurrencies';
import { querySchema } from '../schemas/querySchema';
import { fetchCryptos } from '../services/cryptoService';
import { useFavoritesStore } from '../store/favoritesStore';
import type { MarketCoin, RequestStatus } from '../types/api';

export function CryptoDetailPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const currencyResult = querySchema.shape.currency.safeParse(searchParams.get('currency') ?? 'usd');
  const currency = currencyResult.success ? currencyResult.data : null;
  const validId = id !== undefined && isCryptoId(id) ? id : null;
  const favorite = useFavoritesStore((state) => validId !== null && state.favoriteIds.includes(validId));
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const [coin, setCoin] = useState<MarketCoin | null>(null);
  const [status, setStatus] = useState<RequestStatus>('loading');
  const [requestNumber, setRequestNumber] = useState(0);

  useEffect(() => {
    if (!validId || !currency) return;
    const controller = new AbortController();
    setStatus('loading');
    setCoin(null);
    fetchCryptos({ id: validId, currency, signal: controller.signal })
      .then((data) => {
        if (controller.signal.aborted) return;
        const found = data.find((item) => item.id === validId);
        setCoin(found ?? null);
        setStatus(found ? 'success' : 'empty');
      })
      .catch((cause: unknown) => {
        if (controller.signal.aborted) return;
        console.error('Error al consultar el detalle en CoinGecko:', cause);
        setStatus('error');
      });
    return () => controller.abort();
  }, [validId, currency, requestNumber]);

  return (
    <section className="panel">
      <Link to="/">← Volver a las cotizaciones</Link>
      <h1>Detalle de la criptomoneda</h1>
      {!currency && <StatusMessage status="error" message="La moneda indicada en la dirección no es válida." />}
      {currency && !validId && <StatusMessage status="empty" message="No existe una criptomoneda con ese identificador." />}
      {currency && validId && status === 'loading' && <StatusMessage status="loading" message="Consultando el detalle…" />}
      {currency && validId && status === 'error' && <StatusMessage status="error"
        message="No pudimos obtener el detalle. Revisa tu conexión o inténtalo más tarde."
        onRetry={() => setRequestNumber((previous) => previous + 1)} />}
      {currency && validId && status === 'empty' && <StatusMessage status="empty" message="La consulta no devolvió datos para esta criptomoneda." />}
      {currency && validId && status === 'success' && coin && (
        <div className="detail">
          <div className="coin-heading">
            <img src={coin.image} alt="" width="48" height="48" />
            <div><h2>{coin.name}</h2><span>{coin.symbol.toUpperCase()}</span></div>
          </div>
          <dl>
            <div><dt>Precio actual</dt><dd>{formatMoney(coin.current_price, currency)}</dd></div>
            <div><dt>Capitalización de mercado</dt><dd>{formatMoney(coin.market_cap, currency)}</dd></div>
            <div><dt>Volumen en 24 h</dt><dd>{formatMoney(coin.total_volume, currency)}</dd></div>
            <div><dt>Variación en 24 h</dt><dd>{coin.price_change_percentage_24h === null
              ? 'No disponible' : `${coin.price_change_percentage_24h.toFixed(2)} %`}</dd></div>
          </dl>
          <button type="button" className="button button--secondary" aria-pressed={favorite}
            onClick={() => toggleFavorite(coin.id)}>
            {favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          </button>
        </div>
      )}
    </section>
  );
}

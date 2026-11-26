import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CryptoList } from '../components/CryptoList';
import { QueryControls } from '../components/QueryControls';
import { StatusMessage } from '../components/StatusMessage';
import type { QueryValues } from '../schemas/querySchema';
import { fetchCryptos } from '../services/cryptoService';
import { useFavoritesStore } from '../store/favoritesStore';
import type { MarketCoin, RequestStatus } from '../types/api';
import type { Currency } from '../types/crypto';

export function HomePage() {
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const [searchParams] = useSearchParams();
  const demo = searchParams.get('demo');
  const [values, setValues] = useState<QueryValues>({ search: '', currency: 'usd', favoritesOnly: false });
  const [currency, setCurrency] = useState<Currency>('usd');
  const [requestNumber, setRequestNumber] = useState(0);
  const [coins, setCoins] = useState<MarketCoin[]>([]);
  const [status, setStatus] = useState<RequestStatus>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    if (demo === 'empty') {
      setCoins([]);
      setStatus('empty');
      return;
    }
    if (demo === 'error') {
      setError('Error de prueba de demostración. Quita ?demo=error de la dirección para consultar la API.');
      setStatus('error');
      return;
    }
    const controller = new AbortController();
    setStatus('loading');
    fetchCryptos({ currency, signal: controller.signal })
      .then((data) => {
        if (controller.signal.aborted) return;
        setCoins(data);
        setStatus(data.length ? 'success' : 'empty');
      })
      .catch((cause: unknown) => {
        if (controller.signal.aborted) return;
        console.error('Error al consultar CoinGecko:', cause);
        setError('No pudimos obtener las cotizaciones. Revisa tu conexión o inténtalo más tarde.');
        setStatus('error');
      });
    return () => controller.abort();
  }, [currency, requestNumber, demo]);

  const search = values.search.trim().toLocaleLowerCase();
  const filtered = coins.filter((coin) => (!search || coin.name.toLocaleLowerCase().includes(search) ||
    coin.symbol.toLocaleLowerCase().includes(search)) && (!values.favoritesOnly || favoriteIds.includes(coin.id)));

  function submit(query: QueryValues) {
    setValues(query);
    setCurrency(query.currency);
    setRequestNumber((previous) => previous + 1);
  }

  return (
    <>
      <section className="panel intro">
        <p className="eyebrow">Mercados digitales</p>
        <h1>Cotización de criptomonedas</h1>
        <p>Consulta las cotizaciones de Bitcoin, Ethereum y Solana.</p>
      </section>
      <section className="panel" aria-label="Filtros de consulta">
        <QueryControls values={values} onChange={setValues} onSubmit={submit} loading={status === 'loading'} />
        <p>Favoritos: {favoriteIds.length}</p>
      </section>
      <section aria-labelledby="results-title" aria-busy={status === 'loading'}>
        <h2 id="results-title">Resultados</h2>
        {status === 'loading' && <StatusMessage status="loading" message="Consultando cotizaciones…" />}
        {status === 'error' && <StatusMessage status="error" message={error}
          onRetry={() => setRequestNumber((previous) => previous + 1)} />}
        {status === 'empty' && <StatusMessage status="empty" message="La consulta no devolvió criptomonedas." />}
        {status === 'success' && (
          <>
            <StatusMessage status="success" message={`${filtered.length} resultado${filtered.length === 1 ? '' : 's'} en ${currency.toUpperCase()}.`} />
            <CryptoList cryptos={filtered} currency={currency} />
          </>
        )}
      </section>
    </>
  );
}

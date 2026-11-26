import type { CryptoCoin, Currency } from '../types/crypto';
import { CryptoCard } from './CryptoCard';
import { StatusMessage } from './StatusMessage';

interface CryptoListProps {
  cryptos: CryptoCoin[];
  currency: Currency;
}

export function CryptoList({ cryptos, currency }: CryptoListProps) {
  if (cryptos.length === 0) {
    return <StatusMessage status="empty" message="No hay criptomonedas que coincidan con los filtros." />;
  }
  return (
    <div className="crypto-grid">
      {cryptos.map((crypto) => (
        <CryptoCard key={crypto.id} crypto={crypto} currency={currency} />
      ))}
    </div>
  );
}

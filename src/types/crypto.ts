export type Currency = 'usd' | 'eur' | 'ars';

export interface CryptoCoin {
  id: CryptoId;
  symbol: string;
  name: string;
  image: string;
  current_price: number | null;
  market_cap: number | null;
  price_change_percentage_24h: number | null;
  total_volume: number | null;
}
import type { CryptoId } from '../data/cryptocurrencies';


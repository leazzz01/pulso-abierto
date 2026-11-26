import type { CryptoCoin, Currency } from './crypto';
import type { CryptoId } from '../data/cryptocurrencies';

export type MarketCoin = CryptoCoin;

export interface MarketQuery {
  currency: Currency;
  id?: CryptoId;
  signal?: AbortSignal;
}

export type RequestStatus = 'loading' | 'error' | 'success' | 'empty';

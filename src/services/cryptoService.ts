import { z } from 'zod';
import { cryptoIds, cryptocurrencies } from '../data/cryptocurrencies';
import type { MarketCoin, MarketQuery } from '../types/api';

export async function fetchCryptos({ currency, id, signal }: MarketQuery): Promise<MarketCoin[]> {
  const requestedIds = id ? [id] : cryptoIds;
  const params = new URLSearchParams({
    ids: requestedIds.join(','),
    vs_currencies: currency,
    include_market_cap: 'true',
    include_24hr_vol: 'true',
    include_24hr_change: 'true',
  });

  const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?${params}`, { signal });
  if (!response.ok) {
    throw new Error(`CoinGecko respondió con HTTP ${response.status}.`);
  }

  const quoteSchema = z.object({
    [currency]: z.number().nullable(),
    [`${currency}_market_cap`]: z.number().nullable(),
    [`${currency}_24h_vol`]: z.number().nullable(),
    [`${currency}_24h_change`]: z.number().nullable(),
  });
  const data = z.record(z.string(), quoteSchema).parse(await response.json());
  if (Object.keys(data).length === 0) return [];

  return requestedIds.map((cryptoId) => {
    const quote = data[cryptoId];
    if (!quote) throw new Error(`CoinGecko no devolvió datos para ${cryptoId}.`);
    return {
      id: cryptoId,
      ...cryptocurrencies[cryptoId],
      current_price: quote[currency],
      market_cap: quote[`${currency}_market_cap`],
      total_volume: quote[`${currency}_24h_vol`],
      price_change_percentage_24h: quote[`${currency}_24h_change`],
    };
  });
}

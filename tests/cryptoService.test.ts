import { describe, expect, it, vi } from 'vitest';
import { fetchCryptos } from '../src/services/cryptoService';

function quote(currency: string, price: number) {
  return {
    [currency]: price,
    [`${currency}_market_cap`]: 1000,
    [`${currency}_24h_vol`]: 100,
    [`${currency}_24h_change`]: null,
  };
}

describe('servicio de CoinGecko', () => {
  it('solicita y adapta las tres criptomonedas en la moneda elegida', async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json({
      bitcoin: quote('eur', 1),
      ethereum: quote('eur', 2),
      solana: quote('eur', 3),
    }));
    vi.stubGlobal('fetch', fetchMock);
    const coins = await fetchCryptos({ currency: 'eur' });
    const url = new URL(fetchMock.mock.calls[0][0]);
    expect(url.pathname).toBe('/api/v3/simple/price');
    expect(url.searchParams.get('ids')).toBe('bitcoin,ethereum,solana');
    expect(url.searchParams.get('vs_currencies')).toBe('eur');
    for (const parameter of ['include_market_cap', 'include_24hr_vol', 'include_24hr_change']) {
      expect(url.searchParams.get(parameter)).toBe('true');
    }
    expect(coins.map(({ id, current_price }) => [id, current_price])).toEqual([
      ['bitcoin', 1], ['ethereum', 2], ['solana', 3],
    ]);
    expect(coins[0].price_change_percentage_24h).toBeNull();
    expect(coins[0]).not.toHaveProperty('favorite');
  });

  it('consulta solo el identificador solicitado para el detalle', async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ solana: quote('ars', 42) }));
    vi.stubGlobal('fetch', fetchMock);
    const coins = await fetchCryptos({ currency: 'ars', id: 'solana' });
    expect(new URL(fetchMock.mock.calls[0][0]).searchParams.get('ids')).toBe('solana');
    expect(coins).toHaveLength(1);
    expect(coins[0]).toMatchObject({ name: 'Solana', current_price: 42 });
  });

  it('distingue una respuesta vacía de una respuesta incompleta o un error HTTP', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(Response.json({}))
      .mockResolvedValueOnce(Response.json({ bitcoin: quote('usd', 1) }))
      .mockResolvedValueOnce(Response.json({ bitcoin: { usd: 1 } }))
      .mockResolvedValueOnce(new Response(null, { status: 429 }));
    vi.stubGlobal('fetch', fetchMock);
    await expect(fetchCryptos({ currency: 'usd' })).resolves.toEqual([]);
    await expect(fetchCryptos({ currency: 'usd' })).rejects.toThrow('no devolvió datos para ethereum');
    await expect(fetchCryptos({ currency: 'usd' })).rejects.toThrow();
    await expect(fetchCryptos({ currency: 'usd' })).rejects.toThrow('HTTP 429');
  });
});

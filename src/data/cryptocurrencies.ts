export const cryptoIds = ['bitcoin', 'ethereum', 'solana'] as const;
export type CryptoId = (typeof cryptoIds)[number];

export const cryptocurrencies: Record<CryptoId, { name: string; symbol: string; image: string }> = {
  bitcoin: {
    name: 'Bitcoin',
    symbol: 'btc',
    image: 'https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png?1696501400',
  },
  ethereum: {
    name: 'Ethereum',
    symbol: 'eth',
    image: 'https://coin-images.coingecko.com/coins/images/279/large/ethereum.png?1696501628',
  },
  solana: {
    name: 'Solana',
    symbol: 'sol',
    image: 'https://coin-images.coingecko.com/coins/images/4128/large/solana.png?1718769756',
  },
};

export function isCryptoId(id: string): id is CryptoId {
  return cryptoIds.some((cryptoId) => cryptoId === id);
}

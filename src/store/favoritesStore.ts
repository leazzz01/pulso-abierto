import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { CryptoId } from '../data/cryptocurrencies';

interface FavoritesState {
  favoriteIds: CryptoId[];
  toggleFavorite: (id: CryptoId) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      favoriteIds: [],
      toggleFavorite: (id) => set((state) => ({
        favoriteIds: state.favoriteIds.includes(id)
          ? state.favoriteIds.filter((favoriteId) => favoriteId !== id)
          : [...state.favoriteIds, id],
      })),
    }),
    {
      name: 'pulso-abierto-favorites',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ favoriteIds: state.favoriteIds }),
    },
  ),
);

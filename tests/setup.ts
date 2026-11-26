import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';
import { useFavoritesStore } from '../src/store/favoritesStore';

beforeEach(() => {
  useFavoritesStore.setState({ favoriteIds: [] });
  localStorage.clear();
  vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('Solicitud de red no simulada'))));
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

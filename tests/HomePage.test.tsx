import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CryptoDetailPage } from '../src/pages/CryptoDetailPage';
import { HomePage } from '../src/pages/HomePage';
import { fetchCryptos } from '../src/services/cryptoService';
import { useFavoritesStore } from '../src/store/favoritesStore';
import type { MarketCoin } from '../src/types/api';

vi.mock('../src/services/cryptoService', () => ({ fetchCryptos: vi.fn() }));
const fetchMock = vi.mocked(fetchCryptos);

const bitcoin: MarketCoin = {
  id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', image: 'bitcoin.png',
  current_price: 100, market_cap: 200, total_volume: 300, price_change_percentage_24h: 2,
};

function renderPages() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/criptomonedas/:id" element={<CryptoDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  fetchMock.mockReset();
});

describe('consulta y favoritos', () => {
  it('muestra la carga y luego el resultado', async () => {
    let resolveRequest!: (coins: MarketCoin[]) => void;
    fetchMock.mockReturnValue(new Promise((resolve) => { resolveRequest = resolve; }));
    renderPages();
    expect(screen.getByText('Consultando cotizaciones…')).toBeTruthy();
    await act(async () => { resolveRequest([bitcoin]); });
    expect(await screen.findByRole('heading', { name: 'Bitcoin' })).toBeTruthy();
    expect(screen.getByText('1 resultado en USD.')).toBeTruthy();
  });

  it('sincroniza y desmarca favoritos entre el listado y el detalle', async () => {
    fetchMock.mockResolvedValue([bitcoin]);
    const user = userEvent.setup();
    renderPages();
    await user.click(await screen.findByRole('button', { name: 'Añadir Bitcoin a favoritos' }));
    expect(screen.getByRole('button', { name: 'Quitar Bitcoin de favoritos' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByText('Favoritos: 1')).toBeTruthy();
    await user.click(screen.getByRole('link', { name: 'Ver detalle de Bitcoin' }));
    await user.click(await screen.findByRole('button', { name: 'Quitar de favoritos' }));
    expect(screen.getByRole('button', { name: 'Añadir a favoritos' }).getAttribute('aria-pressed')).toBe('false');
    await user.click(screen.getByRole('link', { name: '← Volver a las cotizaciones' }));
    expect(await screen.findByRole('button', { name: 'Añadir Bitcoin a favoritos' })).toBeTruthy();
    expect(screen.getByText('Favoritos: 0')).toBeTruthy();
    await user.click(screen.getByRole('link', { name: 'Ver detalle de Bitcoin' }));
    await user.click(await screen.findByRole('button', { name: 'Añadir a favoritos' }));
    await user.click(screen.getByRole('link', { name: '← Volver a las cotizaciones' }));
    expect(await screen.findByRole('button', { name: 'Quitar Bitcoin de favoritos' })).toBeTruthy();
    expect(screen.getByText('Favoritos: 1')).toBeTruthy();
  });

  it('recupera los favoritos guardados y también persiste al quitarlos', async () => {
    fetchMock.mockResolvedValue([bitcoin]);
    const user = userEvent.setup();
    const view = renderPages();
    await user.click(await screen.findByRole('button', { name: 'Añadir Bitcoin a favoritos' }));
    const saved = localStorage.getItem('pulso-abierto-favorites');
    expect(saved).not.toBeNull();
    expect(JSON.parse(saved!).state).toEqual({ favoriteIds: ['bitcoin'] });

    view.unmount();
    useFavoritesStore.setState({ favoriteIds: [] });
    localStorage.setItem('pulso-abierto-favorites', saved!);
    await act(async () => { await useFavoritesStore.persist.rehydrate(); });
    renderPages();
    await user.click(await screen.findByRole('button', { name: 'Quitar Bitcoin de favoritos' }));
    const afterRemoval = localStorage.getItem('pulso-abierto-favorites');
    expect(JSON.parse(afterRemoval!).state).toEqual({ favoriteIds: [] });
    await act(async () => { await useFavoritesStore.persist.rehydrate(); });
    expect(screen.getByRole('button', { name: 'Añadir Bitcoin a favoritos' })).toBeTruthy();
  });

  it('muestra la ausencia de datos', async () => {
    fetchMock.mockResolvedValue([]);
    renderPages();
    expect(await screen.findByText('La consulta no devolvió criptomonedas.')).toBeTruthy();
  });

  it('muestra un error y permite recuperar los resultados al reintentar', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    fetchMock.mockRejectedValueOnce(new Error('Error de prueba')).mockResolvedValue([bitcoin]);
    const user = userEvent.setup();
    renderPages();
    expect(await screen.findByRole('alert')).toHaveProperty('textContent',
      'No pudimos obtener las cotizaciones. Revisa tu conexión o inténtalo más tarde.Volver a intentar');
    await user.click(screen.getByRole('button', { name: 'Volver a intentar' }));
    expect(await screen.findByRole('heading', { name: 'Bitcoin' })).toBeTruthy();
  });
});

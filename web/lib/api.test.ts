import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchProducts } from './api';

describe('api product helpers', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'http://localhost:3002');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('tries the direct products endpoint before falling back to the prefixed route', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ message: 'Not Found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify([{ id: 1, name: 'Cloro', slug: 'cloro' }]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

    vi.stubGlobal('fetch', fetchMock);

    const products = await fetchProducts();

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      'http://localhost:3002/products',
      expect.objectContaining({
        cache: 'no-store',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      'http://localhost:3002/api/products',
      expect.objectContaining({
        cache: 'no-store',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      }),
    );
    expect(products).toHaveLength(1);
  });
});

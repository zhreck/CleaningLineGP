import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { api, resolveApiBaseUrl, setAccessToken } from './apiClient';

describe('apiClient', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    setAccessToken(null);
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'http://localhost:3002');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('keeps localhost when the page itself is served from localhost, so the refresh-token cookie stays on the same host as the Next.js middleware', () => {
    expect(resolveApiBaseUrl('http://localhost:3002', 'http://localhost:3000')).toBe('http://localhost:3002');
  });

  it('normalizes localhost to 127.0.0.1 when the page itself is served from 127.0.0.1', () => {
    expect(resolveApiBaseUrl('http://localhost:3002', 'http://127.0.0.1:3000')).toBe('http://127.0.0.1:3002');
  });

  it('posts directly against the /api-prefixed URL', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(
      new Response(JSON.stringify({ success: true, data: { id: 42 } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    vi.stubGlobal('fetch', fetchMock);

    const response = await api.post('/orders/checkout', {
      deliveryType: 'pickup',
      customerName: 'Test',
      customerEmail: 'test@example.com',
      customerPhone: '+56900000000',
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      'http://localhost:3002/api/orders/checkout',
      expect.any(Object),
    );
    expect(response).toEqual({ success: true, data: { id: 42 } });
  });
});

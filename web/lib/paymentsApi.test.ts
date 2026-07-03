import { describe, expect, it, vi } from 'vitest';
import { createWebpayTransaction, commitWebpayPayment } from './paymentsApi';
import { api } from './apiClient';

vi.mock('./apiClient', () => ({
  api: {
    post: vi.fn(),
  },
}));

describe('paymentsApi response shaping', () => {
  it('unwraps wrapped payment responses when the backend returns { success, data }', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({
      success: true,
      data: { url: 'https://webpay.test', token: 'abc123' },
    });

    const result = await createWebpayTransaction(42);

    expect(result).toEqual({ url: 'https://webpay.test', token: 'abc123' });
  });

  it('accepts unwrapped payment responses when the backend returns the payload directly', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({
      status: 'AUTHORIZED',
      amount: 12000,
      authorizationCode: '000000',
      paymentTypeCode: 'VN',
    });

    const result = await commitWebpayPayment('token-ws');

    expect(result).toEqual({
      status: 'AUTHORIZED',
      amount: 12000,
      authorizationCode: '000000',
      paymentTypeCode: 'VN',
    });
  });
});

const request = require('supertest');
const app = require('./server');

describe('Payment API', () => {
  it('should return a successful response for PayPal payment', async () => {
    const response = await request(app)
      .post('/pay')
      .send({ paymentMethod: 'paypal', amount: 100 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('state');
    expect(response.body).toHaveProperty('links');
  });

  it('should return a successful response for Stripe payment', async () => {
    const response = await request(app)
      .post('/pay')
      .send({ paymentMethod: 'stripe', amount: 100 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('amount');
    expect(response.body).toHaveProperty('currency');
    expect(response.body).toHaveProperty('status');
  });

  it('should return an error response for invalid payment method', async () => {
    const response = await request(app)
      .post('/pay')
      .send({ paymentMethod: 'invalid', amount: 100 });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});

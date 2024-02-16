// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const paypal = require('paypal-rest-sdk');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

paypal.configure({
  mode: 'sandbox',
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

const payWithPayPal = async (amount) => {
  const payment = {
    intent: 'sale',
    payer: { payment_method: 'paypal' },
    redirect_urls: {
      return_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    },
    transactions: [{ amount: { total: amount.toString(), currency: 'USD' } }],
  };

  const response = await new Promise((resolve, reject) =>
    paypal.payment.create(payment, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    })
  );

  return response;
};

const payWithStripe = async (amount) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: 'usd',
  });

  return paymentIntent;
};

app.post('/pay', async (req, res) => {
  const { paymentMethod, amount } = req.body;

  try {
    let result;

    switch (paymentMethod) {
      case 'paypal':
        result = await payWithPayPal(amount);
        break;
      case 'stripe':
        result = await payWithStripe(amount);
        break;
      default:
        return res.status(400).json({ error: 'Invalid payment method' });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Payment failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
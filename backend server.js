// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

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
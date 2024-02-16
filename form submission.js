// script.js
document.getElementById('payment-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const paymentMethod = document.getElementById('payment-method').value;
  const amount = document.getElementById('amount').value;

  try {
    const response = await fetch('http://localhost:3000/pay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentMethod, amount }),
    });

    if (response.ok) {
      const result = await response.json();
      alert('Payment successful: ' + JSON.stringify(result));
    } else {
      alert('Payment failed');
    }
  } catch (error) {
    console.error(error);
    alert('Payment failed');
  }
});
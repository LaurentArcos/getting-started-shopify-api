import express from 'express';
import fetch from 'node-fetch';

const app = express();
const port = 3001;

app.get('/api/orders', async (req, res) => {
  const shopifyUrl = 'https://456c31-2.myshopify.com/admin/api/2021-10/orders.json';
  const response = await fetch(shopifyUrl, {
    method: 'GET',
    headers: {
      'X-Shopify-Access-Token': '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',
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  res.send(data);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

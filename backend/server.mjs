import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3001;

app.get('/api/orders', async (req, res) => {
  const shopifyUrl = 'https://456c31-2.myshopify.com/admin/api/2024-01/orders.json?status=any';
  const response = await fetch(shopifyUrl, {
    method: 'GET',
    headers: {
      'X-Shopify-Access-Token': process.env.SHOPIFY_API_TOKEN,
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  res.send(data);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

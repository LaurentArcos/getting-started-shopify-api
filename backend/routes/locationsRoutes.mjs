import express from 'express';
const router = express.Router();

router.get('/', async (req, res) => {
  const shopifyUrl = `https://${process.env.SHOPIFY_STORE_NAME}.myshopify.com/admin/api/2023-10/locations.json`;
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

export default router;
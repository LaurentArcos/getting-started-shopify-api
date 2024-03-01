import express from 'express';
const router = express.Router();
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

// Route pour récupérer tous les produits et leurs variantes
router.get('/', async (req, res) => {
  const shopifyUrl = `https://${process.env.SHOPIFY_STORE_NAME}.myshopify.com/admin/api/2024-01/products.json`;
  try {
    const response = await fetch(shopifyUrl, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': process.env.SHOPIFY_API_TOKEN,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Error fetching products: ${response.statusText}`);
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).send({ error: error.message });
  }
});

export default router;
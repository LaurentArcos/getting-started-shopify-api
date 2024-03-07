import express from 'express';
const router = express.Router();

router.get('/:productId', async (req, res) => {
  const productId = req.params.productId;
  const shopifyUrl = `https://${process.env.SHOPIFY_STORE_NAME}.myshopify.com/admin/api/2023-10/metafields.json?metafield[owner_id]=${productId}&metafield[owner_resource]=product`;

  try {
    const response = await fetch(shopifyUrl, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': process.env.SHOPIFY_API_TOKEN,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch metafields');
    const data = await response.json();
    res.send(data);
  } catch (error) {
    console.error('Error fetching metafields:', error);
    res.status(500).send({ error: 'Error fetching metafields', details: error.message });
  }
});

export default router;
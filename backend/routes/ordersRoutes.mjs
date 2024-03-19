import express from 'express';
import Shopify from 'shopify-api-node';
const router = express.Router();


router.get('/', async (req, res) => {
  const shopifyUrl = `https://${process.env.SHOPIFY_STORE_NAME}.myshopify.com/admin/api/2023-10/orders.json?status=any`;
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

router.post('/fulfill', async (req, res) => {
  const { orderIds } = req.body;
  const shopify = new Shopify({
    shopName: process.env.SHOPIFY_STORE_NAME,
    apiKey: process.env.SHOPIFY_API_KEY, 
    password: process.env.SHOPIFY_API_PASSWORD,
  });

  try {
    const results = [];

    for (const orderId of orderIds) {
      // Récupérer les détails de commande pour le fulfillment
      const fulfillmentDetails = await shopify.fulfillmentOrder.list(orderId);
      const fulfillmentOrderId = fulfillmentDetails[0].id;
      const fulfillmentLineitemIds = fulfillmentDetails[0].line_items.map(item => ({
          id: item.id,
          quantity: item.quantity,
      }));

      // Préparer les données de mise à jour du fulfillment
      const updateParams = {
        line_items_by_fulfillment_order: [{
          fulfillment_order_id: fulfillmentOrderId,
          fulfillment_order_line_items: fulfillmentLineitemIds,
        }],
        // Supposons que trackingNumber, trackingUrl, etc., sont disponibles
        tracking_info: {
          number: "123456",
          url: "https://example.com/tracking",
          company: "ShippingCompany",
        },
        notify_customer: false,
        // Autres paramètres si nécessaire
      };

      // Créer le fulfillment
      const updateFulfillment = await shopify.fulfillment.createV2(orderId, updateParams);

      results.push({ orderId, status: 'success', data: updateFulfillment });
    }

    res.json(results);
  } catch (error) {
    console.error('Erreur lors de la création des fulfillments sur Shopify:', error);
    res.status(500).json({ message: "Erreur interne du serveur", error: error.message });
  }
});

export default router;
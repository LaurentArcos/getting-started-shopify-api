import express from 'express';
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

router.post('/', async (req, res) => {
  const { orderId } = req.params;
  const { location_id, line_items } = req.body;

  const shopifyUrl = `https://${process.env.SHOPIFY_STORE_NAME}.myshopify.com/admin/api/2023-10/orders/${orderId}/fulfillments.json`;

  try {
    console.log('Sending request to Shopify:', shopifyUrl, {
      headers: {
        'X-Shopify-Access-Token': process.env.SHOPIFY_API_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fulfillment: {
          location_id,
          tracking_number: "",
          line_items,
        },
      }),
    });

    const response = await fetch(shopifyUrl, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': process.env.SHOPIFY_API_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fulfillment: {
          location_id,
          tracking_number: "", 
          line_items,
        },
      }),
    });

    
    if (!response.ok) {
      const errorText = await response.text(); 
      console.error('Failed to fetch:', errorText, 'Status:', response.status); 
      return res.status(500).send({ error: 'Error creating fulfillment', details: errorText });
    }

  
    let data;
    try {
      data = await response.json();
    } catch (error) {
      console.error('Error parsing response JSON:', error);
      return res.status(500).send({ error: 'Error parsing Shopify response' });
    }

    console.log('Fulfillment created:', data);
    res.send(data);
  } catch (error) {
    console.error('Error creating fulfillment:', error);
    res.status(500).send({ error: 'Error creating fulfillment', details: error.message });
  }
});

export default router;
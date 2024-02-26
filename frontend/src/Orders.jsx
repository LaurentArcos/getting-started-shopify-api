import { useEffect, useState } from 'react';

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/orders')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setOrders(data.orders || []);
      })
      .catch(error => console.error('Error fetching orders:', error));
  }, []);

return (
  <div>
    <h1>Commandes</h1>
    {orders.length > 0 ? (
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            ID de la commande : {order.id} - Créée le : {new Date(order.created_at).toLocaleString()} montant : {order.current_subtotal_price} - client : {order.customer.last_name}
            {order.line_items && order.line_items.length > 0 && (
              <ul>
                {order.line_items.map((item) => (
                  <li key={item.id}>{item.name}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    ) : (
      <p>Aucune commande trouvée</p>
    )}
  </div>
);
}

export default Orders;

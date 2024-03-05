import { useEffect, useState } from "react";

const Sessions = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState(new Set());

  useEffect(() => {
    fetch("http://localhost:3001/api/orders")
      .then((response) => response.json())
      .then((data) => setOrders(data.orders || []))
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prevSelectedOrders) => {
      const newSelectedOrders = new Set(prevSelectedOrders);
      if (newSelectedOrders.has(orderId)) {
        newSelectedOrders.delete(orderId);
      } else {
        newSelectedOrders.add(orderId);
      }
      return newSelectedOrders;
    });
  };

  const handleCreateSession = () => {
    console.log(`Session creation button for ${selectedOrders.size} orders`);
  };

  return (
    <div>

      <div className="sessions-header">
        <button className="session-button" onClick={handleCreateSession}>Créer session</button>
      </div>

      {orders.length > 0 ? (

        <div>
          {orders.map((order) => (

            <div key={order.id} className="sessions-orders">

              <div className="sessions-orders-info">
                <div className="sessions-orders-id">
                  <strong>{order.name}</strong> (id: {order.id})
                </div>
                <div className="customer-name">
                  {order.customer.first_name} {order.customer.last_name}
                </div>
              </div>

              <input
                className="session-checkbox"
                type="checkbox"
                checked={selectedOrders.has(order.id)}
                onChange={() => handleSelectOrder(order.id)}
              />

              <div className="sessions-orders-priceanddate">
                <div className="sessions-orders-price">{order.current_subtotal_price} €</div>
                <div className="sessions-orders-date">
                  {new Date(order.created_at).toLocaleString()}
                </div>
              </div>

            </div>

          ))}
        </div>

      ) : (
        <p>Aucune commande trouvée</p>
      )}
    </div>
  );
};

export default Sessions;

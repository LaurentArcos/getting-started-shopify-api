import React, { useEffect, useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationId, setLocationId] = useState(null); 

  useEffect(() => {

    fetch("http://localhost:3001/api/orders")
      .then((response) => response.json())
      .then((data) => {
        setOrders(data.orders || []);
      })
      .catch((error) => console.error("Error fetching orders:", error));


    fetch("http://localhost:3001/api/locations") 
      .then((response) => response.json())
      .then((data) => {
        if (data.locations && data.locations.length > 0) {
          setLocationId(data.locations[0].id); 
        }
      })
      .catch((error) => console.error("Error fetching locations:", error));
  }, []);

  const updateOrderFulfillmentStatus = (orderId) => {
    setOrders(
      orders.map((order) => {
        if (order.id === orderId) {
          return { ...order, fulfillment_status: "fulfilled" };
        }
        return order;
      })
    );
  };

  const createFulfillment = (orderId, lineItems) => {
    if (!locationId) {
      console.error("Location ID is not set");
      return;
    }

    fetch(`http://localhost:3001/api/orders/${orderId}/fulfillment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        location_id: locationId,
        line_items: lineItems.map(item => ({
          id: item.id,
          quantity: item.quantity,
        })),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fulfillment created:", data);
        updateOrderFulfillmentStatus(orderId); // Mise à jour de l'état de la commande
      })
      .catch((error) => console.error("Error creating fulfillment:", error));
  };

  const filteredOrders = orders.filter((order) =>
    order.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleOrderDetails = (id) => {
    setExpandedOrderId((prevState) => (prevState === id ? null : id));
  };

  return (
    <div>
      <div className="search">
        <input
          type="number"
          placeholder="Rechercher par numéro de commande"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {filteredOrders.length > 0 ? (
        <div>
          {filteredOrders.map((order) => (
            <React.Fragment key={order.id}>
              <div
                className="order"
                onClick={() => toggleOrderDetails(order.id)}
              >
                <div className="order-info">
                  <div className="order-id">
                    <strong>{order.name}</strong> (id:{order.id})
                  </div>
                  <div className="customer-name">
                    {order.customer.first_name} {order.customer.last_name}
                  </div>

                </div>
                <div className="order-status">
                  {order.fulfillment_status === "fulfilled" && (
                    <img
                      src={`./check.png`}
                      alt="Fulfilled"
                      style={{ width: "40px", marginRight: "20px" }}
                    />
                  )}
                  <div className="order-meta">
                    <div className="order-price">
                      {order.current_subtotal_price} €
                    </div>
                    <div className="order-date">
                      {new Date(order.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
              {expandedOrderId === order.id && (
                <div className="order-details">
                  <button
                    onClick={() =>
                      createFulfillment(order.id, order.line_items)
                    }
                  >
                    Marquer comme traitée
                  </button>
                  <div className="order-items">
                    {order.line_items.map((item) => (
                      <div className="item" key={item.id}>
                        <div className="item-name">
                          {item.title} - qté : {item.quantity}
                        </div>
                        <div className="item-sizeandcolor">
                          {item.variant_title}
                        </div>
                        <div className="item-details">
                          <span className="item-sku">(sku: {item.sku})</span>
                        </div>
                        <div className="item-details">
                          <span className="item-id">(id: {item.product_id})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="customer-name">
                      {order.shipping_address.first_name} {order.shipping_address.last_name}
                    </div>
                    <div className="customer-name">
                      {order.shipping_address.address1}
                    </div>
                    <div className="customer-name">
                      {order.shipping_address.zip}
                    </div>
                    <div className="customer-name">
                      {order.shipping_address.city}
                    </div>
                  </div>
                  <div className="shipping-details">
                    {order.shipping_lines.map((line, index) => (
                      <div key={index}>
                        <div>Mode de livraison : {line.title}</div>
                        <div>Code : {line.code}</div>
                        <div>Prix : {line.price} €</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      ) : (
        <p>Aucune commande trouvée</p>
      )}
    </div>
  );
};

export default Orders;

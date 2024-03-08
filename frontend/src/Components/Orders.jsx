import React, { useState, useContext } from "react";
import { DataContext } from "../utils/dataContext"; 

const Orders = () => {
  const { orders, fetchMetafieldsForProduct, metafields } = useContext(DataContext); 
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");


  const filteredOrders = orders.filter((order) => order.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const toggleOrderDetails = (id) => {
    setExpandedOrderId((prevState) => (prevState === id ? null : id));
  
    if(expandedOrderId !== id) {
      const order = orders.find((order) => order.id === id);
      order?.line_items.forEach((item) => {
        fetchMetafieldsForProduct(item.product_id);
      });
    }
  };

  const handleEtiquetteClick = () => {
    alert("Cette fonctionnalité n'est pas encore disponible.");
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
                        <div className="item-details">
                          <span className="item-id">(Métafield Value: {metafields[item.product_id]})</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="shipping-details">
                    <div className="shipping-address">
                      <span>{order.shipping_address.first_name} {order.shipping_address.last_name}</span>
                    </div>
                    <div className="shipping-address">
                      {order.shipping_address.address1}
                    </div>
                    <div className="shipping-address">
                      {order.shipping_address.zip}
                    </div>
                    <div className="shipping-address">
                      {order.shipping_address.city}
                    </div>
                  
                    <div className="shipping-method">
                      {order.shipping_lines.map((line, index) => (
                        <div key={index}>
                          <div><span>Mode de livraison : {line.title}</span></div>
                          <div>Code : {line.code}</div>
                          <div>Prix : {line.price} €</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <button className="etiquette-button" onClick={handleEtiquetteClick}>Voir étiquette</button>
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

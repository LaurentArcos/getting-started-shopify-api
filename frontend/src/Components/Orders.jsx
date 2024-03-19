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
        <table>
          <thead>
            <tr>
              <th>Commande (ID)</th>
              <th>Produits</th>
              <th>Date</th>
              <th>Transporteur</th>
              <th>Client</th>
              <th>Adresse</th>
              <th>Code postal</th>
              <th>Ville</th>
              <th>Pays</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <React.Fragment key={order.id}>
                <tr>
                  <td><strong>{order.name}</strong> ({order.id})</td>
                  <td>{order.line_items.reduce((acc, item) => acc + item.quantity, 0)}                     <button onClick={() => toggleOrderDetails(order.id)}>
                      {expandedOrderId === order.id ? 'Moins de détails' : 'Plus de détails'}
                    </button></td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>{order.shipping_lines.map((line) => line.title).join(", ")}</td>
                  <td>{order.customer.first_name} {order.customer.last_name}</td>
                  <td>{order.shipping_address.address1}</td>
                  <td>{order.shipping_address.zip}</td>
                  <td>{order.shipping_address.city}</td>
                  <td>{order.shipping_address.country}</td>
                </tr>
                {expandedOrderId === order.id && (
                  <tr>
                    <td colSpan="10">
                      <div className="order-details">
                        {/* Ici, réutiliser le code existant pour afficher les détails des produits */}
                        <div className="order-items">
                          {order.line_items.map((item) => (
                            <div className="item" key={item.id}>
                              <div className="item-name">{item.title} - qté : {item.quantity}</div>
                              <div className="item-sizeandcolor">{item.variant_title}</div>
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
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Aucune commande trouvée</p>
      )}
    </div>
  );
};

export default Orders;

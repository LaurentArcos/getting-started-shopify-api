
import React, { useState, useContext } from "react";
import { DataContext } from "../utils/dataContext";
import visibleIcon from "../assets/visible.png";
import invisibleIcon from "../assets/invisible.png";

const Orders = () => {
  const { orders, fetchMetafieldsForProduct, metafields } = useContext(DataContext);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [expandAll, setExpandAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = orders.filter((order) =>
    order.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleOrderDetails = (id) => {
    if (expandAll) {
      setExpandAll(false);
    }
    setExpandedOrderId((prevState) => (prevState === id ? null : id));
    const order = orders.find((order) => order.id === id);
    order?.line_items.forEach((item) => {
      if (!metafields[item.product_id]) { // Vérifier si les metafields ne sont pas déjà chargés
        fetchMetafieldsForProduct(item.product_id);
      }
    });
  };

  const toggleAllOrderDetails = () => {
    setExpandAll(!expandAll);
    // Réinitialiser l'expansion individuelle lors de l'activation de l'expansion globale
    if (!expandAll) {
      filteredOrders.forEach((order) => {
        order.line_items.forEach((item) => {
          if (!metafields[item.product_id]) {
            fetchMetafieldsForProduct(item.product_id);
          }
        });
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
        <table className="Orders-table">
          <thead>
            <tr className="title-row">
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
            <tr className="filter-row">
              <th className="th2"></th>
              <th className="th2">
                <button onClick={toggleAllOrderDetails} style={{ background: "none", border: "none" }}>
                  <img
                    className="toggle-icon"
                    src={expandAll ? visibleIcon : invisibleIcon}
                    alt={expandAll ? "Cacher tous les détails" : "Afficher tous les détails"}
                  />
                </button>
              </th>
              <th  className="th2" colSpan={7}></th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <React.Fragment key={order.id}>
                <tr>
                <td>
                    <strong>{order.name}</strong> ({order.id})
                  </td>
                  <td>
  <span className="product-quantity">
    {order.line_items.reduce((acc, item) => acc + item.quantity, 0)}
  </span>
  <button
    onClick={() => toggleOrderDetails(order.id)}
    style={{ background: "none", border: "none", padding: 0, margin: 0, display: "inline" }}
  >
    <img
      className="toggle-icon"
      src={expandedOrderId === order.id ? visibleIcon : invisibleIcon}
      alt={expandedOrderId === order.id ? "Moins de détails" : "Plus de détails"}
    />
  </button>
</td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>
                    {order.shipping_lines.map((line) => line.title).join(", ")}
                  </td>
                  <td>
                    {order.customer.first_name} {order.customer.last_name}
                  </td>
                  <td>{order.shipping_address.address1}</td>
                  <td>{order.shipping_address.zip}</td>
                  <td>{order.shipping_address.city}</td>
                  <td>{order.shipping_address.country}</td>
                </tr>
                {(expandedOrderId === order.id || expandAll) && (
                  <tr>
                    <td colSpan="9" style={{ backgroundColor: 'white', padding: 0 }}>
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
                                <span className="item-sku">
                                  (sku: {item.sku})
                                </span>
                              </div>
                              <div className="item-details">
                                <span className="item-id">
                                  (id: {item.product_id})
                                </span>
                              </div>
                              <div className="item-details">
                                <span className="item-id">
                                  (Métafield Value:{" "}
                                  {metafields[item.product_id]})
                                </span>
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
import React, { useState, useContext } from "react";
import { DataContext } from "../utils/dataContext";
import visibleIcon from "../assets/visible.png";
import invisibleIcon from "../assets/invisible.png";

const Orders = () => {
  const { orders, fetchMetafieldsForProduct, metafields } =
    useContext(DataContext);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [expandAll, setExpandAll] = useState(false);
  const [searchID, setSearchID] = useState("");
  const [searchClient, setSearchClient] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [searchCountry, setSearchCountry] = useState("");
  const [searchTransporter, setSearchTransporter] = useState("");
  const [searchAddress, setSearchAddress] = useState("");
  const [searchPostalCode, setSearchPostalCode] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.created_at).getTime();
    const start = startDate ? new Date(startDate).getTime() : null;
    let end = endDate ? new Date(endDate) : null;
    
    if (end) {

      let endWithExtraDay = new Date(end);
      endWithExtraDay.setDate(endWithExtraDay.getDate() + 1);
      
      end = endWithExtraDay.getTime();
    }
  
    return (
      (!startDate || orderDate >= start) &&
      (!endDate || orderDate < end) &&
      (searchID === "" || order.name.toLowerCase().includes(searchID.toLowerCase())) &&
      (searchClient === "" ||
        (order.customer && `${order.customer.first_name} ${order.customer.last_name}`.toLowerCase().includes(searchClient.toLowerCase()))) &&
      (searchCity === "" ||
        (order.shipping_address && order.shipping_address.city && order.shipping_address.city.toLowerCase().includes(searchCity.toLowerCase()))) &&
      (searchCountry === "" ||
        (order.shipping_address && order.shipping_address.country && order.shipping_address.country.toLowerCase().includes(searchCountry.toLowerCase()))) &&
      (searchTransporter === "" ||
        (order.shipping_lines && order.shipping_lines.some((line) => line.title.toLowerCase().includes(searchTransporter.toLowerCase())))) &&
      (searchAddress === "" ||
        (order.shipping_address && order.shipping_address.address1 && order.shipping_address.address1.toLowerCase().includes(searchAddress.toLowerCase()))) &&
      (searchPostalCode === "" || 
        (order.shipping_address && order.shipping_address.zip && order.shipping_address.zip.toString().includes(searchPostalCode)))
    );
  });

  const toggleOrderDetails = (id) => {
    if (expandAll) {
      setExpandAll(false);
    }
    setExpandedOrderId((prevState) => (prevState === id ? null : id));
    const order = orders.find((order) => order.id === id);
    order?.line_items.forEach((item) => {
      if (!metafields[item.product_id]) {
        // Vérifier si les metafields ne sont pas déjà chargés
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
              <th className="th2">
                <input
                  type="text"
                  placeholder=""
                  value={searchID}
                  onChange={(e) => setSearchID(e.target.value)}
                />
              </th>
              <th className="th2">
                <button
                  onClick={toggleAllOrderDetails}
                  style={{ background: "none", border: "none" }}
                >
                  <img
                    className="toggle-icon"
                    src={expandAll ? invisibleIcon : visibleIcon}
                    alt={
                      expandAll
                        ? "Cacher tous les détails"
                        : "Afficher tous les détails"
                    }
                  />
                </button>
              </th>


              <th className="th2">
                <input
                  className="input-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="Date de début"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="Date de fin"
                />
              </th>
              
              
              <th className="th2">
                <input
                  type="text"
                  placeholder=""
                  value={searchTransporter}
                  onChange={(e) => setSearchTransporter(e.target.value)}
                />
              </th>
              <th className="th2">
                <input
                  type="text"
                  placeholder=""
                  value={searchClient}
                  onChange={(e) => setSearchClient(e.target.value)}
                />
              </th>
              <th className="th2">
                <input
                  type="text"
                  placeholder=""
                  value={searchAddress}
                  onChange={(e) => setSearchAddress(e.target.value)}
                />
              </th>
              <th className="th2">
                <input
                  type="text"
                  placeholder=""
                  value={searchPostalCode}
                  onChange={(e) => setSearchPostalCode(e.target.value)}
                />
              </th>
              <th className="th2">
                <input
                  type="text"
                  placeholder=""
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                />
              </th>
              <th className="th2">
                <input
                  type="text"
                  placeholder=""
                  value={searchCountry}
                  onChange={(e) => setSearchCountry(e.target.value)}
                />
              </th>
            </tr>
          </thead>

          <tbody>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <React.Fragment key={order.id}>
                <tr>
                  <td>
                    <strong>{order.name}</strong> ({order.id})
                  </td>
                  <td>
                    <span className="product-quantity">
                      {order.line_items.reduce(
                        (acc, item) => acc + item.quantity,
                        0
                      )}
                    </span>
                    <button
                      onClick={() => toggleOrderDetails(order.id)}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        margin: 0,
                        display: "inline",
                      }}
                    >
                      <img
                        className="toggle-icon"
                        src={
                          expandedOrderId === order.id
                            ? visibleIcon
                            : invisibleIcon
                        }
                        alt={
                          expandedOrderId === order.id
                            ? "Moins de détails"
                            : "Plus de détails"
                        }
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
                  <td colSpan="9" style={{ backgroundColor: "white", padding: 0 }}>
                    <div className="order-details">
                      {order.line_items.map((item, index) => (
                        <div key={index} className="order-details-item">
                          <div className="item-name">{item.title} - qté : {item.quantity}</div>
                          <div>{item.variant_title}</div>
                          <div className="item-sku">(sku: {item.sku})</div>
                          <div className="item-id">(id: {item.product_id})</div>
                          <div>(Métafield Value: {metafields[item.product_id]})</div>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan="9" style={{ textAlign: "center", padding: "50px", fontSize: "1.5rem" }}>Aucune commande ne correspond à la recherche</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
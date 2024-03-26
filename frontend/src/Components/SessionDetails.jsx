import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSessions } from "../utils/sessionContext";
import { DataContext } from "../utils/dataContext";
import { useSessionSelection } from "../utils/sessionSelectionContext";
import visibleIcon from "../assets/visible.png";
import invisibleIcon from "../assets/invisible.png";
import poubelle from "../assets/poubelle.png";
import printer from "../assets/printer.png";

const SessionDetails = () => {
  let { id } = useParams()
  const { sessionId } = useParams();
  const { selectedPickingSessionId, selectSession } = useSessionSelection();

  const { sessions, removeSession, removeOrderFromSession } = useSessions();

  const [selectedSessionId, setSelectedSessionId] = useState(
    sessionId || selectedPickingSessionId || ""
  );


  useEffect(() => {
    console.log("Session ID from URL:", id);
    if (id) {
      selectSession(id);
    }
  }, [id, selectSession]);


  useEffect(() => {
    setSelectedSessionId(selectedPickingSessionId);
  }, [selectedPickingSessionId]);

  const handleSessionChange = (e) => {
    selectSession(e.target.value);
  };

  const { orders, fetchMetafieldsForProduct, metafields } =
    useContext(DataContext);
  const currentSession = sessions.find(
    (session) => session.id === selectedPickingSessionId
  );

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
  const [selectedOrders, setSelectedOrders] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [fulfillmentFilter, setFulfillmentFilter] = useState("all");

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allOrderIds = new Set(filteredOrders.map((order) => order.id));
      setSelectedOrders(allOrderIds);
      setSelectAll(true);
    } else {
      setSelectedOrders(new Set());
      setSelectAll(false);
    }
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prevSelectedOrders) => {
      const newSelectedOrders = new Set(prevSelectedOrders);
      if (newSelectedOrders.has(orderId)) {
        newSelectedOrders.delete(orderId);
      } else {
        newSelectedOrders.add(orderId);
      }

      setSelectAll(newSelectedOrders.size === filteredOrders.length);

      return newSelectedOrders;
    });
  };

  const handlePrintClick = (orderName, sessionName) => {
    alert(
      `Imprimer l'étiquette pour la commande "${orderName}" de la session "${sessionName}".`
    );
  };

  const handleDeleteSessionClick = () => {
    if (
      window.confirm(
        `Êtes-vous sûr de vouloir supprimer la session "${currentSession?.name}" ?`
      )
    ) {
      removeSession(selectedPickingSessionId);
    }
  };

  const handleRemoveOrderFromSession = (orderId) => {
    const order = orders.find((order) => order.id === orderId);

    const isConfirmed = window.confirm(
      `Supprimer la commande "${order?.name}" de la session "${currentSession?.name}" ?`
    );
    if (isConfirmed) {
      removeOrderFromSession(currentSession.id, orderId);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (!currentSession?.orderIds.includes(order.id)) {
      return false;
    }
    const orderDate = new Date(order.created_at).getTime();
    const start = startDate ? new Date(startDate).getTime() : null;
    let end = endDate ? new Date(endDate) : null;

    if (end) {
      let endWithExtraDay = new Date(end);
      endWithExtraDay.setDate(endWithExtraDay.getDate() + 1);
      end = endWithExtraDay.getTime();
    }

    const matchesFilters =
      (!startDate || orderDate >= start) &&
      (!endDate || orderDate < end) &&
      (searchID === "" ||
        order.name.toLowerCase().includes(searchID.toLowerCase())) &&
      (searchClient === "" ||
        `${order.customer?.first_name ?? ""} ${order.customer?.last_name ?? ""}`
          .toLowerCase()
          .includes(searchClient.toLowerCase())) &&
      (searchCity === "" ||
        order.shipping_address?.city
          ?.toLowerCase()
          .includes(searchCity.toLowerCase())) &&
      (searchCountry === "" ||
        order.shipping_address?.country
          ?.toLowerCase()
          .includes(searchCountry.toLowerCase())) &&
      (searchTransporter === "" ||
        order.shipping_lines?.some((line) =>
          line.title.toLowerCase().includes(searchTransporter.toLowerCase())
        )) &&
      (searchAddress === "" ||
        order.shipping_address?.address1
          ?.toLowerCase()
          .includes(searchAddress.toLowerCase())) &&
      (searchPostalCode === "" ||
        (order.shipping_address?.zip?.toString() ?? "").includes(
          searchPostalCode
        ));

    let matchesFulfillmentStatus = true;
    if (
      fulfillmentFilter === "fulfilled" &&
      order.fulfillment_status !== "fulfilled"
    ) {
      matchesFulfillmentStatus = false;
    } else if (
      fulfillmentFilter === "not-fulfilled" &&
      order.fulfillment_status === "fulfilled"
    ) {
      matchesFulfillmentStatus = false;
    }

    return matchesFilters && matchesFulfillmentStatus;
  });

  const handleFulfillmentFilterChange = (e) => {
    setFulfillmentFilter(e.target.value);
  };

  const toggleOrderDetails = (id) => {
    if (expandAll) {
      setExpandAll(false);
    }
    setExpandedOrderId((prevState) => (prevState === id ? null : id));
    const order = orders.find((order) => order.id === id);
    order?.line_items.forEach((item) => {
      if (!metafields[item.product_id]) {
        fetchMetafieldsForProduct(item.product_id);
      }
    });
  };

  const toggleAllOrderDetails = () => {
    setExpandAll(!expandAll);

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
      <div className="orders-title">
        <label htmlFor="sessionSelect">Détail de la session: </label>
        <select
          className="sessionSelect"
          value={selectedSessionId}
          onChange={handleSessionChange}
        >
          <option value="">Sélectionnez une session</option>
          {sessions.map((session) => (
            <option key={session.id} value={session.id}>
              {session.name}
            </option>
          ))}
        </select>
      </div>
      {currentSession && (
        <div className="sessionNumberOrders">
          <p>Nombre de commandes: {currentSession.orderIds.length}</p>
        </div>
      )}
      <div className="orders">
        <table className="Orders-table">
          <thead>
            <tr className="title-row">
              <th></th>
              <th>ID</th>
              <th>Produits</th>
              <th>Status</th>
              <th>Date</th>
              <th>Transporteur</th>
              <th>Client</th>
              <th>Adresse</th>
              <th>Code postal</th>
              <th>Ville</th>
              <th>Pays</th>
              <th>Imprimer</th>
              <th>Supprimer</th>
            </tr>

            <tr className="filter-row">
              <th className="th2">
                <input
                  type="checkbox"
                  className="checkbox-selectAll"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="th2">
                <input
                  className="id-input"
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
                    src={expandAll ? visibleIcon : invisibleIcon}
                    alt={
                      expandAll
                        ? "Cacher tous les détails"
                        : "Afficher tous les détails"
                    }
                  />
                </button>
              </th>
              <th className="th2">
                <select
                  value={fulfillmentFilter}
                  onChange={handleFulfillmentFilterChange}
                  className="filter-select"
                >
                  <option value="all">Tout afficher</option>
                  <option value="fulfilled">Traitées</option>
                  <option value="not-fulfilled">Non traitées</option>
                </select>
              </th>

              <th className="th2 input-date-div">
                <input
                  type="date"
                  className="input-date"
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
              <th className="th2"></th>
              <th className="th2">
                <img
                  src={poubelle}
                  onClick={handleDeleteSessionClick}
                  alt="suppression"
                  style={{ width: "30px" }}
                />
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr
                    className={`order-row ${
                      expandedOrderId === order.id || expandAll
                        ? "expanded"
                        : ""
                    }`}
                  >
                    <td>
                      <input
                        type="checkbox"
                        className="checkbox-select"
                        checked={selectedOrders.has(order.id)}
                        onChange={() => handleSelectOrder(order.id)}
                      />
                    </td>
                    <td>{order.name}</td>
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
                    <td>
                      {order.fulfillment_status === "fulfilled"
                        ? "Traitée"
                        : "Non traitée"}
                    </td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td>
                      {order.shipping_lines
                        .map((line) => line.title)
                        .join(", ")}
                    </td>
                    <td>
                      {order.customer.first_name} {order.customer.last_name}
                    </td>
                    <td>{order.shipping_address.address1}</td>
                    <td>{order.shipping_address.zip}</td>
                    <td>{order.shipping_address.city}</td>
                    <td>{order.shipping_address.country}</td>
                    <td className="poubelle-div">
                      <div className="poubelle">
                        <img
                          src={printer}
                          alt="imprimer"
                          onClick={() =>
                            handlePrintClick(order.name, currentSession.name)
                          }
                          style={{ width: "30px" }}
                        />
                      </div>
                    </td>
                    <td className="poubelle-div">
                      <div
                        className="poubelle"
                        onClick={() => handleRemoveOrderFromSession(order.id)}
                      >
                        <img
                          src={poubelle}
                          alt="suppression"
                          style={{ width: "25px" }}
                        />
                      </div>
                    </td>
                  </tr>
                  {(expandedOrderId === order.id || expandAll) && (
                    <tr>
                      <td
                        colSpan="12"
                        style={{ backgroundColor: "white", padding: 0 }}
                      >
                        <div className="order-details">
                          {order.line_items.map((item, index) => (
                            <div key={index} className="order-details-item">
                              <div className="item-name">
                                {item.title} - qté : {item.quantity}
                              </div>
                              <div>{item.variant_title}</div>
                              <div className="item-sku">(sku: {item.sku})</div>
                              <div className="item-id">
                                (id: {item.product_id})
                              </div>
                              <div>
                                (Métafield Value: {metafields[item.product_id]})
                              </div>
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
                <td
                  colSpan="12"
                  style={{
                    textAlign: "center",
                    padding: "50px",
                    fontSize: "1.5rem",
                  }}
                >
                  Aucune commande ne correspond à la recherche
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SessionDetails;

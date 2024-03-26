import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { DataContext } from "../utils/dataContext";
import { useSessions } from "../utils/sessionContext";
import visibleIcon from "../assets/visible.png";
import invisibleIcon from "../assets/invisible.png";
import loadingImage from '../assets/seagale.svg';

const Orders = () => {
  const { orders, fetchMetafieldsForProduct, metafields, isLoading} = useContext(DataContext);
  const { sessions, addSession } = useSessions();

  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [expandAll, setExpandAll] = useState(false);
  const [searchSession, setSearchSession] = useState("");
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
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage, setOrdersPerPage] = useState(50);
  const [fulfillmentFilter, setFulfillmentFilter] = useState("all");
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [sessionName, setSessionName] = useState("");
  const [showOrdersWithoutSession, setShowOrdersWithoutSession] = useState(false);


  const handleShowOrdersWithoutSessionChange = () => {
    setShowOrdersWithoutSession(!showOrdersWithoutSession);
  };

  const handleOrdersPerPageChange = (e) => {
    setCurrentPage(1);
    setOrdersPerPage(Number(e.target.value));
  };

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

  const filteredOrders = orders.filter((order) => {
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

    let matchesSession = true;
    if (searchSession !== "") {
      const matchingSessions = sessions.filter((session) =>
        session.name.toLowerCase().includes(searchSession.toLowerCase())
      );
      const matchingOrderIds = new Set(
        matchingSessions.flatMap((session) => session.orderIds)
      );
      matchesSession = matchingOrderIds.has(order.id);
    }

    if (showOrdersWithoutSession) {
      const orderIdsInSessions = new Set(sessions.flatMap(session => session.orderIds));
      return !orderIdsInSessions.has(order.id);
    }

    return matchesFilters && matchesFulfillmentStatus && matchesSession;
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

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredOrders.length / ordersPerPage); i++) {
    pageNumbers.push(i);
  }

  const numberOfPagesToShow = 2;

  const startPage = Math.max(1, currentPage - numberOfPagesToShow);
  const endPage = Math.min(
    pageNumbers.length,
    currentPage + numberOfPagesToShow
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleCreateSessionClick = () => {
    setIsCreatingSession(true);
  };

  const handleSaveSession = () => {
    if (!sessionName.trim() || selectedOrders.size === 0) {
      alert(
        "Veuillez fournir un nom pour la session et sélectionner au moins une commande."
      );
      return;
    }

    const orderIdsArray = Array.from(selectedOrders);
    addSession(sessionName, orderIdsArray);

    setIsCreatingSession(false);
    setSessionName("");
    setSelectedOrders(new Set());
  };

  const handleCancelSession = () => {
    setIsCreatingSession(false);
    setSessionName("");
  };

  if (isLoading) {
    return <div className="loader-container"><img src={loadingImage} alt="Chargement..." className="loader" /></div>;
  }

  return (
    <div className="orders">
      <h2 className="orders-title">Liste des Commandes</h2>
      <div className="filter-pagination-container">
        <div className="filter-container">
        <button onClick={handleCreateSessionClick} className="middle-button">
          Créer une session
        </button>
          <label>
            <input
              type="checkbox"
              checked={showOrdersWithoutSession}
              onChange={handleShowOrdersWithoutSessionChange}
            />
            Afficher uniquement les commandes sans session
          </label>
        </div>

        <div>
          <div className="pagination">
            <button onClick={() => paginate(1)} className="page-nav">
              {"<<"}
            </button>
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="page-nav"
            >
              {"<"}
            </button>
            {pageNumbers.slice(startPage - 1, endPage).map((number) => (
              <button
                key={number}
                className={`page-number ${
                  currentPage === number ? "active" : ""
                }`}
                onClick={() => paginate(number)}
              >
                {number}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === pageNumbers.length}
              className="page-nav"
            >
              {">"}
            </button>
            <button
              onClick={() => paginate(pageNumbers.length)}
              className="page-nav"
            >
              {">>"}
            </button>
          </div>
          <div className="orders-per-page-container">
            <label htmlFor="ordersPerPage" className="orders-per-page-label">
              Nb de commandes par page :
            </label>
            <select
              className="ordersPerPage"
              value={ordersPerPage}
              onChange={handleOrdersPerPageChange}
            >
              {[5, 10, 20, 30, 50, 100].map((number) => (
                <option key={number} value={number}>
                  {number}
                </option>
              ))}
            </select>
          </div>{" "}
        </div>
      </div>

      <table className="Orders-table">
        <thead>
          <tr className="title-row">
            <th></th>
            <th>Session</th>
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
                type="text"
                placeholder=""
                value={searchSession}
                onChange={(e) => setSearchSession(e.target.value)}
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
          </tr>
        </thead>

        <tbody>
          {filteredOrders.length > 0 ? (
            currentOrders.map((order) => (
              <React.Fragment key={order.id}>
                <tr
                  className={`order-row ${
                    expandedOrderId === order.id || expandAll ? "expanded" : ""
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
                  <td className="session-name">
  {sessions
    .filter((session) => session.orderIds.includes(order.id))
    .map((session, index, array) => (
      <React.Fragment key={session.id}>
        <Link to={`/sessions/details/${session.id}`}>
          {session.name}
        </Link>
        {index < array.length - 1 ? ', ' : ''}
      </React.Fragment>
    ))}
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
                    {order.fulfillment_status === "fulfilled" ? "Traitée" : "Non traitée"}
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
      {isCreatingSession && (
        <>
          <div className="modal-backdrop"></div>
          <div className="session-modal">
            <h2>Créer une nouvelle session</h2>
            <input
              type="text"
              placeholder="Nom de la session"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
            />
            <button onClick={handleSaveSession}>Sauvegarder la session</button>
            <button onClick={handleCancelSession}>Annuler</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Orders;

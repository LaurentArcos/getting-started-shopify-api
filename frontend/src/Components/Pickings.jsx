import { useState, useContext, useEffect } from "react";
import { useSessions } from "../utils/sessionContext";
import { DataContext } from "../utils/dataContext";
import { useNavigate } from "react-router-dom";

const Pickings = () => {
  const [expandedSessionId, setExpandedSessionId] = useState(null);
  const [orders, setOrders] = useState([]);
  const { sessions, removeSession } = useSessions();
  const { updateOrderFulfillmentStatus } = useContext(DataContext);
  const [isFulfilled, setIsFulfilled] = useState(false);

  const navigate = useNavigate();

  const navigateToJacky = (orderIds, sessionName) => {
    navigate("/jacky", { state: { selectedOrderIds: orderIds, sessionName: sessionName } });
  };

  const markOrdersAsFulfilled = (orderIds) => {
    const confirmMessage = "Êtes-vous sûr de vouloir marquer ces commandes comme fulfilled ?";
    if (window.confirm(confirmMessage)) {
      orderIds.forEach(orderId => {
        updateOrderFulfillmentStatus(orderId, 'fulfilled');
      });
      setIsFulfilled(true); // Mettre à jour l'état pour refléter que les commandes sont marquées comme fulfilled
    }
  };

  useEffect(() => {
    fetch("http://localhost:3001/api/orders")
      .then((response) => response.json())
      .then((data) => setOrders(data.orders || []))
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  const handleToggleDetails = (sessionId) => {
    setExpandedSessionId((prevId) => (prevId === sessionId ? null : sessionId));
  };

  const handleRemoveSession = (sessionId) => {
    const isConfirmed = window.confirm(
      "Êtes-vous sûr de vouloir supprimer cette session ?"
    );
    if (isConfirmed) {
      removeSession(sessionId);
    }
  };

  return (
    <div>
      {sessions.map((session, index) => (
        <div key={index} className="sessions-list">
          <div className="sessions-list-info">
            <div className="sessions-list-name">
              <strong>{session.name}</strong>
              <p>{session.orderIds.length} commandes</p>
              <p>{new Date(session.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          {expandedSessionId === session.id && (
            <div className="sessions-list-details">
              {session.orderIds.map((orderId) => {
                const order = orders.find((order) => order.id === orderId);
                return (
                  order && (
                    <div className="item" key={orderId}>
                      <div className="item-name">
                        Commande #{order.name} - {order.customer.first_name}{" "}
                        {order.customer.last_name} -{" "}
                        {order.line_items.reduce(
                          (total, item) => total + item.quantity,
                          0
                        )}{" "}
                        articles - {order.current_subtotal_price} €
                      </div>
                    </div>
                  )
                );
              })}
            </div>
          )}
          <button
            onClick={() => navigateToJacky(session.orderIds, session.name)}
            className="details-button"
          >
            Afficher Jacky
          </button>
          {isFulfilled ? (
              <img src="./check.png" alt="Fulfilled" style={{ width: "60px", marginRight: "20px" }}/>
            ) : (
              <button onClick={() => markOrdersAsFulfilled(session.orderIds)}>Marquer comme Fulfilled</button>
            )}
          <div className="sessions-list-buttons">
            <button onClick={() => handleToggleDetails(session.id)}>
              {expandedSessionId === session.id
                ? "Masquer Détails"
                : "Voir Détails Session"}
            </button>
            <button onClick={() => handleRemoveSession(session.id)}>
              Supprimer
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Pickings;

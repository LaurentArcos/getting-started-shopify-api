import React, { useEffect, useState } from "react";
import { useSessions } from '../utils/sessionContext';
import { useData } from '../utils/dataContext';


const Sessions = () => {
  const [selectedOrders, setSelectedOrders] = useState(new Set());
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [sessionName, setSessionName] = useState("");
  const { sessions, addSession } = useSessions();
  const { orders } = useData();
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    const sessionOrderIds = new Set(sessions.flatMap(session => session.orderIds));
    const newFilteredOrders = orders.filter(order => !sessionOrderIds.has(order.id));
    setFilteredOrders(newFilteredOrders);
}, [sessions, orders]);

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
    setIsCreatingSession(true);
  };

  const existingOrderIdsInSessions = sessions.reduce((acc, session) => {
    session.orderIds.forEach((orderId) => acc.add(orderId));
    return acc;
  }, new Set());

  const handleSaveSession = () => {
    if (!sessionName.trim() || selectedOrders.size === 0) {
        console.error("Nom de session vide ou aucune commande sélectionnée.");
        return; 
    }

    const orderIds = Array.from(selectedOrders);
    addSession(sessionName, orderIds);

    setIsCreatingSession(false);
    setSessionName("");
    setSelectedOrders(new Set());
};
  return (
    <div>

      <div className="sessions-header">
        <button className="session-button" onClick={handleCreateSession}>Créer session Picking</button>
      </div>

      {filteredOrders.length > 0 ? (

        <div>
          {filteredOrders.filter(order => !existingOrderIdsInSessions.has(order.id)).map((order) => (

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

{isCreatingSession && (
  <React.Fragment>
    <div className="modal-backdrop"></div>
    <div className="session-modal">
      <h2>Créer une nouvelle session</h2>
      <input
        type="text"
        placeholder="Nom de la session"
        value={sessionName}
        onChange={(e) => setSessionName(e.target.value)}
      />
      <p>Créer la session &quot;{sessionName}&quot; pour {selectedOrders.size} commandes</p>
      <div>
        <button onClick={handleSaveSession}>Valider</button>
        <button onClick={() => setIsCreatingSession(false)}>Annuler</button>
      </div>
    </div>
  </React.Fragment>
)}
</div>
);
};

export default Sessions;
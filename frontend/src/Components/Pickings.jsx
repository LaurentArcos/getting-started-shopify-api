import React, { useState, useEffect } from 'react';
import { useSessions } from '../utils/sessionContext';

const Pickings = () => {
  const { sessions } = useSessions();
  const [expandedSessionId, setExpandedSessionId] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/orders")
      .then((response) => response.json())
      .then((data) => setOrders(data.orders || []))
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  const toggleSessionDetails = (sessionId) => {
    setExpandedSessionId((prevId) => (prevId === sessionId ? null : sessionId));
  };

  return (
    <div>
      <h2>Liste des Sessions</h2>
      {sessions.map((session) => (
        <div key={session.id} onClick={() => toggleSessionDetails(session.id)}>
          <strong>{session.name}</strong> - {(session.orderIds || []).length} commandes - Créé le {session.createdAt.toLocaleDateString()}
          {expandedSessionId === session.id && (
            <ul>
              {session.orderIds.map((orderId) => {
                const order = orders.find((order) => order.id === orderId);
                return (
                  <li key={orderId}>
                    Commande #{order.id}: {order.customer.first_name} {order.customer.last_name} - {order.current_subtotal_price} €
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default Pickings;
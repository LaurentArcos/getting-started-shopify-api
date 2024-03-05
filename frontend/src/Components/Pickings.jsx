import { useState, useEffect } from 'react';
import { useSessions } from '../utils/sessionContext';

const Pickings = () => {
  const [expandedSessionId, setExpandedSessionId] = useState(null);
  const [orders, setOrders] = useState([]);
  const { sessions, removeSession } = useSessions();

  useEffect(() => {
    fetch("http://localhost:3001/api/orders")
      .then((response) => response.json())
      .then((data) => setOrders(data.orders || []))
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  
  const toggleSessionDetails = (sessionId) => {
    setExpandedSessionId(prevId => prevId === sessionId ? null : sessionId);
  };

  const handleRemoveSession = (sessionId) => {
    const isConfirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cette session ?");
    if (isConfirmed) {
      removeSession(sessionId);
    }
  };

  return (
    <div>
        {sessions.map((session, index) => (
            <div key={index} className="sessions-list">
                <div className="sessions-list-info" onClick={() => toggleSessionDetails(session.id)}>
                    <div className="sessions-list-name">
                        <strong>{session.name}</strong><p>{session.orderIds.length} commandes</p><p>{new Date(session.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
                {expandedSessionId === session.id && (
                    <div className="sessions-list-details">
                        {session.orderIds.map(orderId => {
                            const order = orders.find(order => order.id === orderId);
                            return order && (
                                <div className="item" key={orderId}>
                                    <div className="item-name">
                                        Commande #{order.id}: {order.customer.first_name} {order.customer.last_name} - {order.current_subtotal_price} €
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                <div className="sessions-list-delete-button">
                    <button onClick={() => handleRemoveSession(session.id)}>Supprimer</button>
                </div>
            </div>
        ))}
    </div>
);
};

export default Pickings;
import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const SessionContext = createContext();

export const useSessions = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
  const [sessions, setSessions] = useState([]);

  const addSession = (sessionName, orderIds) => {
    const newSession = {
      id: `${new Date().getTime()}`,
      name: sessionName,
      orderIds,
      createdAt: new Date(),
      status: "Ouverte",
    };
    setSessions((prevSessions) => [...prevSessions, newSession]);
  };

  const removeSession = (sessionId) => {
    setSessions((prevSessions) =>
      prevSessions.filter((session) => session.id !== sessionId)
    );
  };

  const removeOrderFromSession = (sessionId, orderId) => {
    setSessions((prevSessions) =>
      prevSessions.map((session) =>
        session.id === sessionId
          ? { ...session, orderIds: session.orderIds.filter((id) => id !== orderId) }
          : session
      )
    );
  };

  return (
    <SessionContext.Provider value={{ sessions, addSession, removeSession, removeOrderFromSession }}>
      {children}
    </SessionContext.Provider>
  );
};

SessionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types'; 

const SessionContext = createContext();

export const useSessions = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
  const [sessions, setSessions] = useState([]);

  const addSession = (sessionName, orderIds) => {
    const newSession = {
      id: `session-${new Date().getTime()}`,
      name: sessionName,
      orderIds,
      createdAt: new Date(),
    };
    setSessions((prevSessions) => [...prevSessions, newSession]);
  };

  const removeSession = (sessionId) => {
    setSessions((prevSessions) => prevSessions.filter(session => session.id !== sessionId));
  };

  return (
    <SessionContext.Provider value={{ sessions, addSession, removeSession }}>
      {children}
    </SessionContext.Provider>
  );
};

SessionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
import { createContext, useContext, useState } from 'react';
import PropTypes from "prop-types";

const SessionSelectionContext = createContext();

export const useSessionSelection = () => useContext(SessionSelectionContext);

export const SessionSelectionProvider = ({ children }) => {
    const [selectedPickingSessionId, setSelectedPickingSessionId] = useState(null);

    const selectSession = (sessionId) => {
        setSelectedPickingSessionId(sessionId);
    };

    return (
        <SessionSelectionContext.Provider value={{ selectedPickingSessionId, selectSession }}>
            {children}
        </SessionSelectionContext.Provider>
    );
};

SessionSelectionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSessions } from "../utils/sessionContext";
import { useSessionSelection } from '../utils/sessionSelectionContext';

const SessionDetails = () => {
  const { sessionId } = useParams();
  const { selectedPickingSessionId, selectSession } = useSessionSelection();
  const { sessions } = useSessions();
  const [selectedSessionId, setSelectedSessionId] = useState(sessionId || "");

  useEffect(() => {
    setSelectedSessionId(selectedPickingSessionId);
  }, [selectedPickingSessionId]);

  const handleSessionChange = (e) => {
    selectSession(e.target.value);
  };


  const currentSession = sessions.find(session => session.id === selectedPickingSessionId);

  return (
    <div>
      <div>
        <label htmlFor="sessionSelect">Détail de la session: </label>
        <select id="sessionSelect" value={selectedSessionId} onChange={handleSessionChange}>
          <option value="">Sélectionnez une session</option>
          {sessions.map((session) => (
            <option key={session.id} value={session.id}>
              {session.name}
            </option>
          ))}
        </select>
      </div>
      {currentSession && (
        <div>
          <h3>{currentSession.name} (ID: {currentSession.id})</h3>
          <p>Nombre de commandes: {currentSession.orderIds.length}</p>
        </div>
      )}
    </div>
  );
};

export default SessionDetails;
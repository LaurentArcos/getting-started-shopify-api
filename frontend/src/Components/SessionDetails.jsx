import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSessions } from "../utils/sessionContext";
import { useSessionSelection } from '../utils/sessionSelectionContext';


const SessionDetails = () => {
  const { sessionId } = useParams();
  const { selectedPickingSessionId, selectSession } = useSessionSelection();
  const navigate = useNavigate();
  const { sessions } = useSessions();
  const [selectedSessionId, setSelectedSessionId] = useState(sessionId || "");

  

  useEffect(() => {
    if (sessionId) {
      selectSession(sessionId);
    }
  }, [sessionId, selectSession]);


  const handleSessionChange = (e) => {
    const newSessionId = e.target.value;
    setSelectedSessionId(newSessionId);
  
    navigate(`/sessions/details/${newSessionId}`);
  };

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
      <div>
        {/* Render session details based on `selectedSessionId` */}
        {/* This is where you'd include the logic to display the details of the selected session */}
        Détails de la session: {selectedSessionId}
      </div>
    </div>
  );
};

export default SessionDetails;
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSessions } from "../utils/sessionContext";
import { useSessionSelection } from '../utils/sessionSelectionContext';


const Preparation = () => {
  const { sessionId } = useParams();
  const { selectedPickingSessionId, selectSession } = useSessionSelection();
  const navigate = useNavigate();
  const { sessions } = useSessions();
  const [selectedSessionId, setSelectedSessionId] = useState(sessionId || "");

  // Update component state when URL parameter changes
  useEffect(() => {
    setSelectedSessionId(sessionId);
  }, [sessionId]);

  const handleSessionChange = (e) => {
    const newSessionId = e.target.value;
    selectSession(newSessionId);
    navigate(`/sessions/preparation/${newSessionId}`);
  };

  return (
    <div>
      <div>
        <label htmlFor="sessionSelect">Préparation de la session: </label>
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
        session {selectedSessionId}
      </div>
    </div>
  );
};

export default Preparation
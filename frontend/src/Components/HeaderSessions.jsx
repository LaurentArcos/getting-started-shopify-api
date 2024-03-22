import { NavLink, useMatch, useResolvedPath } from "react-router-dom";
import { useSessionSelection } from '../utils/sessionSelectionContext';

  const HeaderSessions = () => {
    const { selectedPickingSessionId } = useSessionSelection();
  
    const getNavLinkClass = (path, requiresSelection = true) => {
      const resolvedPath = useResolvedPath(path);
      const isActive = useMatch({ path: resolvedPath.pathname, end: true });
  
      let classes = "header-sessions-link";
  
      if (isActive) {
        classes += " header-sessions-link-active";
      }
      if (requiresSelection && !selectedPickingSessionId) {
        classes += " disabled-link";
      }
  
      return classes;
    };
  
    const handleClick = (e, path, requiresSelection = true) => {
      if (requiresSelection && !selectedPickingSessionId) {
        e.preventDefault(); 
        alert("Veuillez d'abord sélectionner une session");
      }
    };

  return (
    <div className="header-sessions">
      <div className="header-sessions-links">
        <NavLink to="/sessions/liste" className={getNavLinkClass("/sessions/liste", false)}>
          Liste des Sessions
        </NavLink>
        <NavLink 
          to={`/sessions/details/${selectedPickingSessionId || ""}`} 
          className={getNavLinkClass(`/sessions/details/${selectedPickingSessionId || ""}`)}
          onClick={(e) => handleClick(e, `/sessions/details/${selectedPickingSessionId}`)}
        >
          Détails de session
        </NavLink>
        <NavLink 
          to={`/sessions/preparation/${selectedPickingSessionId || ""}`} 
          className={getNavLinkClass(`/sessions/preparation/${selectedPickingSessionId || ""}`)}
          onClick={(e) => handleClick(e, `/sessions/preparation/${selectedPickingSessionId}`)}
        >
          Préparation
        </NavLink>
      </div>
    </div>
  );
};

export default HeaderSessions;
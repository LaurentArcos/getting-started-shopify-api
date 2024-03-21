import { NavLink } from "react-router-dom";

const HeaderSessions = () => {
  return (
    <div className="header-sessions">
      <div className="header-sessions-links">
      <NavLink
        className={({ isActive }) =>
          isActive ? "header-sessions-link header-sessions-link-active" : "header-sessions-link"
        }
        to="/sessions/list"
      >
        Liste des Sessions
      </NavLink>

      <NavLink
        className={({ isActive }) =>
          isActive ? "header-sessions-link header-sessions-link-active" : "header-sessions-link"
        }
        to="/sessions/commandes"
      >
        Détails de session
      </NavLink>

      <NavLink
        className={({ isActive }) =>
          isActive ? "header-sessions-link header-sessions-link-active" : "header-sessions-link"
        }
        to="/sessions/preparation"
      >
        Préparation
      </NavLink>
      </div>
    </div>
  );
};

export default HeaderSessions;
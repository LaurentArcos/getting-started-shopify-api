import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <div className="header">
      <NavLink
        className={({ isActive }) =>
          isActive ? "header-link header-link-active" : "header-link"
        }
        to="/"
        end
      >
        Commandes
      </NavLink>

      <NavLink
        className={({ isActive }) =>
          isActive ? "header-link header-link-active" : "header-link"
        }
        to="/sessions"
      >
        Sessions
      </NavLink>

      <NavLink
        className={({ isActive }) =>
          isActive ? "header-link header-link-active" : "header-link"
        }
        to="/picking"
      >
        Préparation
      </NavLink>
    </div>
  );
};

export default Header;

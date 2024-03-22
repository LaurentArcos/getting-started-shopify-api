import { NavLink, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

 
  const checkIsActive = (path) => {
    return location.pathname.startsWith(path);
  };

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
        className={() =>
          checkIsActive("/sessions") ? "header-link header-link-active" : "header-link"
        }
        to="/sessions/liste"
      >
        Sessions
      </NavLink>
    </div>
  );
};

export default Header;
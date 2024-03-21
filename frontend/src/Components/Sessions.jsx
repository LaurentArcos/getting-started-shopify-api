import { Routes, Route } from "react-router-dom";
import HeaderSessions from "./HeaderSessions";
import SessionsList from "./SessionsList";
import Preparation from "./Preparation";
import SessionOrdersList from "./SessionOrdersList";

const Sessions = () => {
  return (
    <div>
      <HeaderSessions />
      <Routes>
        <Route path="list" element={<SessionsList />} />
        <Route path="commandes" element={<SessionOrdersList />} />
        <Route path="preparation" element={<Preparation />} />
      </Routes>
    </div>
  );
};

export default Sessions;
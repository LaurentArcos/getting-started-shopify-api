import { Routes, Route } from "react-router-dom";
import HeaderSessions from "./HeaderSessions";
import SessionsList from "./SessionsList";
import Preparation from "./Preparation";
import SessionDetails from "./SessionDetails";

const Sessions = () => {
  return (
    <div>
      <HeaderSessions />
      <Routes>
        <Route path="liste" element={<SessionsList />} />
        <Route path="details" element={<SessionDetails />} />
        <Route path="details/:id" element={<SessionDetails />} />
        <Route path="preparation" element={<Preparation />} />
        <Route path="preparation/:id" element={<Preparation />} />
      </Routes>
    </div>
  );
};

export default Sessions;
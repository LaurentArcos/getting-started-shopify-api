import { useState } from "react";
import { useSessions } from "../utils/sessionContext";
import { useNavigate } from "react-router-dom";
import { useSessionSelection } from '../utils/sessionSelectionContext';

const SessionsList = () => {
  const { sessions } = useSessions();
  const [currentPage, setCurrentPage] = useState(1);
  const [sessionsPerPage, setSessionsPerPage] = useState(10);

  const [searchName, setSearchName] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { selectSession } = useSessionSelection();
  const navigate = useNavigate();
  const handleSessionClick = (sessionId) => {
    selectSession(sessionId); // Mettre à jour le contexte avec la session sélectionnée
    navigate(`/sessions/details/${sessionId}`);
  };

  const filteredSessions = sessions.filter(session => {
    const sessionDate = new Date(session.createdAt);
    const start = startDate ? new Date(startDate).getTime() : null;
    const end = endDate ? new Date(endDate).getTime() : null;

    return (
      (searchName === "" || session.name.toLowerCase().includes(searchName.toLowerCase())) &&
      (searchId === "" || session.id === searchId) &&
      (searchStatus === "" || session.status === searchStatus) &&
      (!startDate || sessionDate >= start) &&
      (!endDate || sessionDate <= end)
    );
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const indexOfLastSession = currentPage * sessionsPerPage;
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
  const currentSessions = filteredSessions.slice(indexOfFirstSession, indexOfLastSession);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredSessions.length / sessionsPerPage); i++) {
    pageNumbers.push(i);
  }

  const numberOfPagesToShow = 2;

  const startPage = Math.max(1, currentPage - numberOfPagesToShow);
  const endPage = Math.min(
    pageNumbers.length,
    currentPage + numberOfPagesToShow
  );

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleSessionsPerPageChange = (e) => {
    setSessionsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="sessions">

      <h2 className="sessions-title">Liste des Sessions</h2>

      <div className="pagination">
      <button onClick={() => handlePageChange(1)} className="page-nav">
              {"<<"}
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="page-nav"
            >
              {"<"}
            </button>
            {pageNumbers.slice(startPage - 1, endPage).map((number) => (
              <button
                key={number}
                className={`page-number ${
                  currentPage === number ? "active" : ""
                }`}
                onClick={() => handlePageChange(number)}
              >
                {number}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pageNumbers.length}
              className="page-nav"
            >
              {">"}
            </button>
            <button
              onClick={() => handlePageChange(pageNumbers.length)}
              className="page-nav"
            >
              {">>"}
            </button>
          </div>

          <div className="sessionsPerPage-div">      
          <label htmlFor="ordersPerPage" className="orders-per-page-label">
              Nb de commandes par page :
          </label>
          <select
              className="ordersPerPage"
              value={sessionsPerPage}
              onChange={handleSessionsPerPageChange}
            >
              {[5, 10, 20, 30, 50, 100].map((number) => (
                <option key={number} value={number}>
                  {number}
                </option>
              ))}
          </select>
          </div>

      <table className="sessions-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Status</th>
            <th>ID</th>
            <th>Commandes</th>
            <th>Envoyées</th>
            <th>En attente</th>
            <th>Date</th>
          </tr>
          <tr className="filter-row">
            <th className="th2">
              <input type="text" placeholder="Nom" value={searchName} onChange={e => setSearchName(e.target.value)} />
            </th>
            <th className="th2 ">
              <select
                value={searchStatus}
                onChange={e => setSearchStatus(e.target.value)}
                className="filter-select"
              >
                <option value="">Tous</option>
                <option value="Ouverte">Ouverte</option>
                <option value="En Cours">En Cours</option>
                <option value="Terminée">Terminée</option>
              </select>
            </th>
            <th className="th2">
              <input
                type="text"
                placeholder="ID"
                value={searchId}
                onChange={e => setSearchId(e.target.value)}
              />
            </th>
            <th colSpan="3" className="th2"></th>
            <th className="input-date-div th2 session-date">
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </th>
          </tr>
        </thead>
        <tbody>
          {currentSessions.map((session) => (
            <tr key={session.id} onClick={() => handleSessionClick(session.id)} style={{cursor: 'pointer'}}>
              <td>{session.name}</td>
              <td>{session.status}</td>
              <td>{session.id}</td>
              <td>{session.orderIds.length}</td>
              <td>{0 /* Example placeholder */}</td>
              <td>{session.orderIds.length /* Example placeholder */}</td>
              <td>{new Date(session.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
    </div>
  );
};

export default SessionsList;

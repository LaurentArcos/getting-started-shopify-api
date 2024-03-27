import { createContext, useContext, useState } from 'react';
import PropTypes from "prop-types";

const ProblemContext = createContext();

export const useProblems = () => useContext(ProblemContext);

export const ProblemProvider = ({ children }) => {
  const [problematicItems, setProblematicItems] = useState([]);

  const reportProblem = (sku) => {
    setProblematicItems(prevItems => [...prevItems, sku]);
  };

  const isItemProblematic = (sku) => {
    return problematicItems.includes(sku);
  };

  return (
    <ProblemContext.Provider value={{ problematicItems, reportProblem, isItemProblematic }}>
      {children}
    </ProblemContext.Provider>
  );
};

ProblemProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
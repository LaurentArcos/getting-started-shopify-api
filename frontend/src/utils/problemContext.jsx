import { createContext, useContext, useState } from 'react';
import PropTypes from "prop-types";

const ProblemContext = createContext();

export const useProblems = () => useContext(ProblemContext);

export const ProblemProvider = ({ children }) => {
  const [problems, setProblems] = useState([]);

  const addProblem = (problemVariant) => {
    if (!problems.find((p) => p.sku === problemVariant.sku && p.size === problemVariant.size)) {
      setProblems([...problems, problemVariant]);
    }
  };

  const isProblematic = (sku, size) => {
    return problems.some(problem => problem.sku === sku && problem.size === size);
  };

  return (
    <ProblemContext.Provider value={{ problems, addProblem, isProblematic }}>
      {children}
    </ProblemContext.Provider>
  );
};

ProblemProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
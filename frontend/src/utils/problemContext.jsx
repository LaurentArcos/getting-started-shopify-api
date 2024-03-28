import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const ProblemContext = createContext();

export const useProblems = () => useContext(ProblemContext);

export const ProblemProvider = ({ children }) => {
  const [problems, setProblems] = useState([]);

  const addProblem = (problemVariant, sessionId, message) => {
    const problemExists = problems.some(p => p.sku === problemVariant.sku && p.size === problemVariant.size && p.sessionId === sessionId);
    if (!problemExists) {
      setProblems([...problems, { ...problemVariant, sessionId, message }]);
    }
  };

  const isProblematic = (sku, size, sessionId) => {
    const problem = problems.find(problem => problem.sku === sku && problem.size === size && problem.sessionId === sessionId);
    return problem || null;
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
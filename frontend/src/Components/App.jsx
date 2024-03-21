import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SessionProvider } from '../utils/sessionContext';
import { DataProvider } from '../utils/dataContext';
import Header from './Header'; 
import Orders from './Orders';
import Sessions from './Sessions'; 
import Jacky from './Jacky';
import { SessionSelectionProvider } from '../utils/sessionSelectionContext';

function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <SessionProvider>
          <SessionSelectionProvider>
            <div className="App">
              <Header />
              <Routes>
                <Route path="/" element={<Orders />} />
                <Route path="/sessions/*" element={<Sessions />} /> 
                <Route path="/jacky" element={<Jacky />} />
              </Routes>
            </div>
          </SessionSelectionProvider>
        </SessionProvider>
      </DataProvider>
    </BrowserRouter>
  );
}

export default App;
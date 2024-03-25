import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SessionProvider } from '../utils/sessionContext';
import { DataProvider } from '../utils/dataContext';
import Header from './Header'; 
import Orders from './Orders';
import Sessions from './Sessions'; 
import { SessionSelectionProvider } from '../utils/sessionSelectionContext';
import PickingScreen from './PickingScreen';

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
                <Route path="/sessions/picking/:name" element={<PickingScreen />} />
              </Routes>
            </div>
          </SessionSelectionProvider>
        </SessionProvider>
      </DataProvider>
    </BrowserRouter>
  );
}

export default App;
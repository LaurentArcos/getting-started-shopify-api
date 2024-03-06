import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SessionProvider } from '../utils/sessionContext';
import { DataProvider } from '../utils/dataContext';
import Header from './Header'; 
import Orders from './Orders';
import Sessions from './Sessions';
import Pickings from './Pickings';
import Jacky from './Jacky';

function App() {

  return (
    <BrowserRouter>
    <DataProvider>
    <SessionProvider>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Orders />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/picking" element={<Pickings />} />
          <Route path="/jacky" element={<Jacky />} />
        </Routes>
      </div>
    </SessionProvider>
    </DataProvider>
    </BrowserRouter>
  );
}

export default App;
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './Header'; 
import Orders from './Orders';
import Sessions from './Sessions';
import Pickings from './Pickings';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Orders />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/picking" element={<Pickings />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
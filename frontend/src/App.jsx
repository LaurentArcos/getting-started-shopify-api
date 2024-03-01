import Orders from './Components/Orders';
import Header from './Components/Header';
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {


  return (
    <div className="App">
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path="/" element={<Orders/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

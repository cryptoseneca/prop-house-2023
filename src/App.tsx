import './App.css';
import Main from './Main';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/:address" element={<Main />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

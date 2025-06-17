import './App.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login'; 
import Main from './components/Main';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
         <Route path="/main" element={<Main />} />
          <Route path="/register" element={<Register/>} />
      </Routes>
    </Router>
  );
}

export default App;

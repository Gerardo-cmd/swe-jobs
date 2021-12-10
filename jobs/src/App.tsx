import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import './App.css';
import Login from './components/pages/Login';
import SignUp from './components/pages/SignUp';
import HomePage from './components/pages/HomePage';
import NewPosition from './components/pages/NewPosition';
import TemporaryDrawer from './components/sub-components/persistantDrawerLeft';

const App: React.FC = () => {
  return (
    <div className="App">
      <TemporaryDrawer />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/" element={<SignUp />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/new-position" element={<NewPosition />} />
        </Routes>
    </div>
  );
}

const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  )
}

export default AppWrapper;

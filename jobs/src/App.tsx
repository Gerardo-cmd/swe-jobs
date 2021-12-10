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
import EditPosition from './components/pages/EditPosition';

const App: React.FC = () => {
  return (
    <div className="App">
      <TemporaryDrawer />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/:positionId" element={<EditPosition />} />
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

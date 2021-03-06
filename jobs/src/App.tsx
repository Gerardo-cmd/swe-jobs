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
import ViewPosition from './components/pages/ViewPosition';
import EditPosition from './components/pages/EditPosition';
import Data from './components/pages/Data';
import { createTheme, ThemeProvider } from '@mui/material';

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#242222'
    },
    secondary: {
      main: '#C0FDFF'
    },
  }
});

const App: React.FC = () => {
  return (
    <div className={`App gradient`}>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/view/:positionId" element={<ViewPosition />} />
          <Route path="/:positionId" element={<EditPosition />} />
          <Route path="/new-position" element={<NewPosition />} />
          <Route path="/data" element={<Data />} />
        </Routes>
      </ThemeProvider>
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

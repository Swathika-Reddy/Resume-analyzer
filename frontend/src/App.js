import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Home from './components/Home';
import Register from './components/Register';
import UserDashboard from './components/UserDashboard';
import ResumeAnalysis from './components/ResumeAnalysis';
import CareerAssessment from './components/CareerAssessment';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/resume-analysis" element={<ResumeAnalysis />} />
          <Route path="/career-assessment" element={<CareerAssessment />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 
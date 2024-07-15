import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SystemDashboard from './components/SystemDashboard';
import customTheme from './components/Theme';
import Recipes from './components/Recipes';
import { Container, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';


function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component={Link} to="/" style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}>
              Puck
            </Typography>
            <Button color="inherit" component={Link} to="/">System Dashboard</Button>
            <Button color="inherit" component={Link} to="/recipes">Recipes</Button>
          </Toolbar>
        </AppBar>
        <Container>
          <Routes>
            <Route path="/" element={<SystemDashboard />} />
            <Route path="/recipes" element={<Recipes />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>

  );
}

export default App;

import customTheme from './components/Theme'
import './App.css'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import { Container, AppBar, Toolbar, Typography, Button } from '@mui/material'
import SystemDashboard from './components/SystemDashboard'
import Recipes from './components/Recipes';

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
  )
}

export default App

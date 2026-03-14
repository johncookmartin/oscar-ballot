import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ProtectedLayout from './layouts/ProtectedLayout';
import Login from './pages/Login';
import Home from './pages/Home';
import Categories from './pages/Categories';
import Picks from './pages/Picks';
import Admin from './pages/Admin';
import Selections from './pages/Selections';

const theme = createTheme({
  palette: {
    primary: {
      main: '#857b42',
    },
    secondary: {
      main: '#8d8c88',
    },
    background: {
      default: '#000000',
      paper: '#292926',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
    },
    action: {
      hover: 'rgba(255, 255, 255, 0.4)',
    },
  },
  typography: {
    fontFamily: '"Montserrat", "Helvetica", "Arial", sans-serif',
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/picks" element={<Picks />} />
            <Route path="/selections" element={<Selections />} />
            <Route element={<ProtectedLayout />}>
              <Route path="/admin" element={<Admin />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;

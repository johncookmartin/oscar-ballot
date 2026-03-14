import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Card, Container, Typography } from '@mui/material';
import { loginRequest } from '../auth/authConfig';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import CookMartinLogo from '../assets/CookMartinLogo.png';

const sanitizeReturnTo = (value: string | null): string => {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return '/';
  }

  if (value === '/login') {
    return '/';
  }

  return value;
};

const Login: React.FC = () => {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const returnTo = sanitizeReturnTo(params.get('returnTo'));

  useEffect(() => {
    if (isAuthenticated) {
      navigate(returnTo, { replace: true });
    }
  }, [isAuthenticated, navigate, returnTo]);

  const handleLogin = async () => {
    try {
      await instance.loginRedirect(loginRequest);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 64px)',
          gap: 3,
        }}
      >
        <Box
          component="img"
          src={CookMartinLogo}
          alt="CookMartin Logo"
          sx={{
            maxWidth: '300px',
            width: '100%',
            height: 'auto',
          }}
        />

        <Typography
          variant="h1"
          sx={{
            fontSize: '5rem',
            fontWeight: 'bold',
            color: 'error.main',
            margin: 0,
          }}
        >
          401
        </Typography>

        <Card
          sx={{
            padding: 4,
            width: '100%',
            boxShadow: 2,
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Authorization Required
          </Typography>

          <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
            You are not authorized to access this resource. Please sign in to
            continue.
          </Typography>

          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleLogin}
            sx={{
              py: 1.5,
              textTransform: 'none',
              fontSize: '1rem',
            }}
          >
            Sign in with Microsoft
          </Button>
        </Card>
      </Box>
    </Container>
  );
};

export default Login;

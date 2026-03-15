import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CookMartinLogo from '../assets/CookMartinOscarLogo.png';
import { useGetLeaderboardQuery } from '../redux/oscarApi';

const CEREMONY_TIME = new Date('2026-03-15T19:00:00-04:00');

function getCountdown(target: Date): string {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return '';
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return `${h}h ${m}m ${s}s`;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isLive, setIsLive] = useState(() => new Date() >= CEREMONY_TIME);
  const [countdown, setCountdown] = useState(() => getCountdown(CEREMONY_TIME));

  const { data, isLoading, isError } = useGetLeaderboardQuery(undefined, {
    skip: !isLive,
  });

  // Flip to live phase at ceremony time
  useEffect(() => {
    if (isLive) return;
    const ms = CEREMONY_TIME.getTime() - Date.now();
    const timer = setTimeout(() => setIsLive(true), ms);
    return () => clearTimeout(timer);
  }, [isLive]);

  // Countdown ticker
  useEffect(() => {
    if (isLive) return;
    const interval = setInterval(() => {
      setCountdown(getCountdown(CEREMONY_TIME));
    }, 1000);
    return () => clearInterval(interval);
  }, [isLive]);

  if (!isLive) {
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
            sx={{ maxWidth: 600, width: '100%', height: 'auto' }}
          />
          <Typography variant="h4" align="center" sx={{ fontWeight: 700 }}>
            Welcome to the Oscars!
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary">
            Ceremony begins in
          </Typography>
          <Typography
            variant="h3"
            align="center"
            sx={{ fontWeight: 700, color: 'primary.main', letterSpacing: 2 }}
          >
            {countdown}
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ pt: 4, pb: 6 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Box
          component="img"
          src={CookMartinLogo}
          alt="CookMartin Logo"
          sx={{
            width: 200,
            height: 'auto',
            display: { xs: 'none', sm: 'block' },
          }}
        />
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Oscar Ballot Leaderboard
        </Typography>
      </Box>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <Alert severity="error">
          Failed to load leaderboard. Please refresh.
        </Alert>
      )}

      {data && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, width: 80 }}>Rank</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Score
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    align="center"
                    sx={{ color: 'text.secondary' }}
                  >
                    No scores yet
                  </TableCell>
                </TableRow>
              ) : (
                data.map((entry, index) => (
                  <TableRow
                    key={entry.userName}
                    sx={
                      index === 0
                        ? { backgroundColor: 'rgba(153, 141, 75, 0.15)' }
                        : undefined
                    }
                  >
                    <TableCell sx={{ fontWeight: index === 0 ? 700 : 400 }}>
                      #{index + 1}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: index === 0 ? 700 : 400,
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                      onClick={() =>
                        navigate(
                          `/selections?user=${encodeURIComponent(entry.userName)}`,
                        )
                      }
                    >
                      {entry.userName}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: index === 0 ? 700 : 400,
                        color: index === 0 ? 'primary.main' : 'inherit',
                      }}
                    >
                      {entry.score}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default Home;

import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CancelIcon from '@mui/icons-material/Cancel';
import {
  useGetSubmissionsQuery,
  useGetUserResultsQuery,
} from '../redux/oscarApi';

const Selections: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [selectedUser, setSelectedUser] = useState<string | null>(() =>
    searchParams.get('user'),
  );

  const {
    data: submissions,
    isLoading: subsLoading,
    isError: subsError,
  } = useGetSubmissionsQuery(undefined, { pollingInterval: 10000 });
  const {
    data: results,
    isLoading: resultsLoading,
    isError: resultsError,
  } = useGetUserResultsQuery(selectedUser ?? '', {
    skip: selectedUser === null,
    pollingInterval: 10000,
  });

  const sortedResults = results
    ? [...results].sort((a, b) => a.displayOrder - b.displayOrder)
    : [];

  return (
    <Container maxWidth="md" sx={{ pt: 4, pb: 6 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Everyone's Picks
      </Typography>

      {subsLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {subsError && (
        <Alert severity="error">
          Failed to load submissions. Please refresh.
        </Alert>
      )}

      {submissions && !subsLoading && (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            mb: 4,
            position: 'sticky',
            top: { xs: 56, sm: 64 },
            zIndex: 10,
            backgroundColor: 'background.default',
            py: 1,
          }}
        >
          {submissions.map((entry) => (
            <Chip
              key={entry.userName}
              label={entry.userName}
              onClick={() =>
                setSelectedUser((prev) =>
                  prev === entry.userName ? null : entry.userName,
                )
              }
              color={selectedUser === entry.userName ? 'primary' : 'default'}
              variant={selectedUser === entry.userName ? 'filled' : 'outlined'}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Box>
      )}

      {!selectedUser && !subsLoading && !subsError && (
        <Typography color="text.secondary">
          Select a user above to see their picks.
        </Typography>
      )}

      {selectedUser && resultsLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress size={28} />
        </Box>
      )}

      {selectedUser && resultsError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Failed to load picks for {selectedUser}.
        </Alert>
      )}

      {selectedUser && results && !resultsLoading && (
        <>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            {selectedUser}'s Picks
          </Typography>

          {sortedResults.map((result) => (
            <Paper key={result.categoryId} sx={{ mb: 2, p: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: 'text.secondary',
                  mb: 0.5,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}
              >
                {result.categoryName}
              </Typography>

              {result.pickedNomineeName ? (
                <List dense disablePadding>
                  <ListItem disablePadding sx={{ py: 0.5 }}>
                    {result.isCorrect ? (
                      <EmojiEventsIcon
                        sx={{ color: 'primary.main', mr: 1, fontSize: 20 }}
                      />
                    ) : result.winnerNomineeId !== null ? (
                      <CancelIcon
                        sx={{ color: 'error.main', mr: 1, fontSize: 20 }}
                      />
                    ) : null}
                    <ListItemText
                      primary={result.pickedNomineeName}
                      secondary={
                        !result.isCorrect && result.winnerNomineeName
                          ? `Winner: ${result.winnerNomineeName}`
                          : undefined
                      }
                      slotProps={{
                        primary: {
                          sx: result.isCorrect
                            ? { fontWeight: 700, color: 'success.main' }
                            : result.winnerNomineeId !== null
                              ? { fontWeight: 700, color: 'error.main' }
                              : undefined,
                        },
                      }}
                    />
                  </ListItem>
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No pick recorded
                </Typography>
              )}
            </Paper>
          ))}
        </>
      )}
    </Container>
  );
};

export default Selections;

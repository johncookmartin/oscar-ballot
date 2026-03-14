import React from 'react';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import {
  useGetCategoriesQuery,
  useSetWinnerMutation,
  useClearWinnerMutation,
} from '../redux/oscarApi';

const Admin: React.FC = () => {
  const { data, isLoading, isError } = useGetCategoriesQuery();
  const [setWinner, { isLoading: isSetting }] = useSetWinnerMutation();
  const [clearWinner, { isLoading: isClearing }] = useClearWinnerMutation();

  const isBusy = isSetting || isClearing;

  const sorted = data
    ? [...data].sort((a, b) => a.displayOrder - b.displayOrder)
    : [];

  return (
    <Container maxWidth="md" sx={{ pt: 4, pb: 6 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Admin — Mark Winners
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Click a nominee to mark them as the winner. The leaderboard updates
        automatically.
      </Typography>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <Alert severity="error">
          Failed to load categories. Please refresh.
        </Alert>
      )}

      {sorted.map((category) => (
        <Paper key={category.categoryId} sx={{ mb: 2, p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            {category.categoryName}
          </Typography>
          <List dense disablePadding>
            {category.nominees.map((nominee) => (
              <ListItem
                key={nominee.nomineeId}
                disablePadding
                sx={{ py: 0.5 }}
                secondaryAction={
                  <Button
                    variant={nominee.isWinner ? 'contained' : 'outlined'}
                    color={nominee.isWinner ? 'success' : 'primary'}
                    size="small"
                    onClick={() =>
                      nominee.isWinner
                        ? clearWinner(nominee.nomineeId)
                        : setWinner(nominee.nomineeId)
                    }
                    disabled={isBusy}
                    startIcon={
                      nominee.isWinner ? <EmojiEventsIcon /> : undefined
                    }
                    sx={{ minWidth: 150 }}
                  >
                    {nominee.isWinner ? 'Winner' : 'Mark as Winner'}
                  </Button>
                }
              >
                <ListItemText primary={nominee.nomineeName} sx={{ pr: 20 }} />
              </ListItem>
            ))}
          </List>
        </Paper>
      ))}
    </Container>
  );
};

export default Admin;

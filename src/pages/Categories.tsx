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
  Chip,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useGetCategoriesQuery } from '../redux/oscarApi';

const Categories: React.FC = () => {
  const { data, isLoading, isError } = useGetCategoriesQuery(undefined, {pollingInterval: 10000});

  const sorted = data ? [...data].sort((a, b) => a.displayOrder - b.displayOrder) : [];

  return (
    <Container maxWidth="md" sx={{ pt: 4, pb: 6 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Oscar Categories
      </Typography>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <Alert severity="error">Failed to load categories. Please refresh.</Alert>
      )}

      {sorted.map((category) => (
        <Paper key={category.categoryId} sx={{ mb: 2, p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            {category.categoryName}
          </Typography>
          <List dense disablePadding>
            {category.nominees.map((nominee) => (
              <ListItem key={nominee.nomineeId} disablePadding sx={{ py: 0.5 }}>
                {nominee.isWinner && (
                  <EmojiEventsIcon
                    sx={{ color: 'primary.main', mr: 1, fontSize: 20 }}
                  />
                )}
                <ListItemText
                  primary={nominee.nomineeName}
                  slotProps={{
                    primary: {
                      sx: nominee.isWinner
                        ? { fontWeight: 700, color: 'primary.main' }
                        : undefined,
                    },
                  }}
                />
                {nominee.isWinner && (
                  <Chip label="Winner" color="primary" size="small" sx={{ ml: 1 }} />
                )}
              </ListItem>
            ))}
          </List>
        </Paper>
      ))}
    </Container>
  );
};

export default Categories;

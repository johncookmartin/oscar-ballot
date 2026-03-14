import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  TextField,
  RadioGroup,
  Radio,
  FormControl,
  FormControlLabel,
  FormLabel,
  Button,
  Link as MuiLink,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  useGetCategoriesQuery,
  useGetSubmissionsQuery,
  useSubmitPicksMutation,
} from '../redux/oscarApi';

const Picks: React.FC = () => {
  const [userName, setUserName] = useState('');
  const [picks, setPicks] = useState<Record<number, number>>({});
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');

  const { data: categories, isLoading, isError } = useGetCategoriesQuery();
  const { data: submissions } = useGetSubmissionsQuery();
  const [submitPicks, { isLoading: isSubmitting }] = useSubmitPicksMutation();

  const sorted = categories
    ? [...categories].sort((a, b) => a.displayOrder - b.displayOrder)
    : [];

  const alreadySubmitted =
    userName.trim().length > 0 &&
    (submissions?.some(
      (s) => s.userName.toLowerCase() === userName.trim().toLowerCase(),
    ) ??
      false);

  const allPicked =
    sorted.length > 0 && sorted.every((c) => picks[c.categoryId] != null);
  const canSubmit = userName.trim().length > 0 && allPicked && !isSubmitting;

  const unpickedCount = sorted.filter(
    (c) => picks[c.categoryId] == null,
  ).length;
  const submitBlockReason = isSubmitting
    ? null
    : userName.trim().length === 0
      ? 'Enter your name above to submit.'
      : !allPicked
        ? `You still have ${unpickedCount} categor${unpickedCount === 1 ? 'y' : 'ies'} without a pick.`
        : null;

  const handleSubmit = async () => {
    try {
      await submitPicks({
        userName: userName.trim(),
        picks: Object.values(picks),
      }).unwrap();
      setSubmitStatus('success');
      setUserName('');
      setPicks({});
    } catch {
      setSubmitStatus('error');
    }
  };

  return (
    <Container maxWidth="md" sx={{ pt: 4, pb: 6 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Submit Your Oscar Picks
      </Typography>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load categories. Please refresh.
        </Alert>
      )}

      {!isLoading && !isError && (
        <>
          <TextField
            label="Enter Your Name"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
              setSubmitStatus('idle');
            }}
            error={alreadySubmitted}
            helperText={
              alreadySubmitted
                ? 'This name has already been submitted — submitting again will overwrite your picks.'
                : ''
            }
            fullWidth
            sx={{ mb: 3 }}
          />

          {sorted.map((category) => (
            <Paper key={category.categoryId} sx={{ mb: 2, p: 2 }}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>
                  {category.categoryName}
                </FormLabel>
                <RadioGroup
                  value={
                    picks[category.categoryId] != null
                      ? String(picks[category.categoryId])
                      : ''
                  }
                  onChange={(e) =>
                    setPicks((prev) => ({
                      ...prev,
                      [category.categoryId]: Number(e.target.value),
                    }))
                  }
                >
                  {category.nominees.map((nominee) => (
                    <FormControlLabel
                      key={nominee.nomineeId}
                      value={String(nominee.nomineeId)}
                      control={<Radio size="small" />}
                      label={nominee.nomineeName}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Paper>
          ))}

          {submitStatus === 'success' && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Your picks have been submitted. Good luck!{' '}
              <MuiLink
                component={RouterLink}
                to="/selections"
                color="inherit"
                underline="always"
              >
                Click here to see what everyone else picked!
              </MuiLink>
            </Alert>
          )}

          {submitStatus === 'error' && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Submission failed. Please try again.
            </Alert>
          )}

          {submitBlockReason && (
            <Typography
              variant="body2"
              color="error.main"
              sx={{ mb: 1, textAlign: 'center' }}
            >
              {submitBlockReason}
            </Typography>
          )}

          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={!canSubmit}
            fullWidth
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Submit Picks'
            )}
          </Button>
        </>
      )}
    </Container>
  );
};

export default Picks;

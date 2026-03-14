import { useMsal } from '@azure/msal-react';
import { Button, useTheme } from '@mui/material';
import { loginRequest } from '../auth/authConfig';

const AuthButton: React.FC = () => {
  const { instance, accounts } = useMsal();
  const theme = useTheme();
  const isSignedIn = accounts.length > 0;

  const handleOnClick = async () => {
    if (isSignedIn) {
      await instance.logoutRedirect();
    } else {
      instance.loginRedirect(loginRequest).catch((error) => console.log(error));
    }
  };

  return (
    <Button
      color="inherit"
      variant="text"
      onClick={handleOnClick}
      sx={{
        textTransform: 'none',
        fontSize: '1rem',
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
        },
      }}
    >
      {isSignedIn ? 'Sign out' : 'Sign in'}
    </Button>
  );
};

export default AuthButton;

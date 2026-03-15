import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useIsAuthenticated } from '@azure/msal-react';
import AuthButton from './AuthButton';

const Navbar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isAuthenticated = useIsAuthenticated();

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      setDrawerOpen(open);
    };

  const menuItems = [
    { label: 'Leaderboard', path: '/' },
    { label: 'Categories', path: '/categories' },
    { label: 'Submit Picks', path: '/picks' },
    { label: 'Compare Picks', path: '/selections' },
    ...(isAuthenticated ? [{ label: 'Admin', path: '/admin' }] : []),
  ];

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <AuthButton />
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 250,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <List>
            {menuItems.map((item) => (
              <ListItem disablePadding key={item.label}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={toggleDrawer(false)}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <List sx={{ mt: 'auto' }}>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="https://yellow-pond-0ff1d8e0f.4.azurestaticapps.net/"
                onClick={toggleDrawer(false)}
              >
                <ListItemText primary="Cook-Martin Home" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;

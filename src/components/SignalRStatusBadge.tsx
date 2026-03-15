import React from 'react';
import { Chip } from '@mui/material';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import { useSignalRStatus } from '../signalr/SignalRContext';

const SignalRStatusBadge: React.FC = () => {
  const { status } = useSignalRStatus();

  if (status === 'connected') return null;

  return (
    <Chip
      icon={<WifiOffIcon />}
      label={status === 'connecting' ? 'Reconnecting…' : 'Disconnected'}
      color="warning"
      size="small"
      sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999 }}
    />
  );
};

export default SignalRStatusBadge;

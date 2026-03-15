import React, { useEffect, useRef, useState } from 'react';
import { hubConnection, HubConnectionState } from './hubConnection';
import { HUB_EVENTS } from './hubEvents';
import { SignalRContext, type SignalRStatus } from './SignalRContext';
import { store } from '../redux/store';
import { oscarApi } from '../redux/oscarApi';

export const SignalRProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<SignalRStatus>('connecting');
  const registered = useRef(false);

  useEffect(() => {
    if (!registered.current) {
      registered.current = true;

      hubConnection.on(HUB_EVENTS.LeaderboardChanged, () => { store.dispatch(oscarApi.util.invalidateTags(['Leaderboard'])); });
      hubConnection.on(HUB_EVENTS.CategoriesChanged,  () => { store.dispatch(oscarApi.util.invalidateTags(['Categories'])); });
      hubConnection.on(HUB_EVENTS.SubmissionsChanged, () => { store.dispatch(oscarApi.util.invalidateTags(['Submissions'])); });
      hubConnection.on(HUB_EVENTS.ResultsChanged,     () => { store.dispatch(oscarApi.util.invalidateTags(['UserResults'])); });

      hubConnection.onreconnecting(() => setStatus('connecting'));
      hubConnection.onreconnected(() => setStatus('connected'));
      hubConnection.onclose(() => setStatus('disconnected'));
    }

    const start = async () => {
      if (hubConnection.state === HubConnectionState.Disconnected) {
        try {
          await hubConnection.start();
          setStatus('connected');
        } catch (err) {
          console.error('SignalR connection failed:', err);
          setStatus('disconnected');
        }
      }
    };

    start();
  }, []);

  return (
    <SignalRContext.Provider value={{ status }}>
      {children}
    </SignalRContext.Provider>
  );
};

import { createContext, useContext } from 'react';

export type SignalRStatus = 'connecting' | 'connected' | 'disconnected';

interface SignalRContextValue {
  status: SignalRStatus;
}

export const SignalRContext = createContext<SignalRContextValue>({ status: 'disconnected' });

export const useSignalRStatus = () => useContext(SignalRContext);

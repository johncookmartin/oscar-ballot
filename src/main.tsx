import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './auth/authConfig.ts';
import { initApiAuth } from './redux/api.ts';
import { MsalProvider } from '@azure/msal-react';
import { Provider } from 'react-redux';
import { store } from './redux/store.ts';

const msalInstance = new PublicClientApplication(msalConfig);

initApiAuth({
  msal: msalInstance,
  getAccount: () =>
    msalInstance.getActiveAccount() ?? msalInstance.getAllAccounts()[0] ?? null,
});

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/montserrat/300.css';
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/700.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MsalProvider instance={msalInstance}>
      <Provider store={store}>
        <App />
      </Provider>
    </MsalProvider>
  </StrictMode>,
);

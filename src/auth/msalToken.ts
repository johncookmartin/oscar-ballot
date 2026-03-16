import {
  InteractionRequiredAuthError,
  type AccountInfo,
  type IPublicClientApplication,
} from '@azure/msal-browser';

export async function acquiredApiAccessToken(params: {
  msal: IPublicClientApplication;
  account: AccountInfo | null;
  scope: string;
}): Promise<string> {
  const { msal, account, scope } = params;

  // if we have an account, try silent token acquisition first
  if (account) {
    try {
      const result = await msal.acquireTokenSilent({
        account,
        scopes: [scope],
      });
      return result.accessToken;
    } catch (error) {
      if (!(error instanceof InteractionRequiredAuthError)) {
        throw error;
      }
    }
  }

  try {
    const result = await msal.ssoSilent({
      scopes: [scope],
    });

    msal.setActiveAccount(result.account);
    return result.accessToken;
  } catch (_error) {
    throw new Error('No active session. User must log in');
  }
}

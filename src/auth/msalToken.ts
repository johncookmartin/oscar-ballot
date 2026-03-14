import type {
  AccountInfo,
  IPublicClientApplication,
} from '@azure/msal-browser';

export async function acquiredApiAccessToken(params: {
  msal: IPublicClientApplication;
  account: AccountInfo | null;
  scope: string;
}): Promise<string> {
  const { msal, account, scope } = params;

  if (!account) {
    throw new Error(
      'No signed-in account. Call login first and setActiveAccount',
    );
  }

  const result = await msal.acquireTokenSilent({
    account,
    scopes: [scope],
  });

  return result.accessToken;
}

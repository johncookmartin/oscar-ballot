import type {
  AccountInfo,
  IPublicClientApplication,
} from '@azure/msal-browser';
import { createBaseQueryWithMsal } from './baseQueryWithMsal';
import { createApi } from '@reduxjs/toolkit/query/react';

let msalInstance: IPublicClientApplication | null = null;
let getAccountFn: (() => AccountInfo | null) | null = null;

export function initApiAuth(params: {
  msal: IPublicClientApplication;
  getAccount: () => AccountInfo | null;
}) {
  msalInstance = params.msal;
  getAccountFn = params.getAccount;
}

const baseUrl = import.meta.env.VITE_API_BASE_URL as string;
const scope = import.meta.env.VITE_API_SCOPE as string;

export const api = createApi({
  reducerPath: 'api',
  tagTypes: ['Categories'],
  baseQuery: async (args, api, extraOptions) => {
    if (!msalInstance || !getAccountFn) {
      return {
        error: {
          status: 500,
          data: {
            message:
              'API auth not initialized. Call initApiAuth() at app startup.',
          },
        },
      };
    }

    const baseQuery = createBaseQueryWithMsal({
      baseUrl,
      scope,
      msal: msalInstance,
      getAccount: getAccountFn,
    });

    return baseQuery(args, api, extraOptions);
  },
  // Base API with empty endpoints - use injectEndpoints() in feature modules
  // See src/redux/endpoints/test/testApi.ts for example
  endpoints: () => ({}),
});

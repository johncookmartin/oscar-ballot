import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from '@azure/msal-react';
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  fallbackPath = '/login',
}) => {
  const location = useLocation();
  const returnTo = `${location.pathname}${location.search}${location.hash}`;
  const separator = fallbackPath.includes('?') ? '&' : '?';
  const loginUrl = `${fallbackPath}${separator}returnTo=${encodeURIComponent(returnTo)}`;

  return (
    <>
      <AuthenticatedTemplate>
        <Outlet />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Navigate to={loginUrl} replace />
      </UnauthenticatedTemplate>
    </>
  );
};

export default ProtectedRoute;

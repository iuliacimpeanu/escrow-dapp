import type { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { useGetIsLoggedIn } from '@multiversx/sdk-dapp/hooks';


interface AuthRedirectWrapperPropsType extends PropsWithChildren {
  requireAuth?: boolean;
}

export const AuthRedirectWrapper = ({
  children,
  requireAuth = true
}: AuthRedirectWrapperPropsType) => {
  const isLoggedIn = useGetIsLoggedIn();

  if (isLoggedIn && !requireAuth) {
    return <Navigate to={'/dashboard'} />;
  }

  if (!isLoggedIn && requireAuth) {
    return <Navigate to={'/unlock'} />;
  }

  return <>{children}</>;
};

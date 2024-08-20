import type { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { useGetIsLoggedIn } from '@multiversx/sdk-dapp/hooks';
import { RouteNamesEnum } from '../../localConstants/routes';


interface AuthRedirectWrapperPropsType extends PropsWithChildren {
  requireAuth?: boolean;
}

export const AuthRedirectWrapper = ({
  children,
  requireAuth = true
}: AuthRedirectWrapperPropsType) => {
  const isLoggedIn = useGetIsLoggedIn();

  if (isLoggedIn && !requireAuth) {
    return <Navigate to={RouteNamesEnum.dashboard} />;
  }

  if (!isLoggedIn && requireAuth) {
    return <Navigate to={RouteNamesEnum.unlock} />;
  }

  return <>{children}</>;
};

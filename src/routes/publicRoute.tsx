import React from 'react';
import { Navigate } from 'react-router-dom';
import { sessionService } from '../utils/session.service';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const token = sessionService.getToken();

  if (token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;

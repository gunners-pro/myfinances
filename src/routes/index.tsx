import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { PublicRoutes } from './public.routes';
import { useAuth } from '../context/AuthContext';
import { PrivateRoutes } from './private.routes';

export function Routes() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      {user?.id ? <PrivateRoutes /> : <PublicRoutes />}
    </NavigationContainer>
  );
}

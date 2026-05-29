import { useContext } from 'react';

import { AuthContextServer } from '../contexts/AuthContextServer';

function useAuth() {
  const context = useContext(AuthContextServer);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProviderServer.');
  }

  return context;
}

export default useAuth;

import { useContext } from 'react';
import { AuthContext } from '../context/authContext';

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const useLogin = () => {
  const { login } = useAuth();
  return login;
};

const useLogout = () => {
  const { logout } = useAuth();
  return logout;
};

export { useAuth, useLogin, useLogout };

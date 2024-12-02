import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './css/style.css';
import './css/satoshi.css';
import 'jsvectormap/dist/css/jsvectormap.css';
import 'flatpickr/dist/flatpickr.min.css';
import {  AuthProvider } from './context/authContext';
import Toast from './common/Toast';
import { CategoryProvider } from './UserLayout/components/CategoryContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { store } from './store';
import { HelmetProvider } from 'react-helmet-async';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
      <Provider store={store}>

    <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CategoryProvider>
    <Router>
    <Toast position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    <HelmetProvider>
      <App />
      </HelmetProvider>
    </Router>
    </CategoryProvider>
    </AuthProvider>
    </QueryClientProvider>
    </Provider>

  </React.StrictMode>,
);

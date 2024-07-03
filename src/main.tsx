import './globals.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext';
import { ApolloProvider } from '@apollo/client';
import apolloClient from './lib/apolloClient';
import { SocketProvider } from './context/SocketContext';
import { TransactionProvider } from './context/TransactionContext';
import { Toaster } from '@/components/ui/toaster';
import './lib/raydium'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <SocketProvider>
          <TransactionProvider>
            <App />
          </TransactionProvider>
        </SocketProvider>
      </AuthProvider>
    </ApolloProvider>
    <Toaster />
  </React.StrictMode>
);

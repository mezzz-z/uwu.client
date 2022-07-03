import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import { AuthState } from './context/index.js'
import { SocketState } from './context/index.js'
import './assets/css/main.css'



const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <AuthState>
    <SocketState>
      <App />
    </SocketState>
  </AuthState>
);
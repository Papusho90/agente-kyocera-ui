import React from 'react';
import ReactDOM from 'react-dom/client';
import ChatUI from './ChatUI';
import './style.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChatUI />
  </React.StrictMode>
);
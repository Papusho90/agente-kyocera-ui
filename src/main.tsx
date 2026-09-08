import React from 'react';
import ReactDOM from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

// @ts-ignore
import outputs from '../amplify_outputs.json';

Amplify.configure(outputs);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Authenticator>
      {({ signOut, user }) => (
        <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
          <h1>Panel del Agente Kyocera</h1>
          <p>Autenticación exitosa. Bienvenido al sistema.</p>
          <button 
            onClick={signOut} 
            style={{ padding: '0.5rem 1rem', background: '#d00000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Cerrar sesión
          </button>
        </main>
      )}
    </Authenticator>
  </React.StrictMode>
);

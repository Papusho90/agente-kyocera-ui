import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import {
  Authenticator,
  ThemeProvider,
  Theme,
  useTheme,
  View,
  Heading,
  Text,
} from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

// @ts-ignore
import outputs from '../amplify_outputs.json';

Amplify.configure(outputs);

// ---------------------------------------------------------------------------
// Tema Kyocera
// ---------------------------------------------------------------------------
const kyoceraTheme: Theme = {
  name: 'Kyocera-Theme',
  tokens: {
    colors: {
      brand: {
        primary: {
          10: '#fce5e6',
          20: '#f8ccce',
          40: '#f099a0',
          60: '#e56672',
          80: '#d00000',
          90: '#a30000',
          100: '#800000',
        },
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Estilos centralizados
// ---------------------------------------------------------------------------
const styles: Record<string, React.CSSProperties> = {
  page: { display: 'flex', minHeight: '100vh', margin: '-8px', fontFamily: 'sans-serif' },
  sidebar: { width: '260px', backgroundColor: '#171717', color: '#fff', padding: '1.5rem', position: 'relative', display: 'flex', flexDirection: 'column' },
  sidebarTitle: { color: '#fff', borderBottom: '1px solid #333', paddingBottom: '1rem', marginTop: 0, fontSize: '1.2rem' },
  navList: { listStyle: 'none', padding: 0, marginTop: '1.5rem' },
  navButton: { display: 'block', width: '100%', textAlign: 'left', background: 'transparent', border: 'none', color: '#ececec', padding: '0.8rem 1rem', borderRadius: '6px', fontSize: '0.95rem', cursor: 'pointer', marginBottom: '0.5rem', transition: 'background 0.2s' },
  navButtonActive: { backgroundColor: '#2f2f2f', fontWeight: 'bold' },
  signOutButton: { marginTop: 'auto', padding: '10px', background: '#d00000', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  main: { flex: 1, backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', height: '100vh' },
  topBar: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '1rem 2rem', borderBottom: '1px solid #e5e5e5' },
  userBadge: { background: '#f4f4f4', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.9rem', color: '#333' },
  chatContainer: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  messageList: { flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  messageWrapperUser: { display: 'flex', justifyContent: 'flex-end' },
  messageWrapperBot: { display: 'flex', justifyContent: 'flex-start' },
  messageBubbleUser: { backgroundColor: '#f3f3f3', color: '#000', padding: '1rem 1.5rem', borderRadius: '20px 20px 0 20px', maxWidth: '70%', lineHeight: '1.5', fontSize: '1rem' },
  messageBubbleBot: { backgroundColor: '#fff', color: '#000', padding: '1rem 1.5rem', borderRadius: '20px 20px 20px 0', border: '1px solid #e5e5e5', maxWidth: '70%', lineHeight: '1.5', fontSize: '1rem' },
  inputContainer: { padding: '1.5rem 2rem', backgroundColor: '#fff' },
  inputWrapper: { display: 'flex', gap: '0.8rem', maxWidth: '800px', margin: '0 auto', background: '#f4f4f4', borderRadius: '25px', padding: '0.4rem 0.4rem 0.4rem 1.5rem', alignItems: 'center' },
  textInput: { flex: 1, border: 'none', background: 'transparent', fontSize: '1rem', outline: 'none', padding: '0.5rem 0' },
  sendButton: { backgroundColor: '#d00000', color: '#fff', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' },
  settingsView: { padding: '3rem', color: '#333' }
};

// ---------------------------------------------------------------------------
// Header del Login
// ---------------------------------------------------------------------------
function AuthHeader() {
  const { tokens } = useTheme();
  return (
    <View textAlign="center" padding={tokens.space.large}>
      <Heading level={2} style={{ color: '#d00000', fontWeight: 'bold' }}>
        Agente Kyocera
      </Heading>
      <Text style={{ marginTop: '0.5rem', color: '#555' }}>
        Inicia sesión para conversar con el Agente
      </Text>
    </View>
  );
}
const authComponents = { Header: AuthHeader };

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------
const NAV_ITEMS = [
  { id: 'chat', label: '💬 Nuevo Chat' },
  { id: 'configuracion', label: '⚙️ Configuración' },
];

function Sidebar({ activeItem, onSelect, onSignOut }: any) {
  return (
    <aside style={styles.sidebar}>
      <h2 style={styles.sidebarTitle}>Agente Kyocera</h2>
      <nav>
        <ul style={styles.navList}>
          {NAV_ITEMS.map((item) => {
            const isActive = item.id === activeItem;
            return (
              <li key={item.id}>
                <button type="button" onClick={() => onSelect(item.id)} style={{ ...styles.navButton, ...(isActive ? styles.navButtonActive : {}) }}>
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      <button type="button" onClick={onSignOut} style={styles.signOutButton}>Cerrar sesión</button>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Área de Chat (Actualizada para consumir API real)
// ---------------------------------------------------------------------------
function ChatArea() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: '¡Hola! Soy el Agente Kyocera. Puedes alimentarme con datos, manuales o hacerme preguntas operativas.' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => scrollToBottom(), [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInputValue('');
    setIsLoading(true);

    try {
      // AQUÍ IRÁ LA URL DE TU LAMBDA EN EL FUTURO
      const lambdaUrl = 'https://atwhxzvbgnacwlgmsb44ltydc40cbauv.lambda-url.us-east-1.on.aws/'; 
      
      const response = await fetch(lambdaUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userText })
      });

      if (!response.ok) throw new Error('Error en la red');
      const data = await response.json();
      
      setMessages(prev => [...prev, { role: 'assistant', text: data.respuesta || data.message }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', text: 'Esperando conexión con el backend de Python...' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.messageList}>
        {messages.map((msg, idx) => (
          <div key={idx} style={msg.role === 'user' ? styles.messageWrapperUser : styles.messageWrapperBot}>
            <div style={msg.role === 'user' ? styles.messageBubbleUser : styles.messageBubbleBot}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={styles.messageWrapperBot}>
            <div style={{...styles.messageBubbleBot, color: '#999'}}>Escribiendo...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div style={styles.inputContainer}>
        <form onSubmit={handleSend} style={styles.inputWrapper}>
          <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Escribe un mensaje..." style={styles.textInput} disabled={isLoading} />
          <button type="submit" style={{...styles.sendButton, opacity: isLoading ? 0.5 : 1}} disabled={isLoading}>↑</button>
        </form>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dashboard Principal
// ---------------------------------------------------------------------------
function Dashboard({ userLabel, onSignOut }: any) {
  const [activeItem, setActiveItem] = useState('chat');
  return (
    <div style={styles.page}>
      <Sidebar activeItem={activeItem} onSelect={setActiveItem} onSignOut={onSignOut} />
      <main style={styles.main}>
        <header style={styles.topBar}>
          <div style={styles.userBadge}>👤 {userLabel}</div>
        </header>
        {activeItem === 'chat' ? <ChatArea /> : (
          <div style={styles.settingsView}>
            <h2>Configuración del Agente</h2>
            <p>Sección para gestión de llaves API y base de conocimientos.</p>
          </div>
        )}
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Punto de entrada
// ---------------------------------------------------------------------------
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={kyoceraTheme}>
      <Authenticator components={authComponents}>
        {({ signOut, user }) => (
          <Dashboard userLabel={user?.signInDetails?.loginId ?? 'Administrador'} onSignOut={signOut ?? (() => {})} />
        )}
      </Authenticator>
    </ThemeProvider>
  </React.StrictMode>
);

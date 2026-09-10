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
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// @ts-ignore
import outputs from '../amplify_outputs.json';

Amplify.configure(outputs);

const kyoceraTheme: Theme = {
  name: 'Kyocera-Theme',
  tokens: {
    colors: {
      brand: {
        primary: {
          10: '#fce5e6', 20: '#f8ccce', 40: '#f099a0', 60: '#e56672',
          80: '#d00000', 90: '#a30000', 100: '#800000',
        },
      },
    },
  },
};

const styles: Record<string, React.CSSProperties> = {
  page: { display: 'flex', minHeight: '100vh', margin: '-8px', fontFamily: 'sans-serif', background: '#212121' },
  sidebar: { width: '260px', backgroundColor: '#171717', color: '#ececec', padding: '1rem', display: 'flex', flexDirection: 'column' },
  sidebarHeader: { display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0.4rem 1.2rem' },
  sidebarLogo: { width: '28px', height: '28px', borderRadius: '8px', background: '#d00000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' },
  sidebarTitle: { fontSize: '1rem', fontWeight: 600, color: '#fff' },
  navList: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.2rem' },
  navButton: { display: 'flex', alignItems: 'center', gap: '0.7rem', width: '100%', textAlign: 'left', background: 'transparent', border: 'none', color: '#ececec', padding: '0.6rem 0.7rem', borderRadius: '10px', fontSize: '0.9rem', cursor: 'pointer' },
  navButtonActive: { backgroundColor: '#2a2a2a', fontWeight: 600 },
  sectionLabel: { fontSize: '0.75rem', color: '#8a8a8a', padding: '1rem 0.7rem 0.3rem', textTransform: 'uppercase', letterSpacing: '0.03em' },
  signOutButton: { marginTop: 'auto', padding: '10px', background: 'transparent', color: '#ececec', border: '1px solid #333', borderRadius: '10px', cursor: 'pointer', fontSize: '0.85rem' },
  main: { flex: 1, backgroundColor: '#212121', display: 'flex', flexDirection: 'column', height: '100vh', color: '#ececec' },
  topBar: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '1rem 2rem' },
  userBadge: { background: '#2a2a2a', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', color: '#ececec' },
  chatContainer: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' },
  messageList: { flex: 1, overflowY: 'auto', padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '780px', margin: '0 auto', width: '100%' },
  messageWrapperUser: { display: 'flex', justifyContent: 'flex-end' },
  messageWrapperBot: { display: 'flex', justifyContent: 'flex-start' },
  messageBubbleUser: { backgroundColor: '#2f2f2f', color: '#ececec', padding: '0.8rem 1.2rem', borderRadius: '20px', maxWidth: '75%', lineHeight: '1.5', fontSize: '0.95rem' },
  messageBubbleBot: { backgroundColor: 'transparent', color: '#ececec', padding: '0.2rem 0', maxWidth: '85%', lineHeight: '1.6', fontSize: '0.95rem' },
  inputContainer: { padding: '1rem 2rem 1.5rem' },
  inputWrapper: { display: 'flex', gap: '0.6rem', maxWidth: '780px', margin: '0 auto', background: '#2f2f2f', borderRadius: '28px', padding: '0.5rem 0.5rem 0.5rem 1.2rem', alignItems: 'center', border: '1px solid #3a3a3a' },
  iconButton: { background: 'transparent', border: 'none', color: '#b5b5b5', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  textInput: { flex: 1, border: 'none', background: 'transparent', color: '#ececec', fontSize: '0.95rem', outline: 'none', padding: '0.5rem 0' },
  sendButton: { backgroundColor: '#ececec', color: '#171717', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' },
  emptyState: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', padding: '0 2rem' },
  emptyLogo: { width: '48px', height: '48px', borderRadius: '12px', background: '#d00000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' },
  emptyTitle: { fontSize: '1.4rem', color: '#ececec', fontWeight: 500 },
  settingsView: { padding: '3rem', color: '#ececec' }
};

function AuthHeader() {
  const { tokens } = useTheme();
  return (
    <View textAlign="center" padding={tokens.space.large}>
      <Heading level={2} style={{ color: '#d00000', fontWeight: 'bold' }}>Agente Forte Servicios</Heading>
      <Text style={{ marginTop: '0.5rem', color: '#555' }}>Inicia sesión para conversar con el Agente</Text>
    </View>
  );
}

const authComponents = { Header: AuthHeader };

const NAV_ITEMS = [
  { id: 'chat', label: 'Nuevo Chat', icon: '✏️' },
  { id: 'buscar', label: 'Buscar', icon: '🔍' },
  { id: 'notas', label: 'Notas', icon: '📝' },
  { id: 'configuracion', label: 'Configuración', icon: '⚙️' },
];

function Sidebar({ activeItem, onSelect, onSignOut }: any) {
  return (
    <aside style={styles.sidebar}>
      <div style={styles.sidebarHeader}>
        <div style={styles.sidebarLogo}>🖨️</div>
        <span style={styles.sidebarTitle}>Agente Forte Servicios</span>
      </div>
      <ul style={styles.navList}>
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === activeItem;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(item.id === 'buscar' || item.id === 'notas' ? activeItem : item.id)}
                style={{ ...styles.navButton, ...(isActive ? styles.navButtonActive : {}) }}
              >
                <span>{item.icon}</span> {item.label}
              </button>
            </li>
          );
        })}
      </ul>
      <div style={styles.sectionLabel}>Chats</div>
      <div style={{ padding: '0.6rem 0.7rem', color: '#6a6a6a', fontSize: '0.85rem' }}>
        Aún no hay historial guardado
      </div>
      <button type="button" onClick={onSignOut} style={styles.signOutButton}>Cerrar sesión</button>
    </aside>
  );
}

function ChatArea() {
  const [messages, setMessages] = useState<{role: string; text: string}[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{name: string; data: string; mediaType: string} | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      setAttachedFile({ name: file.name, data: base64, mediaType: file.type });
    };
    reader.readAsDataURL(file);
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() && !attachedFile) return;
    if (isLoading) return;

    const userText = inputValue;
    const displayMessage = userText + (attachedFile ? `\n\n📎 [Archivo adjunto: ${attachedFile.name}]` : '');
    
    setMessages(prev => [...prev, { role: 'user', text: displayMessage }]);
    setInputValue('');
    setIsLoading(true);

    const currentFile = attachedFile;
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    try {
      const lambdaUrl = 'https://atwhxzvbgnacwlgmsb44ltydc40cbauv.lambda-url.us-east-1.on.aws/';
      const response = await fetch(lambdaUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: userText,
          file: currentFile ? { data: currentFile.data, media_type: currentFile.mediaType, name: currentFile.name } : null
        })
      });
      
      const data = await response.json();
      let textoIA = 'Sin respuesta';
      
      if (typeof data === 'string') textoIA = data;
      else if (data?.respuesta) textoIA = typeof data.respuesta === 'object' ? JSON.stringify(data.respuesta) : String(data.respuesta);
      else if (data?.message) textoIA = typeof data.message === 'object' ? JSON.stringify(data.message) : String(data.message);
      else textoIA = JSON.stringify(data);

      setMessages(prev => [...prev, { role: 'assistant', text: textoIA }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { role: 'assistant', text: `Fallo crítico de red: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const inputBar = (
    <form onSubmit={handleSend} style={{ width: '100%', maxWidth: '780px', margin: '0 auto' }}>
      {attachedFile && (
        <div style={{ fontSize: '0.8rem', color: '#a3a3a3', marginBottom: '0.5rem', paddingLeft: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          📄 {attachedFile.name}
          <button type="button" onClick={() => { setAttachedFile(null); if(fileInputRef.current) fileInputRef.current.value=''; }} style={{ background: 'none', border: 'none', color: '#d00000', cursor: 'pointer', fontWeight: 'bold' }}>✖</button>
        </div>
      )}
      <div style={styles.inputWrapper}>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept=".pdf,.txt,.csv,image/*" />
        <button type="button" onClick={() => fileInputRef.current?.click()} style={styles.iconButton} title="Adjuntar archivo">📎</button>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Escribe un mensaje o describe el archivo..."
          style={styles.textInput}
          disabled={isLoading}
        />
        <button type="submit" style={{ ...styles.sendButton, opacity: isLoading ? 0.5 : 1 }} disabled={isLoading}>↑</button>
      </div>
    </form>
  );

  if (messages.length === 0) {
    return (
      <div style={styles.chatContainer}>
        <div style={styles.emptyState}>
          <div style={styles.emptyLogo}>🖨️</div>
          <div style={styles.emptyTitle}>¿Cómo puedo ayudarte hoy?</div>
          <div style={{ width: '100%' }}>{inputBar}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.chatContainer}>
      <div style={styles.messageList}>
        {messages.map((msg, idx) => (
          <div key={idx} style={msg.role === 'user' ? styles.messageWrapperUser : styles.messageWrapperBot}>
            <div style={msg.role === 'user' ? styles.messageBubbleUser : styles.messageBubbleBot}>
              {msg.role === 'assistant' ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={styles.messageWrapperBot}>
            <div style={{ ...styles.messageBubbleBot, color: '#888' }}>Escribiendo...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div style={styles.inputContainer}>{inputBar}</div>
    </div>
  );
}

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

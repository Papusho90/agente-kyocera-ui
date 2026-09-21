import React, { useState } from 'react';
import './style.css';

interface ChatUIProps {
  signOut?: () => void;
}

export default function ChatUI({ signOut }: ChatUIProps) {
  const [mensaje, setMensaje] = useState("");

  const enviarMensaje = () => {
    if (!mensaje.trim()) return;
    console.log("Enviando a Lambda:", mensaje);
    // Aquí conectaremos tu API de AWS más adelante
    setMensaje("");
  };

  return (
    <div className="app-layout">
      {/* BARRA LATERAL */}
      <nav className="sidebar">
        <div className="sidebar-header">
          <span>Forte Servicios</span>
          <span style={{ cursor: 'pointer' }}>◫</span>
        </div>
        
        <ul className="sidebar-menu">
          <li>✎ Nuevo Chat</li>
        </ul>

        <div className="user-profile" onClick={signOut}>
          <div className="avatar">AA</div>
          <span style={{ fontSize: '0.9rem' }}>Adalberto Ariza</span>
        </div>
      </nav>

      {/* ÁREA DE CHAT PRINCIPAL */}
      <main className="main-chat">
        <header className="chat-header">
          <span style={{ cursor: 'pointer' }}>⚙️</span>
        </header>

        <div className="chat-messages">
          {/* Bienvenida central */}
          <div className="model-title">
            <div className="model-icon">IA</div>
            Agente Forte Servicios
          </div>
        </div>

        {/* BARRA DE ENTRADA */}
        <div className="input-container">
          <div className="input-box">
            <button className="icon-btn">＋</button>
            <input 
              type="text" 
              placeholder="¿Cómo puedo ayudarte hoy?" 
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && enviarMensaje()}
            />
            <span style={{ fontSize: '0.8rem', color: '#8b8b8b' }}>Agente ⌄</span>
            <button className="icon-btn">🎤</button>
            <button className="send-btn" onClick={enviarMensaje}>⬆</button>
          </div>
        </div>
      </main>
    </div>
  );
}
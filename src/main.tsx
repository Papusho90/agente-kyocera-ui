import React, { useState } from 'react';
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
          80: '#d00000', // Rojo Kyocera principal
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
  page: {
    display: 'flex',
    minHeight: '100vh',
    margin: '-8px',
    fontFamily: 'sans-serif',
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#1e1e1e',
    color: '#fff',
    padding: '1.5rem',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarTitle: {
    color: '#fff',
    borderBottom: '1px solid #333',
    paddingBottom: '1rem',
    marginTop: 0,
  },
  navList: {
    listStyle: 'none',
    padding: 0,
    marginTop: '2rem',
  },
  navButton: {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    background: 'none',
    border: 'none',
    color: '#aaa',
    padding: '0.6rem 0',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  navButtonActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  signOutButton: {
    marginTop: 'auto',
    padding: '10px',
    background: '#d00000',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  main: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    padding: '2rem',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2.5rem',
  },
  topBarTitle: {
    margin: 0,
    color: '#333',
  },
  userBadge: {
    background: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
  },
  statCard: {
    background: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  statLabel: {
    margin: '0 0 1rem 0',
    color: '#666',
  },
};

// ---------------------------------------------------------------------------
// Header personalizado del Authenticator
// ---------------------------------------------------------------------------
function AuthHeader() {
  const { tokens } = useTheme();
  return (
    <View textAlign="center" padding={tokens.space.large}>
      <Heading level={2} style={{ color: '#d00000', fontWeight: 'bold' }}>
        Kyocera Fleet Services
      </Heading>
      <Text style={{ marginTop: '0.5rem', color: '#555' }}>
        Portal de Administración
      </Text>
    </View>
  );
}

const authComponents = { Header: AuthHeader };

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------
interface NavItem {
  id: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'resumen', label: '📊 Resumen' },
  { id: 'equipos', label: '🖨️ Mis Equipos' },
  { id: 'configuracion', label: '⚙️ Configuración' },
];

interface SidebarProps {
  activeItem: string;
  onSelect: (id: string) => void;
  onSignOut: () => void;
}

function Sidebar({ activeItem, onSelect, onSignOut }: SidebarProps) {
  return (
    <aside style={styles.sidebar}>
      <h2 style={styles.sidebarTitle}>Agente Kyocera</h2>
      <nav>
        <ul style={styles.navList}>
          {NAV_ITEMS.map((item) => {
            const isActive = item.id === activeItem;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onSelect(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  style={{
                    ...styles.navButton,
                    ...(isActive ? styles.navButtonActive : {}),
                  }}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      <button type="button" onClick={onSignOut} style={styles.signOutButton}>
        Cerrar sesión
      </button>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Tarjeta de estadística
// ---------------------------------------------------------------------------
interface StatCardProps {
  label: string;
  value: React.ReactNode;
  valueColor?: string;
}

function StatCard({ label, value, valueColor = '#333' }: StatCardProps) {
  return (
    <div style={styles.statCard}>
      <h3 style={styles.statLabel}>{label}</h3>
      <p style={{ fontSize: '2.5rem', margin: 0, fontWeight: 'bold', color: valueColor }}>
        {value}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Barra superior
// ---------------------------------------------------------------------------
interface TopBarProps {
  userLabel: string;
}

function TopBar({ userLabel }: TopBarProps) {
  return (
    <header style={styles.topBar}>
      <h1 style={styles.topBarTitle}>Panel de Control</h1>
      <div style={styles.userBadge}>👤 {userLabel}</div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// Dashboard (contenido post-login)
// ---------------------------------------------------------------------------
interface DashboardProps {
  userLabel: string;
  onSignOut: () => void;
}

function Dashboard({ userLabel, onSignOut }: DashboardProps) {
  const [activeItem, setActiveItem] = useState<string>('resumen');

  return (
    <div style={styles.page}>
      <Sidebar activeItem={activeItem} onSelect={setActiveItem} onSignOut={onSignOut} />

      <main style={styles.main}>
        <TopBar userLabel={userLabel} />

        <div style={styles.statsGrid}>
          <StatCard label="Estado de Red" value="● Conectado a AWS" valueColor="green" />
          <StatCard label="Equipos Registrados" value={0} />
          <StatCard label="Alertas de Tóner" value={0} valueColor="#d00000" />
        </div>
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
          <Dashboard
            userLabel={user?.signInDetails?.loginId ?? 'Administrador'}
            onSignOut={signOut ?? (() => {})}
          />
        )}
      </Authenticator>
    </ThemeProvider>
  </React.StrictMode>
);

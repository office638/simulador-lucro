import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { LoginPage } from './components/auth/LoginPage';
import { authenticate } from './lib/auth';
import './index.css';

function Root() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (username: string, password: string) => {
    if (authenticate(username, password)) {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
    } else {
      alert('Usuário ou senha inválidos');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <>
      <button
        onClick={handleLogout}
        className="fixed top-4 left-4 z-50 p-2 rounded shadow-md bg-red-600 text-white hover:bg-red-700 transition-colors"
      >
        Sair
      </button>
      <App />
    </>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);

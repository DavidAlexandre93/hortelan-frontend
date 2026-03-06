import React, { Component, useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import SplashHarvestPro from "./SplashHarvestPro";
import Router from "./routes";

class SplashErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    // eslint-disable-next-line no-console
    console.error('Falha ao renderizar SplashHarvestPro.', error);
    this.props.onError?.();
  }

  render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}

function SplashFallback() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0b1220',
        color: '#fff',
        display: 'grid',
        placeItems: 'center',
        fontWeight: 700,
      }}
    >
      Carregando plataforma Hortelan...
    </div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showFallbackSplash, setShowFallbackSplash] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fallbackTimer = window.setTimeout(() => {
      setShowSplash(false);
    }, 10000);

    return () => window.clearTimeout(fallbackTimer);
  }, []);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);

    // Garante a splash como primeira tela em qualquer rota de entrada.
    // Se a aplicação chegar na raiz, redireciona para login.
    if (location.pathname === '/') {
      navigate('/login', { replace: true, state: { forceLogin: true } });
    }
  }, [location.pathname, navigate]);

  const handleSplashError = useCallback(() => {
    setShowFallbackSplash(true);

    // Mantém uma splash mínima visível antes de carregar o Router.
    window.setTimeout(() => {
      setShowSplash(false);
    }, 1800);
  }, []);

  if (!showSplash) {
    return <Router />;
  }

  if (showFallbackSplash) {
    return <SplashFallback />;
  }

  return (
    <SplashErrorBoundary onError={handleSplashError}>
      <SplashHarvestPro onFinish={handleSplashFinish} />
    </SplashErrorBoundary>
  );
}

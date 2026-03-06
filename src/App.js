import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import SplashHarvestPro from "./SplashHarvestPro";
import Router from "./routes";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
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

  return showSplash ? (
    <SplashHarvestPro onFinish={handleSplashFinish} />
  ) : (
    <Router />
  );
}

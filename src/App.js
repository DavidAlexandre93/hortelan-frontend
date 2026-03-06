import React, { useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import SplashHarvestPro from "./SplashHarvestPro";
import Router from "./routes";

const SPLASH_SEEN_STORAGE_KEY = 'hortelan:splash-seen';

function shouldShowSplash() {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.sessionStorage.getItem(SPLASH_SEEN_STORAGE_KEY) !== '1';
}

export default function App() {
  const [showSplash, setShowSplash] = useState(() => shouldShowSplash());
  const navigate = useNavigate();
  const location = useLocation();

  const handleSplashFinish = () => {
    window.sessionStorage.setItem(SPLASH_SEEN_STORAGE_KEY, '1');
    setShowSplash(false);

    // Garante a splash como primeira tela em qualquer rota de entrada.
    // Faz o redirecionamento para login apenas quando o usuário abre a raiz.
    if (location.pathname === '/') {
      navigate('/login', { replace: true, state: { forceLogin: true } });
    }
  };

  return showSplash ? (
    <SplashHarvestPro onFinish={handleSplashFinish} />
  ) : (
    <Router />
  );
}

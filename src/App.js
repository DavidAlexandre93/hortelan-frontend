import React, { useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import SplashHarvestPro from "./SplashHarvestPro";
import Router from "./routes";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSplashFinish = () => {
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

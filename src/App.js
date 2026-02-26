import React, { useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import SplashHarvestPro from "./SplashHarvestPro";
import Router from "./routes";

export default function App() {
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(location.pathname === '/');
  const navigate = useNavigate();

  const handleSplashFinish = () => {
    setShowSplash(false);
    navigate('/login', { replace: true });
  };

  return showSplash ? (
    <SplashHarvestPro onFinish={handleSplashFinish} />
  ) : (
    <Router />
  );
}

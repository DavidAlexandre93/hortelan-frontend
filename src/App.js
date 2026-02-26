import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import SplashHarvestPro from "./SplashHarvestPro";
import Router from "./routes";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();

  const handleSplashFinish = () => {
    setShowSplash(false);
    navigate('/login', { replace: true, state: { forceLogin: true } });
  };

  return showSplash ? (
    <SplashHarvestPro onFinish={handleSplashFinish} />
  ) : (
    <Router />
  );
}

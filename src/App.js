import React, { useState } from "react";
import SplashHarvestPro from "./SplashHarvestPro";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return showSplash ? (
    <SplashHarvestPro onFinish={() => setShowSplash(false)} />
  ) : (
    <div style={{ padding: 40, fontFamily: "system-ui" }}>
      <h1>Minha Home real</h1>
      <p>Conteúdo da HomePage aqui...</p>
    </div>
  );
}

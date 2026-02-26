import React, { useState } from "react";
import SplashHarvestPro from "./SplashHarvestPro";
import Router from "./routes";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return showSplash ? (
    <SplashHarvestPro onFinish={() => setShowSplash(false)} />
  ) : (
    <Router />
  );
}

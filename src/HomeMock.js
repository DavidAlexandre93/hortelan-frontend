import React from "react";
import { styles } from "./styles";

export default function HomeMock() {
  return (
    <div style={styles.homeMock}>
      <div style={styles.homeTop}>
        <div style={styles.homeTitle}>Home</div>
      </div>

      <div style={styles.homeCards}>
        {["Card 1", "Card 2", "Card 3"].map((t) => (
          <div key={t} style={styles.card}>
            <div style={styles.cardTitle}>{t}</div>
            <div style={styles.cardBar} />
          </div>
        ))}
      </div>

      <div style={styles.homeBottomPill}>Bem-vindo! (prévia)</div>
    </div>
  );
}

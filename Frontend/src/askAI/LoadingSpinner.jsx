import React, { useEffect, useState } from "react";
import "./LoadingSpinner.css";

const sciFiPhrases = [
  "Scanning cosmic archives...",
  "Decrypting neural patterns...",
  "Compiling quantum insights...",
  "Stabilizing temporal threads...",
  "Synthesizing smart response..."
];

export default function LoadingSpinner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < sciFiPhrases.length - 1) {
      const interval = setTimeout(() => {
        setIndex(prev => prev + 1);
      }, 6000); // 3 seconds per phrase
      return () => clearTimeout(interval);
    }
  }, [index]);

  return (
    <div className="loading-container">
      <div className="spinner" />
      <p className="loading-text">{sciFiPhrases[index]}</p>
    </div>
  );
}

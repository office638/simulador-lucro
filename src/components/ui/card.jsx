// src/components/ui/card.jsx

import React from 'react';  // (Se React estiver no escopo via JSX runtime novo, este import pode não ser necessário)

export function Card({ children }) {
  return (
    <div className="border rounded bg-white shadow-sm">
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  // Garantir que className seja string. Usamos concatenação para evitar qualquer ambiguidade de template literal.
  const classes = "p-4 " + className;
  return (
    <div className={classes.trim()}>  {/* .trim() opcional para remover espaço se className="" */}
      {children}
    </div>
  );
}

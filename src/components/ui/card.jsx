import React from 'react';

/**
 * Componente Card para encapsular conteúdo com borda e sombra.
 */
export function Card({ children }) {
  return (
    <div className="bg-white rounded shadow">
      {children}
    </div>
  );
}

/**
 * Componente CardContent para definir padding interno do card.
 * Evita uso de template literals para compatibilidade com esbuild/Vercel.
 */
export function CardContent({ children, className = "" }) {
  return (
    <div className={'p-4 ' + className}>
      {children}
    </div>
  );
}

import React, { useState } from 'react'

export default function SimuladorFinanceiro() {
  const [valorInicial, setValorInicial] = useState('')
  const [taxa, setTaxa] = useState('')
  const [resultado, setResultado] = useState(null)

  function calcularLucro(e) {
    e.preventDefault()
    const lucro = Number(valorInicial) * (Number(taxa) / 100)
    setResultado(lucro)
  }

  return (
    <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
      <h2>Simulador Financeiro</h2>
      <form onSubmit={calcularLucro}>
        <div>
          <label>
            Valor inicial:
            <input
              type="number"
              value={valorInicial}
              onChange={(e) => setValorInicial(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Taxa de lucro (%):
            <input
              type="number"
              value={taxa}
              onChange={(e) => setTaxa(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">Calcular</button>
      </form>
      {resultado !== null && (
        <p>
          Seu lucro estimado é: <strong>R$ {resultado.toFixed(2)}</strong>
        </p>
      )}
    </div>
  )
}

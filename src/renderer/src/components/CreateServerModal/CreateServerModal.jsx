
import './CreateServerModal.css'
import { useState } from 'react'

function CreateServerModal({ onClose, onCreate }) {
  const [nome, setNome] = useState('')

  function handleSubmit(e) {
    e.preventDefault()

    if (!nome.trim()) return

    onCreate(nome.trim())
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="create-server-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close"
          onClick={onClose}
          type="button"
        >
          ×
        </button>

        <h2>Crie seu servidor</h2>

        <p>
          Dê um nome para seu novo espaço e comece a reunir sua comunidade.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="server-name">
            NOME DO SERVIDOR
          </label>

          <input
            id="server-name"
            type="text"
            placeholder="Meu servidor"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            autoFocus
            maxLength={50}
          />

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="create-button"
              disabled={!nome.trim()}
            >
              Criar servidor
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateServerModal

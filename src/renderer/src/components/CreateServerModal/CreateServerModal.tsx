import './CreateServerModal.css'
import { useState } from 'react'
import type { FormEvent } from 'react'

interface CreateServerModalProps {
  onClose: () => void
  onCreate: (name: string) => void
}

function CreateServerModal({ onClose, onCreate }: CreateServerModalProps) {
  const [name, setName] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!name.trim()) return

    onCreate(name.trim())
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="create-server-modal" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} type="button">
          ×
        </button>

        <h2>Crie seu servidor</h2>

        <p>Dê um nome para seu novo espaço e comece a reunir sua comunidade.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="server-name">NOME DO SERVIDOR</label>

          <input
            id="server-name"
            type="text"
            placeholder="Meu servidor"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoFocus
            maxLength={50}
          />

          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancelar
            </button>

            <button type="submit" className="create-button" disabled={!name.trim()}>
              Criar servidor
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateServerModal

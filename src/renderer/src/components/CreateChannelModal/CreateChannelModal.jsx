import './CreateChannelModal.css'
import { useState } from 'react'

function CreateChannelModal({ type, onClose, onCreate }) {
  const [name, setName] = useState('')

  const isTextChannel = type === 'text'

  function handleSubmit(event) {
    event.preventDefault()

    if (!name.trim()) return

    onCreate(name.trim(), type)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="create-channel-modal" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} type="button">
          ×
        </button>

        <h2>Criar canal</h2>

        <p>Crie um novo canal para organizar as conversas do servidor.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="channel-name">TIPO DE CANAL</label>

          <div className="channel-type-display">
            {isTextChannel ? '# Canal de texto' : '🔊 Canal de voz'}
          </div>

          <label htmlFor="channel-name">NOME DO CANAL</label>

          <input
            id="channel-name"
            type="text"
            placeholder={isTextChannel ? 'novo-canal' : 'nova-sala'}
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={50}
            autoFocus
          />

          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancelar
            </button>

            <button type="submit" className="create-button" disabled={!name.trim()}>
              Criar canal
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateChannelModal

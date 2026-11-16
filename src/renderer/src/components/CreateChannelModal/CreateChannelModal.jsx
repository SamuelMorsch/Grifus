import './CreateChannelModal.css'
import { useState } from 'react'

function CreateChannelModal({ tipo, onClose, onCreate }) {
  const [nome, setNome] = useState('')

  const canalDeTexto = tipo === 'texto'

  function handleSubmit(e) {
    e.preventDefault()

    if (!nome.trim()) return

    onCreate(nome.trim(), tipo)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="create-channel-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} type="button">
          ×
        </button>

        <h2>Criar canal</h2>

        <p>Crie um novo canal para organizar as conversas do servidor.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="channel-name">TIPO DE CANAL</label>

          <div className="channel-type-display">
            {canalDeTexto ? '# Canal de texto' : '🔊 Canal de voz'}
          </div>

          <label htmlFor="channel-name">NOME DO CANAL</label>

          <input
            id="channel-name"
            type="text"
            placeholder={canalDeTexto ? 'novo-canal' : 'nova-sala'}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            maxLength={50}
            autoFocus
          />

          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancelar
            </button>

            <button type="submit" className="create-button" disabled={!nome.trim()}>
              Criar canal
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateChannelModal

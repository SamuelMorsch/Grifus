import './ManageItemModal.css'
import { useState } from 'react'

function ManageItemModal({ item, onClose, onConfirm }) {
  const [nome, setNome] = useState(item.nome)

  const renomeando = item.acao === 'renomear'
  const tipoNome = item.tipo === 'servidor' ? 'servidor' : 'canal'

  function handleSubmit(e) {
    e.preventDefault()

    if (renomeando && !nome.trim()) return

    onConfirm(renomeando ? nome.trim() : null)
  }

  return (
    <div className="manage-item-overlay" onClick={onClose}>
      <div className="manage-item-modal" onClick={(e) => e.stopPropagation()}>
        <button className="manage-item-close" onClick={onClose} type="button">
          ×
        </button>

        <h2>{renomeando ? `Renomear ${tipoNome}` : `Excluir ${tipoNome}`}</h2>

        {renomeando ? (
          <form onSubmit={handleSubmit}>
            <label htmlFor="manage-item-name">NOVO NOME</label>

            <input
              id="manage-item-name"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              maxLength={50}
              autoFocus
            />

            <div className="manage-item-actions">
              <button type="button" className="manage-cancel-button" onClick={onClose}>
                Cancelar
              </button>

              <button type="submit" className="manage-confirm-button" disabled={!nome.trim()}>
                Salvar
              </button>
            </div>
          </form>
        ) : (
          <>
            <p>
              Tem certeza de que deseja excluir <strong>{item.nome}</strong>? Essa ação não poderá
              ser desfeita.
            </p>

            <div className="manage-item-actions">
              <button type="button" className="manage-cancel-button" onClick={onClose}>
                Cancelar
              </button>

              <button type="button" className="manage-confirm-button delete" onClick={handleSubmit}>
                Excluir
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ManageItemModal

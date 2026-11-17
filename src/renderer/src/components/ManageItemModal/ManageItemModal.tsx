import './ManageItemModal.css'
import { useState } from 'react'
import type { FormEvent } from 'react'
import type { ManagedItem } from '../../types/chat'

interface ManageItemModalProps {
  item: ManagedItem
  onClose: () => void
  onConfirm: (newName: string | null) => void
}

function ManageItemModal({ item, onClose, onConfirm }: ManageItemModalProps) {
  const [name, setName] = useState(item.name)

  const isRenaming = item.action === 'rename'
  const targetLabel = item.target === 'server' ? 'servidor' : 'canal'

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (isRenaming && !name.trim()) return

    onConfirm(isRenaming ? name.trim() : null)
  }

  return (
    <div className="manage-item-overlay" onClick={onClose}>
      <div className="manage-item-modal" onClick={(event) => event.stopPropagation()}>
        <button className="manage-item-close" onClick={onClose} type="button">
          ×
        </button>

        <h2>{isRenaming ? `Renomear ${targetLabel}` : `Excluir ${targetLabel}`}</h2>

        {isRenaming ? (
          <form onSubmit={handleSubmit}>
            <label htmlFor="manage-item-name">NOVO NOME</label>

            <input
              id="manage-item-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={50}
              autoFocus
            />

            <div className="manage-item-actions">
              <button type="button" className="manage-cancel-button" onClick={onClose}>
                Cancelar
              </button>

              <button type="submit" className="manage-confirm-button" disabled={!name.trim()}>
                Salvar
              </button>
            </div>
          </form>
        ) : (
          <>
            <p>
              Tem certeza de que deseja excluir <strong>{item.name}</strong>? Essa ação não poderá
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

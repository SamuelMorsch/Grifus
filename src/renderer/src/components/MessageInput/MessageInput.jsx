import './MessageInput.css'
import { useState } from 'react'

function MessageInput({ enviarMensagem }) {
  const [conteudo, setConteudo] = useState('')

  function handleSubmit(e) {
    e.preventDefault()

    if (!conteudo.trim()) return

    enviarMensagem(conteudo.trim())
    setConteudo('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      e.currentTarget.form.requestSubmit()
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={conteudo}
        onChange={(e) => setConteudo(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Digite sua mensagem..."
        rows={1}
      />
    </form>
  )
}

export default MessageInput

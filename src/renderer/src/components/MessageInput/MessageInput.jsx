import './MessageInput.css'
import { useState } from 'react'
import { useChatStore } from '../../store/useChatStore'

function MessageInput() {
  const sendMessage = useChatStore((state) => state.sendMessage)
  const [content, setContent] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    if (!content.trim()) return

    sendMessage(content)
    setContent('')
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      event.currentTarget.form.requestSubmit()
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Digite sua mensagem..."
        rows={1}
      />
    </form>
  )
}

export default MessageInput

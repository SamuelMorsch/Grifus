import './MessageInput.css'
import { useState } from 'react'
import type { ChangeEvent, FormEvent, KeyboardEvent } from 'react'
import { useChatStore } from '../../store/useChatStore'

function MessageInput() {
  const sendMessage = useChatStore((state) => state.sendMessage)
  const [content, setContent] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!content.trim()) return

    sendMessage(content)
    setContent('')
  }

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      event.currentTarget.form?.requestSubmit()
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Digite sua mensagem..."
        rows={1}
      />
    </form>
  )
}

export default MessageInput

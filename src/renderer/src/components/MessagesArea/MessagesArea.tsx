import './MessagesArea.css'
import { useEffect, useMemo, useRef } from 'react'
import { useChatStore } from '../../store/useChatStore'

function formatTime(isoDate: string): string {
  return new Date(isoDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function MessagesArea() {
  const allMessages = useChatStore((state) => state.messages)
  const users = useChatStore((state) => state.users)
  const channelId = useChatStore((state) => state.selectedTextChannelId)

  const endRef = useRef<HTMLDivElement>(null)

  const messages = useMemo(
    () => allMessages.filter((message) => message.channelId === channelId),
    [allMessages, channelId]
  )

  const authorNames = useMemo(
    () => new Map(users.map((user): [string, string] => [user.id, user.name])),
    [users]
  )

  // Sempre rola até a última mensagem ao trocar de canal ou receber uma nova.
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [messages])

  return (
    <section className="messages-area">
      {messages.map((message) => (
        <div className="mensagem-chat" key={message.id}>
          <div className="mensagem-cabecalho">
            <strong>{authorNames.get(message.authorId) ?? 'Usuário desconhecido'}</strong>
            <time dateTime={message.createdAt}>{formatTime(message.createdAt)}</time>
          </div>
          <p>{message.content}</p>
        </div>
      ))}

      <div ref={endRef} />
    </section>
  )
}

export default MessagesArea

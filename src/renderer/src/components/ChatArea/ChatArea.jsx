import './ChatArea.css'
import MessagesArea from '../MessagesArea/MessagesArea'
import MessageInput from '../MessageInput/MessageInput'

function ChatArea({ canalSelecionado, mensagens, enviarMensagem }) {
  return (
    <main className="chat-area">
      <header className="chat-header">
        <h2># {canalSelecionado}</h2>
      </header>

      <MessagesArea mensagens={mensagens} />

      <MessageInput enviarMensagem={enviarMensagem} />
    </main>
  )
}

export default ChatArea

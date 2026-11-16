import './MessagesArea.css'

function MessagesArea({ mensagens }) {
  return (
    <section className="messages-area">
      {mensagens.map((mensagem) => (
        <div className="mensagem-chat" key={mensagem.id}>
          <strong>{mensagem.autor}</strong>
          <p>{mensagem.conteudo}</p>
        </div>
      ))}
    </section>
  )
}

export default MessagesArea

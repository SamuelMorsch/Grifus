import './ChannelSidebar.css'
import { useState } from 'react'

function ChannelSidebar({
  servidorAtual,
  canalSelecionado,
  canalVozSelecionado,
  setCanalSelecionado,
  setCanalVozSelecionado,
  criarCanal,
  abrirGerenciamento
}) {
  const [menuAberto, setMenuAberto] = useState(null)

  function abrirOpcoes(canal, tipo) {
    setMenuAberto(
      menuAberto?.id === canal.id && menuAberto?.tipo === tipo ? null : { id: canal.id, tipo }
    )
  }

  function gerenciarCanal(canal, tipo, acao) {
    abrirGerenciamento({
      tipo: 'canal',
      acao,
      id: canal.id,
      canalTipo: tipo,
      nome: canal.nome
    })

    setMenuAberto(null)
  }

  return (
    <aside className="channel-sidebar">
      <h2 className="server-name">{servidorAtual.nome}</h2>

      <section>
        <div className="channel-category-header">
          <h3 className="channel-category">CANAIS DE TEXTO</h3>

          <button
            className="add-channel-button"
            onClick={() => criarCanal('texto')}
            title="Criar canal de texto"
          >
            +
          </button>
        </div>

        {servidorAtual.canais.texto.map((canal) => (
          <div className="channel-row" key={canal.id}>
            <button
              onClick={() => {
                setCanalSelecionado(canal.id)
                setMenuAberto(null)
              }}
              className={canalSelecionado === canal.id ? 'channel-item selected' : 'channel-item'}
            >
              # {canal.nome}
            </button>

            <button
              className="channel-options-button"
              onClick={() => abrirOpcoes(canal, 'texto')}
              title="Opções do canal"
            >
              ⋯
            </button>

            {menuAberto?.id === canal.id && menuAberto?.tipo === 'texto' && (
              <div className="channel-options-menu">
                <button onClick={() => gerenciarCanal(canal, 'texto', 'renomear')}>
                  Renomear canal
                </button>

                {servidorAtual.canais.texto.length > 1 && (
                  <button
                    className="channel-delete-option"
                    onClick={() => gerenciarCanal(canal, 'texto', 'excluir')}
                  >
                    Excluir canal
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </section>

      <section>
        <div className="channel-category-header">
          <h3 className="channel-category">CANAIS DE VOZ</h3>

          <button
            className="add-channel-button"
            onClick={() => criarCanal('voz')}
            title="Criar canal de voz"
          >
            +
          </button>
        </div>

        {servidorAtual.canais.voz.map((canal) => (
          <div className="channel-row" key={canal.id}>
            <button
              className={
                canalVozSelecionado === canal.id ? 'channel-item selected' : 'channel-item'
              }
              onClick={() => {
                setCanalVozSelecionado(canal.id)
                setMenuAberto(null)
              }}
            >
              🔊 {canal.nome}
            </button>

            <button
              className="channel-options-button"
              onClick={() => abrirOpcoes(canal, 'voz')}
              title="Opções do canal"
            >
              ⋯
            </button>

            {menuAberto?.id === canal.id && menuAberto?.tipo === 'voz' && (
              <div className="channel-options-menu">
                <button onClick={() => gerenciarCanal(canal, 'voz', 'renomear')}>
                  Renomear canal
                </button>

                <button
                  className="channel-delete-option"
                  onClick={() => gerenciarCanal(canal, 'voz', 'excluir')}
                >
                  Excluir canal
                </button>
              </div>
            )}
          </div>
        ))}
      </section>
    </aside>
  )
}

export default ChannelSidebar

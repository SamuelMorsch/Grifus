import ServerSidebar from './components/ServerSidebar/ServerSidebar'
import ChannelSidebar from './components/ChannelSidebar/ChannelSidebar'
import ChatArea from './components/ChatArea/ChatArea'
import CreateServerModal from './components/CreateServerModal/CreateServerModal'
import CreateChannelModal from './components/CreateChannelModal/CreateChannelModal'
import ManageItemModal from './components/ManageItemModal/ManageItemModal'
import { useState } from 'react'

function App() {
  const [servidores, setServidores] = useState([
    {
      id: 1,
      nome: 'Geral',
      imagem: null,
      canais: {
        texto: [
          {
            id: 1,
            nome: 'geral',
            mensagens: [
              { id: 1, autor: 'Samuel', conteudo: 'Oi, tudo bem?' },
              { id: 2, autor: 'João', conteudo: 'Estou bem e você?' }
            ]
          },
          { id: 2, nome: 'ajuda', mensagens: [] }
        ],
        voz: [{ id: 'voz-1', nome: 'voz' }]
      }
    },
    {
      id: 2,
      nome: 'Games',
      imagem: null,
      canais: {
        texto: [{ id: 3, nome: 'geral', mensagens: [] }],
        voz: [{ id: 'voz-2', nome: 'voz' }]
      }
    },
    {
      id: 3,
      nome: 'Programação',
      imagem: null,
      canais: {
        texto: [{ id: 4, nome: 'geral', mensagens: [] }],
        voz: [{ id: 'voz-3', nome: 'voz' }]
      }
    }
  ])

  const [servidorSelecionado, setServidorSelecionado] = useState(1)
  const [canalSelecionado, setCanalSelecionado] = useState(1)
  const [canalVozSelecionado, setCanalVozSelecionado] = useState('voz-1')

  const [modalCriacaoServidor, setModalCriacaoServidor] = useState(false)
  const [tipoCanalModal, setTipoCanalModal] = useState(null)
  const [itemGerenciamento, setItemGerenciamento] = useState(null)

  const servidorAtual = servidores.find((servidor) => servidorSelecionado === servidor.id)

  const canalAtual = servidorAtual.canais.texto.find((canal) => canal.id === canalSelecionado)

  function selecionarServidor(id) {
    setServidorSelecionado(id)

    const servidor = servidores.find((servidor) => servidor.id === id)

    setCanalSelecionado(servidor.canais.texto[0].id)
    setCanalVozSelecionado(servidor.canais.voz[0]?.id ?? null)
  }

  function enviarMensagem(conteudo) {
    setServidores((servidoresAtuais) =>
      servidoresAtuais.map((servidor) => {
        if (servidor.id !== servidorSelecionado) return servidor

        return {
          ...servidor,
          canais: {
            ...servidor.canais,
            texto: servidor.canais.texto.map((canal) => {
              if (canal.id !== canalSelecionado) return canal

              return {
                ...canal,
                mensagens: [
                  ...canal.mensagens,
                  {
                    id: crypto.randomUUID(),
                    autor: 'Samuel',
                    conteudo
                  }
                ]
              }
            })
          }
        }
      })
    )
  }

  function criarServidor(nome) {
    const novoServidor = {
      id: crypto.randomUUID(),
      nome,
      imagem: null,
      canais: {
        texto: [
          {
            id: crypto.randomUUID(),
            nome: 'geral',
            mensagens: []
          }
        ],
        voz: [
          {
            id: crypto.randomUUID(),
            nome: 'voz'
          }
        ]
      }
    }

    setServidores((servidoresAtuais) => [...servidoresAtuais, novoServidor])

    setServidorSelecionado(novoServidor.id)
    setCanalSelecionado(novoServidor.canais.texto[0].id)
    setCanalVozSelecionado(novoServidor.canais.voz[0].id)
    setModalCriacaoServidor(false)
  }

  function criarCanal(nome, tipo) {
    const novoCanal = {
      id: crypto.randomUUID(),
      nome,
      ...(tipo === 'texto' ? { mensagens: [] } : {})
    }

    setServidores((servidoresAtuais) =>
      servidoresAtuais.map((servidor) => {
        if (servidor.id !== servidorSelecionado) return servidor

        return {
          ...servidor,
          canais: {
            ...servidor.canais,
            [tipo]: [...servidor.canais[tipo], novoCanal]
          }
        }
      })
    )

    if (tipo === 'texto') {
      setCanalSelecionado(novoCanal.id)
    } else {
      setCanalVozSelecionado(novoCanal.id)
    }

    setTipoCanalModal(null)
  }

  function confirmarGerenciamento(novoNome) {
    const item = itemGerenciamento

    if (!item) return

    if (item.acao === 'renomear') {
      setServidores((servidoresAtuais) =>
        servidoresAtuais.map((servidor) => {
          if (item.tipo === 'servidor' && servidor.id === item.id) {
            return {
              ...servidor,
              nome: novoNome
            }
          }

          if (item.tipo === 'canal' && servidor.id === servidorSelecionado) {
            return {
              ...servidor,
              canais: {
                ...servidor.canais,
                [item.canalTipo]: servidor.canais[item.canalTipo].map((canal) =>
                  canal.id === item.id ? { ...canal, nome: novoNome } : canal
                )
              }
            }
          }

          return servidor
        })
      )
    }

    if (item.acao === 'excluir' && item.tipo === 'servidor') {
      if (servidores.length <= 1) return

      const servidoresRestantes = servidores.filter((servidor) => servidor.id !== item.id)

      setServidores(servidoresRestantes)

      if (servidorSelecionado === item.id) {
        const novoServidor = servidoresRestantes[0]

        setServidorSelecionado(novoServidor.id)
        setCanalSelecionado(novoServidor.canais.texto[0].id)
        setCanalVozSelecionado(novoServidor.canais.voz[0]?.id ?? null)
      }
    }

    if (item.acao === 'excluir' && item.tipo === 'canal') {
      setServidores((servidoresAtuais) =>
        servidoresAtuais.map((servidor) => {
          if (servidor.id !== servidorSelecionado) return servidor

          const canaisRestantes = servidor.canais[item.canalTipo].filter(
            (canal) => canal.id !== item.id
          )

          if (canaisRestantes.length === 0 && item.canalTipo === 'texto') {
            return servidor
          }

          return {
            ...servidor,
            canais: {
              ...servidor.canais,
              [item.canalTipo]: canaisRestantes
            }
          }
        })
      )

      if (item.canalTipo === 'texto' && canalSelecionado === item.id) {
        const canaisRestantes = servidorAtual.canais.texto.filter((canal) => canal.id !== item.id)

        if (canaisRestantes.length > 0) {
          setCanalSelecionado(canaisRestantes[0].id)
        }
      }

      if (item.canalTipo === 'voz' && canalVozSelecionado === item.id) {
        const canaisRestantes = servidorAtual.canais.voz.filter((canal) => canal.id !== item.id)

        setCanalVozSelecionado(canaisRestantes[0]?.id ?? null)
      }
    }

    setItemGerenciamento(null)
  }

  return (
    <>
      <ServerSidebar
        servidores={servidores}
        servidorSelecionado={servidorSelecionado}
        setServidorSelecionado={selecionarServidor}
        criarServidor={() => setModalCriacaoServidor(true)}
        abrirGerenciamento={setItemGerenciamento}
      />

      <ChannelSidebar
        servidorAtual={servidorAtual}
        canalSelecionado={canalSelecionado}
        canalVozSelecionado={canalVozSelecionado}
        setCanalSelecionado={setCanalSelecionado}
        setCanalVozSelecionado={setCanalVozSelecionado}
        criarCanal={setTipoCanalModal}
        abrirGerenciamento={setItemGerenciamento}
      />

      <ChatArea
        canalSelecionado={canalAtual.nome}
        mensagens={canalAtual.mensagens}
        enviarMensagem={enviarMensagem}
      />

      {modalCriacaoServidor && (
        <CreateServerModal
          onClose={() => setModalCriacaoServidor(false)}
          onCreate={criarServidor}
        />
      )}

      {tipoCanalModal && (
        <CreateChannelModal
          tipo={tipoCanalModal}
          onClose={() => setTipoCanalModal(null)}
          onCreate={criarCanal}
        />
      )}

      {itemGerenciamento && (
        <ManageItemModal
          item={itemGerenciamento}
          onClose={() => setItemGerenciamento(null)}
          onConfirm={confirmarGerenciamento}
        />
      )}
    </>
  )
}

export default App

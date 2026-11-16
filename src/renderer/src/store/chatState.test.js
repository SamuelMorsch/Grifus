import { describe, it, expect } from 'vitest'
import {
  createInitialState,
  selectServer,
  selectTextChannel,
  selectVoiceChannel,
  createServer,
  renameServer,
  deleteServer,
  createChannel,
  renameChannel,
  deleteChannel,
  sendMessage
} from './chatState'

function channelsOf(state, serverId, type) {
  return state.channels.filter((c) => c.serverId === serverId && c.type === type)
}

describe('selectServer', () => {
  it('seleciona o servidor e o primeiro canal de texto e de voz dele', () => {
    const state = selectServer(createInitialState(), 'server-games')

    expect(state.selectedServerId).toBe('server-games')
    expect(state.selectedTextChannelId).toBe('channel-games-geral')
    expect(state.selectedVoiceChannelId).toBe('channel-games-voz')
  })

  it('ignora um servidor que não existe', () => {
    const initial = createInitialState()

    expect(selectServer(initial, 'nao-existe')).toBe(initial)
  })
})

describe('selectTextChannel e selectVoiceChannel', () => {
  it('seleciona canais do tipo correto', () => {
    const initial = createInitialState()

    expect(selectTextChannel(initial, 'channel-geral-ajuda').selectedTextChannelId).toBe(
      'channel-geral-ajuda'
    )
    expect(selectVoiceChannel(initial, 'channel-geral-voz').selectedVoiceChannelId).toBe(
      'channel-geral-voz'
    )
  })

  it('rejeita canal de tipo errado', () => {
    const initial = createInitialState()

    expect(selectTextChannel(initial, 'channel-geral-voz')).toBe(initial)
    expect(selectVoiceChannel(initial, 'channel-geral-geral')).toBe(initial)
  })
})

describe('createServer', () => {
  it('cria o servidor com os canais geral e voz e o seleciona', () => {
    const state = createServer(createInitialState(), '  Estudos  ')
    const server = state.servers.find((s) => s.name === 'Estudos')

    expect(server).toBeTruthy()
    expect(state.selectedServerId).toBe(server.id)

    const [text] = channelsOf(state, server.id, 'text')
    const [voice] = channelsOf(state, server.id, 'voice')

    expect(text.name).toBe('geral')
    expect(voice.name).toBe('voz')
    expect(state.selectedTextChannelId).toBe(text.id)
    expect(state.selectedVoiceChannelId).toBe(voice.id)
  })

  it('ignora nome vazio', () => {
    const initial = createInitialState()

    expect(createServer(initial, '   ')).toBe(initial)
  })
})

describe('renameServer', () => {
  it('renomeia o servidor', () => {
    const state = renameServer(createInitialState(), 'server-games', 'Jogos')

    expect(state.servers.find((s) => s.id === 'server-games').name).toBe('Jogos')
  })

  it('ignora nome vazio', () => {
    const initial = createInitialState()

    expect(renameServer(initial, 'server-games', '  ')).toBe(initial)
  })
})

describe('deleteServer', () => {
  it('remove o servidor, seus canais e suas mensagens', () => {
    const state = deleteServer(createInitialState(), 'server-geral')

    expect(state.servers.some((s) => s.id === 'server-geral')).toBe(false)
    expect(state.channels.some((c) => c.serverId === 'server-geral')).toBe(false)
    expect(state.messages).toHaveLength(0)
  })

  it('seleciona outro servidor quando o selecionado é excluído', () => {
    const state = deleteServer(createInitialState(), 'server-geral')

    expect(state.selectedServerId).toBe('server-games')
    expect(state.selectedTextChannelId).toBe('channel-games-geral')
    expect(state.selectedVoiceChannelId).toBe('channel-games-voz')
  })

  it('mantém a seleção quando outro servidor é excluído', () => {
    const state = deleteServer(createInitialState(), 'server-games')

    expect(state.selectedServerId).toBe('server-geral')
    expect(state.selectedTextChannelId).toBe('channel-geral-geral')
  })

  it('nunca exclui o último servidor', () => {
    let state = createInitialState()
    state = deleteServer(state, 'server-games')
    state = deleteServer(state, 'server-programacao')

    expect(state.servers).toHaveLength(1)
    expect(deleteServer(state, 'server-geral')).toBe(state)
  })
})

describe('createChannel', () => {
  it('cria canal de texto no servidor selecionado e o seleciona', () => {
    const state = createChannel(createInitialState(), 'novidades', 'text')
    const channel = state.channels.find((c) => c.name === 'novidades')

    expect(channel.serverId).toBe('server-geral')
    expect(channel.type).toBe('text')
    expect(state.selectedTextChannelId).toBe(channel.id)
  })

  it('cria canal de voz e seleciona apenas o canal de voz', () => {
    const state = createChannel(createInitialState(), 'sala-2', 'voice')
    const channel = state.channels.find((c) => c.name === 'sala-2')

    expect(channel.type).toBe('voice')
    expect(state.selectedVoiceChannelId).toBe(channel.id)
    expect(state.selectedTextChannelId).toBe('channel-geral-geral')
  })

  it('ignora nome vazio e tipo inválido', () => {
    const initial = createInitialState()

    expect(createChannel(initial, ' ', 'text')).toBe(initial)
    expect(createChannel(initial, 'x', 'video')).toBe(initial)
  })
})

describe('renameChannel', () => {
  it('renomeia o canal', () => {
    const state = renameChannel(createInitialState(), 'channel-geral-ajuda', 'suporte')

    expect(state.channels.find((c) => c.id === 'channel-geral-ajuda').name).toBe('suporte')
  })
})

describe('deleteChannel', () => {
  it('remove o canal e as mensagens dele', () => {
    const state = deleteChannel(createInitialState(), 'channel-geral-geral')

    expect(state.channels.some((c) => c.id === 'channel-geral-geral')).toBe(false)
    expect(state.messages).toHaveLength(0)
  })

  it('seleciona outro canal de texto quando o selecionado é excluído', () => {
    const state = deleteChannel(createInitialState(), 'channel-geral-geral')

    expect(state.selectedTextChannelId).toBe('channel-geral-ajuda')
  })

  it('não exclui o último canal de texto do servidor', () => {
    const initial = createInitialState()

    expect(deleteChannel(initial, 'channel-games-geral')).toBe(initial)
  })

  it('permite excluir o último canal de voz', () => {
    const state = deleteChannel(createInitialState(), 'channel-geral-voz')

    expect(channelsOf(state, 'server-geral', 'voice')).toHaveLength(0)
    expect(state.selectedVoiceChannelId).toBeNull()
  })
})

describe('sendMessage', () => {
  it('adiciona a mensagem no canal selecionado, com autor e data', () => {
    const state = sendMessage(createInitialState(), '  olá  ')
    const message = state.messages.at(-1)

    expect(message.content).toBe('olá')
    expect(message.channelId).toBe('channel-geral-geral')
    expect(message.authorId).toBe('user-samuel')
    expect(Number.isNaN(Date.parse(message.createdAt))).toBe(false)
  })

  it('mantém as mensagens separadas por canal', () => {
    let state = selectTextChannel(createInitialState(), 'channel-geral-ajuda')
    state = sendMessage(state, 'ajuda aqui')

    const inHelp = state.messages.filter((m) => m.channelId === 'channel-geral-ajuda')
    const inGeneral = state.messages.filter((m) => m.channelId === 'channel-geral-geral')

    expect(inHelp).toHaveLength(1)
    expect(inGeneral).toHaveLength(2)
  })

  it('ignora mensagem vazia', () => {
    const initial = createInitialState()

    expect(sendMessage(initial, '   ')).toBe(initial)
  })
})

// Estado do chat e as regras de negócio, como funções puras.
// Cada função recebe o estado atual e devolve o próximo estado.
// Se nada mudar, devolve o mesmo objeto de estado que recebeu.

const newId = () => crypto.randomUUID()

export function createInitialState() {
  return {
    currentUserId: 'user-samuel',
    users: [
      { id: 'user-samuel', name: 'Samuel' },
      { id: 'user-joao', name: 'João' }
    ],
    servers: [
      { id: 'server-geral', name: 'Geral', imageUrl: null },
      { id: 'server-games', name: 'Games', imageUrl: null },
      { id: 'server-programacao', name: 'Programação', imageUrl: null }
    ],
    channels: [
      { id: 'channel-geral-geral', serverId: 'server-geral', name: 'geral', type: 'text' },
      { id: 'channel-geral-ajuda', serverId: 'server-geral', name: 'ajuda', type: 'text' },
      { id: 'channel-geral-voz', serverId: 'server-geral', name: 'voz', type: 'voice' },
      { id: 'channel-games-geral', serverId: 'server-games', name: 'geral', type: 'text' },
      { id: 'channel-games-voz', serverId: 'server-games', name: 'voz', type: 'voice' },
      {
        id: 'channel-programacao-geral',
        serverId: 'server-programacao',
        name: 'geral',
        type: 'text'
      },
      { id: 'channel-programacao-voz', serverId: 'server-programacao', name: 'voz', type: 'voice' }
    ],
    messages: [
      {
        id: 'message-1',
        channelId: 'channel-geral-geral',
        authorId: 'user-samuel',
        content: 'Oi, tudo bem?',
        createdAt: '2026-11-12T12:00:00.000Z'
      },
      {
        id: 'message-2',
        channelId: 'channel-geral-geral',
        authorId: 'user-joao',
        content: 'Estou bem e você?',
        createdAt: '2026-11-12T12:01:00.000Z'
      }
    ],
    selectedServerId: 'server-geral',
    selectedTextChannelId: 'channel-geral-geral',
    selectedVoiceChannelId: 'channel-geral-voz'
  }
}

function firstChannelOfType(channels, serverId, type) {
  return channels.find((channel) => channel.serverId === serverId && channel.type === type) ?? null
}

function selectionForServer(channels, serverId) {
  return {
    selectedServerId: serverId,
    selectedTextChannelId: firstChannelOfType(channels, serverId, 'text')?.id ?? null,
    selectedVoiceChannelId: firstChannelOfType(channels, serverId, 'voice')?.id ?? null
  }
}

export function selectServer(state, serverId) {
  if (!state.servers.some((server) => server.id === serverId)) return state

  return { ...state, ...selectionForServer(state.channels, serverId) }
}

export function selectTextChannel(state, channelId) {
  const channel = state.channels.find((item) => item.id === channelId)

  if (!channel || channel.type !== 'text') return state

  return { ...state, selectedTextChannelId: channelId }
}

export function selectVoiceChannel(state, channelId) {
  const channel = state.channels.find((item) => item.id === channelId)

  if (!channel || channel.type !== 'voice') return state

  return { ...state, selectedVoiceChannelId: channelId }
}

export function createServer(state, name) {
  const trimmedName = name.trim()

  if (!trimmedName) return state

  const server = { id: newId(), name: trimmedName, imageUrl: null }

  const channels = [
    ...state.channels,
    { id: newId(), serverId: server.id, name: 'geral', type: 'text' },
    { id: newId(), serverId: server.id, name: 'voz', type: 'voice' }
  ]

  return {
    ...state,
    servers: [...state.servers, server],
    channels,
    ...selectionForServer(channels, server.id)
  }
}

export function renameServer(state, serverId, name) {
  const trimmedName = name.trim()

  if (!trimmedName) return state

  return {
    ...state,
    servers: state.servers.map((server) =>
      server.id === serverId ? { ...server, name: trimmedName } : server
    )
  }
}

export function deleteServer(state, serverId) {
  // Nunca permite ficar sem servidores.
  if (state.servers.length <= 1) return state
  if (!state.servers.some((server) => server.id === serverId)) return state

  const servers = state.servers.filter((server) => server.id !== serverId)
  const removedChannelIds = new Set(
    state.channels.filter((channel) => channel.serverId === serverId).map((channel) => channel.id)
  )
  const channels = state.channels.filter((channel) => channel.serverId !== serverId)
  const messages = state.messages.filter((message) => !removedChannelIds.has(message.channelId))

  const next = { ...state, servers, channels, messages }

  if (state.selectedServerId !== serverId) return next

  return { ...next, ...selectionForServer(channels, servers[0].id) }
}

export function createChannel(state, name, type) {
  const trimmedName = name.trim()

  if (!trimmedName) return state
  if (type !== 'text' && type !== 'voice') return state
  if (!state.servers.some((server) => server.id === state.selectedServerId)) return state

  const channel = {
    id: newId(),
    serverId: state.selectedServerId,
    name: trimmedName,
    type
  }

  const next = { ...state, channels: [...state.channels, channel] }

  return type === 'text'
    ? { ...next, selectedTextChannelId: channel.id }
    : { ...next, selectedVoiceChannelId: channel.id }
}

export function renameChannel(state, channelId, name) {
  const trimmedName = name.trim()

  if (!trimmedName) return state

  return {
    ...state,
    channels: state.channels.map((channel) =>
      channel.id === channelId ? { ...channel, name: trimmedName } : channel
    )
  }
}

export function deleteChannel(state, channelId) {
  const channel = state.channels.find((item) => item.id === channelId)

  if (!channel) return state

  // Todo servidor precisa manter pelo menos um canal de texto.
  if (channel.type === 'text') {
    const textChannelsInServer = state.channels.filter(
      (item) => item.serverId === channel.serverId && item.type === 'text'
    )

    if (textChannelsInServer.length <= 1) return state
  }

  const channels = state.channels.filter((item) => item.id !== channelId)
  const messages = state.messages.filter((message) => message.channelId !== channelId)
  const next = { ...state, channels, messages }

  if (channel.type === 'text' && state.selectedTextChannelId === channelId) {
    return {
      ...next,
      selectedTextChannelId: firstChannelOfType(channels, channel.serverId, 'text')?.id ?? null
    }
  }

  if (channel.type === 'voice' && state.selectedVoiceChannelId === channelId) {
    return {
      ...next,
      selectedVoiceChannelId: firstChannelOfType(channels, channel.serverId, 'voice')?.id ?? null
    }
  }

  return next
}

export function sendMessage(state, content) {
  const trimmedContent = content.trim()

  if (!trimmedContent || !state.selectedTextChannelId) return state

  const message = {
    id: newId(),
    channelId: state.selectedTextChannelId,
    authorId: state.currentUserId,
    content: trimmedContent,
    createdAt: new Date().toISOString()
  }

  return { ...state, messages: [...state.messages, message] }
}

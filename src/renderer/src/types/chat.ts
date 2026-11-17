export type ChannelType = 'text' | 'voice'

export interface User {
  id: string
  name: string
}

export interface Server {
  id: string
  name: string
  imageUrl: string | null
}

export interface Channel {
  id: string
  serverId: string
  name: string
  type: ChannelType
}

export interface Message {
  id: string
  channelId: string
  authorId: string
  content: string
  createdAt: string
}

export interface ChatState {
  currentUserId: string
  users: User[]
  servers: Server[]
  channels: Channel[]
  messages: Message[]
  selectedServerId: string
  selectedTextChannelId: string | null
  selectedVoiceChannelId: string | null
}

// Item que o usuário está renomeando ou excluindo (servidor ou canal).
export interface ManagedItem {
  target: 'server' | 'channel'
  action: 'rename' | 'delete'
  id: string
  name: string
}

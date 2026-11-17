import { create } from 'zustand'
import * as chat from './chatState'
import type { ChannelType, ChatState } from '../types/chat'

interface ChatActions {
  selectServer: (serverId: string) => void
  selectTextChannel: (channelId: string) => void
  selectVoiceChannel: (channelId: string) => void

  createServer: (name: string) => void
  renameServer: (serverId: string, name: string) => void
  deleteServer: (serverId: string) => void

  createChannel: (name: string, type: ChannelType) => void
  renameChannel: (channelId: string, name: string) => void
  deleteChannel: (channelId: string) => void

  sendMessage: (content: string) => void
}

export type ChatStore = ChatState & ChatActions

// Cada ação aplica uma função pura de chatState.ts ao estado atual.
export const useChatStore = create<ChatStore>()((set) => ({
  ...chat.createInitialState(),

  selectServer: (serverId) => set((state) => chat.selectServer(state, serverId)),
  selectTextChannel: (channelId) => set((state) => chat.selectTextChannel(state, channelId)),
  selectVoiceChannel: (channelId) => set((state) => chat.selectVoiceChannel(state, channelId)),

  createServer: (name) => set((state) => chat.createServer(state, name)),
  renameServer: (serverId, name) => set((state) => chat.renameServer(state, serverId, name)),
  deleteServer: (serverId) => set((state) => chat.deleteServer(state, serverId)),

  createChannel: (name, type) => set((state) => chat.createChannel(state, name, type)),
  renameChannel: (channelId, name) => set((state) => chat.renameChannel(state, channelId, name)),
  deleteChannel: (channelId) => set((state) => chat.deleteChannel(state, channelId)),

  sendMessage: (content) => set((state) => chat.sendMessage(state, content))
}))

import { create } from 'zustand'
import * as chat from './chatState'

// Cada ação aplica uma função pura de chatState.js ao estado atual.
export const useChatStore = create((set) => ({
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

import { contextBridge } from 'electron'

// Tudo que a interface pode pedir ao sistema entra aqui, de forma explícita.
contextBridge.exposeInMainWorld('api', {
  platform: process.platform
})

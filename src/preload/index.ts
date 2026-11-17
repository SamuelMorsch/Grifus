import { contextBridge } from 'electron'

// Tudo que a interface pode pedir ao sistema entra aqui, de forma explícita.
// Se mudar algo aqui, atualize também o tipo em src/renderer/src/env.d.ts.
contextBridge.exposeInMainWorld('api', {
  platform: process.platform
})

/// <reference types="vite/client" />

// Deve espelhar o que o preload expõe em contextBridge.exposeInMainWorld('api', ...)
interface Window {
  api: {
    platform: string
  }
}

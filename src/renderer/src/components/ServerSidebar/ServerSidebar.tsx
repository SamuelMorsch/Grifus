import './ServerSidebar.css'
import { useState } from 'react'
import type { MouseEvent } from 'react'
import { useChatStore } from '../../store/useChatStore'
import type { ManagedItem, Server } from '../../types/chat'

interface ServerSidebarProps {
  onCreateServer: () => void
  onManage: (item: ManagedItem) => void
}

interface ContextMenuState {
  serverId: string
  x: number
  y: number
}

function ServerSidebar({ onCreateServer, onManage }: ServerSidebarProps) {
  const servers = useChatStore((state) => state.servers)
  const selectedServerId = useChatStore((state) => state.selectedServerId)
  const selectServer = useChatStore((state) => state.selectServer)

  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null)

  function openContextMenu(event: MouseEvent<HTMLButtonElement>, server: Server) {
    event.preventDefault()

    setContextMenu({
      serverId: server.id,
      x: event.clientX,
      y: event.clientY
    })
  }

  function manage(action: ManagedItem['action'], server: Server) {
    onManage({ target: 'server', action, id: server.id, name: server.name })
    setContextMenu(null)
  }

  const menuServer = servers.find((server) => server.id === contextMenu?.serverId)

  return (
    <aside className="server-sidebar">
      <div className="server-logo">G</div>

      {servers.map((server) => (
        <button
          key={server.id}
          className={selectedServerId === server.id ? 'server-button selected' : 'server-button'}
          onClick={() => {
            selectServer(server.id)
            setContextMenu(null)
          }}
          onContextMenu={(event) => openContextMenu(event, server)}
          title={server.name}
        >
          <span
            className={selectedServerId === server.id ? 'button-barra selected' : 'button-barra'}
          />

          {server.imageUrl ? (
            <img className="server-image" src={server.imageUrl} alt={server.name} />
          ) : (
            server.name[0]
          )}
        </button>
      ))}

      <button
        className="server-button add-server-button"
        onClick={onCreateServer}
        title="Criar servidor"
      >
        +
      </button>

      {contextMenu && menuServer && (
        <div
          className="server-context-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onMouseLeave={() => setContextMenu(null)}
        >
          <button onClick={() => manage('rename', menuServer)}>Renomear servidor</button>

          {servers.length > 1 && (
            <button className="context-delete" onClick={() => manage('delete', menuServer)}>
              Excluir servidor
            </button>
          )}
        </div>
      )}
    </aside>
  )
}

export default ServerSidebar

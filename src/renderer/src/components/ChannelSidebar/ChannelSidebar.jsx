import './ChannelSidebar.css'
import { useMemo, useState } from 'react'
import { useChatStore } from '../../store/useChatStore'

function ChannelRow({
  channel,
  icon,
  isSelected,
  isMenuOpen,
  canDelete,
  onSelect,
  onToggleMenu,
  onManage
}) {
  return (
    <div className="channel-row">
      <button className={isSelected ? 'channel-item selected' : 'channel-item'} onClick={onSelect}>
        {icon} {channel.name}
      </button>

      <button className="channel-options-button" onClick={onToggleMenu} title="Opções do canal">
        ⋯
      </button>

      {isMenuOpen && (
        <div className="channel-options-menu">
          <button onClick={() => onManage('rename')}>Renomear canal</button>

          {canDelete && (
            <button className="channel-delete-option" onClick={() => onManage('delete')}>
              Excluir canal
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function ChannelSidebar({ onCreateChannel, onManage }) {
  const servers = useChatStore((state) => state.servers)
  const channels = useChatStore((state) => state.channels)
  const selectedServerId = useChatStore((state) => state.selectedServerId)
  const selectedTextChannelId = useChatStore((state) => state.selectedTextChannelId)
  const selectedVoiceChannelId = useChatStore((state) => state.selectedVoiceChannelId)
  const selectTextChannel = useChatStore((state) => state.selectTextChannel)
  const selectVoiceChannel = useChatStore((state) => state.selectVoiceChannel)

  const [openMenuId, setOpenMenuId] = useState(null)

  const server = servers.find((item) => item.id === selectedServerId)

  const textChannels = useMemo(
    () =>
      channels.filter(
        (channel) => channel.serverId === selectedServerId && channel.type === 'text'
      ),
    [channels, selectedServerId]
  )

  const voiceChannels = useMemo(
    () =>
      channels.filter(
        (channel) => channel.serverId === selectedServerId && channel.type === 'voice'
      ),
    [channels, selectedServerId]
  )

  function toggleMenu(channelId) {
    setOpenMenuId((current) => (current === channelId ? null : channelId))
  }

  function manage(channel, action) {
    onManage({ target: 'channel', action, id: channel.id, name: channel.name })
    setOpenMenuId(null)
  }

  if (!server) return null

  return (
    <aside className="channel-sidebar">
      <h2 className="server-name">{server.name}</h2>

      <section>
        <div className="channel-category-header">
          <h3 className="channel-category">CANAIS DE TEXTO</h3>

          <button
            className="add-channel-button"
            onClick={() => onCreateChannel('text')}
            title="Criar canal de texto"
          >
            +
          </button>
        </div>

        {textChannels.map((channel) => (
          <ChannelRow
            key={channel.id}
            channel={channel}
            icon="#"
            isSelected={selectedTextChannelId === channel.id}
            isMenuOpen={openMenuId === channel.id}
            canDelete={textChannels.length > 1}
            onSelect={() => {
              selectTextChannel(channel.id)
              setOpenMenuId(null)
            }}
            onToggleMenu={() => toggleMenu(channel.id)}
            onManage={(action) => manage(channel, action)}
          />
        ))}
      </section>

      <section>
        <div className="channel-category-header">
          <h3 className="channel-category">CANAIS DE VOZ</h3>

          <button
            className="add-channel-button"
            onClick={() => onCreateChannel('voice')}
            title="Criar canal de voz"
          >
            +
          </button>
        </div>

        {voiceChannels.map((channel) => (
          <ChannelRow
            key={channel.id}
            channel={channel}
            icon="🔊"
            isSelected={selectedVoiceChannelId === channel.id}
            isMenuOpen={openMenuId === channel.id}
            canDelete={true}
            onSelect={() => {
              selectVoiceChannel(channel.id)
              setOpenMenuId(null)
            }}
            onToggleMenu={() => toggleMenu(channel.id)}
            onManage={(action) => manage(channel, action)}
          />
        ))}
      </section>
    </aside>
  )
}

export default ChannelSidebar

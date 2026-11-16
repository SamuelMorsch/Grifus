import './ChatArea.css'
import MessagesArea from '../MessagesArea/MessagesArea'
import MessageInput from '../MessageInput/MessageInput'
import { useChatStore } from '../../store/useChatStore'

function ChatArea() {
  const channelName = useChatStore(
    (state) =>
      state.channels.find((channel) => channel.id === state.selectedTextChannelId)?.name ?? ''
  )

  return (
    <main className="chat-area">
      <header className="chat-header">
        <h2># {channelName}</h2>
      </header>

      <MessagesArea />

      <MessageInput />
    </main>
  )
}

export default ChatArea

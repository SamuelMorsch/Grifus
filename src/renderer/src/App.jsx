import { useState } from 'react'
import ServerSidebar from './components/ServerSidebar/ServerSidebar'
import ChannelSidebar from './components/ChannelSidebar/ChannelSidebar'
import ChatArea from './components/ChatArea/ChatArea'
import CreateServerModal from './components/CreateServerModal/CreateServerModal'
import CreateChannelModal from './components/CreateChannelModal/CreateChannelModal'
import ManageItemModal from './components/ManageItemModal/ManageItemModal'
import { useChatStore } from './store/useChatStore'

function App() {
  const createServer = useChatStore((state) => state.createServer)
  const renameServer = useChatStore((state) => state.renameServer)
  const deleteServer = useChatStore((state) => state.deleteServer)
  const createChannel = useChatStore((state) => state.createChannel)
  const renameChannel = useChatStore((state) => state.renameChannel)
  const deleteChannel = useChatStore((state) => state.deleteChannel)

  // Estado só da interface: quais modais estão abertos.
  const [isCreateServerOpen, setIsCreateServerOpen] = useState(false)
  const [createChannelType, setCreateChannelType] = useState(null)
  const [managedItem, setManagedItem] = useState(null)

  function handleCreateServer(name) {
    createServer(name)
    setIsCreateServerOpen(false)
  }

  function handleCreateChannel(name, type) {
    createChannel(name, type)
    setCreateChannelType(null)
  }

  function handleConfirmManage(newName) {
    if (!managedItem) return

    const { target, action, id } = managedItem

    if (target === 'server') {
      if (action === 'rename') renameServer(id, newName)
      if (action === 'delete') deleteServer(id)
    }

    if (target === 'channel') {
      if (action === 'rename') renameChannel(id, newName)
      if (action === 'delete') deleteChannel(id)
    }

    setManagedItem(null)
  }

  return (
    <>
      <ServerSidebar onCreateServer={() => setIsCreateServerOpen(true)} onManage={setManagedItem} />

      <ChannelSidebar onCreateChannel={setCreateChannelType} onManage={setManagedItem} />

      <ChatArea />

      {isCreateServerOpen && (
        <CreateServerModal
          onClose={() => setIsCreateServerOpen(false)}
          onCreate={handleCreateServer}
        />
      )}

      {createChannelType && (
        <CreateChannelModal
          type={createChannelType}
          onClose={() => setCreateChannelType(null)}
          onCreate={handleCreateChannel}
        />
      )}

      {managedItem && (
        <ManageItemModal
          item={managedItem}
          onClose={() => setManagedItem(null)}
          onConfirm={handleConfirmManage}
        />
      )}
    </>
  )
}

export default App

import ChatDB from '@/db/chat.js'

const ChatApi = {
  create(param) {
    return ChatDB.create(param)
  },
  list() {
    return ChatDB.list()
  },
  delete(param) {
    return ChatDB.delete(param)
  }
}
export default ChatApi

import WebSocket from '@tauri-apps/plugin-websocket'

const WsUtil = {
  async connect(url, onResponseHandler, onCloseHandler) {
    return WebSocket.connect(url)
      .then((ws) => {
        ws.addListener(onResponseHandler)
        return ws
      })
      .catch((e) => {
        onCloseHandler(e)
        throw e
      })
  }
}
export default WsUtil

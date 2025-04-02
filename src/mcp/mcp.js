import PlugApi from '@/api/plug.js'
import { Client } from '@/mcp/client.js'

class Mcp {
  static async start(item) {
    let plugContent = JSON.parse(item.plugContent)
    let args = plugContent.args?.split(/(?:\r?\n)+/).filter((part) => part.trim() !== '')
    let evn = {}
    if (plugContent.env) {
      plugContent.env?.map((e) => (evn[e.key] = e.value))
    }
    return Client.connect({
      id: item.id,
      type: plugContent.mcpType,
      transport: {
        cmd: plugContent.cmd,
        params: args ?? [],
        env: evn
      }
    })
  }

  static async startAll() {
    let plugList = await PlugApi.list()
    if (plugList.code === 0) {
      plugList.data.map(async (item) => {
        if (item.isActive) {
          Mcp.start(item).catch(() => {
            item.isActive = 0
            PlugApi.switch(item)
          })
        }
      })
    }
  }

  static close(item) {
    Client.closeConnect(item)
  }
}

export default Mcp

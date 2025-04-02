import Stdio from '@/mcp/stdio.js'

export class Client {
  static mspClient = {
    stdio: Stdio
  }
  static connects = new Map()
  static toolNameAndMcpClientId = new Map() //tool对应的client

  static async connect(item) {
    let server = Client.mspClient[item.type]
    if (server) {
      let instance = server.instance(item.transport)
      await instance
        .start()
        .then(() => {
          this.connects.set(item.id, instance)
        })
        .catch(() => {
          throw new Error(err)
        })
    }
  }

  static async closeConnect(item) {
    let client = this.connects.get(item.id)
    if (client) {
      client.close()
      this.connects.delete(item.id)
    }
  }

  //获取tool列表
  static async toolList(item) {
    let client = this.connects.get(item.id)
    if (!client) return
    let message = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/list'
    }
    const finished = new Promise((resolve) => {
      client.onmessage = (message) => {
        try {
          resolve(JSON.parse(message))
        } catch (e) {
          resolve([])
        }
      }
    })
    await client.request(message)
    return await finished
  }

  //获取所有tool列表
  static async toolListAll() {
    let message = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/list'
    }
    //获取所有的tools
    const tools = []
    const promises = Array.from(this.connects).map(async ([key, client]) => {
      const finished = new Promise((resolve) => {
        client.onmessage = (message) => {
          try {
            resolve(JSON.parse(message))
          } catch (e) {
            resolve([])
          }
        }
      })
      await client.request(message)
      const tool = await finished
      tool?.result?.tools?.map((value) => {
        tools.push(value)
        this.toolNameAndMcpClientId.set(value.name, key)
      })
    })
    await Promise.all(promises)
    return tools
  }

  //执行所有tool
  static async callTools(callTools) {
    const toolsResult = []
    const promises = Array.from(callTools).map(async (value) => {
      let clientId = this.toolNameAndMcpClientId.get(value.function.name)
      let client = this.connects.get(clientId)
      if (client) {
        const finished = new Promise((resolve) => {
          client.onmessage = (message) => resolve(message)
        })
        let arg = value.function.arguments
        if (typeof arg === 'string') {
          arg = JSON.parse(arg)
        }
        let message = {
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/call',
          params: {
            name: value.function.name,
            arguments: {
              ...arg
            }
          }
        }
        await client.request(message)
        const result = await finished
        toolsResult.push({
          name: value.function.name,
          callId: value.id,
          content: result
        })
      }
    })
    await Promise.all(promises)
    return toolsResult
  }
}

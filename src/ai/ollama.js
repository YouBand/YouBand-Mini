import HttpUtil from '@/utils/http.js'
import AI from '@/ai/ai.js'
import { Client } from '@/mcp/client.js'

class OllamakAI {
  static async getResponseContent(roleCharacter, modelContent, context, message) {
    //获取tools
    let tools = await Client.toolListAll()
    let requestTools = []
    tools.map((value) =>
      requestTools.push({
        type: 'function',
        function: {
          name: value.name,
          description: value.description,
          parameters: value.inputSchema
        }
      })
    )
    let data = {
      messages: [{ role: 'system', content: roleCharacter }, ...context, { role: 'user', content: message }],
      model: modelContent.model,
      stream: false,
      options: {
        num_ctx: modelContent.maxToken,
        temperature: modelContent.temperature
      }
    }
    if (requestTools && requestTools.length > 0) {
      data.tools = requestTools
    }
    let replyMsg = ''
    let count = 0
    while (!replyMsg) {
      let msg = await this.send(modelContent, data)
      if (typeof msg === 'string' || msg instanceof String) {
        replyMsg = msg
        break
      }
      if (msg?.['tool_calls'] && msg?.['tool_calls'].length > 0) {
        //调用tools
        let callTools = msg?.['tool_calls']
        let callResult = await Client.callTools(callTools)
        data.messages.push(msg?.message)
        delete data.tools
        callResult.map((value) => {
          data.messages.push({ role: 'tool', content: value.content, tool_call_id: value.callId })
        })
      } else {
        replyMsg = msg?.content || '好像什么都没有哦~'
      }
      count++
      if (count > 3) {
        replyMsg = '好像还没有结果，算不动了~'
      }
    }
    return replyMsg
  }

  static send(modelContent, data) {
    return HttpUtil.send({
      url: `${modelContent.url}/api/chat`,
      data: data,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${modelContent.apiKey}`
      }
    })
      .then((res) => {
        return res['message']
      })
      .catch(() => {
        return AI.bugMsg
      })
  }
}

export default OllamakAI

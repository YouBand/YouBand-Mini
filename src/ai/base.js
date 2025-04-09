import { Client } from '@/mcp/client.js'
import HttpUtil from '@/utils/http.js'
import AI from '@/ai/ai.js'

class AiBase {
  static async openAI(url, roleCharacter, modelContent, context, message) {
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
      max_tokens: modelContent.maxToken,
      temperature: modelContent.temperature
    }
    if (requestTools && requestTools.length > 0) {
      data.tools = requestTools
    }
    let replyMsg = ''
    let msgStr = ''
    let count = 0
    while (!replyMsg) {
      let msg = await this.send(url, data, modelContent.apiKey)
      if (typeof msg === 'string' || msg instanceof String) {
        replyMsg = msg
        break
      }
      if (msg?.['finish_reason'] === 'tool_calls' || msg?.message?.['tool_calls']) {
        //调用tools
        let callTools = msg?.message?.['tool_calls']
        let callResult = await Client.callTools(callTools)
        data.messages.push(msg?.message)
        callResult.map((value) => {
          data.messages.push({ role: 'tool', content: value.content, tool_call_id: value.callId })
        })
        if (msg?.message?.content) {
          msgStr += msg?.message?.content + '\n'
        }
      } else {
        replyMsg = msgStr + msg?.message?.content || '好像什么都没有哦~'
      }
      count++
      if (count > 10) {
        replyMsg = '好像还没有结果，算不动了~'
      }
    }
    return replyMsg
  }

  static send(url, data, apiKey) {
    return HttpUtil.send({
      url: url,
      data: data,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    })
      .then((res) => {
        return res['choices'][0]
      })
      .catch(() => {
        return AI.bugMsg
      })
  }
}

export default AiBase

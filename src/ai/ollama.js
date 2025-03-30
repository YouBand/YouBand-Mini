import HttpUtil from '@/utils/http.js'
import AI from '@/ai/ai.js'

class OllamakAI {
  static async getResponseContent(roleCharacter, modelContent, context, message) {
    let data = {
      messages: [{ role: 'system', content: roleCharacter }, ...context, { role: 'user', content: message }],
      model: modelContent.model,
      stream: false,
      options: {
        num_ctx: modelContent.maxToken,
        temperature: modelContent.temperature
      }
    }
    return HttpUtil.send({
      url: `${modelContent.url}/api/chat`,
      data: data,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${modelContent.apiKey}`
      }
    })
      .then((res) => res['message']['content'])
      .catch(() => {
        return AI.bugMsg
      })
  }
}

export default OllamakAI
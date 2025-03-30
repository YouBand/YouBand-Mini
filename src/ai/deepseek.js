import HttpUtil from '@/utils/http.js'
import AI from "@/ai/ai.js";

class DeepSeekAI {
  static baseUrl = 'https://api.deepseek.com/chat/completions'

  static async getResponseContent(roleCharacter, modelContent, context, message) {
    let data = {
      messages: [{ role: 'system', content: roleCharacter }, ...context, { role: 'user', content: message }],
      model: modelContent.model,
      stream: false,
      max_tokens: modelContent.maxToken,
      temperature: modelContent.temperature
    }
    return HttpUtil.send({
      url: this.baseUrl,
      data: data,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${modelContent.apiKey}`
      }
    })
      .then((res) => res['choices'][0]['message']['content'])
      .catch(() => {
        return AI.bugMsg
      })
  }
}

export default DeepSeekAI

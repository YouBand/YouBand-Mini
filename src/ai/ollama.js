import HttpUtil from '@/utils/http.js'

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
        return '好像有只bug在开派对？我正在驱散它们，请稍后重试~'
      })
  }
}

export default OllamakAI

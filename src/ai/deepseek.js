import HttpUtil from '@/utils/http.js'

class DeepSeekAI {
  static baseUrl = 'https://api.deepseek.com/chat/completions'

  static async getResponseContent(roleCharacter, modelContent, context, message) {
    let data = {
      messages: [{ role: 'system', content: roleCharacter }, ...context, { role: 'user', content: message }],
      model: modelContent.model,
      stream: false,
      max_tokens: 2048,
      temperature: 1.3,
      top_p: 0.95,
      frequency_penalty: 0.2
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
      .catch((err) => {
        console.log(err)
        return '好像有只bug在开派对？我正在驱散它们，请稍后重试~'
      })
  }
}

export default DeepSeekAI

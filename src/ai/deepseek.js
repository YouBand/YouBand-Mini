import HttpUtil from '@/utils/http.js'

class DeepSeekAI {
  static baseUrl = 'https://api.deepseek.com/chat/completions'

  static async getResponseContent(content, context, prompt, apikey, model) {
    let data = {
      messages: [{ role: 'system', content: prompt }, ...context, { role: 'user', content: content }],
      model: model,
      stream: false,
      max_tokens: 2048,
      temperature: 1.3,
      top_p: 0.95,
      frequency_penalty: 0.2
    }
    HttpUtil.send({
      url: this.baseUrl,
      data: data,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apikey}`
      }
    })
      .then((res) => {
        return res
      })
      .catch((err) => {
        return '好像有只bug在开派对？我正在驱散它们，请稍后重试~'
      })
  }
}

export default DeepSeekAI

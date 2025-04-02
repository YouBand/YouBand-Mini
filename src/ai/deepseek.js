import AiBase from '@/ai/base.js'

class DeepSeekAI {
  static baseUrl = 'https://api.deepseek.com/chat/completions'

  static async getResponseContent(roleCharacter, modelContent, context, message) {
    return await AiBase.openAI(DeepSeekAI.baseUrl, roleCharacter, modelContent, context, message)
  }
}

export default DeepSeekAI

import AiBase from '@/ai/base.js'

class XunFeiAI {
  static baseUrl = 'https://spark-api-open.xf-yun.com/v1/chat/completions'

  static async getResponseContent(roleCharacter, modelContent, context, message) {
    return await AiBase.openAI(XunFeiAI.baseUrl, roleCharacter, modelContent, context, message)
  }
}

export default XunFeiAI

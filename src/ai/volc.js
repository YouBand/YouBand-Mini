import AiBase from '@/ai/base.js'

class VolcAI {
  static baseUrl = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions'

  static async getResponseContent(roleCharacter, modelContent, context, message) {
    return await AiBase.openAI(VolcAI.baseUrl, roleCharacter, modelContent, context, message)
  }
}

export default VolcAI

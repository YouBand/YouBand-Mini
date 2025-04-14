import AiBase from '@/ai/base.js'

class SiliconFlowAI {
  static baseUrl = 'https://api.siliconflow.cn/v1/chat/completions'

  static async getResponseContent(roleCharacter, modelContent, context, message) {
    return await AiBase.openAI(SiliconFlowAI.baseUrl, roleCharacter, modelContent, context, message)
  }
}

export default SiliconFlowAI

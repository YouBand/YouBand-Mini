import AiBase from '@/ai/base.js'

class QwenAI {
  static baseUrl = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'

  static async getResponseContent(roleCharacter, modelContent, context, message) {
    return await AiBase.openAI(QwenAI.baseUrl, roleCharacter, modelContent, context, message)
  }
}

export default QwenAI

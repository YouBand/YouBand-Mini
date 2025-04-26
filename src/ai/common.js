import AiBase from '@/ai/base.js'

class CommonAI {
  static async getResponseContent(roleCharacter, modelContent, context, message) {
    return await AiBase.openAI(modelContent['url'], roleCharacter, modelContent, context, message)
  }
}

export default CommonAI

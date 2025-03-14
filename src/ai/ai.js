import DeepSeekAI from '@/ai/deepseek.js'

class AI {
  static ais = {
    deepseek: DeepSeekAI
  }

  static async getResponseContent(roleCharacter, modelContent, context, message) {
    const ai = AI.ais[modelContent.type]
    if (ai) {
      return await AI.ais[modelContent.type].getResponseContent(roleCharacter, modelContent, context, message)
    } else {
      return 'ta好像迷路了，请稍后重试吧'
    }
  }
}

export default AI

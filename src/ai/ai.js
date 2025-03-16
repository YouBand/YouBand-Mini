import DeepSeekAI from '@/ai/deepseek.js'
import OllamakAI from '@/ai/ollama.js'
import QwenAI from '@/ai/qwen.js'

class AI {
  static ais = {
    deepseek: DeepSeekAI,
    ollama: OllamakAI,
    qwen: QwenAI
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

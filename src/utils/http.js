import { fetch } from '@tauri-apps/plugin-http'

const HttpUtil = {
  async send(configs) {
    try {
      const response = await fetch(configs.url, {
        connectTimeout: 120 * 1000,
        method: configs.method,
        body: JSON.stringify(configs.data),
        headers: {
          ...configs.headers,
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8'
        }
      })
      if (!response.ok) {
        throw new Error(`Request failed with status code ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error('JSON 解析失败: ' + error.message)
      } else if (error.message?.startsWith('Request failed')) {
        throw error
      } else {
        throw new Error(`网络请求异常: ${error.message}`)
      }
    }
  }
}

export default HttpUtil

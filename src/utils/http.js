import { fetch } from '@tauri-apps/plugin-http'

const HttpUtil = {
  async send(configs) {
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
      const errorBody = await response.text()
      let errorMessage = `Request failed with status ${response.status} ${response.statusText}`
      try {
        const jsonError = JSON.parse(errorBody)
        errorMessage += `,Response Body: ${JSON.stringify(jsonError)}`
      } catch {
        errorMessage += `,Response Body: ${errorBody}`
      }
      throw new Error(errorMessage)
    }
    return await response.json()
  }
}

export default HttpUtil

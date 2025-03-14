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
      throw new Error(`Request failed with status code ${response.status}`)
    }
    return await response.json()
  }
}

export default HttpUtil

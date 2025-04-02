import { Command } from '@tauri-apps/plugin-shell'

class Stdio {
  onerror = null
  onmessage = null
  process = null
  timer = null

  constructor(transport) {
    this.command = new Command(transport.cmd, [...transport.params], { env: transport.env })
  }

  async start() {
    await this.command.stderr.on('data', (line) => {
      this.onerror?.(line)
    })
    await this.command.stderr.on('error', (line) => {
      this.onerror?.(line)
    })
    await this.command.stdout.on('data', (line) => {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.onmessage?.(line)
    })
    await this.command.stdout.on('error', (err) => {
      this.onerror?.(err)
    })
    await this.command
      .spawn()
      .then((res) => {
        this.process = res
      })
      .catch((e) => {
        throw new Error(`stdio sever启动失败：${e}`)
      })
  }

  async request(request) {
    this.timer = setTimeout(() => {
      this.onmessage?.('')
    }, 10000)
    await this.process.write(JSON.stringify(request) + '\n\n')
  }

  static instance(transport) {
    return new Stdio(transport)
  }

  async close() {
    if (this.process) this.process.kill()
  }
}

export default Stdio

const McpType = {
  Sse: 'sse',
  Stdio: 'stdio',
  valueMap(status) {
    if (!status || status === McpType.Sse) {
      return 'SSE'
    } else if (status === McpType.Stdio) {
      return 'Stdio'
    } else {
      return status
    }
  }
}

export default McpType

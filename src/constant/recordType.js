const RecordType = {
  Receive: 'receive',
  Reply: 'reply',
  Info: 'info',
  Error: 'error',
  warn: 'warn',
  valueMap(type) {
    switch (type) {
      case RecordType.Reply:
        return '回复'
      case RecordType.Receive:
        return '接收'
      case RecordType.warn:
        return '警告'
      case RecordType.Error:
        return '错误'
      case RecordType.Info:
        return '信息'
      default:
        return type
    }
  }
}

export default RecordType

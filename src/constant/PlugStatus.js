const PlugStatus = {
  Active: 'active',
  NoActive: 'noactive',
  valueMap(status) {
    if (!status || status === PlugStatus.Active) {
      return '已开启'
    } else if (status === PlugStatus.NoActive) {
      return '未开启'
    } else {
      return status
    }
  }
}

export default PlugStatus

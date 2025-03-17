const RobotStatus = {
  Running: 'running',
  NoRun: 'norun',
  Error: 'error',
  valueMap(status) {
    if (!status || status === RobotStatus.NoRun) {
      return '未启动'
    } else if (status === RobotStatus.Running) {
      return '运行中'
    } else if (status === RobotStatus.Error) {
      return '错误'
    } else {
      return status
    }
  }
}

export default RobotStatus

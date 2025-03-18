import RobotDB from '@/db/robot.js'

const RobotApi = {
  create(param) {
    return RobotDB.create(param)
  },
  list() {
    return RobotDB.list()
  },
  delete(param) {
    return RobotDB.delete(param)
  },
  update(param) {
    return RobotDB.update(param)
  }
}
export default RobotApi

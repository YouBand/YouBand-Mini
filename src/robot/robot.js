import NapCatRobot from '@/robot/napcat.js'
import GewechatRobot from '@/robot/gewechat.js'

class Robot {
  static robots = {
    napcat: NapCatRobot,
    gewechat: GewechatRobot
  }

  static async connect(item, modal) {
    const robot = Robot.robots[item.type]
    if (robot) {
      return robot.connect(item, modal)
    }
  }

  static async closeConnect(item) {
    const robot = Robot.robots[item.type]
    if (robot) {
      return robot.closeConnect(item)
    }
  }
}

export default Robot

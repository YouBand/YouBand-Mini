import NapCatRobot from '@/robot/napcat.js'

class Robot {
  static robots = {
    napcat: NapCatRobot
  }

  static async content(item) {
    const robot = Robot.robots[item.type]
    if (robot) {
      return robot.content(item)
    }
  }

  static async closeContent(item) {
    const robot = Robot.robots[item.type]
    if (robot) {
      return robot.closeContent(item)
    }
  }
}

export default Robot

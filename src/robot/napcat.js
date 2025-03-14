import WsUtil from '@/utils/ws.js'
import AI from '@/ai/ai.js'
import { useRobotStore } from '@/stores/useRobotStore.js'
import RobotStatus from '@/constant/robotStatus.js'

const robotStore = useRobotStore()

class NapCatRobot {
  static connects = new Map()

  static async content(param) {
    if (NapCatRobot.connects.get(param.id)) {
      return
    }
    console.log(`${param.name},建立NapCat连接`)
    let connectInfo = {}
    //获取机器人信息
    connectInfo.robotContent = JSON.parse(param.robotContent)
    //获取角色提示词
    connectInfo.roleCharacter = param.roleCharacter
    //获取模型信息
    connectInfo.modelContent = JSON.parse(param.modelContent)
    //建立ws连接
    WsUtil.connect(
      connectInfo.robotContent.webSocket,
      (msg) => {
        if (typeof msg === 'string') {
          NapCatRobot.closeContent(param)
          return
        }
        if (msg.type !== 'Close') {
          NapCatRobot.reply(param.id, JSON.parse(msg.data))
        }
      },
      () => {
        NapCatRobot.connects.delete(param.id)
        robotStore.setRobotStatus(param.id, RobotStatus.Error)
      }
    ).then((ws) => {
      connectInfo.ws = ws
      NapCatRobot.connects.set(param.id, connectInfo)
      robotStore.setRobotStatus(param.id, RobotStatus.Running)
    })
  }

  static async closeContent(param) {
    const connectInfo = NapCatRobot.connects.get(param.id)
    if (connectInfo) connectInfo.ws.disconnect()
    console.log(`${param.name},NapCat连接已关闭`)
    NapCatRobot.connects.delete(param.id)
    robotStore.setRobotStatus(param.id, RobotStatus.NoRun)
  }

  static async reply(key, data) {
    if (data['message'] && !data['message_sent_type']) {
      const msgs = data['message']
      //获取文本消息
      let textMsg = ''
      let isAt = false
      for (let i = 0; i < msgs.length; i++) {
        if (msgs[i].type === 'text') {
          textMsg = textMsg + msgs[i].data.text + ','
        }
        if (msgs[i].type === 'at' && Number(msgs[i].data.qq) === data['self_id']) {
          isAt = true
        }
      }
      const connectInfo = NapCatRobot.connects.get(key)
      if (connectInfo.ws && textMsg) {
        let replyRequest = null
        switch (data['message_type']) {
          case 'private':
            let replyMsg = await AI.getResponseContent(connectInfo.roleCharacter, connectInfo.modelContent, [], textMsg)
            replyRequest = NapCatRobot.buildPrivateMsg(data, replyMsg)
            break
          case 'group':
            if (isAt) {
              let replyMsg = await AI.getResponseContent(
                connectInfo.roleCharacter,
                connectInfo.modelContent,
                [],
                textMsg
              )
              replyRequest = NapCatRobot.buildGroupMsg(data, replyMsg)
            }
            break
        }
        if (replyRequest) {
          connectInfo.ws.send(JSON.stringify(replyRequest))
        }
      }
    }
  }

  static buildPrivateMsg(data, replyMsg) {
    return NapCatRobot.buildRequest('send_private_msg', {
      user_id: data['user_id'],
      message: [
        {
          type: 'text',
          data: { text: replyMsg }
        }
      ]
    })
  }

  static buildGroupMsg(data, replyMsg) {
    //生成回复的消息内容
    return NapCatRobot.buildRequest('send_group_msg', {
      group_id: data['group_id'],
      message: [
        {
          type: 'reply',
          data: { id: data['message_id'] }
        },
        {
          type: 'text',
          data: { text: replyMsg }
        }
      ]
    })
  }

  static buildRequest(action, params) {
    return {
      action: action,
      params: params
    }
  }
}

export default NapCatRobot

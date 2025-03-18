import WsUtil from '@/utils/ws.js'
import AI from '@/ai/ai.js'
import { useRobotStore } from '@/stores/useRobotStore.js'
import RobotStatus from '@/constant/robotStatus.js'
import RecordType from '@/constant/recordType.js'
import RecordApi from '@/api/record.js'

const robotStore = useRobotStore()

class NapCatRobot {
  static connects = new Map()

  static async content(param) {
    if (NapCatRobot.connects.get(param.id)) {
      return
    }
    console.log(`${param.name}，建立NapCat连接`)
    NapCatRobot.crateRecord(param.id, RecordType.Info, `${param.name}，建立NapCat连接`)
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
          NapCatRobot.crateRecord(param.id, RecordType.Error, msg)
          NapCatRobot.closeContent(param)
          return
        }
        if (msg.type !== 'Close') {
          NapCatRobot.reply(param.id, JSON.parse(msg.data))
        }
      },
      (e) => {
        NapCatRobot.closeContent(param)
        robotStore.setRobotStatus(param.id, RobotStatus.Error)
        NapCatRobot.crateRecord(param.id, RecordType.Error, e)
      }
    ).then((ws) => {
      connectInfo.ws = ws
      NapCatRobot.connects.set(param.id, connectInfo)
      robotStore.setRobotStatus(param.id, RobotStatus.Running)
    })
  }

  static async closeContent(param) {
    const connectInfo = NapCatRobot.connects.get(param.id)
    if (connectInfo) {
      connectInfo.ws.disconnect()
      console.log(`${param.name},NapCat连接已关闭`)
      NapCatRobot.crateRecord(param.id, RecordType.Info, `${param.name}，NapCat连接已关闭`)
    }
    NapCatRobot.connects.delete(param.id)
    robotStore.setRobotStatus(param.id, RobotStatus.NoRun)
  }

  static crateRecord(produceId, type, recordContent, targetInfo, targetKey) {
    RecordApi.create({ produceId, type, recordContent, targetInfo, targetKey }).then()
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
      //获取对应的ws连接
      const connectInfo = NapCatRobot.connects.get(key)
      if (connectInfo.ws && textMsg) {
        let replyRequest = null
        switch (data['message_type']) {
          case 'private':
            const targetInfo = [
              {
                key: 'QQ',
                value: data.sender['user_id']
              },
              {
                key: '名字',
                value: data.sender['nickname']
              }
            ]
            //记录接收
            NapCatRobot.crateRecord(key, RecordType.Receive, data['raw_message'], targetInfo, data['user_id'])
            let replyMsg = await AI.getResponseContent(connectInfo.roleCharacter, connectInfo.modelContent, textMsg, {
              produceId: key,
              targetKey: data['user_id']
            })
            replyRequest = NapCatRobot.buildPrivateMsg(data, replyMsg)
            //记录返回
            NapCatRobot.crateRecord(key, RecordType.Reply, replyMsg, targetInfo, data['user_id'])
            break
          case 'group':
            if (isAt) {
              let replyMsg = await AI.getResponseContent(connectInfo.roleCharacter, connectInfo.modelContent, textMsg, {
                produceId: key,
                targetKey: data['group_id']
              })
              const targetInfo = [
                {
                  key: 'QQ群',
                  value: data['group_id']
                },
                {
                  key: 'QQ',
                  value: data.sender['user_id']
                },
                {
                  key: '名字',
                  value: data.sender['nickname']
                }
              ]
              //记录接收
              NapCatRobot.crateRecord(key, RecordType.Receive, data['raw_message'], targetInfo, data['group_id'])
              replyRequest = NapCatRobot.buildGroupMsg(data, replyMsg)
              //记录返回
              NapCatRobot.crateRecord(key, RecordType.Reply, replyMsg, targetInfo, data['group_id'])
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

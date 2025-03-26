import GewechatContent from '@/components/GewechatContent.vue'
import { listen } from '@tauri-apps/api/event'
import RobotStatus from '@/constant/robotStatus.js'
import { useRobotStore } from '@/stores/useRobotStore.js'
import RecordApi from '@/api/record.js'
import HttpUtil from '@/utils/http.js'
import RecordType from '@/constant/recordType.js'
import AI from '@/ai/ai.js'

class GewechatRobot {
  static connects = new Map()
  static webListen = null

  //监听web消息（gewechat）
  static async createWebListen() {
    if (GewechatRobot.webListen) return
    GewechatRobot.webListen = await listen('new-api-call', (event) => {
      const data = event.payload
      GewechatRobot.reply(data)
    })
  }

  //关闭监听web消息（gewechat）
  static async closeWebListen() {
    if (!GewechatRobot.webListen) return
    GewechatRobot.webListen()
  }

  static async connect(param, modal) {
    let connectInfo = {}
    //获取机器人信息
    connectInfo.robotContent = JSON.parse(param.robotContent)
    //获取角色提示词
    connectInfo.roleCharacter = param.roleCharacter
    //获取模型信息
    connectInfo.modelContent = JSON.parse(param.modelContent)
    await GewechatRobot.modal(param, modal, connectInfo)
    console.log(`${param.name},建立gewechat连接`)
    GewechatRobot.crateRecord(param.id, RecordType.Info, `${param.name}，建立gewechat连接`)
  }

  static async closeConnect(param) {
    const robotStore = useRobotStore()
    const connectInfo = GewechatRobot.connects.get(param.id)
    if (connectInfo) {
      console.log(`${param.name},Gewechat连接已关闭`)
      GewechatRobot.crateRecord(param.id, RecordType.Info, `${param.name}，Gewechat连接已关闭`)
    }
    GewechatRobot.connects.delete(param.id)
    robotStore.setRobotStatus(param.id, RobotStatus.NoRun)
  }

  static async reply(data) {
    let produceId = data.path
    const connectInfo = GewechatRobot.connects.get(produceId)
    if (!connectInfo) return
    //消息类型
    let msgType = data.params['Data']['MsgType']
    //目前处理文本消息
    if (msgType !== 1) return
    //获取消息内容
    let stringContent = data.params['Data']['Content']['string']
    //发送人
    let fromUserName = data.params['Data']['FromUserName']['string']
    //PushContent
    let pushContent = data.params['Data']['PushContent']

    //消息过滤（过滤@这种内容）
    stringContent = stringContent.replace(/wxid\w+:\s*/g, ' ').replace(/@[^\s]+\s?/g, ' ')
    //是否是群聊
    let isGroup = fromUserName?.includes('@chatroom')
    if (isGroup) {
      //是否at
      let isAt = pushContent?.includes('@了你')
      if (!isAt) return
    }
    GewechatRobot.crateRecord(produceId, RecordType.Receive, stringContent, null, fromUserName)
    let replyMsg = await AI.getResponseContent(connectInfo.roleCharacter, connectInfo.modelContent, stringContent, {
      produceId: produceId,
      targetKey: fromUserName
    })
    GewechatRobot.sendMsg(connectInfo.robotContent, produceId, fromUserName, replyMsg)
  }

  static crateRecord(produceId, type, recordContent, targetInfo, targetKey) {
    RecordApi.create({ produceId, type, recordContent, targetInfo, targetKey }).then()
  }

  static sendMsg(info, produceId, toWxid, content) {
    return HttpUtil.send({
      url: info.url + '/v2/api' + '/message/postText',
      method: 'POST',
      data: {
        appId: info.appId,
        toWxid: toWxid,
        content: content
      },
      headers: {
        'X-GEWE-TOKEN': info.token
      }
    })
      .then((res) => {
        if (res.ret === 200) {
          GewechatRobot.crateRecord(produceId, RecordType.Reply, content, null, toWxid)
        } else {
          GewechatRobot.crateRecord(produceId, RecordType.Error, res)
        }
      })
      .catch((e) => {
        GewechatRobot.crateRecord(produceId, RecordType.Error, e)
      })
  }

  static modal(param, modal, connectInfo) {
    const robotStore = useRobotStore()
    const m = modal.create({
      preset: 'card',
      closeOnEsc: false,
      maskClosable: false,
      style: {
        width: '300px'
      },
      content: () =>
        h(GewechatContent, {
          info: connectInfo.robotContent,
          produceId: param.id,
          onLogin: (info) => {
            m.destroy()
            connectInfo.robotContent = info
            GewechatRobot.connects.set(param.id, connectInfo)
            robotStore.setRobotStatus(param.id, RobotStatus.Running)
          },
          onLogout: () => {
            m.destroy()
            GewechatRobot.connects.delete(param.id)
            robotStore.setRobotStatus(param.id, RobotStatus.NoRun)
          }
        })
    })
  }
}

export default GewechatRobot

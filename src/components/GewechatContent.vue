<template>
  <div class="gewechat-container">
    <div class="text-[20px]">{{ isScan ? '扫码成功，请点击确认' : '扫码登录微信' }}</div>
    <div class="flex">
      <n-qr-code style="box-sizing: content-box" v-if="qr" :size="120" :value="qr" type="svg" />
    </div>
    <div v-if="isQrError" class="mt-[30px] text-[var(--error-color)]">二维码生成错误，请查看记录</div>
    <div v-if="isError" class="mt-[15px] text-[var(--error-color)]">错误，请查看记录</div>
    <div v-if="isLogin" class="mt-[30px]">
      您已登录
      <n-a @click="handlerLogout">点击退出登录</n-a>
      即将关闭窗口
    </div>
  </div>
</template>
<script setup>
import HttpUtil from '@/utils/http.js'
import RecordApi from '@/api/record.js'
import RecordType from '@/constant/recordType.js'
import RobotApi from '@/api/robot.js'
import { useSettingStore } from '@/stores/useSettingStore.js'

const props = defineProps({
  produceId: String,
  info: Object
})

const emit = defineEmits(['login', 'logout'])

const settingStore = useSettingStore()
const localInfo = reactive({ ...props.info })
const qr = ref('')
const token = ref('')
const uuid = ref('')
const isScan = ref(false)
let timer = null
const isQrError = ref(false)
const isLogin = ref(false)
const isError = ref(false)

const handlerCreateErrorRecord = (content) => {
  isError.value = true
  RecordApi.create({ produceId: props.produceId, type: RecordType.Error, recordContent: content }).then()
}

//获取token
const handlerGetGewechatToken = () => {
  return HttpUtil.send({
    url: props.info.url + '/v2/api' + '/tools/getTokenId',
    method: 'POST'
  })
    .then((res) => {
      if (res.ret === 200) {
        token.value = res.data
        localInfo.token = token.value
        RobotApi.updateRobotContent({ robotContent: localInfo, id: props.produceId })
      } else {
        handlerCreateErrorRecord(res)
      }
    })
    .catch((e) => {
      handlerCreateErrorRecord(e)
    })
}

//获取二维码
const handlerGetLoginQrCode = () => {
  const appId = localInfo.appId ?? ''
  return HttpUtil.send({
    url: props.info.url + '/v2/api' + '/login/getLoginQrCode',
    method: 'POST',
    data: { appId: appId },
    headers: {
      'X-GEWE-TOKEN': token.value
    }
  })
    .then((res) => {
      if (res.ret === 200) {
        //更新appid
        if (res.data.appId !== appId) {
          localInfo.appId = res.data.appId
          RobotApi.updateRobotContent({ robotContent: localInfo, id: props.produceId })
        }
        qr.value = res.data.qrData
        uuid.value = res.data.uuid
        // 获取扫描结果
        timer = setInterval(() => {
          handlerCheckLogin()
        }, 5000)
      } else {
        isQrError.value = true
        handlerCreateErrorRecord(res)
      }
    })
    .catch((e) => {
      isQrError.value = true
      handlerCreateErrorRecord(e)
    })
}

//检查是否在线
const handlerCheckOnline = async () => {
  if (!localInfo.appId) return false
  return HttpUtil.send({
    url: props.info.url + '/v2/api' + '/login/checkOnline',
    method: 'POST',
    data: { appId: localInfo.appId },
    headers: {
      'X-GEWE-TOKEN': token.value
    }
  })
    .then((res) => {
      if (res.ret === 200) {
        return res.data
      } else {
        handlerCreateErrorRecord(res)
        return false
      }
    })
    .catch((e) => {
      handlerCreateErrorRecord(e)
      return false
    })
}

//检查是否登录
const handlerCheckLogin = async () => {
  return HttpUtil.send({
    url: props.info.url + '/v2/api' + '/login/checkLogin',
    method: 'POST',
    data: { appId: localInfo.appId, uuid: uuid.value },
    headers: {
      'X-GEWE-TOKEN': token.value
    }
  })
    .then((res) => {
      if (res.ret === 200) {
        if (res.data.status === 2) {
          if (timer) {
            clearInterval(timer)
          }
          //登录成功
          emit('login', localInfo)
        } else if (res.data.status === 1) {
          isScan.value = true
        }
      } else {
        handlerCreateErrorRecord(res)
      }
    })
    .catch((e) => {
      handlerCreateErrorRecord(e)
    })
}

//退出登录
const handlerLogout = () => {
  return HttpUtil.send({
    url: props.info.url + '/v2/api' + '/login/logout',
    method: 'POST',
    data: { appId: localInfo.appId },
    headers: {
      'X-GEWE-TOKEN': token.value
    }
  })
    .then((res) => {
      if (res.ret === 200) {
        emit('logout')
      } else {
        handlerCreateErrorRecord(res)
      }
    })
    .catch((e) => {
      handlerCreateErrorRecord(e)
    })
}

//设置回调地址
const handlerSetCallback = () => {
  return HttpUtil.send({
    url: props.info.url + '/v2/api' + '/tools/setCallback',
    method: 'POST',
    data: {
      token: token.value,
      callbackUrl: `${settingStore.general.callbackIp}:${settingStore.general.callbackPort}/${props.produceId}`
    },
    headers: {
      'X-GEWE-TOKEN': token.value
    }
  })
    .then((res) => {
      if (res.ret !== 200) {
        handlerCreateErrorRecord(res)
      }
    })
    .catch((e) => {
      handlerCreateErrorRecord(e)
    })
}

onMounted(async () => {
  if (!props.info?.url) {
    handlerCreateErrorRecord('gewechat连接地址为空')
    return
  }
  await handlerGetGewechatToken()
  handlerSetCallback()
  if (!localInfo.appId) {
    isLogin.value = false
  } else {
    isLogin.value = await handlerCheckOnline()
  }
  if (!isLogin.value) {
    // 获取二维码
    handlerGetLoginQrCode()
  } else {
    timer = setTimeout(() => {
      emit('login', localInfo)
    }, 1500)
  }
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>
<style scoped lang="scss">
.gewechat-container {
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--primary-text-color);
}
</style>

<template>
  <div class="chat">
    <div class="chat-wrapper">
      <div class="chat-list px-[10px]">
        <div class="h-[60px] flex items-center">
          <n-button type="primary" size="large" class="w-full">
            <template #icon>
              <Icon icon="tabler:plus"></Icon>
            </template>
            新建聊天
          </n-button>
        </div>
        <div>
          <div class="chat-list__card">
            <div class="chat-list__card--name">认识机器人</div>
            <div class="chat-list__card--msg truncate overflow-hidden">
              12222222222222222222222222222222222222222222222222222312312312
            </div>
          </div>
        </div>
      </div>
      <div class="chat-content">
        <div class="chat-content__title">认识机器人</div>
        <div class="chat-content__area">
          <message message="sssss" />
          <message :right="true" message="111111111111111111" />
          <message
            message="122222222222222222222222222222222222222222222222222223123123122222222222222222222222222222222222222222222" />
          <message :right="true" message="111111111111111111" />
          <message
            message="122222222222222222222222222222222222222222222222222223123123122222222222222222222222222222222222222222222" />
          <message :right="true" message="111111111111111111" />
          <message
            message="122222222222222222222222222222222222222222222222222223123123122222222222222222222222222222222222222222222" />
          <message :right="true" message="111111111111111111" />
          <message
            message="122222222222222222222222222222222222222222222222222223123123122222222222222222222222222222222222222222222" />
          <message :right="true" message="111111111111111111" />
        </div>
        <div class="chat-content__input">
          <n-input :resizable="false" class="flex-1" type="textarea" placeholder="请输入消息~"></n-input>
          <div class="flex w-full justify-end">
            <n-button type="primary" class="w-[100px]">
              <template #icon>
                <Icon icon="solar:plain-3-bold"></Icon>
              </template>
              发送
            </n-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { Icon } from '@iconify/vue'
import Message from '@/components/msg/Message.vue'
</script>
<style scoped lang="scss">
.chat {
  height: 100%;
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-x: hidden;
  padding: 10px 20px;

  .chat-wrapper {
    height: 100%;
    background-color: var(--nav-bg);
    border-radius: 8px;
    display: flex;

    .chat-list {
      height: 100%;
      border-right: 1px var(--card-bg) solid;
      max-width: 260px;

      .chat-list__card {
        height: 60px;
        background-color: var(--card-bg);
        padding: 10px;
        border-radius: 8px;
        cursor: pointer;

        .chat-list__card--name {
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 5px;
        }

        .chat-list__card--msg {
          font-size: 12px;
          color: var(--minor-text-color);
        }
      }
    }

    .chat-content {
      display: flex;
      flex-direction: column;

      .chat-content__title {
        height: 60px;
        border-bottom: 1px var(--card-bg) solid;
        display: flex;
        align-items: center;
        font-size: 18px;
        padding: 0 10px;
        font-weight: 500;
      }

      .chat-content__input {
        height: 200px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .chat-content__area {
        flex: 1;
        border-bottom: 1px var(--card-bg) solid;
        padding: 20px 10px;
        overflow-y: scroll;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
    }
  }
}
</style>

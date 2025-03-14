<template>
  <div class="role-container">
    <div class="flex justify-between items-center">
      <div class="role-title__h1">角色档案室</div>
      <n-button type="primary" size="large" @click="handlerAddRole">
        <template #icon>
          <Icon icon="tabler:plus" />
        </template>
        添加角色
      </n-button>
    </div>
    <!--角色列表-->
    <div class="role-list">
      <div v-for="item in roleData" class="role-card">
        <div class="role-card__avatar">
          <div
            class="w-[50px] h-[50px] text-[40px] rounded-full text-[--minor-text-color] flex justify-center items-center">
            <Icon icon="solar:user-broken" />
          </div>
        </div>
        <div class="role-car__content">
          <div class="flex flex-col flex-1 gap-[5px]">
            <div class="role-car__content--name line-clamp-1">{{ item.name }}</div>
            <div class="role-car__content--character">{{ item.character }}</div>
          </div>
          <div class="flex gap-[5px] text-[var(--minor-text-color)] justify-end mt-[10px]">
            <icon-hover-button
              type="theme"
              style="width: 28px; height: 28px; font-size: 18px"
              @click="() => handlerShowDetails(item)">
              <Icon icon="solar:eye-line-duotone" />
            </icon-hover-button>
            <icon-hover-button
              @click="() => handlerEditRole(item)"
              type="theme"
              style="width: 28px; height: 28px; font-size: 16px">
              <Icon icon="solar:pen-new-square-line-duotone" />
            </icon-hover-button>
            <icon-hover-button
              @click="() => onDeleteRole(item)"
              type="theme-error"
              style="width: 28px; height: 28px; font-size: 18px">
              <Icon icon="solar:trash-bin-minimalistic-line-duotone" />
            </icon-hover-button>
          </div>
        </div>
      </div>
    </div>
    <!--添加角色弹窗-->
    <n-modal v-model:show="showAddModal" :mask-closable="false" :on-esc="false">
      <n-card
        style="width: 600px"
        :title="isEditRole ? '编辑角色' : '添加角色'"
        :bordered="false"
        footer-class="flex justify-end gap-[10px]">
        <n-form ref="roleForm" :model="roleInfo" :rules="roleFormRules">
          <n-form-item path="name" label="角色名称">
            <n-input v-model:value="roleInfo.name" maxlength="16" show-count @keydown.enter.prevent placeholder="" />
          </n-form-item>
          <n-form-item path="age" label="年龄">
            <n-input v-model:value="roleInfo.age" @keydown.enter.prevent placeholder="" />
          </n-form-item>
          <n-form-item path="character" label="角色设定">
            <n-input
              v-model:value="roleInfo.character"
              placeholder="使用 # 标题 来添加新的属性，例如：&#10;# 任务&#10;这里是任务描述内容&#10;&#10;# 性格&#10;这里是性格描述内容"
              type="textarea"
              :autosize="{
                minRows: 7,
                maxRows: 7
              }" />
          </n-form-item>
        </n-form>
        <template #header-extra>
          <icon-hover-button type="error" @click="showAddModal = false">
            <Icon icon="carbon:close" />
          </icon-hover-button>
        </template>
        <template #footer>
          <n-button size="small" class="w-[60px]" @click="showAddModal = false">取消</n-button>
          <n-button size="small" class="w-[60px]" type="primary" @click="onCrateRole">保存</n-button>
        </template>
      </n-card>
    </n-modal>
    <!--角色预览-->
    <n-modal v-model:show="showDetailsModal" to=".role-container">
      <n-card class="role-details-card" title="角色预览" :bordered="false" footer-class="flex justify-end gap-[10px]">
        <div class="role-details">
          <div class="flex gap-[20px]">
            <div class="role-details-avatar">
              <div
                class="w-[50px] h-[50px] text-[40px] rounded-full text-[--minor-text-color] flex justify-center items-center">
                <Icon icon="solar:user-broken" />
              </div>
            </div>
            <div class="flex flex-col gap-[5px]">
              <div class="text-[22px] text-[var(--primary-text-color)]">{{ detailsRoleModal.name }}</div>
              <div>
                <n-tag size="small" type="primary">年龄：{{ detailsRoleModal.age }}</n-tag>
              </div>
            </div>
          </div>
          <div
            v-for="attr in parseCharacterContent(detailsRoleModal.character)"
            :key="attr.key"
            class="role-character-card">
            <div class="role-character-key">
              <div class="w-[8px] h-[8px] rounded-full bg-[rgba(var(--primary-color))]"></div>
              {{ attr.key }}
            </div>
            <div class="role-character-value">
              <div class="whitespace-pre-wrap">{{ attr.value }}</div>
            </div>
          </div>
        </div>
        <template #header-extra>
          <icon-hover-button type="error" @click="showDetailsModal = false">
            <Icon icon="carbon:close" />
          </icon-hover-button>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>
<script setup>
import { Icon } from '@iconify/vue'
import IconHoverButton from '@/components/IconHoverButton.vue'
import { onMounted } from 'vue'
import RoleApi from '@/api/role.js'
import { useDialog } from 'naive-ui'

const roleData = ref([])
const showAddModal = ref(false)
const roleForm = ref()
const roleInfo = ref({ name: '', avatar: '', aga: '', character: '' })
const showDetailsModal = ref(false)
const detailsRoleModal = ref()
const dialog = useDialog()
const isEditRole = ref(false)

const roleFormRules = {
  name: [
    {
      required: true,
      message: '请输入角色名称',
      trigger: ['input', 'blur']
    }
  ],
  age: [
    {
      required: true,
      validator(rule, value) {
        if (!value) {
          return new Error('请输入角色年龄')
        } else if (!/^\d*$/.test(value)) {
          return new Error('年龄应该为整数')
        }
        return true
      },
      trigger: ['input', 'blur']
    }
  ],
  character: [
    {
      required: true,
      message: '请输入角色设定',
      trigger: ['input', 'blur']
    }
  ]
}

const handlerEditRole = (item) => {
  roleInfo.value = { ...item }
  isEditRole.value = true
  showAddModal.value = true
}

const handlerAddRole = () => {
  roleInfo.value = {}
  isEditRole.value = false
  showAddModal.value = true
}

const parseCharacterContent = (content) => {
  if (!content) return []
  const sections = content.split('\n# ').filter(Boolean)
  return sections.map((section) => {
    const [title, ...contentLines] = section.split('\n')
    return {
      key: title.trim().replace(/^# /, ''),
      value: contentLines.join('\n').trim()
    }
  })
}

const handlerShowDetails = (item) => {
  detailsRoleModal.value = item
  showDetailsModal.value = true
}

const onListRole = () => {
  RoleApi.list().then((res) => {
    if (res.code === 0) {
      roleData.value = res.data
    }
  })
}

const onCrateRole = () => {
  roleForm.value?.validate((errors) => {
    if (!errors) {
      if (isEditRole.value) {
        RoleApi.update(roleInfo.value).then((res) => {
          if (res.code === 0) {
            onListRole()
            showAddModal.value = false
          }
        })
      } else {
        RoleApi.create(roleInfo.value).then((res) => {
          if (res.code === 0) {
            onListRole()
            showAddModal.value = false
          }
        })
      }
    }
  })
}

const onDeleteRole = (item) => {
  dialog.error({
    title: '确认删除',
    content: `确定要删除角色 "${item.name}" 吗？此操作无法撤销。`,
    positiveText: '确定',
    negativeText: '取消',
    draggable: false,
    showIcon: false,
    onPositiveClick: () => {
      RoleApi.delete({ id: item.id }).then((res) => {
        if (res.code === 0) {
          onListRole()
        }
      })
    }
  })
}

onMounted(async () => {
  onListRole()
})
</script>
<style scoped lang="scss">
.role-container {
  height: 100%;
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-x: hidden;
  padding: 10px 20px;

  .role-title__h1 {
    font-size: 26px;
    font-weight: 500;
    letter-spacing: 1px;
    user-select: none;
  }

  .role-details-card {
    width: 600px;
    overflow-y: scroll;
    height: 90vh;

    .role-details {
      display: flex;
      flex-direction: column;
      gap: 20px;

      .role-details-avatar {
        width: 140px;
        height: 140px;
        border-radius: 8px;
        background-color: var(--card-bg);
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .role-character-card {
        padding: 20px;
        background-color: var(--card-bg);
        border-radius: 8px;

        .role-character-key {
          color: var(--primary-text-color);
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .role-character-value {
          color: var(--minor-text-color);
        }
      }
    }
  }

  .role-list {
    @apply grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-[20px];
    padding: 20px;
    background-color: var(--nav-bg);
    border-radius: 8px;

    .role-card {
      background-color: var(--card-bg);
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      overflow: hidden;

      .role-card__avatar {
        height: 120px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .role-car__content {
        background-color: var(--minor-card-bg);
        padding: 10px;
        flex: 1;
        display: flex;
        flex-direction: column;

        .role-car__content--character {
          @apply line-clamp-2;
          color: var(--minor-text-color);
          font-size: 12px;
        }
      }
    }
  }
}
</style>

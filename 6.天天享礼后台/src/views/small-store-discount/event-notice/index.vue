<template>
  <CommonPage show-footer title="消息模板">
    <n-form
      ref="formContRef"
      mr-100
      :model="contModel"
      label-placement="left"
      label-width="140px"
      require-mark-placement="right-hanging"
    >
      <div flex>
        <block>
          <n-form-item label="消息模板ID" w-800>
            <n-input v-model:value="contModel.temp_id" :allow-input="noSideSpace" clearable />
          </n-form-item>
          <n-form-item label="标题" w-800>
            <n-input v-model:value="contModel.title" :allow-input="noSideSpace" maxlength="20" clearable />
          </n-form-item>
          <n-form-item label="内容" w-800>
            <n-input v-model:value="contModel.content" :allow-input="noSideSpace" maxlength="20" clearable />
          </n-form-item>
          <n-form-item label="小程序页面路径" w-800>
            <n-input v-model:value="contModel.path" :allow-input="noSideSpace" clearable />
          </n-form-item>
          <n-form-item label="启用状态" w-400>
            <n-switch v-model:value="contModel.status" />
          </n-form-item>
        </block>
        <n-button ml-30 size="large" :loading="loadingSend" @click="sendHandle">
          <template #icon>
            <n-icon>
              <icon-charm:forward />
            </n-icon>
          </template>
          发送 {{ power_people }}人
        </n-button>
      </div>

      <div flex justify-center w-800>
        <n-button type="primary" @click="saveContHandle">确认并提交</n-button>
      </div>
    </n-form>
  </CommonPage>
</template>

<script setup>
import { useMessage } from 'naive-ui';
import http from './api';
defineOptions({ name: 'eventNotice' })
const contModel = ref({
  title: '',
  temp_id: '',
  content: '',
  path: '',
  status: false,
})

//提示展示
const message = useMessage()
//校验数据
onMounted(() => {
  getList()
})
const power_people = ref()
function getList() {
  http.getInfo().then((res) => {
    if (res.code != 1 || !res.data) return
    contModel.value = res.data
    power_people.value = res.data.power_people
    contModel.value.status = Boolean(contModel.value?.status)
  })
}
function noSideSpace(value) {
  return !value.startsWith(' ') && !value.endsWith(' ')
}
function saveContHandle() {
  http
    .create({
      ...contModel.value,
      status: Number(contModel.value.status),
    })
    .then((res) => {
      if (res.code == 1) {
        message.success(res.msg)
        // refresh()
      } else {
        message.error(res.msg)
      }
    })
}
const loadingSend = ref(false)
function sendHandle() {
  loadingSend.value = true
  http.sendMes().then((res) => {
    loadingSend.value = false
    if (res.code == 1) {
      message.success(res.msg)
      // refresh()
    } else {
      //   message.error(res.msg)
    }
  })
}
</script>

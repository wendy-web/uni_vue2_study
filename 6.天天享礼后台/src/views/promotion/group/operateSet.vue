<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    preset="dialog"
    :title="model.id ? '设置' : '添加'"
    :style="{ width: '800px' }"
    positive-text="确认"
    negative-text="关闭"
    @positive-click="handleValidateButtonClick"
    @negative-click="onNegativeClick"
  >
    <n-form
      ref="formRef"
      :model="model"
      :rules="rules"
      label-placement="left"
      label-width="130px"
      require-mark-placement="right-hanging"
      :style="{
        maxWidth: '1200px',
      }"
    >
      <n-form-item label="群名称" path="group_name">
        <n-input v-model:value="model.group_name" :disabled="model.id && true" clearable />
      </n-form-item>
      <div class="flex justify-between">
        <n-form-item label="京东推广位ID" path="jd_positionid">
          <n-input v-model:value="model.jd_positionid" :style="{ width: '200px' }" clearable />
        </n-form-item>
        <n-form-item label="拼多多推广位ID" path="pdd_positionid">
          <n-input v-model:value="model.pdd_positionid" :style="{ width: '200px' }" clearable />
        </n-form-item>
      </div>
      <div class="flex mb-10">
        <n-form-item label="商品间隔(s/秒)" path="goods_time">
          <n-input-number v-model:value="model.goods_time" min="10" :style="{ width: '200px' }" clearable />
          <div class="pos_lab">最小值为10s</div>
        </n-form-item>
        <n-form-item label="发送间隔(s/秒)" path="send_time">
          <n-input-number v-model:value="model.send_time" min="10" :style="{ width: '200px' }" clearable />
          <div class="pos_lab">最小值为10s</div>
        </n-form-item>
      </div>

      <div class="flex">
        <n-form-item label="启动时间" path="start_time">
          <n-time-picker v-model:formatted-value="model.start_time" value-format="HH:mm:ss" clearable />
          <div class="ml-10 color-gray" style="font-size: 3rem">(24小时)</div>
        </n-form-item>
        <n-form-item label="停止时间" path="over_time">
          <n-time-picker v-model:formatted-value="model.over_time" value-format="HH:mm:ss" clearable />
          <div class="ml-10 color-gray" style="font-size: 3rem">(24小时)</div>
        </n-form-item>
      </div>
      <n-form-item label="启用状态">
        <n-switch v-model:value="model.status" />
      </n-form-item>
    </n-form>
  </n-modal>
</template>
<script setup>
import { NInputNumber, useMessage } from 'naive-ui';
import { ref } from 'vue';
import http from './api';

/**弹窗显示控制 */
const showModal = ref(false)
/**弹窗取消 */
function onNegativeClick() {}
/**表单 */
const formRef = ref(null)
//提示展示
const message = useMessage()
//表单数据
const model = ref({})

//校验数据
const rules = ref({
  group_name: [
    {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入群名称',
    },
  ],
  send_time: [
    {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入发送间隔',
      validator: function (rule, value) {
        return Boolean(value)
      },
    },
  ],
  goods_time: [
    {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入商品间隔',
      validator: function (rule, value) {
        return Boolean(value)
      },
    },
  ],
  start_time: {
    required: true,
    message: '请选择开始时间',
  },
  over_time: {
    required: true,
    message: '请选择结束时间',
  },
})

/**表单验证 */
function handleValidateButtonClick() {
  console.log(formRef)
  formRef.value?.validate(async (errors) => {
    if (errors) return
    /**还原数据 */
    const res = await http.groupCreate({
      ...model.value,
      status: Number(model.value.status),
    })
    if (res.code == 1) {
      message.success(res.msg)
      emit('refresh')
      showModal.value = false
    } else {
      message.error(res.msg)
    }
  })

  return false
}
async function show(id) {
  model.value = {}
  if (id) {
    model.value.id = id
    const res = await http.groupXq({ id })
    if (!res.code) return
    const { group_name, jd_positionid, over_time, pdd_positionid, send_time, goods_time, start_time, status } = res.data
    model.value = {
      id,
      group_name,
      jd_positionid,
      over_time,
      pdd_positionid,
      send_time,
      start_time,
      status: Boolean(status),
      goods_time,
    }
  }
  showModal.value = true
}

/**暴露给父组件使用 */
defineExpose({
  show,
})
/**回调父组件函数注册 */
const emit = defineEmits(['refresh'])
</script>
<style scoped>
.pos_lab {
  position: absolute;
  top: 100%;
  color: #666;
  font-size: 3rem;
}
</style>

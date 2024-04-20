<template>
  <CommonPage show-footer title="基本配置">
    <n-form
      ref="formRef"
      mr-100
      :rules="rules"
      :model="contModel"
      label-placement="left"
      label-width="202px"
      require-mark-placement="right-hanging"
    >
      <n-form-item label="任务订单数" path="order_num">
        <n-input-number
          v-model:value="contModel.order_num"
          :min="0"
          :max="100"
          :precision="0"
          :style="{ width: '170px' }"
        />
      </n-form-item>
      <n-form-item label="任务订单实付金额" path="order_money">
        <n-input-number v-model:value="contModel.order_money" :min="0" :max="100" :style="{ width: '170px' }" />
      </n-form-item>
      <n-form-item label="商品佣金百分比(%)" path="commission_lv">
        <n-input-number
          v-model:value="contModel.commission_lv"
          :min="0"
          :max="100"
          :precision="0"
          :style="{ width: '170px' }"
        />
      </n-form-item>
      <n-form-item label="活动有效时间（d）" path="active_time">
        <n-input-number v-model:value="contModel.active_time" :min="0" :precision="0" :style="{ width: '170px' }" />
      </n-form-item>
      <n-form-item label="活动间隔时间（d）" path="interval_time">
        <n-input-number v-model:value="contModel.interval_time" :min="0" :precision="0" :style="{ width: '170px' }" />
      </n-form-item>
      <n-form-item label="当前活动状态" path="active_status">
        <n-switch v-model:value="contModel.active_status" />
      </n-form-item>
      <div flex justify-center w-480>
        <n-button type="primary" @click="saveContHandle">确认并提交</n-button>
      </div>
    </n-form>
  </CommonPage>
</template>

<script setup>
import { NButton, useMessage } from 'naive-ui';
import http from './api';
const formRef = ref(null)
onMounted(() => {
  initGetXq()
})
// 表单数据
const contModel = ref({
  order_num: 0,
  order_money: 0,
  commission_lv: 0,
  active_time: 0,
  interval_time: 0,
  active_status: 0,
})
async function initGetXq() {
  const res = await http.getXq()
  if (res.code != 1 || !res.data) return
  contModel.value = res.data
  contModel.value.active_status = Boolean(contModel.value.active_status)
}
//校验数据
const rules = ref({
  order_num: {
    required: true,
    validator: (rule, value) => value > 0,
    trigger: ['blur', 'input'],
    message: '请输入任务订单数',
  },
  order_money: {
    required: true,
    validator: (rule, value) => value > 0,
    trigger: ['blur', 'input'],
    message: '请输入任务订单实付金额',
  },
  commission_lv: {
    required: true,
    validator: (rule, value) => value > 0,
    trigger: ['blur', 'input'],
    message: '请输入商品佣金百分比',
  },
  active_time: {
    required: true,
    validator: (rule, value) => value > 0,
    trigger: ['blur', 'input'],
    message: '请输入活动有效时间',
  },
  interval_time: {
    required: true,
    validator: (rule, value) => value > 0,
    trigger: ['blur', 'input'],
    message: '请输入活动间隔时间',
  },
})
const message = useMessage()
function saveContHandle() {
  formRef.value?.validate(async (errors) => {
    if (errors) return
    // contModel.value.active_status = Number(contModel.value.active_status)
    const res = await http.create({
      ...contModel.value,
      active_status: Number(contModel.value.active_status),
    })
    if (res.code == 1) {
      return message.success(res.msg)
    }
    message.error(res.msg)
  })
}
</script>

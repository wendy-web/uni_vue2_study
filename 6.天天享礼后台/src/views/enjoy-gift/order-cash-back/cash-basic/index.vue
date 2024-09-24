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
      <n-form-item label="首单上限金额(元)" path="max_profit">
        <n-input-number
          v-model:value="contModel.max_profit"
          :min="0"
          :max="100"
          :precision="0"
          :style="{ width: '170px' }"
        />
      </n-form-item>
      <n-form-item label="首单分佣比例(%)" path="first_lv">
        <n-input-number
          v-model:value="contModel.first_lv"
          :min="0"
          :max="100"
          :precision="0"
          :style="{ width: '170px' }"
        />
      </n-form-item>
      <n-form-item label="翻倍分佣比例(%)" path="second_lv" mb-15>
        <n-input-number
          v-model:value="contModel.second_lv"
          :min="0"
          :max="100"
          :precision="0"
          :style="{ width: '170px' }"
        />
        <div class="lab_txt">该比例需≥首单分佣比例</div>
      </n-form-item>
      <n-form-item label="活动有效时间（h）" path="active_time">
        <n-input-number v-model:value="contModel.active_time" :min="0" :precision="0" :style="{ width: '170px' }" />
      </n-form-item>
      <n-form-item label="活动间隔时间（min）" path="interval_time">
        <n-input-number v-model:value="contModel.interval_time" :min="0" :precision="0" :style="{ width: '170px' }" />
      </n-form-item>
      <n-form-item label="个性化商品最低佣金（元）" path="profit">
        <n-input v-model:value="contModel.profit" :min="0" :precision="0" :style="{ width: '170px' }" />
      </n-form-item>
      <n-form-item label="个性化商品最低佣金率（%）" path="profit_rate">
        <n-input v-model:value="contModel.profit_rate" :min="0" :precision="0" :style="{ width: '170px' }" />
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
  max_profit: 0,
  first_lv: 0,
  second_lv: 0,
  active_time: 0,
  interval_time: 0,
  profit: 0,
  profit_rate: 0,
  is_show: 0
})
async function initGetXq() {
  const res = await http.getXq()
  if (res.code != 1 || !res.data) return
  contModel.value = res.data
}
//校验数据
const rules = ref({
  max_profit: {
    required: true,
    validator: (rule, value) => value > 0,
    trigger: ['blur', 'input'],
    message: '请输入最高分佣金额',
  },
  first_lv: {
    required: true,
    validator: (rule, value) => value > 0,
    trigger: ['blur', 'input'],
    message: '请输入首单分佣比例',
  },
  second_lv: {
    required: true,
    validator: (rule, value) => value > 0,
    trigger: ['blur', 'input'],
    message: '请输入翻倍订单比例',
  },
  active_time: {
    required: true,
    validator: (rule, value) => value > 0,
    trigger: ['blur', 'input'],
    message: '请活动间隔时间',
  }
})
const message = useMessage()
function saveContHandle() {
  formRef.value?.validate(async (errors) => {
    if (errors) return
    const res = await http.create(contModel.value)
    if (res.code == 1) {
      return message.success(res.msg)
    }
    message.error(res.msg)
  })
}
</script>
<style scoped>
.lab_txt {
  position: absolute;
  top: 100%;
  left: 0;
  font-size: 12px;
  color: #999;
}
</style>

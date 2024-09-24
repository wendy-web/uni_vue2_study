<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    preset="dialog"
    :title="modalType === 1 ? '查看' : '修改'"
    :positive-text="modalType === 1 ? '' : '确认'"
    negative-text="关闭"
    :style="{
      width: '1200px',
    }"
    @positive-click="handleValidateButtonClick"
    @negative-click="onNegativeClick"
  >
    <n-form
      ref="formRef"
      :model="model"
      :rules="rules"
      label-placement="left"
      label-width="120px"
      require-mark-placement="right-hanging"
      :style="{
        maxWidth: '1200px',
      }"
    >
      <n-form-item label="任务名称" path="name">
        <n-input
          v-model:value="model.name"
          :style="{
            width: '200px',
          }"
          :disabled="true"
        />
      </n-form-item>
      <n-form-item label="任务奖励" path="reward_rules">
        <n-data-table :columns="columns" :data="model.reward_rules" :pagination="false" />
      </n-form-item>
      <n-form-item label="描述" path="describe">
        <n-input v-model:value="model.describe" type="textarea" :disabled="modalType === 1" />
      </n-form-item>
    </n-form>
  </n-modal>
</template>
<script setup>
import { NInputNumber, useMessage } from 'naive-ui';
import { h, ref } from 'vue';
import http from '../api';

/**弹窗显示控制 */
const showModal = ref(false)
/**弹窗类型 1.查看 2.修改*/
const modalType = ref(1)
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
  describe: [
    {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入活动描述',
    },
  ],
  reward_rules: {
    validator: function (rule, value) {
      for (let i = 1; i <= 7; i++) {
        if (!value[0]['days_' + i]) {
          return false
        }
      }
      return true
    },
    message: '每天的奖励必须输入',
    trigger: 'input',
  },
})

/**表单验证 */
function handleValidateButtonClick() {
  console.log(formRef)
  formRef.value?.validate((errors) => {
    if (!errors) {
      /**还原数据 */
      let row = model.value.reward_rules[0]
      let reward_rules = []
      for (let i = 1; i <= 7; i++) {
        reward_rules.push({
          days: i,
          credits: row['days_' + i],
        })
      }
      /**还原数据 */
      http
        .updateInfo({
          ...model.value,
          reward_rules,
        })
        .then((res) => {
          if (res.code == 1) {
            message.success(res.msg)
            emit('refresh')
            showModal.value = false
          } else {
            message.error(res.msg)
          }
        })
    }
  })

  return false
}
/**展示弹窗 */
function show(operatType, data) {
  http.getInfo({ task_id: data.id }).then((res) => {
    let { id: task_id, title, subtitle, name, tag, type, image, describe, reward_rules } = res.data
    modalType.value = operatType
    //处理数据
    let cell = { label: '牛金豆' }
    reward_rules = reward_rules || [
      { credits: 0, days: 1 },
      { credits: 0, days: 2 },
      { credits: 0, days: 3 },
      { credits: 0, days: 4 },
      { credits: 0, days: 5 },
      { credits: 0, days: 6 },
      { credits: 0, days: 7 },
    ]
    reward_rules.forEach(function (item) {
      cell['days_' + item.days] = +item.credits
    })
    model.value = { task_id, name, title, subtitle, tag, type, image, describe, reward_rules: [cell] }
    initColumns(reward_rules, operatType)
    showModal.value = true
  })
}

//表格单元格
const columns = ref([])

function initColumns(list, operatType) {
  list = list.map(function (item) {
    return {
      title: item.days + '天',
      key: 'days_' + item.days,
      render(row, index) {
        return h(NInputNumber, {
          value: row['days_' + item.days],
          min: 1,
          disabled: Boolean(operatType === 1),
          precision: 0,
          onUpdateValue(v) {
            model.value.reward_rules[index]['days_' + item.days] = v
          },
        })
      },
    }
  })
  list.unshift({
    title: '签到周期',
    key: 'label',
    width: '100px',
  })
  columns.value = list
}

/**暴露给父组件使用 */
defineExpose({
  show,
})
/**回调父组件函数注册 */
const emit = defineEmits(['refresh'])
</script>

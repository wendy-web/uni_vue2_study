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
      <n-form-item label="任务名称" path="title">
        <n-input
          v-model:value="model.title"
          :style="{
            width: '200px',
          }"
        />
      </n-form-item>
      <n-form-item label="任务奖励" path="reward_rules">
        <n-data-table :columns="columns" :data="model.reward_rules" :pagination="false" />
      </n-form-item>
      <n-form-item label="任务描述" path="intro">
        <n-input v-model:value="model.intro"/>
      </n-form-item>
    </n-form>
  </n-modal>
</template>
<script setup>
import { ref, h } from 'vue'
import { useMessage, NInputNumber } from 'naive-ui'
import http from '../api'

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
  formRef.value?.validate((errors) => {
    if (!errors) {
      /**还原数据 */
      let row = model.value.reward_rules[0]
      let reward = []
      for (let i = 1; i <= 7; i++) {
        reward.push(row['days_' + i])
      }
      /**还原数据 */
      http
        .edit({
          ...model.value,
          reward: reward.toString(),
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
function show(data, operatType) {
  http.xq({ id: data.id }).then((res) => {
    let { id, title, appid, url_path, look_num, intro, reward } = res.data
    modalType.value = operatType
    //处理数据
    let cell = { label: '牛金豆' }
    let reward_rules = reward.map((item, index) => {
      return {
        credits: item.credits,
        days: index + 1,
      }
    })
    reward_rules.forEach(function (item) {
      cell['days_' + item.days] = +item.credits
    })
    model.value = { id, title, appid, url_path, look_num, intro, reward_rules: [cell] }
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

<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    preset="dialog"
    :title="modalType === 1 ? '查看' : '修改'"
    :positive-text="modalType === 1 ? '' : '确认'"
    negative-text="关闭"
    :style="{
      width: '700px',
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
        maxWidth: '500px',
      }"
    >
      <n-form-item label="任务名称" path="title">
        <n-input v-model:value="model.title"/>
      </n-form-item>
      <n-form-item label="任务奖励" path="reward">
        <n-input-group>
          <n-input-number
            v-model:value="model.reward"
            :min="0"
            :precision="0"
            :disabled="modalType === 1"
            :style="{ width: '150px' }"
          />
          <n-input-group-label>积分</n-input-group-label>
        </n-input-group>
      </n-form-item>
      <n-form-item label="观看次数" path="look_num">
        <n-input-group>
          <n-input-group-label>每人每天看</n-input-group-label>
          <n-input-number
            v-model:value="model.look_num"
            :min="0"
            :precision="0"
            :disabled="modalType === 1"
            :style="{ width: '150px' }"
          />
          <n-input-group-label>次</n-input-group-label>
        </n-input-group>
      </n-form-item>
      <n-form-item label="任务描述" path="intro">
        <n-input v-model:value="model.intro"/>
      </n-form-item>
    </n-form>
  </n-modal>
</template>
<script setup>
import { ref } from 'vue'
import { useMessage } from 'naive-ui'
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
  reward: [
    {
      required: true,
      validator: function (rule, value) {
        return value >= 0
      },
      trigger: ['blur', 'input'],
      message: '请输入任务奖励',
    },
  ],
  look_num: [
    {
      required: true,
      validator: function (rule, value) {
        return value >= 0
      },
      trigger: ['blur', 'input'],
      message: '请输入观看次数',
    },
  ],
})

/**表单验证 */
function handleValidateButtonClick() {
  console.log(formRef)
  formRef.value?.validate((errors) => {
    if (!errors) {
      http.edit(model.value).then((res) => {
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
  modalType.value = operatType
  http.xq({ id: data.id }).then((res) => {
    let { id, title, appid, url_path, look_num, intro, reward } = res.data
    reward = +reward.map((item) => item.credits).toString()
    model.value = {
      id,
      appid,
      url_path,
      look_num,
      intro,
      reward,
      title,
    }
    showModal.value = true
  })
}

/**暴露给父组件使用 */
defineExpose({
  show,
})
/**回调父组件函数注册 */
const emit = defineEmits(['refresh'])
</script>

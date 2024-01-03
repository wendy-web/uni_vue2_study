<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    preset="dialog"
    :title="modalType === 1 ? '新增账户' : '修改账户'"
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
      label-width="120px"
      require-mark-placement="right-hanging"
      :style="{
        maxWidth: '640px',
      }"
    >
      <n-form-item label="账号名" path="username">
        <n-input v-model:value="model.username" placeholder="请输入账号名" />
      </n-form-item>
      <n-form-item label="密码" path="password">
        <n-input v-model:value="model.password" type="password" @input="handlePasswordInput" @keydown.enter.prevent />
      </n-form-item>
      <n-form-item ref="rPasswordFormItemRef" label="确认密码" path="password2" first>
        <n-input v-model:value="model.password2" type="password" :disabled="!model.password" @keydown.enter.prevent />
      </n-form-item>
    </n-form>
  </n-modal>
</template>
<script setup>
import { ref } from 'vue'
import { useMessage } from 'naive-ui'
import http from './api'

/**弹窗显示控制 */
const showModal = ref(false)
/**弹窗类型 1.新增 2.修改*/
const modalType = ref(1)
/**弹窗取消 */
function onNegativeClick() {}
/**表单 */
const formRef = ref(null)
//确认密码
const rPasswordFormItemRef = ref(null)
//提示展示
const message = useMessage()
//表单数据
const model = ref({
  username: '',
  password: '',
  password2: '',
})
//校验数据
const rules = ref({
  username: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入账号名',
  },
  password: [
    {
      required: true,
      message: '请输入密码',
    },
  ],
  password2: [
    {
      required: true,
      message: '请再次输入密码',
      trigger: ['input', 'blur'],
    },
    {
      validator: function (rule, value) {
        return (
          !!model.value.password &&
          model.value.password.startsWith(value) &&
          model.value.password.length >= value.length
        )
      },
      message: '两次密码输入不一致',
      trigger: 'input',
    },
    {
      validator: function (rule, value) {
        return value === model.value.password
      },
      message: '两次密码输入不一致',
      trigger: ['blur', 'password-input'],
    },
  ],
})

function handlePasswordInput() {
  if (model.value.password2) {
    rPasswordFormItemRef.value?.validate({ trigger: 'password-input' })
  }
}

/**表单验证 */
function handleValidateButtonClick() {
  console.log(formRef)
  formRef.value?.validate((errors) => {
    if (!errors) {
      http.operatUser(model.value).then((res) => {
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
function show(data) {
  if (data) {
    //修改
    modalType.value = 2
    model.value = {
      uid: data.id,
      username: data.username,
      password: '',
      password2: '',
    }
  } else {
    //新增
    modalType.value = 1
    model.value = {
      username: '',
      password: '',
      password2: '',
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

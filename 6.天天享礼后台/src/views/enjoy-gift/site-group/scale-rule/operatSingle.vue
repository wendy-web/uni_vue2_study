<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    preset="dialog"
    :title="modalTitle"
    :positive-text="modalType === 1 ? '' : '确认'"
    negative-text="关闭"
    :style="{
      width: '800px',
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
        maxWidth: '800px',
      }"
    >
      <n-form-item label="品牌" path="tag">
        <n-select v-model:value="model.tag" :options="statusOptions" :disabled="modalType === 1" style="width: 200px" />
      </n-form-item>
      <n-form-item label="小店一级分佣" path="one_scale" w-400>
        <n-input-number v-model:value="model.one_scale" :disabled="modalType === 1" /> %
      </n-form-item>
      <n-form-item label="小店团长分佣" path="two_scale" w-400>
        <n-input-number v-model:value="model.two_scale" :disabled="modalType === 1" /> %
      </n-form-item>
      <n-form-item label="天天返利分佣(非省钱卡)" path="user_scale" w-400>
        <n-input-number v-model:value="model.user_scale" :disabled="modalType === 1" /> %
      </n-form-item>
      <n-form-item label="天天返利分佣(省钱卡)" path="vip_scale" w-400>
        <n-input-number v-model:value="model.vip_scale" :disabled="modalType === 1" /> %
      </n-form-item>
    </n-form>
  </n-modal>
</template>
<script setup>
import { useMessage } from 'naive-ui';
import { ref } from 'vue';
import http from './api';
import { statusOptions } from './options';

/**弹窗显示控制 */
const showModal = ref(false)
/**弹窗类型 1.查看 2.修改,3.新增*/
const modalType = ref(3)
const modalTitle = ref('新增')
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
  tag: {
    required: true,
    message: '品牌不能为空',
  },
  one_scale: {
    required: true,
    message: '小店一级分佣不能为空',
  },
  two_scale: {
    required: true,
    message: '小店二级分佣不能为空',
  },
  user_scale: {
    required: true,
    message: '天天返利分佣(非省钱卡)不能为空',
  },
  vip_scale: {
    required: true,
    message: '天天返利分佣(省钱卡)不能为空',
  },
})
/**表单验证 */
function handleValidateButtonClick() {
  formRef.value?.validate((errors) => {
    if (!errors) {
      http.operatSingleImage(model.value).then((res) => {
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
  modalTitle.value = ['查看', '编辑', '新增'][operatType - 1]
  modalType.value = operatType

  if (operatType !== 3) {
    http.getSingleImage({ id: data.id }).then((res) => {
      let { id, tag, one_scale, two_scale, user_scale, vip_scale } = res.data
      model.value = { id, tag, one_scale, two_scale, user_scale, vip_scale }
      showModal.value = true
    })
  } else {
    model.value = {
      tag: '',
      one_scale: 0,
      two_scale: 0,
      user_scale: 0,
      vip_scale: 0,
    }
    setTimeout(() => {
      showModal.value = true
    }, 0)
  }
}

/**暴露给父组件使用 */
defineExpose({
  show,
})
/**回调父组件函数注册 */
const emit = defineEmits(['refresh'])
</script>

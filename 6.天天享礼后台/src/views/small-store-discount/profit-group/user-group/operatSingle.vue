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
      <n-form-item label="昵称" path="nick_name" w-400 v-if="model.level == 0">
        <n-input v-model:value="model.nick_name" :disabled="modalType === 1" />
      </n-form-item>
      <n-form-item label="手机号" path="mobile" w-400 v-if="model.level == 0">
        <n-input v-model:value="model.mobile" :disabled="modalType === 1" />
      </n-form-item>
      <n-form-item label="归属上级" path="pid" v-if="model.level == 1">
        <n-radio-group v-model:value="model.pid" name="radiogroup">
          <n-space>
            <n-radio v-for="song in parentOptions" :key="song.value" :value="song.value">
              {{ song.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
    </n-form>
  </n-modal>
</template>
<script setup>
import { ref } from 'vue';
import { useMessage } from 'naive-ui';
import http from './api';

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
  nick_name: {
    required: true,
    trigger: ['blur', 'input'],
    message: '昵称不能为空',
  },
  mobile: {
    required: true,
    trigger: ['blur', 'input'],
    message: '手机号不能为空',
  },
});
const parentOptions = ref({})
/**表单验证 */
function handleValidateButtonClick() {
  formRef.value?.validate((errors) => {
    if (!errors) {
      http.create(model.value).then((res) => {
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
    http.getXq({ id: data.id }).then((res) => {
      let {
        id,
        nick_name,
        mobile,
        level,
        pid
      } = res.data;
      model.value = {
        id,
        nick_name,
        mobile,
        level,
        pid
      }
      showModal.value = true
    })
    http.getParent({}).then((res) => {
        if(res.code == 1){
            parentOptions.value = res.data
        }
    })
  } else {
    model.value = {
      nick_name: '',
      mobile: '',
      level: 0,
      pid: 0
    }
    setTimeout(() => {
      showModal.value = true
    }, 0)
  }
}

const couponOptions = ref([])
const loading = ref([false])
/**暴露给父组件使用 */
defineExpose({
  show,
})
/**回调父组件函数注册 */
const emit = defineEmits(['refresh'])
</script>

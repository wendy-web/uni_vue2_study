<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    preset="dialog"
    :title="modalTitle"
    positive-text="确认"
    negative-text="关闭"
    :style="{ width: '1000px' }"
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
      :style="{ maxWidth: '800px' }"
    >
      <n-form-item label="备注信息" path="notes" w-800>
        <n-input
          v-model:value="model.notes"
          type="textarea"
          :style="{
            width: '800px',
            height: '240px',
          }"
          :disabled="modalType === 1"
        />
      </n-form-item>
      <n-form-item v-if="modalType == 3" label="记录日期" path="create_time">
        <n-date-picker
          v-model:formatted-value="model.create_time"
          :disabled="modalType === 1"
          value-format="yyyy-MM-dd"
          type="date"
          clearable
      /></n-form-item>
    </n-form>
  </n-modal>
</template>
<script setup>
import { useMessage } from 'naive-ui';
import { ref } from 'vue';
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
const position_id = ref({})
//校验数据
const rules = ref({
  notes: {
    required: true,
    trigger: ['blur', 'input'],
    message: '备注不能为空',
  },
})
/**展示弹窗 */
async function show(operateType, data) {
  modalTitle.value = ['查看', '编辑', '新增'][operateType - 1]
  modalType.value = operateType
  position_id.value = data.position_id
  const getTime = new Date().getTime() //获取到当前时间戳
  const time = new Date(getTime) //创建一个日期对象
  let year = time.getFullYear() // 年
  let month = time.getMonth() + 1 //月
  let date = time.getDate() //日
  if (month < 10) month = '0' + month
  if (date < 10) date = '0' + date
  model.value = {
    notes: '',
    create_time: year + '-' + month + '-' + date,
    pid: operateType == 3 ? data.value.position_id : data.pid,
  }
  if (operateType !== 3) {
    const res = await http.noteXq({ id: data.id })
    let { id, notes, create_time, pid } = res.data
    operateType === 2 && (model.value = { id, notes, create_time, pid })
  }
  showModal.value = true
}
/**表单验证 */
function handleValidateButtonClick() {
  formRef.value?.validate((errors) => {
    if (!errors) {
      http.noteCreate(model.value).then((res) => {
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
/**暴露给父组件使用 */
defineExpose({
  show,
})
/**回调父组件函数注册 */
const emit = defineEmits(['refresh'])
</script>

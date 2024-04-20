<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    preset="dialog"
    :title="modalTitle"
    positive-text="确认"
    negative-text="关闭"
    :style="{ width: '800px' }"
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
      <n-form-item label="标题" path="title" w-400>
        <n-input v-model:value="model.title" />
      </n-form-item>
      <n-form-item label="类型" path="type">
        <n-select
          v-model:value="model.type"
          :options="typeOptions"
          :disabled="modalType === 1 || modalType === 2"
          style="width: 200px"
        />
      </n-form-item>
      <block v-if="model.type == 2">
        <n-form-item v-if="modalType !== 1" label="归属" path="pid" w-400>
          <n-select v-model:value="model.pid" :filterable="modalType === 1" :options="Options" style="width: 200px" />
        </n-form-item>
        <n-form-item v-else label="归属" w-400>
          <n-input v-model:value="pidTitle" disabled />
        </n-form-item>
      </block>
      <n-form-item label="名称" path="name" w-400>
        <n-input v-model:value="model.name" />
      </n-form-item>
    </n-form>
  </n-modal>
</template>
<script setup>
import { useMessage } from 'naive-ui';
import { onMounted, ref } from 'vue';
import http from './api';
import { typeOptions } from './options';
const props = defineProps({
  cid: {
    type: Number,
    default: 1,
  },
})
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
  title: {
    required: true,
    trigger: ['blur', 'input'],
    message: '标题不能为空',
  },
  type: {
    required: true,
    message: '类型不能为空',
  },
  pid: {
    required: true,
    message: '归属不能为空',
  },
  name: {
    required: true,
    trigger: ['blur', 'input'],
    message: '名称不能为空',
  },
})
const Options = ref([])
onMounted(() => {
  http.getLists({ cid: props.cid }).then((res) => {
    if (res.code == 1) {
      Options.value = res.data
    }
  })
})
/**展示弹窗 */
const pidTitle = ref('')
async function show(operateType, data) {
  modalTitle.value = ['添加', '编辑', '新增'][operateType - 1]
  modalType.value = operateType
  model.value = {
    title: '',
    type: null,
    pid: null,
    name: '',
  }
  if (operateType !== 3) {
    const res = await http.details({ id: data.id })
    let { id, title, type, pid, name } = res.data
    model.value.type = 2
    model.value.pid = id
    pidTitle.value = title
    operateType === 2 && (model.value = { id, title, type, pid: pid || null, name })
  }
  http.getLists({ cid: props.cid }).then((res) => {
    if (res.code == 1) {
      Options.value = res.data
    }
  })
  showModal.value = true
}
/**表单验证 */
function handleValidateButtonClick() {
  formRef.value?.validate((errors) => {
    if (!errors) {
      model.value.cid = props.cid
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
/**暴露给父组件使用 */
defineExpose({
  show,
})
/**回调父组件函数注册 */
const emit = defineEmits(['refresh'])
</script>

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
      <n-form-item label="名称" path="name" w-400>
        <n-input v-model:value="model.name" />
      </n-form-item>
      <n-form-item v-if="model.level == 2" label="英文名称" path="ename" w-400>
        <n-input v-model:value="model.ename" />
      </n-form-item>
      <n-form-item v-if="model.level == 1" label="来源" path="tags" w-400>
        <n-radio-group v-model:value="model.tags" name="radiogroup" :disabled="modalType === 1">
          <n-space>
            <n-radio v-for="song in tagsOptions" :key="song.value" :value="song.value">
              {{ song.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
      <n-form-item v-if="model.level == 1 && model.tags == 'qita'" label="其他标识" path="tag" w-400>
        <n-input v-model:value="model.tag" />
      </n-form-item>
      <n-form-item label="级别" path="level">
        <n-select
          v-model:value="model.level"
          :options="typeOptions"
          :disabled="modalType === 1 || modalType === 2"
          style="width: 200px"
        />
      </n-form-item>
      <block v-if="model.level == 2">
        <n-form-item v-if="modalType !== 1" label="来源" path="pid" w-400>
          <n-select v-model:value="model.pid" :filterable="modalType === 1" :options="Options" style="width: 200px" />
        </n-form-item>
        <n-form-item v-else label="来源" w-400>
          <n-input v-model:value="pidTitle" disabled />
        </n-form-item>
        <n-form-item label="跳转小程序" path="tag" w-400>
          <n-select v-model:value="model.tag" :options="tagOptions" style="width: 200px" />
        </n-form-item>
        <n-form-item label="小程序路径" path="path" w-600>
          <n-input v-model:value="model.path" />
        </n-form-item>
      </block>
    </n-form>
  </n-modal>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import http from './api'
import { typeOptions, tagOptions, tagsOptions } from './options'
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
  name: {
    required: true,
    trigger: ['blur', 'input'],
    message: '名称不能为空',
  },
  level: {
    required: true,
    message: '级别不能为空',
  },
  pid: {
    required: true,
    message: '归属不能为空',
  },
  tags: {
    required: true,
    message: '请选择来源',
  },
  tag: {
    required: true,
    message: '标识不能为空',
  },
  path: {
    required: true,
    trigger: ['blur', 'input'],
    message: '小程序路径不能为空',
  },
})
const Options = ref([])
onMounted(() => {
  http.getLists().then((res) => {
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
    name: '',
    ename: '',
    level: 1,
    pid: 0,
    path: '',
    tags: '',
  }
  if (operateType !== 3) {
    const res = await http.details({ id: data.id })
    let { id, name, ename, level, pid, path, tag, tags } = res.data
    model.value.level = 2
    model.value.pid = id
    pidTitle.value = name
    operateType === 2 && (model.value = { id, name, ename, level, pid: pid || 1, path, tag, tags })
  }
  http.getLists().then((res) => {
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

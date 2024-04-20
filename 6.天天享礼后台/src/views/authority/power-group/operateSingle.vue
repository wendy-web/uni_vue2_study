<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    preset="dialog"
    :title="modalTitle"
    :positive-text="modalType === 1 ? '' : '确认'"
    negative-text="关闭"
    :style="{ width: '1200px' }"
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
      :style="{ maxWidth: '1200px' }"
    >
      <n-form-item label="标题" path="title" w-800>
        <n-input v-model:value="model.title" :disabled="modalType === 1" />
      </n-form-item>
      <div flex>
        <n-form-item label="权限列表：" w-600>
          <n-tree
            ref="treeInstRef"
            block-line
            checkable
            cascade
            :data="treeData"
            :default-expanded-keys="model.power_ids"
            :default-checked-keys="model.power_ids"
            key-field="id"
            label-field="title"
            children-field="child"
            default-expand-all
            virtual-scroll
            :disabled="modalType === 1"
            @update:checked-keys="updatePowerCheckedKeys"
          />
        </n-form-item>
        <n-form-item label="用户列表：" w-600>
          <n-tree
            ref="treeInstRef"
            block-line
            checkable
            :data="useData"
            :default-expanded-keys="model.uids"
            :default-checked-keys="model.uids"
            key-field="id"
            label-field="username"
            children-field="child"
            default-expand-all
            virtual-scroll
            :disabled="modalType === 1"
            @update:checked-keys="updateUidCheckedKeys"
          />
        </n-form-item>
      </div>
    </n-form>
  </n-modal>
</template>
<script setup>
import { useMessage } from 'naive-ui';
import { onMounted, ref } from 'vue';
import http from './api';
const props = defineProps({
  cid: {
    type: Number,
    default: 1,
  },
  useData: {
    type: Array,
    default: [],
  },
  treeData: {
    type: Array,
    default: [],
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
})
const defaultExpandedKeys = ref([])
onMounted(() => {})
/**展示弹窗 */
async function show(operateType, data) {
  modalTitle.value = ['查看', '编辑', '新增'][operateType - 1]
  modalType.value = operateType
  if (operateType !== 3) {
    const res = await http.groupDetails({ id: data.id })
    let { id, title, power_ids, uids } = res.data
    model.value = {
      id,
      power_ids,
      title,
      uids,
    }
  } else {
    model.value = {
      title: '',
      power_ids: [],
      uids: [],
    }
  }
  showModal.value = true
}
function updatePowerCheckedKeys(keys, options) {
  model.value.power_ids = keys
}
function updateUidCheckedKeys(keys, options) {
  model.value.uids = keys
}
/**表单验证 */
function handleValidateButtonClick() {
  formRef.value?.validate((errors) => {
    if (!errors) {
      model.value.cid = props.cid
      http.groupCreate(model.value).then((res) => {
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

<template>
  <n-drawer v-model:show="showModal" :width="drawerWidth">
    <n-drawer-content :title="modalTitle" closable>
      <n-form
        ref="formRef"
        :model="model"
        :rules="rules"
        label-placement="left"
        label-width="140px"
        require-mark-placement="right-hanging"
        :style="{
          maxWidth: '2000px',
        }"
      >
        <n-form-item label="类型" path="tag" w-400>
          <n-select v-model:value="model.tag" :options="tagOptions" :disabled="modalType === 1" />
        </n-form-item>
        <n-form-item label="内容" path="contents">
          <div style="border: 1px solid #ccc">
            <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="editorRef"
              :default-config="toolbarConfig"
              mode="default"
            />
            <Editor
              v-model="model.contents"
              style="height: 500px; overflow-y: hidden"
              :default-config="editorConfig"
              mode="default"
              @onCreated="handleCreated"
            />
          </div>
        </n-form-item>
        <div flex justify-center w-1000>
          <n-button mr-10 @click="showModal = false"> 关闭 </n-button>
          <n-button v-if="modalType !== 1" type="info" @click="handleValidateButtonClick"> 保存 </n-button>
        </div>
      </n-form>
      <!-- </n-modal> -->
    </n-drawer-content>
  </n-drawer>
</template>
<script setup>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import { NButton, useMessage } from 'naive-ui';
import { ref } from 'vue';
import http from './api';
/**抽屉宽度 */
const drawerWidth = window.innerWidth - 220 + 'px'
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
    trigger: ['change'],
    message: '选择类型不能为空',
    type: 'string',
  },
  contents: {
    required: true,
    trigger: ['change', 'input'],
    validator: function (rule, value) {
      return value != '<p><br></p>' && Boolean(value)
    },
    message: '兑换须知不能为空',
  },
})
const tagOptions = [
  {
    label: '默认消息',
    value: 'GZGZH',
  },
  {
    label: '拜雅耳机',
    value: 'GZGZH-2',
  },
  {
    label: '电费充值',
    value: 'GZGZH-3',
  },
  {
    label: '话费充值',
    value: 'GZGZH-4',
  },
  {
    label: '抓娃娃',
    value: 'GZGZH-5',
  },
]
/**回调父组件函数注册 */
const emit = defineEmits(['refresh'])

/**表单验证 */
function handleValidateButtonClick() {
  formRef.value?.validate((errors) => {
    if (!errors) {
      http
        .operatGroup({
          ...model.value,
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
const showType = ref()
const showData = ref()
let typeOptions = ref({})
/**展示弹窗 */
function show(operatType, data) {
  modalTitle.value = ['查看', '编辑', '新增'][operatType - 1]
  modalType.value = operatType
  model.value = {
    tag: '',
    contents: '',
  }
  showType.value = operatType
  showData.value = data
  if (operatType < 3) {
    getTableData(data.id)
  }
  showModal.value = true
}
function getTableData(id) {
  if (showType.value !== 3) {
    return getGroupDetails(id)
  }
  showModal.value = true
}
function getGroupDetails(id) {
  http
    .getGroupDetails({
      id,
    })
    .then((res) => {
      let { id, tag, contents } = res.data
      model.value = {
        id,
        tag,
        contents,
      }
    })
}
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()
const toolbarConfig = {}
const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      server: '/apios/Tools/uploadImg',
      fieldName: 'img',
      // 自定义插入图片
      customInsert(res, insertFn) {
        // res 即服务端的返回结果
        let { url } = res.data
        // 从 res 中找到 url alt href ，然后插入图片
        insertFn(url, '', '')
      },
    },
  },
}
const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
  if (modalType.value === 1) editorRef.value?.disable()
}
/**暴露给父组件使用 */
defineExpose({
  show,
})
</script>

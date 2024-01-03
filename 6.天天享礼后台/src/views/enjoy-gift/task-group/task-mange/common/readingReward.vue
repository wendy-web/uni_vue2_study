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
      <n-form-item label="任务名称" path="name">
        <n-input v-model:value="model.name" :disabled="true" />
      </n-form-item>
      <n-form-item label="文章地址" path="article_url">
        <n-input v-model:value="model.article_url" type="textarea" :disabled="modalType === 1" />
      </n-form-item>
      <n-form-item label="主标题" path="title">
        <n-input v-model:value="model.title" :disabled="modalType === 1" />
      </n-form-item>
      <n-form-item label="副标题" path="subtitle">
        <n-input v-model:value="model.subtitle" :disabled="modalType === 1" />
      </n-form-item>
      <n-form-item label="任务图片" path="image">
        <n-upload
          action="/apios/Tools/uploadImg"
          :disabled="modalType === 1"
          list-type="image-card"
          :default-file-list="fileList"
          :max="1"
          name="img"
          @finish="handleFinish"
          @before-upload="beforeUpload"
        >
          <n-button quaternary>上传文件</n-button>
        </n-upload>
      </n-form-item>
      <n-form-item label="任务奖励" path="credits">
        <n-input-group>
          <n-input-number
            v-model:value="model.credits"
            :min="1"
            :precision="0"
            :disabled="modalType === 1"
            :style="{ width: '150px' }"
          />
          <n-input-group-label>牛金豆</n-input-group-label>
        </n-input-group>
      </n-form-item>
      <n-form-item label="描述" path="describe">
        <n-input v-model:value="model.describe" type="textarea" :disabled="modalType === 1" />
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
//已上传的图片
const fileList = ref([])
//图片上传
function handleFinish({ event }) {
  let { response, responseText } = event.currentTarget
  let res = JSON.parse(response || responseText)
  model.value.image = res.data.url
}
async function beforeUpload(data) {
  if (!/image\/(png|jpg|jpeg|gif)/i.test(data.file.file?.type)) {
    message.error('只能上传png|jpg|gif格式的图片文件，请重新上传')
    return false
  }
  return true
}

//校验数据
const rules = ref({
  image: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请上传任务图片',
  },
  credits: {
    required: true,
    validator: function (rule, value) {
      return Boolean(value)
    },
    trigger: ['blur', 'input'],
    message: '请输入任务奖励',
  },
  describe: [
    {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入任务描述',
    },
  ],
})

/**表单验证 */
function handleValidateButtonClick() {
  console.log(formRef)
  formRef.value?.validate((errors) => {
    if (!errors) {
      http.updateInfo(model.value).then((res) => {
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
  fileList.value = []
  http.getInfo({ task_id: data.id }).then((res) => {
    let { id: task_id, tag, name, article_url, title, subtitle, image, credits, describe, type } = res.data
    modalType.value = operatType
    model.value = {
      task_id,
      name,
      article_url,
      title,
      subtitle,
      image,
      credits: credits ? +credits : 0,
      describe,
      tag,
      type,
    }
    /**图片预览 */
    if (image) {
      fileList.value = [
        {
          id: 'c',
          name: '已上传的图片',
          status: 'finished',
          url: image,
        },
      ]
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

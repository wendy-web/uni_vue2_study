<template>
  <CommonPage show-footer title="首页单例图配置">
    <n-form
      ref="formRef"
      :model="model"
      :rules="rules"
      label-placement="left"
      label-width="140px"
      require-mark-placement="right-hanging"
    >
      <div flex flex-justify-center>
        <div>
          <n-form-item w-300 label="未开通团长图片：" path="image">
            <n-upload
              action="/apios/Tools/uploadImg"
              list-type="image-card"
              :default-file-list="imgFileList"
              :max="1"
              name="img"
              @remove="removeFileList"
              @finish="handleFinish"
              @before-upload="beforeUpload"
            >
              <n-button quaternary>上传文件</n-button>
            </n-upload>
          </n-form-item>
          <n-form-item label="启用状态：" path="status" w-400>
            <n-switch v-model:value="model.status" />
          </n-form-item>
        </div>
        <div>
          <n-form-item w-300 label="开通团长图片：" path="image2">
            <n-upload
              action="/apios/Tools/uploadImg"
              list-type="image-card"
              :default-file-list="codeFileList"
              :max="1"
              name="img"
              @remove="removeCodeList"
              @finish="handleCodeFinish"
              @before-upload="beforeUpload"
            >
              <n-button quaternary>上传文件</n-button>
            </n-upload>
          </n-form-item>
          <n-form-item label="启用状态：" path="status2" w-400>
            <n-switch v-model:value="model.status2" />
          </n-form-item>
        </div>
      </div>
      <div flex justify-center w-600>
        <n-button type="primary" @click="saveImgHandle"> 保存 </n-button>
      </div>
    </n-form>
  </CommonPage>
</template>

<script setup>
import http from './api'
import { useMessage } from 'naive-ui'
import { values } from 'lodash-es'
defineOptions({ name: 'SingleColumnDiagram' })
const imgFileList = ref([])
const codeFileList = ref([])
const model = ref({
  status: '',
  status2: '',
  image: '',
  image2: '',
})
//提示展示
const message = useMessage()
//校验数据
const rules = ref({
  image: {
    required: true,
    trigger: ['blur', 'input'],
    message: '未开通团长图片不能为空',
  },
  image2: {
    required: true,
    trigger: ['blur', 'input'],
    message: '开通团长图片不能为空',
  },
})

onMounted(() => {
  init()
})
function init() {
  http.singletonXq().then((res) => {
    if (res.code != 1) return
    const { status, status2, image, image2 } = res.data
    model.value = {
      status: Boolean(status),
      status2: Boolean(status2),
      image,
      image2,
    }
    if (image) {
      imgFileList.value.push({
        id: 'c',
        name: '已上传的图片',
        status: 'finished',
        url: image,
      })
    }
    if (image2) {
      codeFileList.value.push({
        id: 'c',
        name: '已上传的图片',
        status: 'finished',
        url: image2,
      })
    }
  })
}
function removeFileList() {
  model.value.image = ''
}
function removeCodeList() {
  model.value.image2 = ''
}
// 图片上传
function handleFinish({ event }) {
  let { response, responseText } = event.currentTarget
  let res = JSON.parse(response || responseText)
  if (res.code != 1) return message.error(res.msg)
  model.value.image = res.data.url
}
//图片上传
function handleCodeFinish({ event }) {
  let { response, responseText } = event.currentTarget
  let res = JSON.parse(response || responseText)
  if (res.code != 1) return message.error(res.msg)
  model.value.image2 = res.data.url
}
async function beforeUpload(data) {
  if (!/image\/(png|jpg|jpeg|gif)/i.test(data.file.file?.type)) {
    message.error('只能上传png|jpg|gif格式的图片文件，请重新上传')
    return false
  }
  return true
}
/**表单 */
const formRef = ref(null)
/**表单验证 */
function saveImgHandle() {
  formRef.value?.validate((errors) => {
    if (errors) return
    const params = {
      ...model.value,
      status: Number(model.value.status),
      status2: Number(model.value.status2),
    }
    http.singletonCreate(params).then((res) => {
      message.success(res.msg)
    })
  })
  return false
}
</script>

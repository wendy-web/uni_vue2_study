<template>
  <CommonPage show-footer title="彬纷享礼配置">
    <div flex flex-justify-center>
      <div>
        <div>
          <n-form
            ref="formContRef"
            mr-100
            :model="contModel"
            label-placement="left"
            label-width="100px"
            require-mark-placement="right-hanging"
          >
            <n-form-item label="新人标语" w-400>
              <n-input v-model:value="contModel.contents" />
            </n-form-item>
            <n-form-item label="老用户标语" w-400>
              <n-input v-model:value="contModel.content" />
            </n-form-item>
            <div flex justify-center w-380>
              <n-button type="primary" @click="saveContHandle">确认并提交</n-button>
            </div>
          </n-form>
        </div>
        <div style="margin-top:20px;">
          <!--按钮文案-->
          <n-form
            ref="formContRef"
            mr-100
            :model="btnModel"
            label-placement="left"
            label-width="100px"
            require-mark-placement="right-hanging"
          >
            <n-form-item label="按钮文字" w-400>
              <n-input v-model:value="btnModel.contents" />
            </n-form-item>
            <n-form-item label="悬浮文字" w-400>
              <n-input v-model:value="btnModel.content" />
            </n-form-item>
            <div flex justify-center w-380>
              <n-button type="primary" @click="saveBtnHandle">确认并提交</n-button>
            </div>
          </n-form>
        </div>
      </div>
      <n-form
        ref="formRef"
        :model="model"
        :rules="rules"
        label-placement="left"
        label-width="140px"
        require-mark-placement="right-hanging"
        :style="{
          maxWidth: '350px',
        }"
      >
        <n-form-item w-200 label="图片展示" path="contents">
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
        <div flex justify-center style="font-size: 12px; color: #999" mb-50>该图片用于彬纷享礼小程序积分商城</div>
        <n-form-item w-200 label="扫拉环二维码" path="content">
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
        <div flex justify-center w-340>
          <n-button type="primary" @click="saveImgHandle"> 保存 </n-button>
        </div>
      </n-form>
      <n-form
              ref="formRef"
              :model="model2"
              :rules="rules"
              label-placement="left"
              label-width="140px"
              require-mark-placement="right-hanging"
              :style="{
          maxWidth: '350px',
        }"
      >
        <n-form-item w-200 label="图片展示" path="contents">
          <n-upload
                  action="/apios/Tools/uploadImg"
                  list-type="image-card"
                  :default-file-list="imgFileList2"
                  :max="1"
                  name="img"
                  @remove="removeFileList2"
                  @finish="handleFinish2"
                  @before-upload="beforeUpload"
          >
            <n-button quaternary>上传文件</n-button>
          </n-upload>
        </n-form-item>
        <div flex justify-center style="font-size: 12px; color: #999" mb-50>该图片用于彬纷享礼小程序首页悬浮</div>
        <n-form-item w-200 label="新人扫码未中奖" path="content">
          <n-upload
                  action="/apios/Tools/uploadImg"
                  list-type="image-card"
                  :default-file-list="codeFileList2"
                  :max="1"
                  name="img"
                  @remove="removeCodeList2"
                  @finish="handleCodeFinish2"
                  @before-upload="beforeUpload"
          >
            <n-button quaternary>上传文件</n-button>
          </n-upload>
        </n-form-item>
        <div flex justify-center style="font-size: 12px; color: #999" mb-50>该图片用于彬纷享礼小程序扫码未中奖</div>
        <div flex justify-center w-340>
          <n-button type="primary" @click="saveImgHandle2"> 保存 </n-button>
        </div>
      </n-form>
      <n-form
              ref="formRef"
              :model="model3"
              :rules="rules"
              label-placement="left"
              label-width="140px"
              require-mark-placement="right-hanging"
              :style="{
          maxWidth: '350px',
        }"
      >
        <n-form-item w-200 label="图片展示" path="contents">
          <n-upload
                  action="/apios/Tools/uploadImg"
                  list-type="image-card"
                  :default-file-list="imgFileList3"
                  :max="1"
                  name="img"
                  @remove="removeFileList3"
                  @finish="handleFinish3"
                  @before-upload="beforeUpload"
          >
            <n-button quaternary>上传文件</n-button>
          </n-upload>
        </n-form-item>
        <div flex justify-center style="font-size: 12px; color: #999" mb-50>该图片用于彬纷享礼小程序扫战马二维码</div>
        <div flex justify-center w-340>
          <n-button type="primary" @click="saveImgHandle3"> 保存 </n-button>
        </div>
      </n-form>
    </div>
  </CommonPage>
</template>

<script setup>
import http from './api'
import { useMessage } from 'naive-ui'
import { values } from 'lodash-es'
defineOptions({ name: 'SingleColumnDiagram' })
const imgFileList = ref([])
const imgFileList2 = ref([])
const imgFileList3 = ref([])
const codeFileList = ref([])
const codeFileList2 = ref([])
const contModel = ref({
  contents: '',
})
const model = ref({
  contents: '',
})
const model2 = ref({
  contents: '',
  content: ''
})
const model3 = ref({
  contents: '',
})
const btnModel = ref({
  contents: '',
  content: ''
})
//提示展示
const message = useMessage()
//校验数据
const rules = ref({
  img: {
    required: true,
    trigger: ['blur', 'input'],
    message: '背景图片不能为空',
  },
})

onMounted(() => {
  init()
  getList()
  btnXq()
  homeXq()
  zmXq()
})
function init() {
  http.scoreXq().then((res) => {
    if (res.code != 1) return
    const { id, contents, content } = res.data
    model.value = {
      id,
      contents,
      content,
    }
    if (contents) {
      imgFileList.value.push({
        id: 'c',
        name: '已上传的图片',
        status: 'finished',
        url: contents,
      })
    }
    if (content) {
      codeFileList.value.push({
        id: 'c',
        name: '已上传的图片',
        status: 'finished',
        url: content,
      })
    }
  })
}
function getList() {
  http.getList().then((res) => {
    if (res.code != 1) return
    const { contents, content } = res.data
    contModel.value = {
      contents,
      content,
    }
  })
}
function btnXq(){
  http.btnXq().then((res) => {
    if (res.code != 1) return
    const { contents, content } = res.data
    btnModel.value = {
      contents,
      content,
    }
  })
}
function homeXq(){
  http.homeXq().then((res) => {
    if (res.code != 1) return
    model2.value.contents = res.data.contents
    model2.value.content = res.data.content
    if (res.data.contents) {
      imgFileList2.value.push({
        id: 'c',
        name: '已上传的图片',
        status: 'finished',
        url: res.data.contents,
      })
    }
    if (res.data.content) {
      codeFileList2.value.push({
        id: 'c',
        name: '已上传的图片',
        status: 'finished',
        url: res.data.content,
      })
    }
  })
}
function zmXq(){
  http.zmXq().then((res) => {
    if (res.code != 1) return
    model3.value.contents = res.data.contents
    if (res.data.contents) {
      imgFileList3.value.push({
        id: 'c',
        name: '已上传的图片',
        status: 'finished',
        url: res.data.contents,
      })
    }
  })
}
function removeFileList() {
  model.value.contents = ''
}
function removeFileList2() {
  model2.value.contents = ''
}
function removeFileList3() {
  model3.value.contents = ''
}
function removeCodeList() {
  model.value.content = ''
}
function removeCodeList2() {
  model2.value.content = ''
}
//图片上传
function handleFinish({ event }) {
  let { response, responseText } = event.currentTarget
  let res = JSON.parse(response || responseText)
  if (res.code != 1) {
    message.error(res.msg)
    return
  }
  model.value.contents = res.data.url
}
//首页图标上传
//图片上传
function handleFinish2({ event }) {
  let { response, responseText } = event.currentTarget
  let res = JSON.parse(response || responseText)
  if (res.code != 1) {
    message.error(res.msg)
    return
  }
  model2.value.contents = res.data.url
}
function handleFinish3({ event }) {
  let { response, responseText } = event.currentTarget
  let res = JSON.parse(response || responseText)
  if (res.code != 1) {
    message.error(res.msg)
    return
  }
  model3.value.contents = res.data.url
}
//图片上传
function handleCodeFinish({ event }) {
  let { response, responseText } = event.currentTarget
  let res = JSON.parse(response || responseText)
  if (res.code != 1) {
    message.error(res.msg)
    return
  }
  model.value.content = res.data.url
}
//图片上传
function handleCodeFinish2({ event }) {
  let { response, responseText } = event.currentTarget
  let res = JSON.parse(response || responseText)
  if (res.code != 1) {
    message.error(res.msg)
    return
  }
  model2.value.content = res.data.url
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
    if (!errors) {
      http.scoreImg(model.value).then((res) => {
        message.success(res.msg)
      })
    }
  })
  return false
}
function saveImgHandle2() {
  formRef.value?.validate((errors) => {
    if (!errors) {
      http.homeImg(model2.value).then((res) => {
        message.success(res.msg)
      })
    }
  })
  return false
}
function saveImgHandle3() {
  formRef.value?.validate((errors) => {
    if (!errors) {
      http.zmImg(model3.value).then((res) => {
        message.success(res.msg)
      })
    }
  })
  return false
}
function saveContHandle() {
  http.createList(contModel.value).then((res) => {
    if (res.code == 1) {
      message.success(res.msg)
      //   refresh()
    } else {
      message.error(res.msg)
    }
  })
}
function saveBtnHandle(){
  http.btnCreate(btnModel.value).then((res) => {
    if (res.code == 1) {
      message.success(res.msg)
      //   refresh()
    } else {
      message.error(res.msg)
    }
  })
}
</script>

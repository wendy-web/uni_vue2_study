<template>
  <CommonPage show-footer title="彬纷享礼配置">
    <div flex flex-justify-center flex-wrap>
      <div mb-40>
        <div>
          <n-form
            ref="formContRef"
            mr-100
            :model="contModel"
            label-placement="left"
            label-width="130px"
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
        <div style="margin-top: 20px">
          <!--按钮文案-->
          <n-form
            ref="formContRef"
            mr-100
            :model="btnModel"
            label-placement="left"
            label-width="130px"
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
        <n-form
          ref="formContRef"
          mt-30
          mr-100
          label-placement="left"
          label-width="130px"
          require-mark-placement="right-hanging"
        >
          <n-form-item label="扫码未中奖页面" path="is_advertisement">
            <n-switch v-model:value="isNewLosing" @update:value="newLosingHandle" />
          </n-form-item>
          <div style="font-size: 12px; color: #999; margin-top: -20px">开启：使用原始送积分页面；关闭：使用扫码未中奖新页面（新用户）</div>
        </n-form>
        <n-form
                ref="formContRef"
                mt-30
                mr-100
                label-placement="left"
                label-width="130px"
                require-mark-placement="right-hanging"
                v-if="isNewLosing"
        >
          <n-form-item label="原始送积分页面" path="is_advertisement2">
            <n-switch v-model:value="isNewLosing2" @update:value="newLosingHandle2" />
          </n-form-item>
          <div style="font-size: 12px; color: #999; margin-top: -20px">开启：无看视频积分翻倍按钮（只针对新用户生效）</div>
        </n-form>
        <div v-if="!isNewLosing">
          <div style="font-size: 16px; padding: 10px 0">扫码未中奖新页面（新用户）</div>
          <div>
            <n-form
              ref="formContRef"
              mt-10
              mr-100
              label-placement="left"
              label-width="140px"
              require-mark-placement="right-hanging"
              :model="pathModel"
            >
              <n-form-item label="场景一：翻牌动画" path="contents">
                <n-switch v-model:value="pathModel.contents" />
              </n-form-item>
              <n-form-item label="场景二：旋转木马" path="content">
                <n-switch v-model:value="pathModel.content" />
              </n-form-item>
              <div style="font-size: 12px; color: #999; margin-top: -20px">
                至少要开启一个场景，当两个场景都开启时将随机展示
              </div>
              <div mt-10 flex justify-center w-380>
                <n-button type="primary" @click="newpathHandle">确认并提交</n-button>
              </div>
            </n-form>
          </div>
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
        mb-40
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
        mb-40
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
        mb-40
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
      <n-form
        ref="formRef"
        :model="model4"
        label-placement="left"
        label-width="140px"
        require-mark-placement="right-hanging"
        :style="{
          maxWidth: '350px',
        }"
        mb-40
      >
        <n-form-item label="扫码异常送豆" path="contents" w-400>
          <n-input-number
            v-model:value="model4.contents"
            :disabled="modalType === 1"
            placeholder="最小值"
            min="1"
            :show-button="false"
            w-100
          />
          <div style="margin: 0 5px; color: #999">-</div>
          <n-input-number
            v-model:value="model4.content"
            :min="model4.contents"
            placeholder="最大值"
            :show-button="false"
            w-100
          />
        </n-form-item>
        <div flex justify-center w-340>
          <n-button type="primary" @click="saveImgHandle4"> 保存 </n-button>
        </div>
      </n-form>
    </div>
  </CommonPage>
</template>

<script setup>
import { useMessage } from 'naive-ui';
import { ref } from 'vue';
import http from './api';
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
  content: '',
})
const model3 = ref({
  contents: '',
})
const btnModel = ref({
  contents: '',
  content: '',
})
const pathModel = ref({
  contents: '',
  content: '',
})
const model4 = ref({
  contents: '',
  content: '',
})
function saveImgHandle4() {
  formRef.value?.validate((errors) => {
    if (!errors) {
      http.creditsCreate(model4.value).then((res) => {
        message.success(res.msg)
      })
    }
  })
  return false
}
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
  newXq()
  creditsXq()
  pathXq()
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
function pathXq() {
  http.pathXq().then((res) => {
    if (res.code != 1) return
    const { contents, content } = res.data
    pathModel.value = {
      contents: Boolean(contents),
      content: Boolean(content),
    }
  })
}
function btnXq() {
  http.btnXq().then((res) => {
    if (res.code != 1) return
    const { contents, content } = res.data
    btnModel.value = {
      contents,
      content,
    }
  })
}
function creditsXq() {
  http.creditsXq().then((res) => {
    if (res.code != 1) return
    const { contents, content } = res.data
    model4.value = {
      contents,
      content,
    }
  })
}
function homeXq() {
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
function zmXq() {
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
const isNewLosing = ref(false)
const isNewLosing2 = ref(false)
function newXq() {
  http.newXq().then((res) => {
    if (res.code != 1 && !res.data) return
    isNewLosing.value = Boolean(res.data.contents)
    isNewLosing2.value = Boolean(res.data.content)
  })
}
function newLosingHandle(value) {
  console.log('value', value)
  http.newLosing({ contents: Number(value) }).then((res) => {
    if (res.code == 1) {
      message.success(res.msg)
    } else {
      message.error(res.msg)
    }
  })
}
function newLosingHandle2(value) {
  console.log('value', value)
  http.newLosing({ content: Number(value) }).then((res) => {
    if (res.code == 1) {
      message.success(res.msg)
    } else {
      message.error(res.msg)
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
function saveBtnHandle() {
  http.btnCreate(btnModel.value).then((res) => {
    if (res.code == 1) {
      message.success(res.msg)
      //   refresh()
    } else {
      message.error(res.msg)
    }
  })
}
function newpathHandle() {
  http
    .pathCreate({ contents: Number(pathModel.value.contents), content: Number(pathModel.value.content) })
    .then((res) => {
      message.success(res.msg)
    })
    .catch((e) => {
      console.log(e)
      pathXq()
    })
}
</script>

<template>
  <CommonPage show-footer title="小店有惠配置">
    <templete>
      <div class="set_title" mb-20>首页团长指引图配置</div>
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
    </templete>
    <templete>
      <div class="set_title" mt-20 mb-20>赚钱中心tabbar显隐配置</div>
      <n-form
        ref="formRef"
        :model="model2"
        :rules="rules"
        label-placement="left"
        label-width="140px"
        require-mark-placement="right-hanging"
      >
        <div>
          <n-form-item label="状态：" path="status" w-400>
            <n-switch v-model:value="model2.status" />
          </n-form-item>
          <div style="font-size: 12px; color: #999; margin: -20px 0 5px 0">开启显示，关闭隐藏</div>
        </div>
        <div flex justify-center w-600>
          <n-button type="primary" @click="saveTabbarHandle"> 保存 </n-button>
        </div>
      </n-form>
    </templete>
    <templete>
      <div class="set_title" mt-20 mb-20>首页开屏广告</div>
      <n-form
        ref="formRef"
        :model="model3"
        :rules="rules"
        label-placement="left"
        label-width="140px"
        require-mark-placement="right-hanging"
      >
        <div flex>
          <div>
            <n-form-item label="珊瑚广告：" path="status" w-400>
              <n-switch v-model:value="model3.status" />
            </n-form-item>
            <div style="font-size: 12px; color: #999; margin: -20px 0 5px 0">开启显示，关闭隐藏</div>
          </div>
          <n-form-item label="广告时长(秒)" path="status2">
            <n-input-number v-model:value="model3.status2" min="1" style="width: 240px" />
          </n-form-item>
        </div>
        <div flex justify-center w-600>
          <n-button type="primary" @click="saveAdvertisementHandle"> 保存 </n-button>
        </div>
      </n-form>
    </templete>
    <templete>
      <div class="set_title" mt-20 mb-20>赚钱中心商品分佣</div>
      <n-form
        ref="formRef"
        :model="model4"
        :rules="rules"
        label-placement="left"
        label-width="140px"
        require-mark-placement="right-hanging"
      >
        <n-form-item label="分佣比例(%)" path="status">
          <n-input-number v-model:value="model4.status" min="0" max="100" style="width: 240px" />
        </n-form-item>
        <div flex justify-center w-600>
          <n-button type="primary" @click="saveRebateHandle"> 保存 </n-button>
        </div>
      </n-form>
    </templete>
  </CommonPage>
</template>

<script setup>
import { useMessage } from 'naive-ui';
import { isNumber } from '../../../utils/common';
import http from './api';
defineOptions({ name: 'homeImage' })
const imgFileList = ref([])
const codeFileList = ref([])
const model = ref({
  status: '',
  status2: '',
  image: '',
  image2: '',
})
const model2 = ref({
  status: 1,
})
const model3 = ref({
  status: false,
  status2: '',
})
const model4 = ref({
  status: '',
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
  http.tabbarTeamXq().then((res) => {
    if (res.code != 1) return
    model2.value.status = Boolean(isNumber(res.data.status) ? res.data.status : 1)
  })
  http.advertisementXq().then((res) => {
    if (res.code != 1) return
    model3.value.status = Boolean(isNumber(res.data.status) ? res.data.status : 0)
    model3.value.status2 = res.data.status2
  })
  http.rebateXq().then((res) => {
    if (res.code != 1) return
    model4.value.status = res.data.status
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
function saveTabbarHandle() {
  http.tabbarTeam({ status: Number(model2.value.status) }).then((res) => {
    message.success(res.msg)
  })
}
function saveAdvertisementHandle() {
  http.advertisementConfig({ status: Number(model3.value.status), status2: model3.value.status2 }).then((res) => {
    message.success(res.msg)
  })
}
function saveRebateHandle() {
  http.rebateConfig({ status: Number(model4.value.status) }).then((res) => {
    message.success(res.msg)
  })
}
</script>
<style scoped>
.set_title {
  font-size: 20px;
  font-weight: bold;
}
</style>

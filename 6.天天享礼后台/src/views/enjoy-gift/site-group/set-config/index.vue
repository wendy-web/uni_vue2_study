<template>
  <CommonPage show-footer title="天天享礼配置">
    <n-form
      ref="formRef"
      mr-100
      :model="model"
      label-placement="left"
      label-width="210px"
      :rules="rules"
      require-mark-placement="right-hanging"
    >
      <div class="set_title" mb-20>心链话费订单配置：</div>
      <n-form-item label="小程序appid" w-400 path="appid">
        <n-input v-model:value="model.appid" />
      </n-form-item>
      <n-form-item label="小程序路径（非省钱卡用户）" w-1200 path="path">
        <n-input v-model:value="model.path" />
      </n-form-item>
      <n-form-item label="小程序路径（省钱卡用户）" w-1200 path="path2">
        <n-input v-model:value="model.path2" />
      </n-form-item>
      <div flex justify-center w-800 mb-30>
        <n-button type="primary" @click="saveContHandle">确认并提交</n-button>
      </div>
    </n-form>
    <n-form
      ref="formRef"
      mr-100
      :model="shopmodel"
      label-placement="left"
      label-width="210px"
      :rules="rules"
      require-mark-placement="right-hanging"
    >
      <div class="set_title" mb-20>电商商品详情中转配置：</div>
      <div style="font-size: 12px; color: #999; margin: -20px 0 5px 0">
        开启点击商品将进入商品详情页
      </div>
      <n-form-item label="首页商品中转" path="contents">
        <n-switch v-model:value="shopmodel.contents" />
      </n-form-item>
      <n-form-item label="其他页面商品中转" path="content">
        <n-switch v-model:value="shopmodel.content" />
      </n-form-item>
      <div flex justify-center w-800 mb-30>
        <n-button type="primary" @click="shopContHandle">确认并提交</n-button>
      </div>
    </n-form>
  </CommonPage>
</template>

<script setup>
import { useMessage } from 'naive-ui';
import { ref } from 'vue';
import http from './api';
const model = ref({
  appid: '',
  path: '',
})
const shopmodel = ref({
  contents: 0,
  content: 0
})
//提示展示
const message = useMessage()
//校验数据
const rules = ref({})
const rules1 = {
  // appid: {
  //   required: true,
  //   trigger: ['blur', 'input'],
  //   message: '小程序appid不能为空',
  // },
  path: {
    required: true,
    trigger: ['blur', 'input'],
    message: '小程序路径不能为空',
  },
  path2: {
    required: true,
    trigger: ['blur', 'input'],
    message: '小程序路径不能为空',
  },
}
watch(
  () => model.value.appid,
  (count) => {
    const resultAppid = /^[a-zA-Z][a-zA-Z0-9_]{0,31}$/.test(count)
    rules.value = resultAppid ? rules1 : {}
  },
  {
    deep: true,
  }
)
onMounted(() => {
  init()
})
async function init() {
  const res = await http.xlXq()
  if (res.code != 1) return
  const { appid, path, path2 } = res.data
  model.value = {
    appid,
    path,
    path2,
  }
  const res2 = await http.shopXq()
  if (res2.code != 1) return
  const { contents, content } = res2.data
  shopmodel.value = {
    contents: Boolean(contents),
    content: Boolean(content),
  }
}
/**表单 */
const formRef = ref(null)
function saveContHandle() {
  formRef.value?.validate((errors) => {
    if (!errors) {
      http.xlCreate(model.value).then((res) => {
        message.success(res.msg)
      })
    }
  })
}
function shopContHandle() {
    http.shopCreate({contents: Number(shopmodel.value.contents), content: Number(shopmodel.value.content)}).then((res) => {
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

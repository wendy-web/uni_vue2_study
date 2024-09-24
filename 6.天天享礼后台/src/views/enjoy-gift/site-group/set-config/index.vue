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
    <div flex>
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
    <n-form
      ref="formRef"
      mr-100
      :model="lightmodel"
      label-placement="left"
      label-width="210px"
      :rules="rules"
      require-mark-placement="right-hanging"
    >
      <div class="set_title" mb-20>拼多多商品详情超级红包图片：</div>
      <n-form-item w-200 label="图片展示" path="contents">
        <n-upload
          action="/api/apios/Tools/uploadImg"
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
      <div flex justify-center w-800 mb-30>
        <n-button type="primary" @click="lightContHandle">确认并提交</n-button>
      </div>
    </n-form>
    </div>
    <div flex>
      <n-form
        ref="formRef"
        mr-100
        :model="watchmodel"
        label-placement="left"
        label-width="210px"
        :rules="rules"
        require-mark-placement="right-hanging"
      >
        <div class="set_title" mb-20>首页穿插浏览商品配置：</div>
        <n-form-item label="开关" path="contents">
          <n-switch v-model:value="watchmodel.contents" />
        </n-form-item>
        <div style="font-size: 12px; color: #999; margin: -20px 0 5px 0">
          开启：在1、4位置穿插浏览商品
        </div>
        <div flex justify-center w-800 mb-30>
          <n-button type="primary" @click="watchContHandle">确认并提交</n-button>
        </div>
      </n-form>
      <n-form
        ref="formRef"
        mr-100
        :model="advertisementModel"
        label-placement="left"
        label-width="210px"
        :rules="rules"
        require-mark-placement="right-hanging"
      >
        <div class="set_title" mb-20>小程序开屏广告配置：</div>
        <n-form-item label="广告开关" path="contents">
          <n-switch v-model:value="advertisementModel.contents" />
        </n-form-item>
        <div style="font-size: 12px; color: #999; margin: -20px 0 5px 0">
          开启显示珊瑚广告，关闭显示腾讯小程序广告
        </div>
        <div flex justify-center w-800 mb-30>
          <n-button type="primary" @click="advertisementContHandle">确认并提交</n-button>
        </div>
      </n-form>
    </div>
    <div>
      <n-form
          ref="formRef"
          mr-100
          :model="guessmodel"
          label-placement="left"
          label-width="210px"
          :rules="rules"
          require-mark-placement="right-hanging"
      >
        <div class="set_title" mb-20>个性化推荐配置：</div>
        <div flex>
          <div>
            <n-form-item label="品类数量" path="contents">
              <n-input-number v-model:value="guessmodel.contents" min="0" style="width:240px;" />
            </n-form-item>
            <div style="font-size: 12px; color: #999; margin: -20px 0 5px 0">
              浏览商品的总类目数达标则显示个性化推荐商品，浏览同一品类下多个商品只算入一个品类
            </div>
          </div>
          <div>
            <n-form-item label="推荐数量" path="content">
              <n-input-number v-model:value="guessmodel.content" min="0" style="width:240px;" />
            </n-form-item>
            <div style="font-size: 12px; color: #999; margin: -20px 0 5px 0;padding-left:130px;">
              每个品类下推荐商品的数量
            </div>
          </div>
        </div>
        <div flex justify-center w-800 mb-30>
          <n-button type="primary" @click="guessHandle">确认并提交</n-button>
        </div>
      </n-form>
    </div>
    <div>
      <n-form
        ref="formRef"
        mr-100
        :model="guessOpenModel"
        label-placement="left"
        label-width="210px"
        :rules="rules"
        require-mark-placement="right-hanging"
      >
        <div class="set_title" mb-20>个性化显隐配置：</div>
        <div>
          <div flex>
            <n-form-item label="领券中心开关" path="status">
              <n-switch v-model:value="guessOpenModel.lqzc.status" />
            </n-form-item>
            <n-form-item label="京东推广位ID" path="positionId">
              <n-input v-model:value="guessOpenModel.lqzc.positionId" style="width:240px;" placeholder="默认3100983434" />
            </n-form-item>
            <n-form-item label="拼多多推广位ID" path="pdd_positionId">
              <n-input v-model:value="guessOpenModel.lqzc.pdd_positionId" style="width:240px;" placeholder="默认37045673_286323870" />
            </n-form-item>
            <n-form-item label="价格降幅（%）" path="min">
              <n-input-number v-model:value="guessOpenModel.lqzc.min" min="0" max="100" style="width:240px;"/>
            </n-form-item>
            <n-form-item label="价格增幅（%）" path="max">
              <n-input-number v-model:value="guessOpenModel.lqzc.max" min="0" style="width:240px;"/>
            </n-form-item>
          </div>
          <div flex>
            <n-form-item label="首页开关" path="status">
              <n-switch v-model:value="guessOpenModel.home.status" />
            </n-form-item>
            <n-form-item label="京东推广位ID" path="positionId">
              <n-input v-model:value="guessOpenModel.home.positionId" style="width:240px;" placeholder="默认3100983434" />
            </n-form-item>
            <n-form-item label="拼多多推广位ID" path="pdd_positionId">
              <n-input v-model:value="guessOpenModel.home.pdd_positionId" style="width:240px;" placeholder="默认37045673_286323870" />
            </n-form-item>
            <n-form-item label="价格降幅（%）" path="min">
              <n-input-number v-model:value="guessOpenModel.home.min" min="0" max="100" style="width:240px;"/>
            </n-form-item>
            <n-form-item label="价格增幅（%）" path="max">
              <n-input-number v-model:value="guessOpenModel.home.max" min="0" style="width:240px;"/>
            </n-form-item>
          </div>
          <div flex>
            <n-form-item label="我的开关" path="status">
              <n-switch v-model:value="guessOpenModel.my.status" />
            </n-form-item>
            <n-form-item label="京东推广位ID" path="positionId">
              <n-input v-model:value="guessOpenModel.my.positionId" style="width:240px;" placeholder="默认3100983434" />
            </n-form-item>
            <n-form-item label="拼多多推广位ID" path="pdd_positionId">
              <n-input v-model:value="guessOpenModel.my.pdd_positionId" style="width:240px;" placeholder="默认37045673_286323870" />
            </n-form-item>
            <n-form-item label="价格降幅（%）" path="min">
              <n-input-number v-model:value="guessOpenModel.my.min" min="0" max="100" style="width:240px;"/>
            </n-form-item>
            <n-form-item label="价格增幅（%）" path="max">
              <n-input-number v-model:value="guessOpenModel.my.max" min="0" style="width:240px;"/>
            </n-form-item>
          </div>
          <div flex>
            <n-form-item label="牛金豆签到开关" path="status">
              <n-switch v-model:value="guessOpenModel.sign.status" />
            </n-form-item>
            <n-form-item label="京东推广位ID" path="positionId">
              <n-input v-model:value="guessOpenModel.sign.positionId" style="width:240px;" placeholder="默认3100983434" />
            </n-form-item>
            <n-form-item label="拼多多推广位ID" path="pdd_positionId">
              <n-input v-model:value="guessOpenModel.sign.pdd_positionId" style="width:240px;" placeholder="默认37045673_286323870" />
            </n-form-item>
            <n-form-item label="价格降幅（%）" path="min">
              <n-input-number v-model:value="guessOpenModel.sign.min" min="0" max="100" style="width:240px;"/>
            </n-form-item>
            <n-form-item label="价格增幅（%）" path="max">
              <n-input-number v-model:value="guessOpenModel.sign.max" min="0" style="width:240px;"/>
            </n-form-item>
          </div>
          <div flex>
            <n-form-item label="我的订单开关" path="status">
              <n-switch v-model:value="guessOpenModel.order.status" />
            </n-form-item>
            <n-form-item label="京东推广位ID" path="positionId">
              <n-input v-model:value="guessOpenModel.order.positionId" style="width:240px;" placeholder="默认3100983434" />
            </n-form-item>
            <n-form-item label="拼多多推广位ID" path="pdd_positionId">
              <n-input v-model:value="guessOpenModel.order.pdd_positionId" style="width:240px;" placeholder="默认37045673_286323870" />
            </n-form-item>
            <n-form-item label="价格降幅（%）" path="min">
              <n-input-number v-model:value="guessOpenModel.order.min" min="0" max="100" style="width:240px;"/>
            </n-form-item>
            <n-form-item label="价格增幅（%）" path="max">
              <n-input-number v-model:value="guessOpenModel.order.max" min="0" style="width:240px;"/>
            </n-form-item>
          </div>
          <div flex>
            <n-form-item label="领现金活动开关" path="status">
              <n-switch v-model:value="guessOpenModel.profit.status" />
            </n-form-item>
            <n-form-item label="京东推广位ID" path="positionId">
              <n-input v-model:value="guessOpenModel.profit.positionId" style="width:240px;" placeholder="默认3100983434" />
            </n-form-item>
            <n-form-item label="拼多多推广位ID" path="pdd_positionId">
              <n-input v-model:value="guessOpenModel.profit.pdd_positionId" style="width:240px;" placeholder="默认37045673_286323870" />
            </n-form-item>
            <n-form-item label="价格降幅（%）" path="min">
              <n-input-number v-model:value="guessOpenModel.profit.min" min="0" max="100" style="width:240px;"/>
            </n-form-item>
            <n-form-item label="价格增幅（%）" path="max">
              <n-input-number v-model:value="guessOpenModel.profit.max" min="0" style="width:240px;"/>
            </n-form-item>
          </div>
          <div flex>
            <n-form-item label="半屏推券开关" path="status">
              <n-switch v-model:value="guessOpenModel.ticket.status" />
            </n-form-item>
            <n-form-item label="京东推广位ID" path="positionId">
              <n-input v-model:value="guessOpenModel.ticket.positionId" style="width:240px;" placeholder="默认3100983434" />
            </n-form-item>
            <n-form-item label="拼多多推广位ID" path="pdd_positionId">
              <n-input v-model:value="guessOpenModel.ticket.pdd_positionId" style="width:240px;" placeholder="默认37045673_286323870" />
            </n-form-item>
            <n-form-item label="价格降幅（%）" path="min">
              <n-input-number v-model:value="guessOpenModel.ticket.min" min="0" max="100" style="width:240px;"/>
            </n-form-item>
            <n-form-item label="价格增幅（%）" path="max">
              <n-input-number v-model:value="guessOpenModel.ticket.max" min="0" style="width:240px;"/>
            </n-form-item>
          </div>
          <div flex>
            <n-form-item label="省钱卡专享开关" path="status">
              <n-switch v-model:value="guessOpenModel.saving.status" />
            </n-form-item>
            <n-form-item label="京东推广位ID" path="positionId">
              <n-input v-model:value="guessOpenModel.saving.positionId" style="width:240px;" placeholder="默认3100983434" />
            </n-form-item>
            <n-form-item label="拼多多推广位ID" path="pdd_positionId">
              <n-input v-model:value="guessOpenModel.saving.pdd_positionId" style="width:240px;" placeholder="默认37045673_286323870" />
            </n-form-item>
            <n-form-item label="价格降幅（%）" path="min">
              <n-input-number v-model:value="guessOpenModel.saving.min" min="0" max="100" style="width:240px;"/>
            </n-form-item>
            <n-form-item label="价格增幅（%）" path="max">
              <n-input-number v-model:value="guessOpenModel.saving.max" min="0" style="width:240px;"/>
            </n-form-item>
          </div>
        </div>
        <div>
          <div class="set_title" mb-20>领券中心、收藏、浏览记录券后价显隐开关：</div>
          <n-form-item label="券后价显隐" path="status">
            <n-switch v-model:value="guessOpenModel.couponPrice.status" />
          </n-form-item>
        </div>
        <div flex justify-center w-800 mb-30>
          <n-button type="primary" @click="guessOpenHandle">确认并提交</n-button>
        </div>
      </n-form>
    </div>
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
const imgFileList = ref([])
const shopmodel = ref({
  contents: 0,
  content: 0
})
const lightmodel = ref({
  contents: "",
})
const watchmodel = ref({
  contents: false,
})
const advertisementModel = ref({
  contents: false
})
const guessmodel = ref({
  contents: '',
  content: ''
})
const guessOpenModel = ref({
  lqzc:{
    status: false,
    positionId: '',
    pdd_positionId: '',
    min: '',
    max: ''
  },
  home:{
    status: false,
    positionId: '',
    pdd_positionId: '',
    min: '',
    max: ''
  },
  my:{
    status: false,
    positionId: '',
    pdd_positionId: '',
    min: '',
    max: ''
  },
  sign:{
    status: false,
    positionId: '',
    pdd_positionId: '',
    min: '',
    max: ''
  },
  order:{
    status: false,
    positionId: '',
    pdd_positionId: '',
    min: '',
    max: ''
  },
  profit:{
    status: false,
    positionId: '',
    pdd_positionId: '',
    min: '',
    max: ''
  },
  ticket:{
    status: false,
    positionId: '',
    pdd_positionId: '',
    min: '',
    max: ''
  },
  saving:{
    status: false,
    positionId: '',
    pdd_positionId: '',
    min: '',
    max: ''
  },
  couponPrice:{
    status: false
  }
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
  if (res.code == 1) {
    const {appid, path, path2} = res.data
    model.value = {
      appid,
      path,
      path2,
    }
  }
  const res2 = await http.shopXq()
  if (res2.code == 1) {
    const {contents, content} = res2.data
    shopmodel.value = {
      contents: Boolean(contents),
      content: Boolean(content),
    }
  }
  const res3 = await http.lightXq()
  if (res3.code == 1) {
      if (res3.data.contents) {
          imgFileList.value.push({
              id: 'c',
              name: '已上传的图片',
              status: 'finished',
              url: res3.data.contents,
          })
      }
  }
  const res4 = await http.watchXq()
  if (res4.code == 1) {
    watchmodel.value = {
      contents: Boolean(res4.data.contents)
    }
  }
  const res5 = await http.advertisementXq()
  if (res5.code == 1) {
    advertisementModel.value = {
      contents: Boolean(res5.data.contents)
    }
  }
  const res6 = await http.guessXq()
  if (res6.code == 1) {
    guessmodel.value = {
      contents: res6.data.contents,
      content: res6.data.content
    }
  }
  const res7 = await http.openXq()
  if(res7.code == 1 && res7.data.contents){
    guessOpenModel.value = res7.data.contents
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
function lightContHandle(){
  http.lightCreate({contents: lightmodel.value.contents}).then((res) => {
    message.success(res.msg)
  })
}
function watchContHandle(){
  http.watchCreate({contents: Number(watchmodel.value.contents)}).then((res) => {
    message.success(res.msg)
  })
}
function advertisementContHandle()
{
  http.advertisementCreate({contents: Number(advertisementModel.value.contents)}).then((res) => {
    message.success(res.msg)
  })
}
function guessHandle()
{
  http.guessCreate({contents: guessmodel.value.contents, content: guessmodel.value.content}).then((res) => {
    message.success(res.msg)
  })
}
function guessOpenHandle()
{
  http.openCreate({contents: guessOpenModel.value}).then((res) => {
    message.success(res.msg)
  })
}
//图片上传
function handleFinish({ event }) {
  let { response, responseText } = event.currentTarget
  let res = JSON.parse(response || responseText)
  if (res.code != 1) {
    message.error(res.msg)
    return
  }
  lightmodel.value.contents = res.data.url
}
</script>
<style scoped>
.set_title {
  font-size: 20px;
  font-weight: bold;
}
</style>

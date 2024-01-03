<template>
  <n-drawer v-model:show="showModal" :default-width="drawerWidth" resizable>
    <n-drawer-content :title="modalTitle" closable>
      <n-form
        ref="formRef"
        :model="model"
        :rules="rules"
        label-placement="left"
        label-width="120px"
        require-mark-placement="right-hanging"
      >
        <div class="form-title" pb-15 fw-600 v-if="model.items.type > 0">商品类型信息</div>
        <n-form-item label="类型" path="type" v-if="model.items.type > 0">
          <n-radio-group
                  v-model:value="model.items.type"
                  name="radiogroup"
                  :disabled="modalType === 1"
                  @change="typeChange"
          >
            <n-space>
              <n-radio v-for="song in songs" :key="song.value" :value="song.value">
                {{ song.label }}
              </n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        <n-form-item label="跳转方式" path="detail.is_jump" v-if="model.items.type > 0">
          <n-select
                  v-model:value="model.items.is_jump"
                  :options="isJumpOptions"
                  :disabled="modalType === 1"
                  style="width: 200px"
          />
        </n-form-item>
        <!-- 公众号 -->
        <template v-if="model.items.type === 1">
          <n-form-item label="主体关系" path="detail.is_main">
            <n-select
                    v-model:value="model.items.is_main"
                    :options="isMainOptions"
                    :disabled="modalType === 1"
                    style="width: 200px"
            />
          </n-form-item>
          <n-form-item v-if="model.items.is_main === 1" label="文章地址" path="detail.article_url">
            <n-input
                    v-model:value="model.items.article_url"
                    type="textarea"
                    :style="{
                maxWidth: '400px',
              }"
                    :disabled="modalType === 1"
            />
          </n-form-item>
          <n-form-item v-else label="网页图片" path="detail.main_url">
            <n-upload
                    v-if="showModal"
                    action="/apios/Tools/uploadImg"
                    :disabled="modalType === 1"
                    list-type="image-card"
                    :default-file-list="mainfileList"
                    :max="1"
                    name="img"
                    @finish="mainHandleFinish"
                    @before-upload="beforeUpload"
            >
              <n-button quaternary>上传文件</n-button>
            </n-upload>
          </n-form-item>
          <n-form-item label="视频号ID">
            <n-input
                    v-model:value="model.items.video_id"
                    :style="{
                maxWidth: '400px',
              }"
                    :disabled="modalType === 1"
            />
          </n-form-item>
          <n-form-item label="视频ID">
            <n-input
                    v-model:value="model.items.video_account_id"
                    type="textarea"
                    :style="{
                maxWidth: '400px',
              }"
                    :disabled="modalType === 1"
            />
          </n-form-item>
        </template>
        <!-- 视频号 -->
        <template v-if="model.items.type === 2">
          <n-form-item label="视频号ID" path="detail.video_id">
            <n-input
                    v-model:value="model.items.video_id"
                    :style="{
                maxWidth: '400px',
              }"
                    :disabled="modalType === 1"
            />
          </n-form-item>
          <n-form-item label="视频ID" path="detail.video_account_id">
            <n-input
                    v-model:value="model.items.video_account_id"
                    type="textarea"
                    :style="{
                maxWidth: '400px',
              }"
                    :disabled="modalType === 1"
            />
          </n-form-item>
          <div class="form-title" pb-15 fw-600>跳转视频号</div>
          <n-form-item label="视频号ID" path="detail.type_id">
            <n-input
                    v-model:value="model.items.type_id"
                    :style="{
                maxWidth: '400px',
              }"
                    :disabled="modalType === 1"
            />
          </n-form-item>
          <n-form-item label="视频ID" path="detail.type_sid">
            <n-input
                    v-model:value="model.items.type_sid"
                    type="textarea"
                    :style="{
                maxWidth: '400px',
              }"
                    :disabled="modalType === 1"
            />
          </n-form-item>
        </template>
        <!-- 小程序 -->
        <template v-if="model.items.type === 3">
          <n-form-item label="打开方式" w-400 path="detail.open_mini_type">
            <n-select
                    :disabled="modalType === 1"
                    :options="openMiniType"
                    v-model:value="model.items.open_mini_type"
                    filterable
                    clearable
                    remote
                    placeholder="跳转方式"
            />
          </n-form-item>
          <n-form-item label="选择小程序" w-400 path="xcx">
            <n-select
                    :disabled="modalType === 1"
                    :options="xcxType"
                    v-model:value="xcx"
                    filterable
                    clearable
                    remote
                    placeholder="小程序名称"
                    @change="xcxCk"
                    @clear="querykey"
            />
          </n-form-item>
          <n-form-item label="小程序ID" path="detail.type_id">
            <n-input
                    v-model:value="model.items.type_id"
                    :style="{
                maxWidth: '400px',
              }"
                    :disabled="modalType === 1"
            />
          </n-form-item>
          <n-form-item label="页面路径" path="detail.type_sid">
            <n-input
                    v-model:value="model.items.type_sid"
                    :style="{
                maxWidth: '400px',
              }"
                    :disabled="modalType === 1"
            />
          </n-form-item>
        </template>
        <div style="background-color: #f0f8ff; font-size: 14px" pl-12 h-40 flex items-center mb-10 font-600>
          基本信息
        </div>
        <n-form-item label="商品编号" path="skuCode" w-300 v-if="model.items.type === 0">
          <n-input v-model:value="model.goods_number" :disabled="true" />
        </n-form-item>
        <n-form-item label="商品图片" path="imgs">
          <n-upload
            action="/apios/Tools/uploadImg"
            :disabled="modalType === 1"
            list-type="image-card"
            :default-file-list="fileList"
            :max="5"
            :multiple="true"
            name="img"
            @finish="handleFinish"
            @remove="handleRemove"
            @before-upload="beforeUpload"
          >
            <n-button quaternary>上传文件</n-button>
          </n-upload>
        </n-form-item>
        <div flex>
          <n-form-item label="商品类型" path="goods_type" w-400 v-if="model.items.type === 0">
            <n-input v-model:value="goodsType" :disabled="true" />
          </n-form-item>
          <n-form-item label="销售状态" path="status" w-300 v-if="model.items.type === 0">
            <n-input v-model:value="sellType" :disabled="true" />
          </n-form-item>
        </div>
        <div flex>
          <n-form-item label="参考名称" path="skuName" w-400 v-if="model.items.type === 0">
            <n-input v-model:value="model.skuName" :disabled="true" />
          </n-form-item>
          <n-form-item label="SPU名称" path="spuName" w-400 v-if="model.items.type === 0">
            <n-input v-model:value="model.spuName" :disabled="true" />
          </n-form-item>
        </div>
        <div flex>
          <n-form-item label="商品名称" path="goods_name" w-400>
            <n-input v-model:value="model.goods_name" :disabled="modalType === 1" />
          </n-form-item>
          <n-form-item label="供应商" w-400 v-if="model.items.type === 0">
            <n-input :default-value="model.supplier" :disabled="true" />
          </n-form-item>
        </div>
        <!-- 充值类型为直充时 -->
        <div flex v-if="model.goods_type == 0">
          <n-form-item label="充值类型" path="cz_type" w-400 v-if="model.items.type === 0">
            <n-select
              v-model:value="model.cz_type"
              :options="rechargeOptions"
              :disabled="modalType === 1"
              @update:value="rechargeOptionsUpdate"
            />
          </n-form-item>
          <n-form-item label="提示文案" path="cz_type_intro" w-400 v-if="model.items.type === 0">
            <n-input v-model:value="model.cz_type_intro" :disabled="modalType === 1" />
          </n-form-item>
        </div>
        <div flex>
          <n-form-item label="系统类型" path="device_type" w-400>
            <n-select v-model:value="model.device_type" :options="systemOptions" :disabled="modalType === 1" />
          </n-form-item>
        </div>
        <div style="background-color: #f0f8ff; font-size: 14px" pl-12 h-40 flex items-center mb-10 font-600>
          价格库存
        </div>
        <div flex>
          <n-form-item label="商品面值" path="price" w-300>
            <n-input-group>
              <n-input-group-label>￥</n-input-group-label>
              <n-input-number
                v-model:value="model.price"
                :min="1"
                :precision="2"
                :style="{ width: '150px' }"
                :disabled="model.items.type === 0"
              />
            </n-input-group>
          </n-form-item>
          <n-form-item label="成本价" path="cost" w-300 v-if="model.items.type === 0">
            <n-input-group>
              <n-input-group-label>￥</n-input-group-label>
              <n-input-number
                v-model:value="model.cost"
                :min="0"
                :precision="2"
                :style="{ width: '150px' }"
                :disabled="true"
              />
            </n-input-group>
          </n-form-item>
          <n-form-item label="差价" path="price_difference" w-300 v-if="model.items.type === 0">
            <n-input-group>
              <n-input-group-label>￥</n-input-group-label>
              <n-input-number
                v-model:value="model.price_difference"
                :min="0"
                :precision="2"
                :style="{ width: '150px' }"
                :disabled="true"
              />
            </n-input-group>
          </n-form-item>
        </div>
        <div flex>
          <n-form-item label="抵扣金额" path="deduction_price" w-300 v-if="model.items.type === 0">
            <n-input-group>
              <n-input-group-label>￥</n-input-group-label>
              <n-input-number
                v-model:value="model.deduction_price"
                :min="0"
                :max="model.price_difference"
                :precision="2"
                :style="{ width: '150px' }"
                :disabled="modalType === 1"
              />
            </n-input-group>
          </n-form-item>
          <n-form-item label="抵扣积分" path="deduction_credits" w-300 v-if="model.items.type === 0">
            <n-input-group>
              <n-input-number
                v-model:value="model.deduction_credits"
                :min="0"
                :precision="0"
                :style="{ width: '150px' }"
                :disabled="modalType === 1"
              />
              <n-input-group-label>积分</n-input-group-label>
            </n-input-group>
          </n-form-item>
          <n-form-item label="抵扣后价格" path="costPrice" w-300 v-if="model.items.type === 0">
            <n-input-group>
              <n-input-group-label>￥</n-input-group-label>
              <n-input-number
                v-model:value="afterPrice"
                :min="0"
                :precision="2"
                :style="{ width: '150px' }"
                :disabled="true"
              />
            </n-input-group>
          </n-form-item>
        </div>
        <div style="background-color: #f0f8ff; font-size: 14px" pl-12 h-40 flex items-center mb-10 font-600 v-if="model.items.type === 0">
          使用说明
        </div>
        <n-form-item label="使用说明" path="goods_explain" v-if="model.items.type === 0">
          <div style="border: 1px solid #ccc">
            <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="editorOneRef"
              :default-config="toolbarConfig"
              mode="default"
            />
            <Editor
              v-model="model.goods_explain"
              style="height: 500px; overflow-y: hidden"
              :default-config="editorConfig"
              mode="default"
              @onCreated="handleOneCreated"
            />
          </div>
        </n-form-item>
        <div style="background-color: #f0f8ff; font-size: 14px" pl-12 h-40 flex items-center mb-10 font-600 v-if="model.items.type === 0">
          订单使用说明
        </div>
        <n-form-item label="订单使用说明" path="order_explain" v-if="model.items.type === 0">
          <div style="border: 1px solid #ccc">
            <Toolbar
                    style="border-bottom: 1px solid #ccc"
                    :editor="editorThreeRef"
                    :default-config="toolbarConfig"
                    mode="default"
            />
            <Editor
                    v-model="model.order_explain"
                    style="height: 500px; overflow-y: hidden"
                    :default-config="editorConfig"
                    mode="default"
                    @onCreated="handleThreeCreated"
            />
          </div>
        </n-form-item>
        <div style="background-color: #f0f8ff; font-size: 14px" pl-12 h-40 flex items-center mb-10 font-600>
          商品详情
        </div>
        <n-form-item label="商品详情" path="goods_details">
          <div style="border: 1px solid #ccc">
            <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="editorTwoRef"
              :default-config="toolbarConfig"
              mode="default"
            />
            <Editor
              v-model="model.goods_details"
              style="height: 500px; overflow-y: hidden"
              :default-config="editorConfig"
              mode="default"
              @onCreated="handleTwoCreated"
            />
          </div>
        </n-form-item>
        <div style="background-color: #f0f8ff; font-size: 14px" pl-12 h-40 flex items-center mb-10 font-600 v-if="model.items.type === 0">
          参考信息
        </div>
        <n-form-item label="使用说明" path="detail" v-if="model.items.type === 0">
          <div
            style="border: 1px solid #ccc; width: 1200px; min-height: 400px"
            p-20
            v-html="model.purchaseInstructions"
          ></div>
        </n-form-item>
        <n-form-item label="商品详情" path="detail" v-if="model.items.type === 0">
          <div style="border: 1px solid #ccc; width: 1200px; min-height: 400px" p-20 v-html="model.detail"></div>
        </n-form-item>
        <div flex justify-center w-1000>
          <n-button mr-10 @click="closeModel"> 关闭 </n-button>
          <n-button v-if="modalType !== 1" type="info" @click="handleValidate"> 保存 </n-button>
        </div>
      </n-form>
    </n-drawer-content>
  </n-drawer>
</template>
<script setup>
import { ref, onBeforeUnmount, shallowRef, computed } from 'vue'
import { useMessage } from 'naive-ui'
import http from '../api'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { escape2Html } from '@/utils'
import { rechargeOptions, systemOptions } from '../options'
/**弹窗显示控制 */
const showModal = ref(false)
/**抽屉宽度 */
const drawerWidth = window.innerWidth - 220 + 'px'
/**弹窗类型 1.查看 2.修改 3新增*/
const modalType = ref(1)
/**modalTitle */
const modalTitle = ref('')
//提示展示
const message = useMessage()
/**表单 */
const formRef = ref(null)
//表单数据
const model = ref({});
//券类型
const songs = [
  {
    value: 1,
    label: '公众号',
  },
  {
    value: 2,
    label: '视频号',
  },
  {
    value: 3,
    label: '小程序',
  },
]
//主体关系
const isMainOptions = [
  {
    label: '同主体',
    value: 1,
  },
  {
    label: '非同主体',
    value: 2,
  },
]
//跳转方式
const isJumpOptions = [
  {
    label: '直接跳转',
    value: 1,
  },
  {
    label: '详情跳转',
    value: 2,
  },
]
// 充值的类型
const openMiniType = ref([
  {
    label: '全屏打开',
    value: 1,
  },
  {
    label: '半屏打开',
    value: 2,
  }
]);
const xcxType = [
  {
    label: '请选择',
    value: 0,
  },
  {
    label: '京东联盟',
    value: 1,
  },
  {
    label: '美团联盟',
    value: 2,
  },
  {
    label: '其他',
    value: 3,
  },
]
let type_id = '';
let type_sid = '';
let xcx = ref(false);
let xcxs = 0;
const tyArr = {
  0: {
    'type_id': '',
    'type_sid': ''
  },
  1: {
    'type_id': 'wx91d27dbf599dff74',
    'type_sid': '/pages/union/proxy/proxy?spreadUrl='
  },
  2: {
    'type_id': 'wxde8ac0a21135c07d',
    'type_sid': ''
  },
  3: {
    'type_id': '',
    'type_sid': ''
  }
}
function xcxCk(e){
  if(e > 0){
    model.value.items.type_id = tyArr[e].type_id;
    model.value.items.type_sid = tyArr[e].type_sid;
    xcx.value = e;
  }else if(e === 0){
    xcx.value = 0;
    model.value.items.type_id = '';
    model.value.items.type_sid = '';
  }
}
function querykey(){
  model.value.items.type_id = type_id;
  model.value.items.type_sid = type_sid;
  xcx.value = xcxs;
  this.$forceUpdate();
}
function typeChange() {
  /*model.value.items = {
    type: model.value.items.type,
    is_main: model.value.items.is_main || 1,
    article_url: model.value.items.article_url || '',
    main_url: model.value.items.main_url || '',
    type_id: model.value.items.type_id || '',
    open_mini_type: model.value.items.open_mini_type || 1,
    type_sid: model.value.items.type_sid || '',
    video_id: model.value.items.video_id || '',
    video_account_id: model.value.items.video_account_id || '',
  }*/
}
function rechargeOptionsUpdate(value, option) {
  console.log('value, option', value, option)
  model.value.cz_type = value;
  model.value.cz_type_intro = option.placeholder;
}
//抵扣后金额
const afterPrice = computed(() => {
  if (model.value.price || model.value.deduction_price) {
    return model.value.price - model.value.deduction_price
  }
  return 0
})
//商品状态
const goodsType = computed(() => {
  return ['直充', '卡密'][model.value.goods_type]
})
//商品状态
const sellType = computed(() => {
  return ['下架', '上架'][model.value.status]
})
//校验数据
const rules = ref({
  goods_name: {
    required: true,
    trigger: ['blur', 'input'],
    message: '商品名称不能为空',
  },
  cz_type: {
    required: true,
    validator: function (rule, value) {
      return typeof value === 'number'
    },
    trigger: ['blur', 'input'],
    message: '请选择充值类型',
  },
  cz_type_intro: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入提示文案',
  },
  device_type: {
    required: true,
    validator: function (rule, value) {
      return typeof value === 'number'
    },
    trigger: ['blur', 'input'],
    message: '请选择系统类型',
  },
  deduction_price: {
    required: true,
    validator: function (rule, value) {
      return value >= 0
    },
    trigger: ['blur', 'input'],
    message: '请输入抵扣金额',
  },
  deduction_credits: {
    required: true,
    validator: function (rule, value) {
      return value >= 0
    },
    trigger: ['blur', 'input'],
    message: '请输入抵扣积分',
  },
})
// 编辑器实例，必须用 shallowRef
const editorOneRef = shallowRef()
const editorTwoRef = shallowRef()
const editorThreeRef = shallowRef()
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

const handleOneCreated = (editor) => {
  editorOneRef.value = editor // 记录 editor 实例，重要！
  if (modalType.value === 1) editorOneRef.value?.disable()
}
const handleTwoCreated = (editor) => {
  editorTwoRef.value = editor // 记录 editor 实例，重要！
  if (modalType.value === 1) editorTwoRef.value?.disable()
}
const handleThreeCreated = (editor) => {
  editorThreeRef.value = editor // 记录 editor 实例，重要！
  if (modalType.value === 1) editorThreeRef.value?.disable()
}

//已上传的图片
const fileList = ref([])
//图片上传
function handleFinish({ file, event }) {
  let { response, responseText } = event.currentTarget
  let res = JSON.parse(response || responseText)
  model.value.imgs.push(res.data.url)

  file.url = res.data.url

  return file
}

//网页图片
function mainHandleFinish({ event }) {
  let { response, responseText } = event.currentTarget
  let res = JSON.parse(response || responseText)
  model.value.items.main_url = res.data.url
}
const mainfileList = ref([])

function handleRemove(data) {
  let { file } = data
  let index = model.value.imgs.findIndex(function (item) {
    return item === file.url
  })

  model.value.imgs.splice(index, 1)
}

async function beforeUpload(data) {
  if (!/image\/(png|jpg|jpeg|gif)/i.test(data.file.file?.type)) {
    message.error('只能上传png|jpg|gif格式的图片文件，请重新上传')
    return false
  }
  return true
}

/**展示弹窗 */
function show(operatType, data) {
  modalType.value = operatType
  modalTitle.value = ['查看', '编辑', '新增'][operatType - 1]
  if (operatType === 1) {
    editorOneRef.value?.disable()
    editorTwoRef.value?.disable()
    editorThreeRef.value?.disable()
  }
  init(data?.id)
}

function init(id) {
  if (modalType.value != 3) {
    http.getDetails({ id }).then((res) => {
      let {
        id,
        goods_number,
        goods_name,
        goods_type,
        status,
        use,
        supplier,
        price,
        cost,
        deduction_price,
        price_difference,
        deduction_credits,
        goods_explain,
        order_explain,
        goods_details,
        imgs,
        purchaseInstructions,
        detail,
        device_type,
        cz_type,
        cz_type_intro,
        spuName,
        skuName,
        items
      } = res.data;

      model.value = {
        id,
        purchaseInstructions: escape2Html(purchaseInstructions || ''),
        detail: escape2Html(detail || ''),
        goods_explain: escape2Html(goods_explain || ''),
        order_explain: escape2Html(order_explain || ''),
        goods_details: escape2Html(goods_details || ''),
        goods_number,
        goods_name,
        goods_type,
        status,
        use,
        supplier,
        price_difference: price_difference / 100,
        price: price / 100,
        cost: cost / 100,
        deduction_price: deduction_price / 100,
        deduction_credits,
        device_type,
        spuName,
        skuName,
        imgs: imgs || [],
        items: items || {
          type: 1,
          is_main: 1,
          article_url: '',
          main_url: '',
          type_id: '',
          open_mini_type: 1,
          type_sid: '',
          video_id: '',
          video_account_id: '',
          is_jump: 1
        }
      }
      // 直充的类型
      if(goods_type == 0) {
        model.value.cz_type = cz_type;
        model.value.cz_type_intro = cz_type_intro;
      }
      /**图片预览 */
      if (imgs?.length > 0) {
        fileList.value = imgs.map(function (item, index) {
          return {
            id: 'c' + index,
            name: '已上传的图片',
            status: 'finished',
            url: item,
          }
        })
      } else {
        fileList.value = []
      }
      if (items.main_url) {
        mainfileList.value = [
          {
            id: 'a',
            name: '已上传的图片',
            status: 'finished',
            url: items.main_url,
          },
        ]
      } else {
        mainfileList.value = []
      }
      type_id = items.type_id;
      type_sid = items.type_sid;
      xcxs = 0;
      xcx.value = 0;
      if(items.type == 3 && type_id &&  type_id == 'wx91d27dbf599dff74'){
        xcxs = 1;
        xcx.value = 1;
      }
      if(items.type == 3 && type_id && type_id == 'wxde8ac0a21135c07d'){
        xcxs = 2;
        xcx.value = 2;
      }
      if(items.type == 3 && type_id && type_id != 'wx91d27dbf599dff74' && type_id != 'wxde8ac0a21135c07d' ){
        xcxs = 3;
        xcx.value = 3;
      }
      showModal.value = true
    })
  } else {
    model.value = {
      purchaseInstructions: '',
      detail: '',
      goods_explain: '',
      order_explain: '',
      goods_details: '',
      goods_number: '',
      goods_name: '',
      goods_type: '',
      status: 1,
      use: 0,
      supplier: '',
      price_difference: 0,
      price: 0,
      cost: 0,
      deduction_price: 0,
      deduction_credits: 0,
      device_type: 2,
      spuName: '',
      skuName: '',
      imgs: [],
      items: {
        type: 1,
        is_main: 1,
        article_url: '',
        main_url: '',
        type_id: '',
        open_mini_type: 1,
        type_sid: '',
        video_id: '',
        video_account_id: '',
        is_jump: 1
      },
    }
    fileList.value = [];
    mainfileList.value = []
    showModal.value = true
  }
}

/**关闭弹窗 */
function closeModel() {
  showModal.value = false
}

/**校验表单 */
function handleValidate() {
  formRef.value?.validate((errors) => {
    if (!errors) {
      if(model.value.items.type == 0 && editorOneRef.value.isEmpty()) model.value.goods_explain = '';
      if(model.value.items.type == 0 && editorTwoRef.value.isEmpty()) model.value.goods_details = '';
      if(model.value.items.type == 0 && editorThreeRef.value.isEmpty()) model.value.order_explain = '';
      /**还原数据 */
      const params = {
        ...model.value,
        price_difference: model.value.price_difference * 100,
        price: model.value.price * 100,
        cost: model.value.cost * 100,
        deduction_price: model.value.deduction_price * 100,
      };
      // return;
      http
        .dos(params)
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

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editorOne = editorOneRef.value
  const editorTwo = editorTwoRef.value
  const editorThree = editorThreeRef.value

  editorOne?.destroy()
  editorTwo?.destroy()
  editorThree?.destroy()
})

/**暴露给父组件使用 */
defineExpose({
  show,
})
/**回调父组件函数注册 */
const emit = defineEmits(['refresh'])
</script>

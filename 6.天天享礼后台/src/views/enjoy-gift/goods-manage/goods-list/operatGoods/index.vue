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
        <div style="background-color: #f0f8ff; font-size: 14px" pl-12 h-40 flex items-center mb-10 font-600>
          基本信息
        </div>
        <n-form-item label="商品编号" path="skuCode" w-300>
          <n-input v-model:value="model.skuCode" :disabled="true" />
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
          <n-form-item label="参考名称" path="skuName" w-400>
            <n-input v-model:value="model.skuName" :disabled="true" />
          </n-form-item>
          <n-form-item label="商品名称" path="title" w-400>
            <n-input v-model:value="model.title" :disabled="modalType === 1" />
          </n-form-item>
        </div>
        <div flex>
          <n-form-item label="商品类型" path="type" w-400>
            <n-input v-model:value="model.type" :disabled="true" />
          </n-form-item>
          <n-form-item label="启用状态" path="status" w-300>
            <n-input v-model:value="model.status" :disabled="true" />
          </n-form-item>
        </div>
        <div flex>
          <n-form-item label="供应商" w-400>
            <n-input default-value="乐刷" :disabled="true" />
          </n-form-item>
          <!-- <n-form-item label="生成二维码" path="is_qrcode" w-300>
            <n-switch v-model:value="model.is_qrcode" />
          </n-form-item> -->
        </div>
        <div style="background-color: #f0f8ff; font-size: 14px" pl-12 h-40 flex items-center mb-10 font-600>
          价格库存
        </div>
        <div flex>
          <n-form-item label="商品面值" path="marketPrice" w-300>
            <n-input-group>
              <n-input-group-label>￥</n-input-group-label>
              <n-input-number
                v-model:value="model.marketPrice"
                :min="1"
                :precision="2"
                :style="{ width: '150px' }"
                :disabled="true"
              />
            </n-input-group>
          </n-form-item>
          <n-form-item label="成本价" path="costPrice" w-300>
            <n-input-group>
              <n-input-group-label>￥</n-input-group-label>
              <n-input-number
                v-model:value="model.costPrice"
                :min="0"
                :precision="2"
                :style="{ width: '150px' }"
                :disabled="true"
              />
            </n-input-group>
          </n-form-item>
          <n-form-item v-if="modalType != 2" label="售价" path="salePrice" w-300>
            <n-input-group>
              <n-input-group-label>￥</n-input-group-label>
              <n-input-number
                v-model:value="model.salePrice"
                :min="0"
                :precision="2"
                :style="{ width: '150px' }"
                :disabled="modalType === 1"
              />
            </n-input-group>
          </n-form-item>
          <n-form-item label="捡漏价" w-300>
            <n-input-group>
              <n-input-group-label>￥</n-input-group-label>
              <n-input-number
                v-model:value="model.coupon_price"
                :min="model.costPrice"
                :precision="2"
                :style="{ width: '150px' }"
                :disabled="modalType === 1"
              />
            </n-input-group>
          </n-form-item>
          <div>
            <n-form-item label="库存" path="coupon_num" w-300>
              <n-input-group>
                <n-input-number
                  v-model:value="model.coupon_num"
                  :min="-1"
                  :style="{ width: '150px' }"
                  :disabled="modalType === 1"
                  placeholder="-1不限制库存"
                />
                <p class="value_lab">注：-1代表不限制库存</p>
              </n-input-group>
            </n-form-item>
          </div>
        </div>
        <div style="background-color: #f0f8ff; font-size: 14px" pl-12 h-40 flex items-center mb-10 font-600>
          优惠券信息
        </div>
        <n-form-item label="优惠券列表">
          <n-data-table w-1000 :columns="couponColumns" :data="model.coupon_list" :pagination="false" />
        </n-form-item>
        <div style="background-color: #f0f8ff; font-size: 14px" pl-12 h-40 flex items-center mb-10 font-600>
          使用说明
        </div>
        <n-form-item label="简略使用说明" path="instruction">
          <div style="border: 1px solid #ccc">
            <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="editorOneRef"
              :default-config="toolbarConfig"
              mode="default"
            />
            <Editor
              v-model="model.instruction"
              style="height: 500px; overflow-y: hidden"
              :default-config="editorConfig"
              mode="default"
              @onCreated="handleOneCreated"
            />
          </div>
        </n-form-item>
        <n-form-item label="详细使用说明" path="order_guide">
          <div style="border: 1px solid #ccc">
            <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="ogEditorOneRef"
              :default-config="toolbarConfig"
              mode="default"
            />
            <Editor
              v-model="model.order_guide"
              style="height: 500px; overflow-y: hidden"
              :default-config="editorConfig"
              mode="default"
              @onCreated="ogHandleOneCreated"
            />
          </div>
        </n-form-item>
        <div style="background-color: #f0f8ff; font-size: 14px" pl-12 h-40 flex items-center mb-10 font-600>
          商品详情
        </div>
        <n-form-item label="兑换须知" path="details">
          <div style="border: 1px solid #ccc">
            <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="editorTwoRef"
              :default-config="toolbarConfig"
              mode="default"
            />
            <Editor
              v-model="model.details"
              style="height: 500px; overflow-y: hidden"
              :default-config="editorConfig"
              mode="default"
              @onCreated="handleTwoCreated"
            />
          </div>
        </n-form-item>
        <div style="background-color: #f0f8ff; font-size: 14px" pl-12 h-40 flex items-center mb-10 font-600>
          参考信息
        </div>
        <n-form-item label="商品详情" path="detail">
          <div style="border: 1px solid #ccc; width: 1200px; min-height: 400px" p-20 v-html="model.detail"></div>
        </n-form-item>
        <n-form-item label="使用说明" path="detail">
          <div
            style="border: 1px solid #ccc; width: 1200px; min-height: 400px"
            p-20
            v-html="model.purchaseInstructions"
          ></div>
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
import { ref, onBeforeUnmount, shallowRef } from 'vue'
import { useMessage } from 'naive-ui'
import http from '../api'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { escape2Html } from '@/utils'
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
const model = ref({
  award: [],
  reward_rules: [],
})
//优惠券id
let goods_id = ''
//校验数据
const rules = ref({
  // imgs: {
  //   required: true,
  //   trigger: ['blur', 'input'],
  //   validator: function (rule, value) {
  //     return value.length > 0
  //   },
  //   message: '请上传商品图片',
  // },
  title: {
    required: true,
    trigger: ['blur', 'input'],
    message: '商品名称不能为空',
  },
  salePrice: {
    required: true,
    validator: function (rule, value) {
      let price = model.value.costPrice + model.value.marketPrice
      return value >= price
    },
    trigger: ['blur', 'input'],
    message: ' 商品售价不得小于（商品成本价+优惠券面值）',
  },
  // coupon_price: {
  //   required: true,
  //   validator: function (rule, value) {
  //     let price = model.value.costPrice
  //     return value > price
  //   },
  //   trigger: ['blur', 'input'],
  //   message: '捡漏价需高于成本价',
  // },
  // instruction: {
  //   required: true,
  //   trigger: ['blur', 'input'],
  //   validator: function (rule, value) {
  //     return value != '<p><br></p>' && Boolean(value)
  //   },
  //   message: '使用说明不能为空',
  // },
  // details: {
  //   required: true,
  //   trigger: ['blur', 'input'],
  //   validator: function (rule, value) {
  //     return value != '<p><br></p>' && Boolean(value)
  //   },
  //   message: '商品详情不能为空',
  // },
})
//奖品设置
const couponColumns = [
  { title: '优惠券名称', key: 'title', align: 'center' },
  {
    title: '面值(元)',
    key: 'face_value',
    align: 'center',
    render(row) {
      return Number(row.face_value).toFixed(2)
    },
  },
  { title: '兑换价格(牛金豆)', key: 'credits', align: 'center' },
  { title: '发放数量', key: 'used_num', align: 'center' },
  { title: '剩余数量', key: 'stock_num', align: 'center' },
  { title: '有效期(天)', key: 'expiry_date', align: 'center' },
  { title: '创建时间', key: 'create_time', align: 'center' },
  { title: '创建人', key: 'create_name', align: 'center' },
]
// 编辑器实例，必须用 shallowRef
const editorOneRef = shallowRef()
const ogEditorOneRef = shallowRef()
const editorTwoRef = shallowRef()
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
const ogHandleOneCreated = (editor) => {
  ogEditorOneRef.value = editor // 记录 editor 实例，重要！
  if (modalType.value === 1) editorTwoRef.value?.disable()
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

function handleRemove(data) {
  let { file } = data

  let index = model.value.imgs.findIndex(function (item) {
    return item === 'file'
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
  goods_id = data?.id
  modalType.value = operatType
  modalTitle.value = ['查看', '编辑', '新增'][operatType - 1]
  if (operatType === 1) {
    editorOneRef.value?.disable()
    editorTwoRef.value?.disable()
  }
  init()
}

function init() {
  if (modalType.value != 3) {
    http.getDetails({ goods_id }).then((res) => {
      let {
        id: goods_id,
        costPrice,
        detail,
        details,
        purchaseInstructions,
        instruction,
        marketPrice,
        imgs,
        salePrice,
        skuCode,
        skuName,
        status,
        title,
        type,
        coupon_list,
        order_guide,
        is_qrcode,
        coupon_price,
        coupon_num
      } = res.data

      model.value = {
        goods_id,
        costPrice: costPrice / 100,
        detail: escape2Html(detail || ''),
        details: escape2Html(details || ''),
        instruction: escape2Html(instruction || ''),
        order_guide: escape2Html(order_guide || ''),
        purchaseInstructions,
        marketPrice: marketPrice / 100,
        imgs,
        salePrice: salePrice / 100,
        skuCode,
        skuName,
        status: status ? '启用' : '未启用',
        title,
        type: type == 0 ? '直充' : '卡券',
        coupon_list,
        is_qrcode: Boolean(is_qrcode),
        coupon_price: coupon_price / 100,
        coupon_num
      }
      /**图片预览 */
      if (imgs.length > 0) {
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
      showModal.value = true
    })
  } else {
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
      /**还原数据 */

      let { goods_id, title, salePrice, instruction, details, imgs, is_qrcode, order_guide, coupon_price, coupon_num } = model.value

      http
        .edit({
          goods_id,
          title,
          price: salePrice,
          instruction,
          order_guide,
          details,
          imgs,
          is_qrcode: Number(is_qrcode),
          coupon_price,
          coupon_num
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

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editorOne = editorOneRef.value
  const editorTwo = editorTwoRef.value

  editorOne?.destroy()
  editorTwo?.destroy()
})

/**暴露给父组件使用 */
defineExpose({
  show,
})
/**回调父组件函数注册 */
const emit = defineEmits(['refresh'])
</script>

<style lang="scss">
.value_lab {
  position: absolute;
  top: 120%;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  font-size: 12px;
  line-height: 1;
  color: gray;

  // opacity: 0;
}
</style>

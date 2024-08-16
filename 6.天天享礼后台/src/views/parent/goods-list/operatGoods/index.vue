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
        <n-form-item label="商品名称" path="goods_name" w-800>
          <n-input v-model:value="model.goods_name" :disabled="modalType === 1" />
        </n-form-item>
        <n-form-item label="商品图片" path="imageLists">
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
        <n-form-item label="上架状态" path="status" w-400>
          <n-select v-model:value="model.status" :options="goodsStatusOptions" :disabled="modalType === 1" />
        </n-form-item>
        <n-form-item label="库存" path="inventory" w-300>
          <n-input-group>
            <n-input-number
              v-model:value="model.inventory"
              :min="1"
              :style="{ width: '150px' }"
              :disabled="modalType === 1"
            />
          </n-input-group>
        </n-form-item>
        <n-form-item label="售价" path="selling_price" w-300>
          <n-input-group>
            <n-input-group-label>￥</n-input-group-label>
            <n-input-number
              v-model:value="model.selling_price"
              :min="1"
              :precision="2"
              :style="{ width: '150px' }"
              :disabled="modalType === 1"
            />
          </n-input-group>
        </n-form-item>
        <n-form-item label="原价" path="original_price" w-300>
          <n-input-group>
            <n-input-group-label>￥</n-input-group-label>
            <n-input-number
              v-model:value="model.original_price"
              :min="1"
              :precision="2"
              :style="{ width: '150px' }"
              :disabled="modalType === 1"
            />
          </n-input-group>
        </n-form-item>
        <div style="background-color: #f0f8ff; font-size: 14px" pl-12 h-40 flex items-center mb-10 font-600>
          商品详情
        </div>
        <n-form-item label="商品详情" path="goods_details">
          <div style="border: 1px solid #ccc">
            <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorTwoRef" mode="default" />
            <Editor
              v-model="model.goods_details"
              style="height: 600px; overflow-y: hidden"
              :default-config="editorConfig"
              mode="default"
              :disabled="modalType === 1"
              @onCreated="handleTwoCreated"
            />
          </div>
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
import { escape2Html } from '@/utils';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import { useMessage } from 'naive-ui';
import { onBeforeUnmount, ref, shallowRef } from 'vue';
import http from '../api';
import { goodsStatusOptions } from '../options';
/**弹窗显示控制 */
const showModal = ref(false)
/**抽屉宽度 */
const drawerWidth = window.innerWidth - 220 + 'px'
/**弹窗类型 1.查看 2.修改 3新增*/
const modalType = ref(1)
const modalTitle = ref('')
// 提示展示
const message = useMessage()
/**表单 */
const formRef = ref(null)
//表单数据
const model = ref({})
//校验数据
const rules = ref({
  goods_name: {
    required: true,
    trigger: ['blur', 'input'],
    message: '商品名称不能为空',
  },
})
// 编辑器实例，必须用 shallowRef
const editorTwoRef = shallowRef()
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
const handleTwoCreated = (editor) => {
  editorTwoRef.value = editor // 记录 editor 实例，重要！
  if (modalType.value === 1) editorTwoRef.value?.disable()
}

// 已上传的图片
const fileList = ref([])
// 图片上传
function handleFinish({ file, event }) {
  let { response, responseText } = event.currentTarget
  let res = JSON.parse(response || responseText)
  model.value.imageLists.push(res.data.url)

  file.url = res.data.url

  return file
}

function handleRemove(data) {
  let { file } = data
  let index = model.value.imageLists.findIndex(function (item) {
    return item === file.url
  })
  model.value.imageLists.splice(index, 1)
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
  if (operatType === 1) editorTwoRef.value?.disable()
  init(data?.id)
}

function init(id) {
  if (modalType.value != 3) {
    http.goodsXq({ id }).then((res) => {
      let { id, goods_name, status, inventory, original_price, selling_price, imageLists, goods_details } = res.data
      model.value = {
        id,
        goods_name,
        inventory,
        status,
        original_price: Number(original_price),
        selling_price: Number(selling_price),
        imageLists: imageLists || [],
        goods_details: escape2Html(goods_details || ''),
      }
      /**图片预览 */
      if (imageLists?.length > 0) {
        fileList.value = imageLists.map(function (item, index) {
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
    model.value = {
      goods_name: '',
      imageLists: [],
      original_price: 0,
      selling_price: 0,
      inventory: 0,
      status: 0,
      goods_details: '',
    }
    fileList.value = []
    showModal.value = true
  }
}

function closeModel() {
  showModal.value = false
}
/**校验表单 */
function handleValidate() {
  formRef.value?.validate((errors) => {
    if (!errors) {
      if (editorTwoRef.value.isEmpty()) model.value.goods_details = ''
      http.create(model.value).then((res) => {
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
  const editorTwo = editorTwoRef.value
  editorTwo?.destroy()
})

/**暴露给父组件使用 */
defineExpose({
  show,
})
/**回调父组件函数注册 */
const emit = defineEmits(['refresh'])
</script>

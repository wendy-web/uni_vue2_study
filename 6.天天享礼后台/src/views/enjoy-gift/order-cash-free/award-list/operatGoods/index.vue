<template>
  <n-drawer v-model:show="showModal" :default-width="drawerWidth" resizable>
    <n-drawer-content :title="modalTitle" closable>
      <n-form
        ref="formRef"
        :model="model"
        :rules="rules"
        label-placement="left"
        label-width="140px"
        require-mark-placement="right-hanging"
      >
        <n-form-item label="标题" path="title" w-400>
          <n-input v-model:value="model.title" :disabled="modalType === 1" />
        </n-form-item>
        <n-form-item label="图片" path="img">
          <n-upload
            action="/apios/Tools/uploadImg"
            :disabled="modalType === 1"
            list-type="image-card"
            :default-file-list="fileList"
            :max="1"
            :multiple="true"
            name="img"
            @finish="handleFinish"
            @remove="handleRemove"
            @before-upload="beforeUpload"
          >
            <n-button quaternary>上传文件</n-button>
          </n-upload>
        </n-form-item>
        <n-form-item label="奖品销售价格" path="price" w-400>
          <n-input-number v-model:value="model.price" :min="0" :disabled="modalType === 1" />
        </n-form-item>
        <n-form-item label="奖品成本价格" path="cost_price" w-400>
          <n-input-number v-model:value="model.cost_price" :min="0" :disabled="modalType === 1" />
        </n-form-item>
        <n-form-item label="排序" path="sort" w-400>
          <n-input-number v-model:value="model.sort" :min="0" :precision="0" :disabled="modalType === 1" />
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
import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import { NButton, NInputNumber, useMessage } from 'naive-ui';
import { onBeforeUnmount, ref } from 'vue';
import http from '../api';
/**弹窗显示控制 */
const showModal = ref(false)

/**抽屉宽度 */
const drawerWidth = window.innerWidth - 220 + 'px'
/**弹窗类型 1.查看 2.修改 3新增*/
const modalType = ref(1)
let goods_id = 0
const modalTitle = ref('')
//提示展示
const message = useMessage()
/**表单 */
const formRef = ref(null)
//表单数据
const model = ref({})
//已上传的图片
const fileList = ref([])
//图片上传
function handleFinish({ event }) {
  let { response, responseText } = event.currentTarget
  let res = JSON.parse(response || responseText)
  model.value.img = res.data.url
}
async function beforeUpload(data) {
  if (!/image\/(png|jpg|jpeg|gif)/i.test(data.file.file?.type)) {
    message.error('只能上传png|jpg|gif格式的图片文件，请重新上传')
    return false
  }
  return true
}
function handleRemove() {
  model.value.img = ''
}
//校验数据
const rules = ref({
  title: {
    required: true,
    trigger: ['blur', 'input'],
    message: '分组名称不能为空',
  },
  img: {
    required: true,
    trigger: ['blur', 'input'],
    validator: function (rule, value) {
      return value.length > 0
    },
    message: '请上传图片',
  },
  price: {
    required: true,
    trigger: ['blur', 'input'],
    validator: function (rule, value) {
      return Boolean(value)
    },
    message: '奖品销售价格不能为空',
  },
  cost_price: {
    required: true,
    trigger: ['blur', 'input'],
    validator: function (rule, value) {
      return Boolean(value)
    },
    message: '奖品成本价格不能为空',
  },
})

/**展示弹窗 */
function show(operateType, data) {
  fileList.value = []
  goods_id = data?.id
  modalType.value = operateType
  modalTitle.value = ['查看', '编辑', '新增'][operateType - 1]
  init()
}
onMounted(() => {})
// 该列表的初始化
async function init() {
  if (modalType.value != 3) {
    const res = await http.giftXq({ id: goods_id })
    let { title, sort, num, img, price, cost_price } = res.data
    model.value = {
      title,
      sort,
      num,
      img,
      price,
      cost_price,
    }
    /**图片预览 */
    if (img) {
      fileList.value = [
        {
          id: 'c',
          name: '已上传的图片',
          status: 'finished',
          url: img,
        },
      ]
    }
    showModal.value = true
    return
  }
  model.value = {}
  showModal.value = true
}
// 关闭弹窗
function closeModel() {
  showModal.value = false
}

/**校验表单 */
function handleValidate() {
  formRef.value?.validate(async (errors) => {
    if (errors) return
    let { title, sort, num, img, price, cost_price } = model.value
    const params = {
      id: goods_id,
      title,
      sort,
      num,
      img,
      price,
      cost_price,
    }
    console.log('params', params)
    const res = await http.giftCreate(params)
    if (res.code == 1) {
      message.success(res.msg)
      emit('refresh')
      showModal.value = false
      return
    }
    message.error(res.msg)
  })
}
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {})
/**暴露给父组件使用 */
defineExpose({
  show,
})
/**回调父组件函数注册 */
const emit = defineEmits(['refresh'])
</script>
<style lang="scss"></style>

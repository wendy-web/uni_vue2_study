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
        <n-form-item label="奖品名称" path="name" w-400>
          <n-input v-model:value="model.name" :disabled="modalType === 1" />
        </n-form-item>
        <n-form-item label="奖品图片" path="image">
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
        <n-form-item label="奖品类型" w-400 path="tag">
          <n-select
            v-model:value="model.tag"
            :disabled="modalType === 1"
            :options="tagList"
            filterable
            clearable
            remote
            placeholder="奖品类型"
            @update:value="tagChange"
          />
        </n-form-item>
        <n-form-item label="类型标识" w-400 path="type">
          <n-select
            v-model:value="model.type"
            :disabled="modalType === 1"
            :options="typeList"
            filterable
            clearable
            remote
            placeholder="类型标识"
            @update:value="typeChange"
          />
        </n-form-item>
        <n-form-item label="奖品概率" path="prob" w-400>
          <n-input-number v-model:value="model.prob" min="0" max="1" :disabled="modalType === 1" />
        </n-form-item>
        <n-form-item v-if="model.tag == 2 && model.type == 5" label="页面路径" path="url">
          <n-input
            v-model:value="model.url"
            :style="{
              maxWidth: '400px',
            }"
            :disabled="modalType === 1"
          />
        </n-form-item>
        <n-form-item label="首次必中" path="first_get" w-400>
          <n-switch v-model:value="model.first_get" :disabled="modalType === 1" />
        </n-form-item>
        <n-form-item v-if="model.tag == 1 && model.type == 1" label="京东" path="url">
          <n-input
            v-model:value="goods_name"
            :maxlength="20"
            :style="{
              width: '300px',
            }"
            disabled
          />
          <n-button ml-10 :disabled="modalType === 1" @click="selectJdListHandle"> 选择京东商品 </n-button>
        </n-form-item>
        <n-form-item v-if="model.tag == 1 && model.type == 2" label="拼多多" path="url">
          <n-input
            v-model:value="goods_name"
            :maxlength="20"
            :style="{
              width: '300px',
            }"
            disabled
          />
          <n-button ml-10 :disabled="modalType === 1" @click="selectPddListHandle"> 选择拼多多商品 </n-button>
        </n-form-item>
        <div flex justify-center w-1000>
          <n-button mr-10 @click="closeModel"> 关闭 </n-button>
          <n-button v-if="modalType !== 1" type="info" @click="handleValidate"> 保存 </n-button>
        </div>
      </n-form>
    </n-drawer-content>
  </n-drawer>
  <tag-operat-jd-list ref="tagOperatJdListRef" @selectList="selectListHandle" />
  <tag-operat-pdd-list ref="tagOperatPddListRef" @selectList="selectListHandle" />
</template>
<script setup>
import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import { NButton, NInputNumber, useMessage } from 'naive-ui';
import { onBeforeUnmount, ref } from 'vue';
import http from '../api';
import tagOperatJdList from './tagOperatJdList.vue';
import tagOperatPddList from './tagOperatPddList.vue';
/**弹窗显示控制 */
const showModal = ref(false)
const channelOptions = ref([])
const typeList = ref([])
const tagList = [
  {
    label: '电商',
    value: 1,
  },
  {
    label: '小程序内页',
    value: 2,
  },
  {
    label: 'H5',
    value: 3,
  },
]
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
const tableRef = ref(null)
//已上传的图片
const fileList = ref([])
//图片上传
function handleFinish({ event }) {
  let { response, responseText } = event.currentTarget
  let res = JSON.parse(response || responseText)
  model.value.image = res.data.url
}
async function beforeUpload(data) {
  if (!/image\/(png|jpg|jpeg|gif)/i.test(data.file.file?.type)) {
    message.error('只能上传png|jpg|gif格式的图片文件，请重新上传')
    return false
  }
  return true
}
function handleRemove(data) {
  model.value.image = ''
}
//校验数据
const rules = ref({
  name: {
    required: true,
    trigger: ['blur', 'input'],
    message: '奖品名称不能为空',
  },
  image: {
    required: true,
    trigger: ['blur', 'input'],
    validator: function (rule, value) {
      return value.length > 0
    },
    message: '请上传图片',
  },
  tag: {
    required: true,
    message: '请选择奖品类型',
  },
  type: {
    required: true,
    message: '请选择类型标识',
  },
  prob: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请填写中奖概率',
  },
})
function tagChange(value, value2 = '') {
  typeList.value = []
  model.value.type = modalType.value == 3 ? '' : value2
  if (value == 1) {
    typeList.value = [
      {
        label: '京东',
        value: 1,
      },
      {
        label: '拼多多',
        value: 2,
      },
    ]
  }
  if (value == 2) {
    typeList.value = [
      {
        label: '瑞幸',
        value: 1,
      },
      {
        label: '麦当劳',
        value: 2,
      },
      {
        label: '肯德基',
        value: 3,
      },
      {
        label: '星巴克',
        value: 4,
      },
      {
        label: '其他',
        value: 5,
      },
      {
        label: '领现金',
        value: 6,
      },
      {
        label: '免单',
        value: 7,
      },
    ]
  }
  if (value == 3) {
    typeList.value = [
      {
        label: '话费',
        value: 1,
      },
      {
        label: '抓娃娃',
        value: 2,
      },
      {
        label: '电影',
        value: 3,
      },
      {
        label: '华莱士',
        value: 4,
      },
      {
        label: '汉堡王',
        value: 5,
      },
      {
        label: '必胜客',
        value: 6,
      },
      {
        label: '喜茶',
        value: 7,
      },
      {
        label: '奈雪的茶',
        value: 8,
      },
    ]
  }
}
function typeChange() {
  let tag = model.value.tag
  if (tag == 1) {
    model.value.url = ''
    goods_name.value = ''
  }
}
/**展示弹窗 */
function show(operateType, data) {
  fileList.value = []
  goods_id = data?.id
  modalType.value = operateType
  modalTitle.value = ['查看', '编辑', '新增'][operateType - 1]
  init()
}
onMounted(() => {})
// 查询参数
const tableData = ref([])

// 该列表的初始化
async function init() {
  if (modalType.value != 3) {
    const res = await http.getDetail({ id: goods_id })
    let { name, image, tag, type, prob, url, first_get } = res.data
    model.value = {
      name,
      image,
      tag,
      type,
      prob,
      url,
      first_get,
    }
    goods_name.value = res.data.goods_name
    model.value.first_get = Boolean(model.value.first_get)
    tableData.value = res.data
    /**图片预览 */
    if (image) {
      fileList.value = [
        {
          id: 'c',
          name: '已上传的图片',
          status: 'finished',
          url: image,
        },
      ]
    }
    tagChange(tag, type)
    showModal.value = true
    return
  }
  model.value = {}
  tableData.value = []
  showModal.value = true
}
// 重置数组的排序
function resetIndex() {
  tableData.value.forEach((item, index) => {
    item._index = index + 1
    item.current_index = index
  })
}

// 关闭弹窗
function closeModel() {
  showModal.value = false
}

const handleCheck = (rowKeys) => {
  model.value.group = rowKeys
}

/**校验表单 */
function handleValidate() {
  formRef.value?.validate(async (errors) => {
    if (errors) return
    let { name, image, tag, type, prob, url, first_get } = model.value
    first_get = Number(first_get)
    const params = {
      id: goods_id,
      name,
      image,
      tag,
      type,
      prob,
      url,
      first_get,
    }
    console.log('params', params)
    // return
    const res = await http.doCreate(params)
    if (res.code == 1) {
      message.success(res.msg)
      emit('refresh')
      showModal.value = false
      return
    }
    message.error(res.msg)
  })
}
const tagOperatJdListRef = ref(null)
const tagOperatPddListRef = ref(null)
const goods_name = ref()
// 打开京东可选
function selectJdListHandle() {
  tagOperatJdListRef.value.show()
}
// 打开拼多多可选
function selectPddListHandle() {
  tagOperatPddListRef.value.show()
}
// 电商商品的选择
function selectListHandle(selectList) {
  console.log(selectList)
  model.value.url = selectList.skuId
  goods_name.value = selectList.title
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

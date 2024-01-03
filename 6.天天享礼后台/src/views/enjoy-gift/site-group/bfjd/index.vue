<template>
  <CommonPage show-footer title="外卖红包">
    <n-form
      ref="formRef"
      :model="model"
      :rules="rules"
      label-placement="left"
      label-width="140px"
      require-mark-placement="right-hanging"
      :style="{
        maxWidth: '3000px',
      }"
    >
      <n-form-item label="标题" path="contents">
        <n-input
            v-model:value="model.contents"
            :style="{
            maxWidth: '400px',
          }"
        />
      </n-form-item>
      <n-form-item label="推广位ID" path="content">
        <n-input
                v-model:value="model.content"
                :style="{
            maxWidth: '400px',
          }"
        />
      </n-form-item>
      <!-- 优惠券分组 -->
      <n-form-item label="添加商品" w-600>
        <n-button mr-10 @click="selectHandle"> 选择商品列表 </n-button>
      </n-form-item>
      <n-form-item label="搜索商品" path="defaultCouponFilter" w-400>
        <n-input v-model:value="defaultCouponFilter" @input="handleUpdateFilter" />
      </n-form-item>
      <n-form-item label="商品列表" path="group">
        <n-data-table
          id="dragTable"
          ref="tableRef"
          :scroll-x="2200"
          :columns="columns"
          :data="tableData"
          :checked-row-keys="model.group"
          :row-key="(row) => row['coupon_id']"
          :pagination="false"
          max-height="820px"
          @update:checked-row-keys="handleCheck"
          @update:filters="handleUpdateFilter"
        />
      </n-form-item>
      <div v-has="'add'" flex justify-center>
        <n-button type="info" size="large" @click="handleValidateButtonClick"> 保存 </n-button>
      </div>
    </n-form>
  </CommonPage>
  <operat-group-detail ref="operatGroupDetailRef" :ck-ids="ckIds"  @addList="addListHandle" />
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { NButton, useMessage, NInput, NInputNumber, NSwitch, NDatePicker } from 'naive-ui'
import { renderIcon, formatDateTime } from '@/utils'
import http from './api'
import operatGroupDetail from './operatGroupDetail.vue'
//表单数据
const model = ref({
  id: '',
  contents: '',
  content: '',
  group: [],
})
//校验数据
const rules = ref({
    contents: {
        required: true,
        trigger: ['blur', 'input'],
        message: '标题不能为空',
    },
    group: {
        required: true,
        validator: function (rule, value) {
            return value.length > 0
        },
        trigger: ['blur', 'input'],
        message: '请勾选该分组下的优惠券',
    },
})
/**表单 */
const formRef = ref(null)
//提示展示
const message = useMessage()
//图片上传
function handleFinish({ event }, dataType) {
  let { response, responseText } = event.currentTarget
  let res = JSON.parse(response || responseText)
  if (res.code != 1) {
    message.error(res.msg)
    return
  }
  model.value[dataType] = res.data.url
}
function removeFileList(dataType) {
  model.value[dataType] = ''
}
async function beforeUpload(data) {
  if (!/image\/(png|jpg|jpeg|gif)/i.test(data.file.file?.type)) {
    message.error('只能上传png|jpg|gif格式的图片文件，请重新上传')
    return false
  }
  return true
}

//优惠券
const couponOptions = ref([])
const loading = ref(false)
function handleSearch(query = '') {
  loading.value = true
  const deviceType = 2
  const coupon_id = model.value.coupon_id
  http.getCouponList({ title: query, p_type: deviceType }).then((res) => {
    loading.value = false
    let list = res.data.list.filter(function (item) {
      return item.status == 1 || item.id == coupon_id
    })
    couponOptions.value = list.map(function (item) {
      return {
        label: item.status == 0 ? item.title + '（已下架）' : item.title,
        value: item.id,
        disabled: item.status == 0,
      }
    })
  })
}
// 优惠券的选择
function coupon_id_handleUpdate(value, options) {
  console.log('value :>> ', value)
}
// 商品选择
const shopOptions = ref([])
const operatGroupDetailRef = ref(null)
//查询参数
const tableData = ref([])
const ckIds = ref({})
// 过滤优惠券
const defaultCouponFilter = ref('')
// table ref
const tableRef = ref(null)
const handleCheck = (rowKeys) => {
  model.value.group = rowKeys
}
//优惠券列表选择相关
const columns = [
  {
    type: 'selection',
    key: 'coupon_id',
    render() {
      return true
    },
  },
  { title: 'ID', key: 'coupon_id', align: 'center', width: 160 },
  {
    title: '商品名称',
    key: 'title',
    align: 'center',
    width: 252,
    filter(value, row) {
      return ~row.title.indexOf(value)
    },
    render(row) {
      return row.title
    },
  },
  {
    title: '佣金率',
    width: 80,
    key: 'commissionShare',
    align: 'center',
    render(row) {
      return row.commissionShare || 0
    },
  },
  {
    title: '面值(元)',
    key: 'face_value',
    align: 'center',
    width: 100,
    render(row) {
      return row.face_value
    },
  },
  {
    title: '价格(元)',
    key: 'price',
    align: 'center',
    width: 100,
    render(row) {
      return row.price
    },
  },
  { title: '兑换价格(牛金豆)', key: 'credits', align: 'center', width: 150 },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    fixed: 'right',
    size: 'large',
    width: 260,
    render(row, index) {
      return [
        h(
                NButton,
                {
                  size: 'tiny',
                  type: 'primary',
                  style: {
                    'margin-right': '10px',
                  },
                  secondary: true,
                  onClick: () => {
                    const currentIndex = row.current_index
                    const currData = tableData.value[currentIndex]
                    tableData.value.splice(currentIndex, 1)
                    tableData.value.unshift(currData)
                    resetIndex()
                  },
                },
                { default: () => '置顶', icon: renderIcon('typcn:arrow-up-thick', { size: 14 }) }
        ),
        h(NInputNumber, {
          value: row._index,
          min: 1,
          size: 'tiny',
          max: tableData.value.length,
          style: {
            'margin-right': '10px',
            width: '85px',
            display: 'inline-block',
          },
          onUpdateValue(value) {
            const currentIndex = row.current_index
            tableData.value[currentIndex]._index = value
          },
          onBlur(value) {
            const currInputIndex = row.current_index
            const inputValue = row._index - 1
            if (currInputIndex === inputValue) return
            const currData = tableData.value[currInputIndex]
            const targetIndex = tableData.value[inputValue]
            tableData.value[inputValue] = currData
            tableData.value[currInputIndex] = targetIndex
            resetIndex()
          },
        }),
        h(
                NButton,
                {
                  size: 'tiny',
                  type: 'primary',
                  style: {
                    'margin-right': '10px',
                  },
                  secondary: true,
                  onClick: () => {
                    const currentIndex = row.current_index
                    const currData = tableData.value[currentIndex]
                    tableData.value.splice(currentIndex, 1)
                    tableData.value.push(currData)
                    resetIndex()
                  },
                },
                { default: () => '置底', icon: renderIcon('typcn:arrow-down-thick', { size: 14 }) }
        ),
      ]
    },
  },
]
// 添加数组内容
function addListHandle(addList) {
  addList &&
    addList.forEach((item) => {
      shopOptions.value = shopOptions.value.filter((optionItem) => optionItem.coupon_id != item.coupon_id)
      model.value.group.push(item.coupon_id)
      tableData.value.push({
        ...item,
        _index: tableData.value.length + 1,
        current_index: tableData.value.length,
      })
    })
  // 滑动到底部
  setTimeout(() => {
    tableRef.value.scrollTo({
      left: 0,
      top: 10000,
    })
  }, 100)
  defaultCouponFilter.value = ''
  tableRef.value.filter({
    title: [],
  })
}
/** 表单过滤 */
const handleUpdateFilter = () => {
  let arr = []
  arr.push(defaultCouponFilter.value)
  console.log('arr:', arr)
  tableRef.value.filter({
    title: arr,
  })
}
// 重置数组的排序
function resetIndex() {
  tableData.value.forEach((item, index) => {
    item._index = index + 1
    item.current_index = index
  })
}
function selectHandle() {
  operatGroupDetailRef.value.show(shopOptions.value)
}
onMounted(() => {
  init()
})
const fileList = ref([])
const bgFileList = ref([])
const leftFileList = ref([])
const rightFileList = ref([])

function init() {
  http.getXq().then(async (res) => {
    if (res.code != 1) return
    const {
      id,
      contents,
      content,
      list,
    } = res.data
      ckIds.value = res.data.ckIds ? res.data.ckIds : []
      let _list = list.filter((item, index) => {
          if (item.coupon_id) {
              item._index = index + 1
              item.current_index = index
              return true
          }
          return false
      })
    const group = _list.map((item) => item.coupon_id)
    model.value = {
      id,
      contents,
      content,
      group,
    }
    tableData.value = _list
  })
}

/**表单验证 */
function handleValidateButtonClick() {
  console.log('model.value :>> ', model.value)
  formRef.value?.validate((errors) => {
    if (!errors) {
      let group = model.value.group
      group = tableData.value
        .filter((item) => group.includes(item.coupon_id))
        .map((item) => ({
          coupon_id: item.coupon_id,
        }))
      http
        .create({
          ...model.value,
          group,
        })
        .then((res) => {
          message.success(res.msg)
        })
    }
  })
  return false
}
</script>

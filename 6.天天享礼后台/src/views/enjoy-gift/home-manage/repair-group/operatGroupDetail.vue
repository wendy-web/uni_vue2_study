<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    preset="dialog"
    title="商品添加"
    positive-text="确认"
    negative-text="关闭"
    :style="{
      width: '1500px',
    }"
    @positive-click="handleValidateButtonClick"
    @negative-click="onNegativeClick"
  >
    <n-form
      :model="model"
      label-placement="left"
      label-width="140px"
      require-mark-placement="right-hanging"
      :style="{
        maxWidth: '1500px',
      }"
    >
      <n-form-item label="来源" path="lx_type">
        <n-select
          v-model:value="lx_type"
          :options="pageOptions"
          style="width: 200px"
          @update:value="lx_type_handleUpdate"
        />
      </n-form-item>
      <div flex>
        <n-form-item v-if="lx_type != 3" label="商品名称" path="coupon_id" w-400>
          <n-input v-model:value="inputValue" placeholder="请输入商品名称" clearable @input="handleUpdateFilter" />
        </n-form-item>
        <n-form-item v-if="lx_type == 0" label="选择状态" path="status_type">
          <n-select
            v-model:value="status_type"
            :options="statusOptions"
            style="width: 200px"
            clearable
            @update:value="status_type_handleUpdate"
          />
        </n-form-item>
      </div>
      <n-form-item label="商品列表" path="group">
        <CrudTable
          ref="$table"
          v-model:query-items="queryItems"
          :max-height="700"
          :scroll-x="1200"
          row-key="id"
          :columns="crudTableColumns"
          :get-data="crudTableData"
          :checked-row-keys="checkedRowKeys"
          @onChecked="handleCheck"
          @onAddKeyCheck="addKeyCheck"
          @onFilter="handleUpdateFilter"
        >
        </CrudTable>
      </n-form-item>
    </n-form>
  </n-modal>
</template>
<script setup>
import { ref } from 'vue'
import http from './api'
import { NRadio, NSelect } from 'naive-ui'
import { defineProps } from 'vue'
const props = defineProps({
  ckIds: Array,
})
/**弹窗显示控制 */
const showModal = ref(false)
/**弹窗取消 */
function onNegativeClick() {}
/**展示弹窗 */
const queryItems = ref({
  keyword: '',
  ls_status: '',
})
//表单数据
const model = ref({})
const status_type = ref(null)
const statusOptions = ref([
  {
    label: '下架',
    value: 0,
  },
  {
    label: '系统下架',
    value: 1,
  },
  {
    label: '上架',
    value: 2,
  },
])
const type_options = [
  {
    label: '苹果机',
    value: 1,
  },
  {
    label: '公共',
    value: 2,
  },
  {
    label: '安卓机',
    value: 3,
  },
]
function status_type_handleUpdate(value) {
  status_type.value = value
  handleUpdateFilter()
}

//优惠券列表选择相关
const columns = ref([
  {
    type: 'selection',
    key: 'id',
    disabled(row) {
      return props.ckIds.indexOf(row.coupon_id) > -1
    },
  },
  {
    title: 'ID',
    key: 'coupon_id',
    align: 'center',
    render(row) {
      return row.coupon_id || row.id
    },
  },
  {
    title: '商品名称',
    key: 'title',
    align: 'center',
    render(row) {
      return row.title || row.spuName
    },
  },
])
const lx_type = ref(0)
// 来源
const pageOptions = ref([
  {
    label: '乐刷',
    value: 0,
    getData: http.goodsList,
    queryItems: {
      ls_status: 1,
      title: '',
    },
    columns: [
      ...columns.value,
      {
        title: '捡漏价',
        key: 'coupon_price',
        align: 'center',
        render(row, index) {
          return Number(row.coupon_price) || 0
        },
      },
      { title: '捡漏库存', key: 'coupon_num', align: 'center' },
      {
        title: '面值(元)',
        key: 'marketPrice',
        align: 'center',
        render(row, index) {
          return Number(row.price / 100).toFixed(2)
        },
      },
      {
        title: '成本价格(元)',
        key: 'costPrice',
        align: 'center',
        render(row, index) {
          return Number(row.price / 100).toFixed(2)
        },
      },
      {
        title: '销售价格(元)',
        key: 'salePrice',
        align: 'center',
        render(row, index) {
          return Number(row.price / 100).toFixed(2)
        },
      },
      {
        title: '商品类型',
        key: 'type',
        align: 'center',
        render(row, index) {
          return row.type == 0 ? '直充' : '卡券'
        },
      },
      {
        title: '系统类型',
        key: 'device_type',
        align: 'center',
        render(row, index) {
          return h(NSelect, {
            options: type_options,
            value: row.device_type,
            'label-field': 'label',
            'value-field': 'value',
            onUpdateValue(value) {
              $table.value?.rowKeyChangeValue('device_type', value, index, row)
            },
          })
        },
      },
      {
        title: '启用状态',
        key: 'status',
        align: 'center',
        render(row, index) {
          return ['下架', '系统下架', '上架'][row.status]
        },
      },
    ],
  },
  {
    label: '京东',
    value: 1,
    getData: http.goodsQueryList,
    queryItems: {
      keyword: '',
    },
    columns: [
      ...columns.value,
      {
        title: '佣金率',
        key: 'commissionShare',
        align: 'center',
        render(row) {
          return row.commissionShare || 0
        },
      },
      { title: '面值(元)', key: 'face_value', align: 'center' },
      { title: '兑换价格(牛金豆)', key: 'credits', align: 'center' },
      { title: '有效期(天)', key: 'expiry_date', align: 'center' },
      {
        title: '创建时间',
        key: 'create_time',
        align: 'center',
      },
    ],
  },
  {
    label: '拼多多',
    value: 2,
    getData: http.goodsSearch,
    queryItems: {
      keyword: '',
    },
    columns: [
      ...columns.value,
      {
        title: '佣金率',
        key: 'commissionShare',
        align: 'center',
        render(row) {
          return row.commissionShare || 0
        },
      },
      { title: '面值(元)', key: 'face_value', align: 'center' },
      { title: '兑换价格(牛金豆)', key: 'credits', align: 'center' },
      { title: '有效期(天)', key: 'expiry_date', align: 'center' },
      {
        title: '创建时间',
        key: 'create_time',
        align: 'center',
      },
    ],
  },
  {
    label: '深爱购',
    value: 3,
    getData: http.goodsList2,
    queryItems: {},
    columns: [
      ...columns.value,
      {
        title: '捡漏价',
        key: 'goods_price_min',
        align: 'center',
        render(row, index) {
          return row.goods_price_min
        },
      },
      {
        title: '成本价格(元)',
        key: 'line_price_min',
        align: 'center',
        render(row, index) {
          return row.line_price_min
        },
      },
      {
        title: '商品类型',
        key: 'goods_type',
        align: 'center',
        render(row, index) {
          return row.goods_type == 10 ? '实物商品' : '虚拟商品'
        },
      },
      {
        title: '系统类型',
        key: 'device_type',
        align: 'center',
        render(row, index) {
          return h(NSelect, {
            options: type_options,
            value: row.device_type,
            'label-field': 'label',
            'value-field': 'value',
            onUpdateValue(value) {
              $table.value?.rowKeyChangeValue('device_type', value, index, row)
            },
          })
        },
      },
      {
        title: '启用状态',
        key: 'status',
        align: 'center',
        render(row, index) {
          return row.status == 0 ? '下架' : '上架'
        },
      },
    ],
  },
])
const crudTableData = ref() // crudTable请求的data
const crudTableColumns = ref([])
const $table = ref(null)
// 来源的选择
async function lx_type_handleUpdate(value, options) {
  status_type.value = null
  inputValue.value = ''
  queryItems.value = {}
  queryItems.value.not_coupon = 1;
  checkedRowKeys.value = []
  crudTableData.value = pageOptions.value[value].getData
  crudTableColumns.value = pageOptions.value[value].columns
  await nextTick()
  return $table.value?.handleSearch()
}

/**回调父组件函数注册 */
const emit = defineEmits(['addList'])
/** 表单过滤 */
let timer = null
const handleUpdateFilter = () => {
  const updateInputValue = inputValue.value.trim()
  if (timer) {
    timer = null
    clearTimeout(timer)
  }
  timer = setTimeout(() => {
    if (lx_type.value == 0) {
      queryItems.value.title = updateInputValue
      queryItems.value.status = status_type.value
    } else {
      queryItems.value.keyword = updateInputValue
    }
    $table.value?.handleSearch()
    clearTimeout(timer)
    timer = null
  }, 100)
}
// 关键字搜索
const inputValue = ref('')
const checkedRowKeys = ref([])
const checkAddKeyList = ref([])
const handleCheck = (rowKeys, addKeyList, rows) => {
  checkedRowKeys.value = rowKeys
  checkAddKeyList.value = rows
}
const addKeyCheck = (addKeyList, rows) => {
  checkAddKeyList.value = rows
}

/** 表单的提交 */
function handleValidateButtonClick() {
  let group = checkedRowKeys.value
  group = group.map((res, index) => {
    const currentSel = {
      coupon_id: res,
      device_type: checkAddKeyList.value[index].device_type || 2,
    }
    if (lx_type.value == 2) currentSel.goods_sign = checkAddKeyList.value[index].goods_sign
    if (lx_type.value == 1) currentSel.itemId = checkAddKeyList.value[index].itemId
    return currentSel
  })
  emit('addList', group)
  return true
}
/**展示弹窗 */
async function show() {
  inputValue.value = '' // 清除输入的搜索
  showModal.value = true
  model.value.group = []
  checkedRowKeys.value = []
  lx_type.value = 0
  crudTableData.value = pageOptions.value[lx_type.value].getData
  crudTableColumns.value = pageOptions.value[lx_type.value].columns
  await nextTick()
  $table.value?.handleSearch()
}
/**暴露给父组件使用 */
defineExpose({
  show,
})
</script>

<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    preset="dialog"
    title="商品添加"
    positive-text="确认"
    negative-text="关闭"
    :style="{
      width: '2000px',
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
        maxWidth: '2000px',
      }"
    >
      <n-form-item label="来源" path="lx_type">
        <n-select v-model:value="lx_type" :options="pageOptions" style="width: 200px" />
      </n-form-item>
      <n-form-item v-if="lx_type == 2" label="选品库" path="groupId" w-600>
        <n-input
          v-model:value="defaultCouponFilter2"
          placeholder="请输入选品库ID"
          clearable
          @input="handleUpdateFilter"
        />
      </n-form-item>
      <n-form-item v-else label="商品名称" path="coupon_id" w-600>
        <n-input
          v-model:value="defaultCouponFilter"
          placeholder="请输入商品名称"
          clearable
          @input="handleUpdateFilter"
        />
      </n-form-item>
      <n-form-item label="商品列表" path="group">
        <CrudTable
          ref="$table"
          v-model:query-items="queryItems"
          :list-data="tableData"
          :max-height="700"
          :scroll-x="1200"
          row-key="coupon_id"
          :columns="columns"
          :get-data="requestGetData"
          :checked-row-keys="checkedRowKeys"
          @onChecked="handleCheck"
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
  not_coupon: 1
})
//表单数据
const model = ref({})
//查询参数
const tableData = ref([])
//优惠券列表选择相关
const columns = ref([
  {
    type: 'selection',
    key: 'coupon_id',
    disabled(row) {
      return props.ckIds.indexOf(row.coupon_id) > -1
    },
  },
  { title: 'ID', key: 'coupon_id', align: 'center' },
  {
    title: '商品名称',
    key: 'title',
    align: 'center',
    filter(value, row) {
      return ~row.title.indexOf(value)
    },
  },
  {
    title: '佣金率',
    key: 'commissionShare',
    align: 'center',
    render(row) {
      return row.commissionShare || 0
    },
  },
  { title: '面值(元)', key: 'face_value', align: 'center' },
  { title: '价格(元)', key: 'price', align: 'center' },
  { title: '兑换价格(牛金豆)', key: 'credits', align: 'center' },
  {
    title: '上架状态',
    key: 'status',
    align: 'center',
    render(row) {
      return row.status == 1 ? '上架' : '未上架'
    },
  },
])
const lx_type = ref(1)
const requestGetData = ref()
// 来源
const pageOptions = ref([
  {
    label: '京东',
    value: 1,
    _tableData: null,
    getData: http.goodsQueryList,
  },
  {
    label: '选品库',
    value: 2,
    _tableData: null,
    getData: http.goodsQueryList,
  },
])
const $table = ref(null)
const defaultCouponFilter = ref('')
const defaultCouponFilter2 = ref('')
const checkedRowKeys = ref([])

/**回调父组件函数注册 */
const emit = defineEmits(['addList'])
/** 表单过滤 */
let timer = null
const handleUpdateFilter = () => {
  const inputValue = defaultCouponFilter.value.trim()
  if (timer) {
    timer = null
    clearTimeout(timer)
  }
  timer = setTimeout(() => {
    queryItems.value.keyword = inputValue
    if (lx_type.value == 1) {
      return $table.value?.handleSearch()
    }
    if (lx_type.value == 2) {
      const groupId = defaultCouponFilter2.value.trim()
      queryItems.value.groupId = groupId
      return $table.value?.handleSearch()
    }
    const searchList = tableData.value.filter((item) => item.title.includes(inputValue))
    $table.value.showGetList(searchList)
    clearTimeout(timer)
    timer = null
  }, 100)
}
// 过滤优惠券
const handleCheck = (rowKeys) => {
  checkedRowKeys.value = rowKeys
}
watch(
  () => lx_type.value,
  async (newValue, oldValue) => {
    requestGetData.value = pageOptions.value[newValue - 1].getData
    defaultCouponFilter.value = ''
    defaultCouponFilter2.value = ''
    queryItems.value.keyword = ''
    checkedRowKeys.value = []
    switch (newValue) {
      case 1:
        delete queryItems.value.groupId
        await nextTick()
        $table.value?.handleSearch()
        break
      case 2:
        queryItems.value.groupId = ''
        await nextTick()
        $table.value?.handleSearch()
        break
    }
  },
  {
    deep: true,
    // immediate: true,
  }
)

/** 表单的提交 */
function handleValidateButtonClick() {
  let list = $table.value.getTableData()
  let group = checkedRowKeys.value
  const selectList =
    group &&
    list.filter((item) => {
      item.lx_type = lx_type
      return group.includes(item.coupon_id)
    })
  emit('addList', selectList)
  return true
}
/**展示弹窗 */
async function show() {
  showModal.value = true
  lx_type.value = 1
  requestGetData.value = pageOptions.value[0].getData
  await nextTick()
  $table.value?.handleSearch()
}
/**暴露给父组件使用 */
defineExpose({
  show,
})
</script>

<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    preset="dialog"
    title="选择商品"
    positive-text="确定"
    negative-text="关闭"
    :style="{
      width: '1500px',
    }"
    @positive-click="handleValidateButtonClick"
    @negative-click="onNegativeClick"
  >
    <CrudTable
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="http.getGoods"
      :checked-row-keys="checkedRowKeys"
      @onChecked="onChecked"
    >
      <template #queryBar>
        <QueryBarItem label="商品名称" :label-width="80">
          <n-input
            v-model:value="queryItems.goods_name"
            type="text"
            placeholder="请输入商品名称"
            @keydown.enter="$table?.handleSearch"
          />
        </QueryBarItem>
        <QueryBarItem label="商品编号" :label-width="80">
          <n-input
            v-model:value="queryItems.goods_numbber"
            type="text"
            placeholder="请输入商品编号"
            @keydown.enter="$table?.handleSearch"
          />
        </QueryBarItem>
        <QueryBarItem label="商品类型" :label-width="80">
          <n-select v-model:value="queryItems.goods_type" :options="goodsTypeOptions" />
        </QueryBarItem>
        <QueryBarItem label="启用状态" :label-width="80">
          <n-select v-model:value="queryItems.use" :options="goodsStatusOptions" />
        </QueryBarItem>
      </template>
    </CrudTable>
  </n-modal>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import http from '../api'
//弹窗操作
const showModal = ref(false)
//表格操作
const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})
/**商品类型下拉列表 */
const goodsTypeOptions = [
  {
    label: '直冲',
    value: 0,
  },
  {
    label: '卡券',
    value: 1,
  },
]
/**商品状态下拉列表 */
const goodsStatusOptions = [
  {
    label: '系统停用',
    value: 2,
  },
  {
    label: '启用',
    value: 1,
  },
  {
    label: '关闭',
    value: 0,
  },
]
//当前图片选项
let currItem = null

function show(item) {
  currItem = item
  checkedRowKeys.value = []
  showModal.value = true
  nextTick(() => {
    $table.value?.handleRefreshCurr()
  })
}

const checkedRowKeys = ref([])

function onChecked(data) {
  checkedRowKeys.value = data
}

const columns = [
  { type: 'selection', multiple: false },
  { title: '商品编号', key: 'goods_number', align: 'center' },
  { title: '商品名称', key: 'goods_name', align: 'center' },
  { title: 'SPU名称', key: 'spuName', align: 'center' },
  {
    title: '商品类型',
    key: 'goods_type',
    align: 'center',
    render(row, index) {
      return row.goods_type == 0 ? '直充' : '卡券'
    },
  },
  {
    title: '面值(元)',
    key: 'price',
    align: 'center',
    render(row, index) {
      return Number(row.price / 100).toFixed(2)
    },
  },
  {
    title: '成本价(元)',
    key: 'cost',
    align: 'center',
    render(row, index) {
      return Number(row.cost / 100).toFixed(2)
    },
  },
  {
    title: '差价(元)',
    key: 'price_difference',
    align: 'center',
    render(row, index) {
      return Number(row.price_difference / 100).toFixed(2)
    },
  },
  {
    title: '抵扣金额(元)',
    key: 'deduction_price',
    align: 'center',
    render(row, index) {
      return Number(row.deduction_price / 100).toFixed(2)
    },
  },
  {
    title: '抵扣积分',
    key: 'deduction_credits',
    align: 'center',
  },
  {
    title: '销售状态',
    key: 'status',
    align: 'center',
    render(row, index) {
      return ['下架', '上架'][row.status]
    },
  },
  {
    title: '启用状态',
    key: 'use',
    align: 'center',
    render(row, index) {
      return ['关闭', '启用', '系统停用'][row.use]
    },
  },
]

//确认
function handleValidateButtonClick() {
  let id = checkedRowKeys.value[0]
  let list = $table.value.getTableData()
  let item = list[list.findIndex((item) => item.id === id)]
  currItem.id = item.id
  currItem.goods_name = item.goods_name
}
//取消
function onNegativeClick() {}

/**暴露给父组件使用 */
defineExpose({
  show,
})
/**回调父组件函数注册 */
const emit = defineEmits(['save'])
</script>

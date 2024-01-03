<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    preset="dialog"
    title="选择商品"
    positive-text="确定"
    negative-text="关闭"
    :style="{
      width: '1700px',
    }"
    @positive-click="handleValidateButtonClick"
    @negative-click="onNegativeClick"
  >
    <CrudTable
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1500"
      :columns="columns"
      :get-data="http.getGoods"
      :checked-row-keys="checkedRowKeys"
      @onChecked="onChecked"
    >
      <template #queryBar>
        <QueryBarItem label="商品编号" :label-width="80">
          <n-input
            v-model:value="queryItems.goods_number"
            type="text"
            placeholder="请输商品编号"
            @keydown.enter="$table?.handleSearch"
          />
        </QueryBarItem>
        <QueryBarItem label="商品名称" :label-width="80">
          <n-input
            v-model:value="queryItems.goods_name"
            type="text"
            placeholder="请输商品名称"
            @keydown.enter="$table?.handleSearch"
          />
        </QueryBarItem>
        <QueryBarItem label="spu名称" :label-width="80">
          <n-input
            v-model:value="queryItems.spuName"
            type="text"
            placeholder="请输spu名称"
            @keydown.enter="$table?.handleSearch"
          />
        </QueryBarItem>
        <QueryBarItem label="商品类型" :label-width="80">
          <n-select v-model:value="queryItems.goods_type" :options="goodsTypeOptions" />
        </QueryBarItem>
        <QueryBarItem label="启用状态" :label-width="80">
          <n-select v-model:value="queryItems.use" :options="goodsStatusOptions" />
        </QueryBarItem>
        <QueryBarItem label="系统类型" :label-width="80">
          <n-select v-model:value="queryItems.device_type" :options="systemOptions" />
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
  {
    label: '公众号',
    value: 2,
  },
  {
    label: '视频号',
    value: 3,
  },
  {
    label: '小程序',
    value: 4,
  },
]
/**商品状态下拉列表 */
const goodsStatusOptions = [
  {
    label: '启用',
    value: 1,
  },
  {
    label: '停用',
    value: 0,
  },
  {
    label: '系统停用',
    value: 2,
  },
]
const systemOptions = [
  {
    label: 'ios',
    value: 1,
  },
  // {
  //   label: '公共',
  //   value: 2,
  // },
  {
    label: 'android',
    value: 3,
  },
]

const checkedRowKeys = ref([])
let checkedRows = []

function show(data, system) {
  checkedRowKeys.value = data.map((item) => item.id)
  checkedRows = data
  showModal.value = true
  // queryItems.value.system = system === 1 ? 3 : 1
  nextTick(() => {
    $table.value?.handleRefreshCurr()
  })
}

function onChecked(data) {
  checkedRowKeys.value = data
  let arr = checkedRows.concat(
    $table.value?.tableData.filter(function (item) {
      return checkedRows.map((v) => v.id).indexOf(item.id) === -1
    })
  )
  checkedRows = arr.filter((item) => data.includes(item.id)).map((v) => ({ ...v }))
}

const columns = [
  { type: 'selection', multiple: true },
  { title: '商品编号', key: 'goods_number', align: 'center' },
  { title: '商品名称', key: 'goods_name', align: 'center' },
  { title: 'spuName', key: 'spuName', align: 'center' },
  { title: '参考名称', key: 'skuName', align: 'center' },
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
    key: 'marketPrice',
    align: 'center',
    render(row, index) {
      return Number(row.price / 100).toFixed(2)
    },
  },
  {
    title: '成本(元)',
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
  { title: '抵扣积分', key: 'deduction_credits', align: 'center' },
  {
    title: '销售状态',
    key: 'status',
    align: 'center',
    render(row, index) {
      return row.status == 0 ? '下架' : '上架'
    },
  },
  {
    title: '启用状态',
    key: 'status',
    align: 'center',
    render(row, index) {
      return ['停用', '启用', '系统停用'][row.use]
    },
  },
  {
    title: '系统',
    key: 'device_type',
    align: 'center',
    render(row, index) {
      return ['苹果', '公共', '安卓'][row.device_type - 1]
    },
  },
]

//确认
function handleValidateButtonClick() {
  emit('selectSave', checkedRows)
}
//取消
function onNegativeClick() {}

/**暴露给父组件使用 */
defineExpose({
  show,
})
/**回调父组件函数注册 */
const emit = defineEmits(['selectSave'])
</script>

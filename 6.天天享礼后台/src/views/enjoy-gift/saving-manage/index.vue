<template>
  <CommonPage title="省钱卡订单">
    <CrudTable
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="2200"
      :columns="columns"
      :get-data="http.getList"
    >
      <template #queryBar>
        <QueryBarItem label="订单状态" :label-width="80">
          <n-select v-model:value="queryItems.status" :options="statusOptions" clearable />
        </QueryBarItem>
        <QueryBarItem label="订单号" :label-width="80">
          <n-input v-model:value="queryItems.trade_no" type="text" clearable @keydown.enter="$table?.handleSearch" />
        </QueryBarItem>
        <QueryBarItem label="用户ID" :label-width="80">
          <n-input-number v-model:value="queryItems.uid" type="text" min="1" clearable @keydown.enter="$table?.handleSearch" />
        </QueryBarItem>
        <QueryBarItem label="下单时间" :label-width="80" :content-width="340">
          <n-date-picker
            v-model:formatted-value="queryItems.create_time"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            type="datetimerange"
            clearable
          />
        </QueryBarItem>
        <QueryBarItem label="支付时间" :label-width="80" :content-width="340">
          <n-date-picker
            v-model:formatted-value="queryItems.pay_time"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            type="datetimerange"
            clearable
          />
        </QueryBarItem>
      </template>
    </CrudTable>
  </CommonPage>
</template>

<script setup>
import http from './api';
defineOptions({ name: 'OrderList' })
//表格操作
const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({
  status: null,
  goods_type: null,
  channel: null,
  pay_way: null,
})
/**订单状态下拉列表 */
const statusOptions = [
  {
    label: '已支付',
    value: 2,
  },
  {
    label: '已过期',
    value: 3,
  },
]
function finishImportHandle() {
  refresh()
}
onActivated(() => {
  refresh()
})
//刷新表格
function refresh() {
  $table.value?.handleSearch()
}
const columns = ref([
  {
    title: '订单号',
    key: 'trade_no',
    align: 'center',
    width: 220,
    fixed: 'left',
  },
  {
    title: '省钱卡类型',
    key: 'card_type',
    align: 'center',
    width: 100,
    render(row, index) {
      return ['月卡', '季卡', '年卡'][row.card_type]
    },
  },
  {
    title: '支付金额',
    key: 'pay_amount',
    align: 'center',
    width: 100,
    render(row, index) {
      return '￥' + Number(row.pay_amount / 100).toFixed(2)
    },
  },
  { title: '红包总金额', key: 'packet_amount', align: 'center', width: 100 },
  { title: '已用红包', key: 'use_packet', align: 'center', width: 100 },
  { title: '红包抵扣订单数', key: 'packet_order', align: 'center', width: 100 },
  { title: '用户ID', key: 'uid', align: 'center', width: 100 },
  { title: '关联商品订单号', key: 'third_order_id', align: 'center', width: 220 },
  {
    title: '免豆特权',
    key: 'is_add_to',
    align: 'center',
    width: 100,
    render(row, index) {
      return row.is_add_to == 10 ? '已开通' : '未开通'
    },
  },
  {
    title: '订单状态',
    key: 'status',
    align: 'center',
    width: 100,
    render(row) {
      let index = statusOptions.findIndex((item) => item.value === row['status'])
      return statusOptions[index].label
    },
  },
  { title: '下单时间', key: 'create_time', align: 'center', width: 100 },
  { title: '支付时间', key: 'pay_time', align: 'center', width: 100 },
  { title: '过期时间', key: 'over_time', align: 'center', width: 100 },
])
</script>

<template>
  <CommonPage title="团长分佣订单">
    <div class="statistics" ml-10 mt-10 mb-24 flex color-black>
      <div class="statistics-item"><span text-16>有效订单数</span>：￥{{ gmv_amount.orderNum }}</div>
      <div class="statistics-item" ml-24><span text-16>团长预估佣金</span>：￥{{ gmv_amount.orderProfit }}</div>
    </div>
    <CrudTable
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="http.getList"
      @export="exportOrders"
    >
      <template #queryBar>
        <QueryBarItem label="团长ID" :label-width="80">
          <n-input-number min="1" v-model:value="queryItems.user_id" type="text" @keydown.enter="$table?.handleSearch" />
        </QueryBarItem>
        <QueryBarItem label="订单号" :label-width="80">
          <n-input v-model:value="queryItems.third_order_id" type="text" @keydown.enter="$table?.handleSearch" />
        </QueryBarItem>
        <QueryBarItem label="订单状态" :label-width="100">
          <n-select v-model:value="queryItems.order_status" :options="ztOptions" clearable />
        </QueryBarItem>
        <QueryBarItem label="下单用户ID" :label-width="80">
          <n-input v-model:value="queryItems.uid" type="text" @keydown.enter="$table?.handleSearch" />
        </QueryBarItem>
        <QueryBarItem label="下单时间" :label-width="80" :content-width="340">
          <n-date-picker
            v-model:formatted-value="queryItems.buy_range"
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
import axios from 'axios'
import http from './api'
//表格操作
const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})
onMounted(() => {
  refresh()
})
//刷新表格
function refresh() {
  $table.value?.handleSearch()
}
const gmv_amount = ref('')
async function getOrderGmv() {
  const res = await http.orderGmv(queryItems.value)
  if (res.code != 1) return
  gmv_amount.value = res.data
}
watch(
  queryItems,
  (newValue, oldValue) => {
    getOrderGmv()
  },
  { deep: true, immediate: true }
)
const ztOptions = [
  {
    label: '全部',
    value: 0
  },
  {
    label: '无效',
    value: 1
  },
  {
    label: '有效',
    value: 2
  },
]
const columns = ref([
  { title: '订单号', key: 'third_order_id', align: 'center' },
  { title: '下单时间', key: 'buy_time', align: 'center' },
  { title: '支付金额', key: 'pay_amount', align: 'center' },
  { title: '商品编号', key: 'goods_number', align: 'center' },
  { title: '商品名称', key: 'goods_name', align: 'center' },
  { title: '订单来源', key: 'order_type', align: 'center' },
  { title: '预估收益', key: 'yg_income', align: 'center' },
  { title: '补贴收益(pdd)', key: 'bt_income', align: 'center' },
  { title: '用户返利', key: 'profit_money', align: 'center' },
  { title: '下单用户ID', key: 'uid', align: 'center' },
  { title: '下单用户类型', key: 'vip_order', align: 'center',
    render(row) {
      return ['普通用户', '省钱卡会员'][
        row.vip_order
      ]
    },
  },
  { title: '团长ID', key: 'user_id', align: 'center' },
  { title: '团长昵称', key: 'nick_name', align: 'center' },
  { title: '团长佣金', key: 'settle', align: 'center' },
  { title: '订单状态', key: 'order_status', align: 'center',
    render(row) {
      return ['无效', '有效'][
        row.order_status
      ]
    },
  }
])
</script>

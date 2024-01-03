<template>
  <CommonPage show-footer title="AI充值">
    <div class="statistics" ml-10 mt-10 mb-24 flex color-black>
      <div class="statistics-item"><span text-16>充值金额</span>：{{ statistics.amount }}</div>
      <div class="statistics-item" ml-24><span text-16>充值笔数</span>：{{ statistics.order_num }}</div>
      <div class="statistics-item" ml-24><span text-16>充值人数</span>：{{ statistics.uid_num }}</div>
    </div>
    <CrudTable
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="http.getList"
      @getDataCallback="getDataCallback"
    >
      <template #queryBar>
        <QueryBarItem label="下单时间" :label-width="80" :content-width="340">
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
import { onMounted } from 'vue'
import http from '../api'
defineOptions({ name: 'AiRecharge' })
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
//获取统计
const statistics = ref({ amount: 0, order_num: 0, uid_num: 0 })

function getDataCallback(data) {
  if (data.count && !Array.isArray(data.count)) {
    let { amount, order_num, uid_num } = data.count
    statistics.value = {
      amount: '￥' + Number(amount).toFixed(2),
      order_num,
      uid_num,
    }
  }
}

const columns = [
  { title: 'ID', key: 'id', align: 'center' },
  { title: '商品名称', key: 'title', align: 'center' },
  { title: '订单号', key: 'out_trade_no', align: 'center' },
  {
    title: '充值金额',
    key: 'pay_money',
    align: 'center',
    render(row, index) {
      return '￥' + Number(row.pay_money).toFixed(2)
    },
  },
  { title: '充值时间', key: 'pay_time', align: 'center' },
  {
    title: '来源',
    key: 'source',
    align: 'center',
    render(row, index) {
      return row.source || '--'
    },
  },
]
</script>

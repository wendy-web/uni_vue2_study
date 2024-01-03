<template>
  <CommonPage title="订单管理">
    <div class="statistics" ml-10 mt-10 mb-24 flex color-black>
      <div class="statistics-item"><span text-16>成功交易金额</span>：￥{{ statistics.suc_amount }}</div>
      <div class="statistics-item" ml-24><span text-16>成功交易笔数</span>：{{ statistics.suc_num }}</div>
      <div v-if="statistics.profit_show" class="statistics-item" ml-24>
        <span text-16>预估收益</span>：￥{{ statistics.total_profit }}
      </div>
    </div>
    <template #action>
      <n-button type="primary" @click="synchronization"> 同步美团订单 </n-button>
    </template>
    <CrudTable
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="http.getList"
      :extra-params="{
        isExport: true,
      }"
      @export="exportOrders"
      @getDataCallback="getDataHandle"
    >
      <template #queryBar>
        <QueryBarItem label="订单状态" :label-width="80">
          <n-select v-model:value="queryItems.status" :options="statusOptions" />
        </QueryBarItem>
        <QueryBarItem label="订单号" :label-width="80">
          <n-input v-model:value="queryItems.third_order_id" type="text" @keydown.enter="$table?.handleSearch" />
        </QueryBarItem>
        <QueryBarItem label="收货人" :label-width="80">
          <n-input v-model:value="queryItems.charge_account" type="text" @keydown.enter="$table?.handleSearch" />
        </QueryBarItem>
        <QueryBarItem label="商品编号" :label-width="80">
          <n-input v-model:value="queryItems.goods_skuCode" type="text" @keydown.enter="$table?.handleSearch" />
        </QueryBarItem>
        <QueryBarItem label="商品名称" :label-width="80">
          <n-input v-model:value="queryItems.goods_name" type="text" @keydown.enter="$table?.handleSearch" />
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
        <QueryBarItem label="商品类型" :label-width="100">
          <n-select v-model:value="queryItems.goods_type" :options="typeOptions" />
        </QueryBarItem>
        <QueryBarItem label="订单来源" :label-width="100">
          <n-select v-model:value="queryItems.pay_way" :options="ptOptions" />
        </QueryBarItem>
      </template>
    </CrudTable>
  </CommonPage>
</template>

<script setup>
import axios from 'axios'
import http from './api'
defineOptions({ name: 'OrderList' })
//表格操作
const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})
/**订单状态下拉列表 */
const statusOptions = [
  {
    label: '待付款',
    value: 0,
  },
  {
    label: '已取消',
    value: 1,
  },
  {
    label: '发货中',
    value: 2,
  },
  {
    label: '待核销',
    value: 3,
  },
  {
    label: '已完成',
    value: 4,
  },
  {
    label: '已退款',
    value: 5,
  },
]
/**启用状态下拉列表 */
const typeOptions = [
  {
    label: '直充',
    value: 0,
  },
  {
    label: '卡券',
    value: 1,
  },
  {
    label: '美团',
    value: 2,
  },
  {
    label: '千猪-电影票',
    value: 3,
  },
  {
    label: '千猪-肯德基',
    value: 4,
  },
  {
    label: '千猪-星巴克',
    value: 5,
  },
]
const ptOptions = [
  {
    label: '乐刷',
    value: 0,
  },
  {
    label: '美团联盟',
    value: 1,
  },
  {
    label: '千猪',
    value: 2,
  },
]

onActivated(() => {
  refresh()
  synchronization2()
  // getStat()
})
//刷新表格
function refresh() {
  $table.value?.handleSearch()
}

//获取统计
const statistics = ref({
  suc_amount: 0,
  suc_num: 0,
  total_profit: 0,
  profit_show: 0,
})
// function getStat() {
//   http.getStat().then((res) => {
//     let { suc_amount, suc_num } = res.data
//     statistics.value = {
//       suc_amount: suc_amount.toLocaleString(),
//       suc_num: suc_num.toLocaleString(),
//     }
//   })
// }
const columns = ref([
  { title: '订单号', key: 'third_order_id', align: 'center' },
  { title: '下单时间', key: 'create_time', align: 'center' },
  {
    title: '订单金额',
    key: 'amount',
    align: 'center',
    render(row, index) {
      return '￥' + Number(row.amount / 100).toFixed(2)
    },
  },
  {
    title: '优惠券金额',
    key: 'coupon_amount',
    align: 'center',
    render(row, index) {
      return '￥' + Number(row.coupon_amount / 100).toFixed(2)
    },
  },
  {
    title: '支付金额',
    key: 'pay_amount',
    align: 'center',
    render(row, index) {
      return '￥' + Number(row.pay_amount / 100).toFixed(2)
    },
  },
  { title: '支付时间', key: 'pay_time', align: 'center' },
  { title: '退款时间', key: 'refund_time', align: 'center' },
  { title: '收货人', key: 'charge_account', align: 'center' },
  { title: '完成时间', key: 'complete_time', align: 'center' },
  { title: '商品编号', key: 'goods_skuCode', align: 'center' },
  { title: '商品名称', key: 'goods_name', align: 'center' },
  {
    title: '商品类型',
    key: 'goods_type',
    align: 'center',
    render(row, index) {
      return row.goods_type
    },
  },
  {
    title: '订单来源',
    key: 'pay_way',
    align: 'center',
    render(row, index) {
      return row.pay_way
    },
  },
  {
    title: '订单状态',
    key: 'status',
    align: 'center',
    render(row) {
      let index = statusOptions.findIndex((item) => item.value === row['status'])
      return statusOptions[index].label
    },
  },
])
let isProfitShow = true
function getDataHandle(data) {
  const { total } = data
  statistics.value = {
    suc_amount: total?.suc_amount || 0,
    suc_num: total?.suc_num || 0,
    total_profit: total?.total_profit || 0,
    profit_show: total?.profit_show || 0,
  }
  // 展示收益的权限
  if (isProfitShow && statistics.value.profit_show) {
    isProfitShow = false
    columns.value.splice(
      5,
      0,
      {
        title: '商品成本',
        key: 'profit_costPrice',
        align: 'center',
        render(row, index) {
          return '￥' + Number((row.costPrice || 0) / 100).toFixed(2)
        },
      },
      {
        title: '预估收益',
        key: 'profit_amount',
        align: 'center',
        render(row, index) {
          return '￥' + Number((row.profit || 0) / 100).toFixed(2)
        },
      }
    )
  }
}

// 导出商品
function exportOrders(params) {
  axios
    .post('/apios/order/export', params, { responseType: 'blob' })
    .then((res) => {
      if (!res) {
        return
      }
      let url = window.URL.createObjectURL(
        new Blob([res.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
      )
      let a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.target = '_blank'
      a.setAttribute('download', '订单列表.xls')
      document.body.appendChild(a)
      a.click() //执行下载
      window.URL.revokeObjectURL(a.href)
      document.body.removeChild(a)
    })
    .catch((e) => {
      console.log(e)
    })
}

//自动同步
function synchronization2() {
  http.getMt({ type: 0 }).then(function (res) {
    refresh()
  })
}

//手动同步
function synchronization() {
  http.getMt({ type: 1 }).then(function (res) {
    refresh()
  })
}
</script>

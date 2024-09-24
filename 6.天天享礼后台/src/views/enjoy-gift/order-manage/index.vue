<template>
  <CommonPage title="订单管理">
    <div
      class="statistics"
      ml-10
      mt-10
      mb-24
      flex
      color-black
      style="align-items: center; justify-content: space-between; margin-right: 2.5rem"
    >
      <div class="flex">
        <div class="statistics-item"><span text-16>GMV</span>：￥{{ gmv_amount || 0 }}</div>
        <div class="statistics-item" ml-24><span text-16>成功交易金额</span>：￥{{ statistics.suc_amount }}</div>
        <div class="statistics-item" ml-24><span text-16>成功交易笔数</span>：{{ statistics.suc_num }}</div>
        <div v-if="statistics.profit_show" class="statistics-item" ml-24>
          <span text-16>预估收益</span>：￥{{ statistics.total_profit }}
        </div>
        <div v-if="statistics.profit_show" class="statistics-item" ml-24>
          <span text-16>预估结算收益</span>：￥{{ statistics.complete_profit }}
        </div>
      </div>
      <div v-if="statistics.profit_show" class="statistics-item" ml-24>
        <span text-18>海威账户余额：</span>
        <span v-if="balance.money >= 3000" text-18>￥{{ balance.money }}</span>
        <span v-else text-18 style="color: red; font-weight: 600">￥{{ balance.money }}</span>
      </div>
    </div>
    <CrudTable
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="2200"
      :columns="columns"
      :get-data="http.getList"
      :extra-params="{
        isExport: true,
        isImport: true,
      }"
      is-api="/apios/order/import"
      @export="exportOrders"
      @getDataCallback="getDataHandle"
      @finishImport="finishImportHandle"
    >
      <template #queryBar>
        <QueryBarItem label="订单状态" :label-width="80">
          <n-select v-model:value="queryItems.status" :options="statusOptions" clearable />
        </QueryBarItem>
        <QueryBarItem label="订单号" :label-width="80">
          <n-input
            v-model:value="queryItems.third_order_id"
            type="text"
            clearable
            @keydown.enter="$table?.handleSearch"
          />
        </QueryBarItem>
        <QueryBarItem label="用户ID" :label-width="80">
          <n-input-number
            v-model:value="queryItems.uid"
            type="text"
            clearable
            min="1"
            @keydown.enter="$table?.handleSearch"
          />
        </QueryBarItem>
        <QueryBarItem label="收货人" :label-width="80">
          <n-input
            v-model:value="queryItems.charge_account"
            type="text"
            clearable
            @keydown.enter="$table?.handleSearch"
          />
        </QueryBarItem>
        <QueryBarItem label="商品编号" :label-width="80">
          <n-input
            v-model:value="queryItems.goods_skuCode"
            type="text"
            clearable
            @keydown.enter="$table?.handleSearch"
          />
        </QueryBarItem>
        <QueryBarItem label="商品名称" :label-width="80">
          <n-input v-model:value="queryItems.goods_name" type="text" clearable @keydown.enter="$table?.handleSearch" />
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
        <QueryBarItem label="完成时间" :label-width="80" :content-width="340">
          <n-date-picker
            v-model:formatted-value="queryItems.complete_time"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            type="datetimerange"
            clearable
          />
        </QueryBarItem>
        <QueryBarItem label="商品类型" :label-width="100">
          <n-select v-model:value="queryItems.goods_type" :options="typeOptions" clearable />
        </QueryBarItem>
        <QueryBarItem label="订单来源" :label-width="100">
          <n-select v-model:value="queryItems.pay_way" :options="ptOptions" clearable />
        </QueryBarItem>
        <QueryBarItem label="渠道" :label-width="100">
          <n-select
            v-model:value="queryItems.channel"
            :options="channelOptions"
            clearable
            @update:value="channel_handleUpdate"
          />
        </QueryBarItem>
        <QueryBarItem v-if="queryItems.channel" label="推广位" :label-width="100">
          <n-select v-model:value="queryItems.extension" :options="extensionOptions" clearable />
        </QueryBarItem>
      </template>
    </CrudTable>
  </CommonPage>
</template>

<script setup>
import axios from 'axios';
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
  {
    label: '京东商品',
    value: 6,
  },
  {
    label: '心链话费',
    value: 7,
  },
  {
    label: '心链其他',
    value: 8,
  },
  {
    label: '海威瑞幸',
    value: 9,
  },
  {
    label: '海威麦当劳',
    value: 10,
  },
  {
    label: '拼多多',
    value: 11,
  },
  {
    label: '深爱购',
    value: 12,
  },
  {
    label: '饿了么CPA',
    value: 13,
  },
  {
    label: '饿了么CPS',
    value: 14,
  },
  {
    label: '海威华莱士',
    value: 15,
  },
  {
    label: '海威汉堡王',
    value: 16,
  },
  {
    label: '海威必胜客',
    value: 17,
  },
  {
    label: '海威喜茶',
    value: 18,
  },
  {
    label: '海威奈雪的茶',
    value: 19,
  },
  {
    label: '惠吃喝券',
    value: 20,
  },
  {
    label: '聚推客-库迪咖啡',
    value: 21,
  },
  {
    label: '1分购',
    value: 22,
  },
  {
    label: '聚推客-奈雪的茶',
    value: 23,
  },
  {
    label: '聚推客-瑞幸咖啡',
    value: 24,
  },
  {
    label: '聚推客-必胜客',
    value: 25,
  },
  {
    label: '聚推客-麦当劳',
    value: 26,
  },
  {
    label: '聚推客-星巴克',
    value: 27,
  },
  {
    label: '聚推客-肯德基',
    value: 28,
  },
  {
    label: '聚推客-电影',
    value: 29,
  },
  {
    label: '聚推客-打车出行',
    value: 30,
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
  {
    label: '京东联盟',
    value: 3,
  },
  {
    label: '心链',
    value: 4,
  },
  {
    label: '海威',
    value: 5,
  },
  {
    label: '拼多多',
    value: 6,
  },
  {
    label: '深爱购',
    value: 7,
  },
  {
    label: '饿了么',
    value: 8,
  },
  {
    label: '惠吃喝券',
    value: 9,
  },
  {
    label: '聚推客联盟',
    value: 10,
  },
  {
    label: '1分购',
    value: 11,
  },
]
//推广位
const extensionOptions = ref({})
//渠道
const channelOptions = ref({})
function finishImportHandle() {
  refresh()
}
onActivated(() => {
  refresh()
  getBalance()
  channel_get()
  //   getOrderGmv()
})
//刷新表格
function refresh() {
  $table.value?.handleSearch()
}

const balance = ref({
  money: 0,
})
const gmv_amount = ref('')
async function getOrderGmv() {
  const res = await http.orderGmv(queryItems.value)
  if (res.code != 1) return
  gmv_amount.value = res.data.gmv_amount
  const total = res.data.total
  statistics.value.suc_amount = total?.suc_amount || 0
  statistics.value.suc_num = total?.suc_num || 0
  statistics.value.total_profit = total?.total_profit || 0
  statistics.value.complete_profit = total?.complete_profit || 0
}
//获取余额
function getBalance() {
  http.getBalance().then((res) => {
    console.log(res)
    balance.value = {
      money: res.data.money || 0,
    }
  })
}
watch(
  queryItems,
  (newValue, oldValue) => {
    getOrderGmv()
  },
  { deep: true, immediate: true }
)

//获取统计
const statistics = ref({
  suc_amount: 0,
  suc_num: 0,
  total_profit: 0,
  profit_show: 0,
  complete_profit: 0,
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
    title: '红包抵扣',
    key: 'saving_money',
    align: 'center',
    render(row, index) {
      return '￥' + (row.saving_money ? Number(row.saving_money).toFixed(2) : 0)
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
  {
    title: '支付退款金额',
    key: 'refund_amount',
    align: 'center',
    render(row, index) {
      return '￥' + row.refund_amount
    },
  },
  {
    title: '成本退款金额',
    key: 'partial_refund_price',
    align: 'center',
    render(row, index) {
      return '￥' + (row.partial_refund_price || 0)
    },
  },
  { title: '支付时间', key: 'pay_time', align: 'center' },
  { title: '退款时间', key: 'refund_time', align: 'center' },
  { title: '昵称', key: 'nick_name', align: 'center' },
  { title: '用户ID', key: 'uid', align: 'center' },
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
    title: '渠道',
    key: 'pay_way',
    align: 'center',
    render(row, index) {
      return row.channel || ''
    },
  },
  {
    title: '推广位',
    key: 'pay_way',
    align: 'center',
    render(row, index) {
      return row.extension || ''
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
  statistics.value.profit_show = total?.profit_show || 0
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
        title: '实时结算价',
        key: 'settlePrice',
        align: 'center',
        render(row, index) {
          return '￥' + Number((row.settlePrice || 0) / 100).toFixed(2)
        },
      },
      {
        title: '预估收益',
        key: 'profit_amount',
        align: 'center',
        render(row, index) {
          return '￥' + Number((row.profit || 0) / 100).toFixed(2)
        },
      },
      {
        title: '补贴收益',
        key: 'subsidy_amount',
        align: 'center',
        render(row, index) {
          return '￥' + Number((row.subsidy_amount || 0) / 100).toFixed(2)
        },
      }
    )
  }
}
function channel_get() {
  http.getChannel().then((res) => {
    channelOptions.value = res.data
  })
}
//渠道
function channel_handleUpdate(value) {
  console.log(value)
  http.getExtension({ id: value }).then((res) => {
    extensionOptions.value = res.data
  })
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
</script>

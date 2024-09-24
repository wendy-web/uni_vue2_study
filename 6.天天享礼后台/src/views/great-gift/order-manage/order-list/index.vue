<template>
  <CommonPage title="订单管理">
    <div class="statistics" ml-10 mt-10 mb-24 flex color-black>
      <div class="statistics-item"><span text-16>成功交易金额</span>：￥{{ statistics.suc_amount }}</div>
      <div class="statistics-item" ml-24><span text-16>成功交易笔数</span>：{{ statistics.suc_num }}</div>
      <div v-if="statistics.profit_show" class="statistics-item" ml-24>
        <span text-16>预估收益</span>：￥{{ statistics.total_profit }}
      </div>
    </div>
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
        <QueryBarItem label="订单编号" :label-width="80">
          <n-input v-model:value="queryItems.order_number" type="text" @keydown.enter="$table?.handleSearch" />
        </QueryBarItem>
        <QueryBarItem label="商品名称" :label-width="80">
          <n-input v-model:value="queryItems.goods_name" type="text" @keydown.enter="$table?.handleSearch" />
        </QueryBarItem>
        <QueryBarItem label="下单时间" :label-width="80" :content-width="340">
          <n-date-picker
            v-model:formatted-value="queryItems.xd_range"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            type="datetimerange"
            clearable
          />
        </QueryBarItem>
        <QueryBarItem label="支付时间" :label-width="80" :content-width="340">
          <n-date-picker
            v-model:formatted-value="queryItems.zf_range"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            type="datetimerange"
            clearable
          />
        </QueryBarItem>
        <QueryBarItem label="商品类型" :label-width="100">
          <n-select v-model:value="queryItems.goods_type" :options="typeOptions" />
        </QueryBarItem>
      </template>
    </CrudTable>
  </CommonPage>
</template>

<script setup>
import axios from 'axios';
import http from './api';
//表格操作
const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})
/**订单状态下拉列表 */
const statusOptions = [
  {
    label: '全部',
    value: '',
  },
  {
    label: '待付款',
    value: 1,
  },
  {
    label: '待发货',
    value: 2,
  },
  {
    label: '已完成',
    value: 3,
  },
  {
    label: '已退款',
    value: 4,
  },
  {
    label: '已取消',
    value: 5,
  },
]
/**启用状态下拉列表 */
const typeOptions = [
  {
    label: '全部',
    value: '',
  },
  {
    label: '直充',
    value: 0,
  },
  {
    label: '卡密',
    value: 1,
  },
  {
    label: '自营',
    value: 2,
  },
]

onMounted(() => {
  refresh()
})
//刷新表格
function refresh() {
  $table.value?.handleSearch()
}

const columns = ref([
  { title: '订单编号', key: 'order_number', align: 'center' },
  { title: '下单时间', key: 'create_date', align: 'center' },
  {
    title: '订单金额',
    key: 'price',
    align: 'center',
    render(row, index) {
      return '￥' + Number(row.price / 100).toFixed(2)
    },
  },
  {
    title: '抵扣金额',
    key: 'deduction_price',
    align: 'center',
    render(row, index) {
      return '￥' + Number(row.deduction_price / 100).toFixed(2)
    },
  },
  {
    title: '抵扣积分',
    key: 'deduction_credits',
    align: 'center',
  },
  {
    title: '实付金额',
    key: 'pay_price',
    align: 'center',
    render(row, index) {
      return '￥' + Number(row.pay_price / 100).toFixed(2)
    },
  },
  { title: '支付时间', key: 'pay_time', align: 'center' },
  {
    title: '退款金额',
    key: 'refund_price',
    align: 'center',
    render(row, index) {
      return '￥' + Number(row.refund_price / 100).toFixed(2)
    },
  },
  { title: '退款时间', key: 'refund_date', align: 'center' },
  { title: '收货人', key: 'consignee', align: 'center' },
  { title: '完成时间', key: 'over_date', align: 'center' },
  { title: '商品编号', key: 'goods_number', align: 'center' },
  { title: '商品名称', key: 'goods_name', align: 'center' },
  {
    title: '商品类型',
    key: 'goods_type',
    align: 'center',
    render(row, index) {
      return ['直充', '卡密', '自营'][row.goods_type]
    },
  },
  {
    title: '订单状态',
    key: 'status',
    align: 'center',
    render(row) {
      return ['待支付', '已支付', '已使用', '已充值', '已关闭', '已取消', '已退款', '待使用', '已过期', '发货失败'][
        row.status
      ]
    },
  },
])
//获取统计
const statistics = ref({
  suc_amount: 0,
  suc_num: 0,
  total_profit: 0,
  profit_show: 0,
})
let isProfitShow = true
function getDataHandle(data) {
  statistics.value = {
    suc_amount: data.suc_amount || 0,
    suc_num: data.suc_num || 0,
    total_profit: data.total_profit || 0,
    profit_show: data.profit_show || 0,
  }
  // 展示收益的权限
  if (isProfitShow && statistics.value.profit_show) {
    isProfitShow = false
    columns.value.splice(
      6,
      0,
      {
        title: '商品成本',
        key: 'profit_costPrice',
        align: 'center',
        render(row, index) {
          return '￥' + Number((row.cost || 0) / 100).toFixed(2)
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
    .post('/xdyhos/Order/export', params, { responseType: 'blob' })
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

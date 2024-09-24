<template>
  <CommonPage title="订单管理">
    <div class="statistics" ml-10 mt-10 mb-24 flex color-black>
      <div class="statistics-item"><span text-16>已提现金额</span>：￥{{ gmv_amount.tx_money }}</div>
      <div class="statistics-item" ml-24><span text-16>审核提现金额</span>：￥{{ gmv_amount.sh_money }}</div>
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
    >
      <template #queryBar>
        <QueryBarItem label="用户昵称" :label-width="80">
          <n-input v-model:value="queryItems.nick_name" type="text" @keydown.enter="$table?.handleSearch" />
        </QueryBarItem>
        <QueryBarItem label="用户手机号" :label-width="80">
          <n-input v-model:value="queryItems.mobile" type="text" @keydown.enter="$table?.handleSearch" />
        </QueryBarItem>
        <QueryBarItem label="提现金额" :label-width="80">
          <n-input v-model:value="queryItems.withdraw_money" type="text" @keydown.enter="$table?.handleSearch" />
        </QueryBarItem>
        <QueryBarItem label="提现状态" :label-width="100">
          <n-select v-model:value="queryItems.status" :options="ztOptions" clearable />
        </QueryBarItem>
        <QueryBarItem label="提现时间" :label-width="80" :content-width="340">
          <n-date-picker
            v-model:formatted-value="queryItems.tx_range"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            type="datetimerange"
            clearable
          />
        </QueryBarItem>
        <QueryBarItem label="打款时间" :label-width="80" :content-width="340">
          <n-date-picker
            v-model:formatted-value="queryItems.dk_range"
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
import axios from 'axios';
import http from './api';
//表格操作
const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})
onMounted(() => {
  refresh()
})
const ztOptions = [
  {
    label: '审核中',
    value: 1,
  },
  {
    label: '已打款',
    value: 2,
  },
  {
    label: '已驳回',
    value: 3,
  },
]
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
const columns = ref([
  { title: 'ID', key: 'id', align: 'center' },
  { title: '昵称', key: 'nick_name', align: 'center' },
  { title: '手机号', key: 'mobile', align: 'center' },
  { title: '提现金额', key: 'withdraw_money', align: 'center' },
  { title: '手续费', key: 'scale', align: 'center' },
  { title: '实际打款金额', key: 'real_money', align: 'center' },
  { title: '提现时间', key: 'create_time', align: 'center' },
  { title: '打款时间', key: 'update_time', align: 'center' },
  {
    title: '提现状态',
    key: 'status',
    align: 'center',
    render(row) {
      return ['提现审核', '提现成功', '提现驳回'][row.status]
    },
  },
])
// 导出记录
function exportOrders(params) {
  axios
    .post('/xdyhos/Team/export', params, { responseType: 'blob' })
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
      a.setAttribute('download', '提现记录.xls')
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

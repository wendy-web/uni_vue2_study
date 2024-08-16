<template>
  <CommonPage show-footer title="自营订单">
    <CrudTable
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="http.orderList"
    >
      <template #queryBar>
        <QueryBarItem label="订单状态" :label-width="80">
          <n-select v-model:value="queryItems.status" :options="statusOptions" clearable />
        </QueryBarItem>
        <QueryBarItem label="订单号" :label-width="50">
          <n-input
            v-model:value="queryItems.order_number"
            type="text"
            placeholder="请输入订单号"
            clearable
            @keydown.enter="$table?.handleSearch"
          />
        </QueryBarItem>
        <QueryBarItem label="用户ID" :label-width="50">
          <n-input
            v-model:value="queryItems.user_id"
            type="text"
            placeholder="请输入用户ID"
            clearable
            @keydown.enter="$table?.handleSearch"
          />
        </QueryBarItem>
        <QueryBarItem label="收货人" :label-width="50">
          <n-input
            v-model:value="queryItems.name"
            type="text"
            placeholder="请输入收货人"
            clearable
            @keydown.enter="$table?.handleSearch"
          />
        </QueryBarItem>
        <QueryBarItem label="商品编号" :label-width="80">
          <n-input
            v-model:value="queryItems.goods_id"
            type="text"
            placeholder="请输入商品编号"
            clearable
            @keydown.enter="$table?.handleSearch"
          />
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
            v-model:formatted-value="queryItems.pay_date"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            type="datetimerange"
            clearable
          />
        </QueryBarItem>
        <QueryBarItem label="完成时间" :label-width="80" :content-width="340">
          <n-date-picker
            v-model:formatted-value="queryItems.over_date"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            type="datetimerange"
            clearable
          />
        </QueryBarItem>
      </template>
    </CrudTable>
  </CommonPage>
  <operateSet ref="operateSetRef" :company-type-options="companyTypeOptions" @refresh="refresh" />
  <orderDetail ref="orderDetailRef" :company-type-options="companyTypeOptions" />
</template>

<script setup>
import { renderIcon } from '@/utils';
import { NButton } from 'naive-ui';
import http from './api';
import operateSet from './operateGroup/operateSet.vue';
import orderDetail from './operateGroup/orderDetail.vue';
import { statusOptions } from './options';
defineOptions({ name: 'storeGoodsList' })
const $table = ref(null)
const queryItems = ref({})
const operateSetRef = ref(null)
const orderDetailRef = ref(null)
const companyTypeOptions = ref([])
onMounted(async () => {
  refresh()
  const res = await http.company()
  if (res.code == 0) return
  companyTypeOptions.value = res.data
  // orderDetailRef.value.show(16)
})

function refresh() {
  $table.value?.handleRefreshCurr()
}

const columns = [
  { title: 'ID', key: 'id', align: 'center', width: 100 },
  { title: '订单编号', key: 'order_number', align: 'center' },
  { title: '下单时间', key: 'create_time', align: 'center' },
  { title: '订单金额(￥)', key: 'price', align: 'center' },
  { title: '支付金额(￥)', key: 'pay_price', align: 'center' },
  { title: '收货人姓名', key: 'name', align: 'center' },
  { title: '收货人手机号', key: 'mobile', align: 'center' },
  { title: '下单用户ID', key: 'user_id', align: 'center' },
  { title: '下单用户昵称', key: 'nick_name', align: 'center' },
  { title: '完成时间', key: 'over_date', align: 'center' },
  {
    title: '退款时间',
    key: 'refund_date',
    align: 'center',
    render(row, index) {
      return row.refund_date || '暂无'
    },
  },
  { title: '商品编号', key: 'goods_id', align: 'center' },
  { title: '商品名称', key: 'goods_name', align: 'center' },
  { title: '购买数量', key: 'buy_num', align: 'center' },
  {
    title: '订单状态',
    key: 'status',
    align: 'center',
    render(row, index) {
      console.log('row.status', row.status)
      let foundEntry = statusOptions.find((entry) => entry.value == row.status)
      return foundEntry?.label
    },
  },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    fixed: 'right',
    width: 260,
    render(row) {
      const renderList = [
        h(
          NButton,
          {
            size: 'small',
            type: 'info',
            secondary: true,
            onClick: () => detailOrder(row, 2),
          },
          { default: () => '详情', icon: renderIcon('majesticons:edit-pen-4', { size: 14 }) }
        ),
      ]
      if (row.show_send) {
        renderList.push(
          h(
            NButton,
            {
              size: 'small',
              type: 'warning',
              style: { 'margin-left': '10px' },
              secondary: true,
              onClick: () => detailOperate(row, 2),
            },
            { default: () => '发货', icon: renderIcon('fa6-regular:share-from-square', { size: 14 }) }
          )
        )
      }
      if (row.show_refund) {
        renderList.push(
          h(
            NButton,
            {
              size: 'small',
              type: 'error',
              secondary: true,
              style: { 'margin-left': '10px' },
              onClick: () => detailOperate(row, 3),
            },
            { default: () => '退款', icon: renderIcon('bx:analyse', { size: 14 }) }
          )
        )
      }
      return renderList
    },
  },
]

function detailOperate(row, type) {
  operateSetRef.value.show(row.id, type)
}
function detailOrder(row) {
  orderDetailRef.value.show(row.id)
}
</script>

<template>
  <CommonPage show-footer title="商品统计数据">
    <CrudTable
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="http.getList"
    >
      <template #queryBar>
        <QueryBarItem label="商品ID" :label-width="80">
          <n-input
            v-model:value="queryItems.goods_id"
            type="text"
            placeholder="商品ID"
            clearable
            @keydown.enter="$table?.handleSearch"
          />
        </QueryBarItem>
      </template>
    </CrudTable>
  </CommonPage>
</template>

<script setup>
import { useDialog, useMessage } from 'naive-ui';
import http from './api';
defineOptions({ name: 'GoodsTotalList' })
//表格操作
const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})
const active = ref(false)
const active2 = ref(false)
onMounted(() => {
  refresh()
})

function refresh() {
  $table.value?.handleSearch()
}
const columns = [
  { title: '商品ID', key: 'goods_id', align: 'center' },
  { title: '商品标题', key: 'goods_name', align: 'center' },
  { title: '商品来源', key: 'goods_type', align: 'center' },
  { title: '客单价', key: 'average_price', align: 'center' },
  { title: '佣金率%', key: 'commissionShare', align: 'center' },
  {
    title: '佣金',
    key: 'profit_money',
    align: 'center',
    pid: 1,
    sortOrder: false,
    sorter: 'default',
  },
  {
    title: '点击次数',
    key: 'clickNum',
    align: 'center',
    pid: 2,
    sortOrder: false,
    sorter: 'default',
  },
  {
    title: '有效GMV',
    key: 'sales_money',
    align: 'center',
    pid: 3,
    sortOrder: false,
    sorter: 'default',
  },
  {
    title: '有效订单',
    key: 'sales_num',
    align: 'center',
    pid: 4,
    sortOrder: false,
    sorter: 'default',
  },
  {
    title: '付款订单',
    key: 'pay_num',
    align: 'center',
    pid: 5,
    sortOrder: false,
    sorter: 'default',
  },
  {
    title: '购买人数',
    key: 'buy_people_num',
    align: 'center',
    pid: 6,
    sortOrder: false,
    sorter: 'default',
  },
  {
    title: '转化率%',
    key: 'conversion_rate',
    align: 'center',
    pid: 7,
    sortOrder: false,
    sorter: 'default',
  },
  {
    title: '复购人数',
    key: 'again_people_num',
    align: 'center',
    pid: 8,
    sortOrder: false,
    sorter: 'default',
  },
  {
    title: '复购率%',
    key: 'repurchase_rate',
    align: 'center',
    pid: 9,
    sortOrder: false,
    sorter: 'default',
  },
  {
    title: 'ARPU',
    key: 'arpu_rate',
    align: 'center',
    pid: 10,
    sortOrder: false,
    sorter: 'default',
  },
  {
    title: '是否人工推荐',
    key: 'is_group',
    align: 'center',
    render(row) {
      return ['否', '是'][row.is_group]
    },
  },
]
//优惠券操作
const operatSingleRef = ref(null)
//提示展示
const message = useMessage()
/** 自定义单元格 */
const dialog = useDialog()
</script>

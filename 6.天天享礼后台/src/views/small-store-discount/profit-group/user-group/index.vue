<template>
  <CommonPage show-footer title="用户列表">
    <template #action>
      <n-button type="primary" @click="handleAdd">
        <TheIcon icon="material-symbols:add" :size="18" class="mr-5" /> 添加业务员
      </n-button>
    </template>
    <CrudTable
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="http.getList"
    >
      <template #queryBar>
        <QueryBarItem label="昵称" :label-width="80">
          <n-input
            v-model:value="queryItems.nick_name"
            type="text"
            placeholder="昵称"
            clearable
            @keydown.enter="$table?.handleSearch"
          />
        </QueryBarItem>
        <QueryBarItem label="电话" :label-width="80">
          <n-input
            v-model:value="queryItems.mobile"
            type="text"
            placeholder="电话"
            clearable
            @keydown.enter="$table?.handleSearch"
          />
        </QueryBarItem>
      </template>
    </CrudTable>
  </CommonPage>
  <operat-single ref="operatSingleRef" @refresh="refresh" />
</template>

<script setup>
import { renderIcon } from '@/utils';
import { NButton, useDialog, useMessage } from 'naive-ui';
import http from './api';
import operatSingle from './operatSingle.vue';
defineOptions({ name: 'userStore' })
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
  { title: '昵称', key: 'nick_name', align: 'center' },
  { title: '手机号', key: 'mobile', align: 'center' },
  {
    title: '等级',
    key: 'level',
    align: 'center',
    render(row) {
      return ['业务员', '团长'][row.level]
    },
  },
  {
    title: '团长开通时间',
    key: 'audit_date',
    align: 'center',
  },
  {
    title: '当前绑定用户',
    key: 'send_card',
    align: 'center',
    pid: 1,
    sortOrder: false,
    sorter: 'default',
  },
  {
    title: '累计绑定用户',
    key: 'send_cards',
    align: 'center',
    pid: 2,
    sortOrder: false,
    sorter: 'default',
  },
  {
    title: '订单数',
    key: 'card_order',
    align: 'center',
    pid: 3,
    sortOrder: false,
    sorter: 'default',
  },
  {
    title: '累计收益',
    key: 'card_profit',
    align: 'center',
    pid: 4,
    sortOrder: false,
    sorter: 'default',
  },
  {
    title: '可提现',
    key: 'amount_money',
    align: 'center',
    pid: 5,
    sortOrder: false,
    sorter: 'default',
  },
  {
    title: '已提现',
    key: 'withdraw_money',
    align: 'center',
    pid: 6,
    sortOrder: false,
    sorter: 'default',
  },
  // { title: '归属上级', key: 'pid', align: 'center' },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    fixed: 'right',
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            style: { 'margin-right': '10px' },
            secondary: true,
            onClick: () => lookCoupon(row),
          },
          { default: () => '查看', icon: renderIcon('majesticons:eye-line', { size: 14 }) }
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'info',
            secondary: true,
            style: { 'margin-right': '10px' },
            onClick: () => editCoupon(row),
          },
          { default: () => '编辑', icon: renderIcon('majesticons:eye-line', { size: 14 }) }
        ),
      ]
    },
  },
]
//优惠券操作
const operatSingleRef = ref(null)
//提示展示
const message = useMessage()
/**查看 */
function lookCoupon(row) {
  operatSingleRef.value.show(1, row)
}
/**编辑 */
function editCoupon(row) {
  operatSingleRef.value.show(2, row)
}
/**新增活动 */
function handleAdd() {
  operatSingleRef.value.show(3)
}
/** 自定义单元格 */
const dialog = useDialog()
</script>

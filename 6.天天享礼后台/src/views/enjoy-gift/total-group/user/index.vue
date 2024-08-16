<template>
  <CommonPage show-footer title="用户统计数据">
    <CrudTable
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="http.getList"
    >
      <template #queryBar>
        <QueryBarItem label="用户ID" :label-width="80">
          <n-input
            v-model:value="queryItems.uid"
            type="text"
            placeholder="用户ID"
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
defineOptions({ name: 'UserList' })
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
  { title: '用户ID', key: 'uid', align: 'center' },
  { title: '昵称', key: 'nick_name', align: 'center' },
  { title: '角色', key: 'vipType', align: 'center' },
  { title: '上级团长', key: 'team_info', align: 'center' },
  {
    title: '已消耗牛金豆',
    key: 'use_credits',
    align: 'center',
    pid: 1,
    sortOrder: false,
    sorter: 'default',
  },
  {
    title: '牛金豆余额',
    key: 'credits',
    align: 'center',
    pid: 2,
    sortOrder: false,
    sorter: 'default',
  },
  {
    title: '累计返',
    key: 'profit_money',
    align: 'center',
    pid: 9,
    sortOrder: false,
    sorter: 'default',
  },
  {
    title: '零钱',
    key: 'money',
    align: 'center',
    pid: 3,
    sortOrder: false,
    sorter: 'default',
  },
  { title: '未领取', key: 'unclaimed', align: 'center' },
  { title: '可提现', key: 'balance', align: 'center' },
  {
    title: '已提现',
    key: 'withdraw_money',
    align: 'center',
    pid: 4,
    sortOrder: false,
    sorter: 'default',
  },
  {
    title: '点击次数',
    key: 'click_num',
    align: 'center',
    pid: 5,
    sortOrder: false,
    sorter: 'default',
  },
  {
    title: '付款订单',
    key: 'pay_num',
    align: 'center',
    pid: 6,
    sortOrder: false,
    sorter: 'default',
  },
  {
    title: '复购订单',
    key: 'again_num',
    align: 'center',
    pid: 7,
    sortOrder: false,
    sorter: 'default',
  },
  {
    title: 'GMV',
    key: 'gmv',
    align: 'center',
    pid: 8,
    sortOrder: false,
    sorter: 'default',
  },
  {
    title: '浏览记录',
    key: 'watch_num',
    align: 'center',
    pid: 10,
    sortOrder: false,
    sorter: 'default',
  },
  {
    title: '收藏记录',
    key: 'collect_num',
    align: 'center',
    pid: 11,
    sortOrder: false,
    sorter: 'default',
  },
  { title: '注册时间', key: 'reg_time', align: 'center' },
  { title: '最近登录时间', key: 'login_time', align: 'center' },
  { title: '最近下单时间', key: 'buy_time', align: 'center' },
]
//优惠券操作
const operatSingleRef = ref(null)
//提示展示
const message = useMessage()
/** 自定义单元格 */
const dialog = useDialog()
</script>

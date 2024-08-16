<template>
  <CommonPage show-footer title="群管理">
    <template #action>
      <n-button type="primary" @click="handleSearchAdd">
        <TheIcon icon="bxs:add-to-queue" :size="18" class="mr-5" /> 添加群列表
      </n-button>
    </template>
    <CrudTable
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="http.groupList"
      :is-pagination="false"
      :max-height="windowHeight"
    ></CrudTable>
  </CommonPage>
  <operate-single ref="operateSingleRef" :cid="queryItems.cid" @refresh="refresh" />
  <operate-set ref="operateSetRef" :cid="queryItems.cid" @refresh="refresh" />
</template>
<script setup>
import { renderIcon } from '@/utils';
import { NButton, NSwitch, useDialog, useMessage } from 'naive-ui';
import http from './api';
import operateSet from './operateSet.vue';
import operateSingle from './operateSingle.vue';
const operateSingleRef = ref(null)
const operateSetRef = ref(null)
const queryItems = ref({
  cid: 1,
})
const $table = ref(null)
// 屏幕高度
const windowHeight = ref(0)
onMounted(async () => {
  getWindowResize()
  window.addEventListener('resize', getWindowResize)
  refresh()
})
// 获取屏幕尺寸
const getWindowResize = function () {
  windowHeight.value = window.innerHeight * 0.674
}
function refresh() {
  $table.value?.handleSearch()
}
const columns = [
  { title: 'ID', key: 'id', align: 'center', width: 120 },
  { title: '群名称', key: 'group_name', align: 'center' },
  { title: '京东推广位ID', key: 'jd_positionid', align: 'center' },
  { title: '拼多多推广位ID', key: 'pdd_positionid', align: 'center' },
  { title: '商品间隔(s/秒)', key: 'goods_time', align: 'center' },
  { title: '发送间隔(s/秒)', key: 'send_time', align: 'center' },
  { title: '开始时间', key: 'start_time', align: 'center' },
  { title: '结束时间', key: 'over_time', align: 'center' },
  {
    title: '启用状态',
    key: 'status',
    align: 'center',
    render(row) {
      return h(NSwitch, {
        size: 'small',
        rubberBand: false,
        value: Boolean(row['status']),
        loading: !!row.publishing,
        onUpdateValue: () => handlePublish(row),
      })
    },
  },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    fixed: 'right',
    render(row) {
      const list = [
        h(
          NButton,
          {
            size: 'small',
            type: 'warning',
            secondary: true,
            onClick: () => editCoupon(row.id),
          },
          { default: () => '群发列表', icon: renderIcon('majesticons:applications-add', { size: 14 }) }
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'info',
            secondary: true,
            style: { 'margin-left': '10px' },
            onClick: () => setCoupon(row.id),
          },
          { default: () => '设置', icon: renderIcon('weui:setting-outlined', { size: 14 }) }
        ),
      ]
      return list
    },
  },
]
//提示展示
const message = useMessage()
/** 自定义单元格 */
const dialog = useDialog()
/**新增活动 */
function handleSearchAdd() {
  operateSetRef.value.show()
}
/**编辑 */
function editCoupon(id) {
  operateSingleRef.value.show(id)
}
function setCoupon(id) {
  operateSetRef.value.show(id)
}
// 状态启用
async function handlePublish(row) {
  // return
  const res = await http.groupCreate({
    ...row,
    status: Number(!Boolean(row.status)),
  })
  if (res.code == 1) {
    message.success(res.msg)
    $table.value?.handleSearch()
  } else {
    message.error(res.msg)
  }
}
</script>

<template>
  <CommonPage show-footer title="价格管理">
    <template #action>
      <n-button type="primary" @click="handleAdd">
        <TheIcon icon="material-symbols:add" :size="18" class="mr-5" /> 添加
      </n-button>
    </template>
    <CrudTable
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="http.getList"
      :is-pagination="true"
    >
      <template #queryBar>
        <QueryBarItem label="品牌" :label-width="65">
          <n-select v-model:value="queryItems.tag" :options="statusOptions" />
        </QueryBarItem>
      </template>
    </CrudTable>
  </CommonPage>
  <operat-single ref="operatSingleRef" @refresh="refresh" />
</template>

<script setup>
import { NButton, NImage } from 'naive-ui'
import { renderIcon } from '@/utils'
import { useMessage, useDialog, NSwitch } from 'naive-ui'
import operatSingle from './operatSingle.vue'
import http from './api'
defineOptions({ name: 'SingleColumnDiagram' })
//表格操作
const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})
const statusOptions = [
  {
    label: '乐刷',
    value: 1,
  },
  {
    label: '京东',
    value: 2,
  },
  {
    label: '海威',
    value: 3,
  },
  {
    label: '千猪',
    value: 4,
  },
  {
    label: '拼多多',
    value: 5,
  },
  {
    label: '心链',
    value: 6,
  },
]

onMounted(() => {
  refresh()
})

function refresh() {
  $table.value?.handleSearch()
}

const columns = [
  {
    title: '品牌',
    key: 'tag',
    align: 'center',
    render(row, index) {
      return ['乐刷', '京东', '海威', '千猪', '拼多多', '心链'][row.tag - 1]
    },
  },
  {
    title: '小店一级分佣%',
    key: 'one_scale',
    align: 'center',
    render(row, index) {
      return row.one_scale || 0
    },
  },
  {
    title: '小店团长分佣%',
    key: 'two_scale',
    align: 'center',
    render(row, index) {
      return row.two_scale || 0
    },
  },
  {
    title: '天天返利分佣%',
    key: 'user_scale',
    align: 'center',
    render(row, index) {
      return row.user_scale || 0
    },
  },
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
</script>

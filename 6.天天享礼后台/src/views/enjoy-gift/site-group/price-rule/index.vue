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
      :is-pagination="false"
    >
      <template #queryBar>
        <QueryBarItem label="品牌" :label-width="65">
          <n-select v-model:value="queryItems.type" :options="statusOptions" />
        </QueryBarItem>
      </template>
    </CrudTable>
  </CommonPage>
  <operat-single ref="operatSingleRef" @refresh="refresh" />
</template>

<script setup>
import { renderIcon } from '@/utils';
import { NButton, useMessage } from 'naive-ui';
import http from './api';
import operatSingle from './operatSingle.vue';
defineOptions({ name: 'ruleConfig' })
//表格操作
const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})
const statusOptions = [
  {
    label: '瑞幸',
    value: 1,
  },
  {
    label: '麦当劳',
    value: 2,
  },
]

onMounted(() => {
  refresh()
})

function refresh() {
  $table.value?.handleSearch()
}

const columns = [
  { title: '序号', key: 'id', align: 'center' },
  {
    title: '品牌',
    key: 'type',
    align: 'center',
    render(row, index) {
      return ['瑞幸', '麦当劳'][row.type - 1]
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

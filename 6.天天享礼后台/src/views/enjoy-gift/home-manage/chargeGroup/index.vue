<template>
  <CommonPage show-footer title="大牌直充">
    <template #action>
      <n-button type="primary" @click="handleAdd">
        <TheIcon icon="material-symbols:add" :size="18" class="mr-5" /> 添加分组
      </n-button>
    </template>
    <CrudTable
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="http.categoryList"
    >
      <template #queryBar>
        <QueryBarItem label="系统" :label-width="40">
          <n-select v-model:value="queryItems.type" :options="options" />
        </QueryBarItem>
        <QueryBarItem label="一级分类" :label-width="80">
          <n-select
            v-model:value="queryItems.pid"
            :options="parentOption"
            label-field="name"
            value-field="id"
            filterable
            clearable
            remote
            placeholder="选择一级分类"
          />
        </QueryBarItem>
      </template>
    </CrudTable>
  </CommonPage>
  <operat-group ref="operatGroupRef" :parent-option="parentOption" @refresh="refresh" />
</template>

<script setup>
import { NButton } from 'naive-ui'
import { renderIcon } from '@/utils'
import { useMessage, useDialog } from 'naive-ui'
import operatGroup from './operatGroup.vue'
import http from './api'
defineOptions({ name: 'CouponGroup' })
//表格操作
const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})
const parentOption = ref([])
/**启用状态下拉列表 */
const options = [
  {
    label: '苹果机',
    value: 1,
  },
  {
    label: '公共',
    value: 2,
  },
  {
    label: '安卓机',
    value: 3,
  },
]

onMounted(() => {
  refresh()
  initParentCategory()
})
function initParentCategory() {
  // if (parentOption.value.length) return
  http.parentCategory().then((res) => {
    if (res.code != 1) return
    parentOption.value = res.data
  })
}

function refresh() {
  $table.value?.handleSearch()
  initParentCategory()
}

const columns = [
  { title: 'ID', key: 'id', align: 'center' },
  { title: '一级名称', key: 'parent_name', align: 'center' },
  { title: '类目名称', key: 'name', align: 'center' },
  {
    title: '系统类型',
    key: 'device',
    align: 'center',
    render(row) {
      return ['苹果机', '公共', '安卓机'][row.device - 1]
    },
  },
  { title: '排序', key: 'sort', align: 'center' },
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
        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            secondary: true,
            onClick: () => removeCoupon(row),
          },
          { default: () => '删除', icon: renderIcon('material-symbols:cancel-outline-rounded', { size: 14 }) }
        ),
      ]
    },
  },
]
//优惠券操作
const operatGroupRef = ref(null)
//提示展示
const message = useMessage()
/**查看 */
function lookCoupon(row) {
  operatGroupRef.value.show(1, row)
}
/**编辑 */
function editCoupon(row) {
  operatGroupRef.value.show(2, row)
}
/**新增活动 */
function handleAdd() {
  operatGroupRef.value.show(3)
}
/** 自定义单元格 */
const dialog = useDialog()
/**删除分组 */
function removeCoupon(row) {
  const { pid } = row
  const content = pid == 0 ? '当前是一级类目，删除将删除此类目下的二级类目' : '确定删除？'
  dialog.warning({
    title: '警告',
    content,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: function () {
      http.categoryDel({ id: row.id }).then(function (res) {
        if (res.code == 1) {
          message.success(res.msg)
          refresh()
        } else {
          message.error(res.msg)
        }
      })
    },
  })
}
</script>

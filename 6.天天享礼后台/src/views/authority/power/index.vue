<template>
  <CommonPage show-footer title="列表">
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
      :children-key="child"
      :get-data="http.getList"
      :is-pagination="false"
    >
      <template #queryBar>
        <QueryBarItem label="类目" :label-width="65">
          <n-select v-model:value="queryItems.cid" :options="cidOptions" @update:value="doChange" />
        </QueryBarItem>
      </template>
    </CrudTable>
  </CommonPage>
  <operate-single ref="operateSingleRef" :cid="queryItems.cid" @refresh="refresh" />
</template>
<script setup>
import { NButton, useMessage, useDialog } from 'naive-ui'
import { renderIcon } from '@/utils'
import http from './api'
import operateSingle from './operateSingle.vue'
const operateSingleRef = ref(null)
import { cidOptions } from './options'
const queryItems = ref({
  cid: 1,
})
const $table = ref(null)
onMounted(async () => {
  refresh()
})

function refresh() {
  $table.value?.handleSearch()
}
const columns = [
  { title: '标题', key: 'title', align: 'center' },
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
      if (row.child) {
        list.unshift(
          h(
            NButton,
            {
              size: 'small',
              type: 'info',
              secondary: true,
              style: { 'margin-right': '10px' },
              onClick: () => addCoupon(row),
            },
            { default: () => '添加', icon: renderIcon('majesticons:eye-line', { size: 14 }) }
          )
        )
      }
      return list
    },
  },
]
//提示展示
const message = useMessage()
/** 自定义单元格 */
const dialog = useDialog()
/**删除分组 */
function removeCoupon(row) {
  dialog.warning({
    title: '警告',
    content: '确定删除？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: function () {
      http.delete({ id: row.id }).then(function (res) {
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
/**新增活动 */
function handleAdd() {
  operateSingleRef.value.show(3)
}
/**编辑 */
function editCoupon(row) {
  operateSingleRef.value.show(2, row)
}
// 添加二级
function addCoupon(row) {
  operateSingleRef.value.show(1, row)
}
function doChange(value) {
  queryItems.value.cid = value
  refresh()
}
</script>

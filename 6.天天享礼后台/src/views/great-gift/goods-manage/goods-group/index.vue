<template>
  <CommonPage show-footer title="商品分组">
    <template #action>
      <n-button type="primary" @click="handleAdd">
        <TheIcon icon="material-symbols:add" :size="18" class="mr-5" /> 新增分组
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
        <QueryBarItem label="分组名称" :label-width="80">
          <n-input
            v-model:value="queryItems.goods_number"
            type="text"
            placeholder="请输入分组名称"
            @keydown.enter="$table?.handleSearch"
            clearable
          />
        </QueryBarItem>
        <QueryBarItem label="系统类型" :label-width="80">
          <n-select v-model:value="queryItems.system" :options="systemOptions" clearable />
        </QueryBarItem>
      </template>
    </CrudTable>
  </CommonPage>
  <opreatGroup ref="opreatGroupRef" @refresh="refresh" />
</template>

<script setup>
import { NButton } from 'naive-ui'
import opreatGroup from './opreatGroup/index.vue'
import { renderIcon } from '@/utils'
import { useMessage, useDialog } from 'naive-ui'
import { systemOptions } from './options'
import http from './api'
defineOptions({ name: 'storeGoodsList' })
//表格操作
const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({ })

onMounted(() => {
  refresh()
})

function refresh() {
  $table.value?.handleRefreshCurr()
}

const columns = [
  { title: '分组名称', key: 'title', align: 'center' },
  {
    title: '商品数',
    key: 'gids',
    align: 'center',
    render(row) {
      return row.gids?.split(',').length || 0
    },
  },
  { title: '创建时间', key: 'create_time', align: 'center' },
  { title: '创建人', key: 'create_user', align: 'center' },
  { title: '修改时间', key: 'update_time', align: 'center' },
  { title: '修改人', key: 'update_user', align: 'center' },
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
            type: 'info',
            style: { 'margin-right': '10px' },
            secondary: true,
            onClick: () => edit(row),
          },
          { default: () => '编辑', icon: renderIcon('majesticons:edit-pen-4', { size: 14 }) }
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            secondary: true,
            onClick: () => del(row),
          },
          { default: () => '删除', icon: renderIcon('majesticons:delete-bin-line', { size: 14 }) }
        ),
      ]
    },
  },
]
//操作
const opreatGroupRef = ref()
//提示展示
const message = useMessage()

function edit(row) {
  opreatGroupRef.value.show(1, row)
}

function handleAdd() {
  opreatGroupRef.value.show(2)
}
/** 自定义单元格 */
const dialog = useDialog()
/**删除分组 */
function del(row) {
  dialog.warning({
    title: '警告',
    content: '确定删除？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: function () {
      http.del({ id: row.id }).then(function (res) {
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

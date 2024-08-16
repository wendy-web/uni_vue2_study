<template>
  <CommonPage show-footer title="商品分组">
    <template #action>
      <n-button type="primary" @click="handleAdd">
        <TheIcon icon="material-symbols:add" :size="18" class="mr-5" />
        新增分组
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
            v-model:value="queryItems.name"
            type="text"
            placeholder="请输入分组名称"
            clearable
            @keydown.enter="$table?.handleSearch"
          />
        </QueryBarItem>
        <QueryBarItem label="平台类型" :label-width="80">
          <n-select v-model:value="queryItems.lx_type" :options="lxtypeOptions" clearable />
        </QueryBarItem>
      </template>
    </CrudTable>
  </CommonPage>
  <opreatGroup ref="opreatGroupRef" @refresh="refresh" />
</template>

<script setup>
import { renderIcon } from '@/utils';
import { NButton, useDialog, useMessage } from 'naive-ui';
import { resolveDirective, withDirectives } from 'vue';
import http from './api';
import opreatGroup from './opreatGroup/index.vue';
import { lxtypeOptions } from './options';
defineOptions({ name: 'storeGoodsList' })
//表格操作
const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})

onMounted(() => {
  refresh()
})

function refresh() {
  $table.value?.handleRefreshCurr()
}
const has = resolveDirective('has')
const columns = [
  { title: '分组名称', key: 'name', align: 'center' },
  {
    title: '平台类型',
    key: 'lx_type',
    align: 'center',
    render(row) {
      return ['全部', '京东', '拼多多'][row.lx_type]
    },
  },
  { title: '创建时间', key: 'create_time', align: 'center' },
  { title: '修改时间', key: 'update_time', align: 'center' },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    fixed: 'right',
    render(row) {
      return [
        withDirectives(
          h(
            NButton,
            {
              size: 'small',
              type: 'info',
              style: { 'margin-right': '10px' },
              secondary: true,
              onClick: () => edit(row),
            },
            {
              default: () => '编辑',
              icon: renderIcon('majesticons:edit-pen-4', { size: 14 }),
            }
          ),
          []
        ),
        withDirectives(
          h(
            NButton,
            {
              size: 'small',
              type: 'error',
              secondary: true,
              onClick: () => del(row),
            },
            {
              default: () => '删除',
              icon: renderIcon('majesticons:delete-bin-line', { size: 14 }),
            }
          ),
          []
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

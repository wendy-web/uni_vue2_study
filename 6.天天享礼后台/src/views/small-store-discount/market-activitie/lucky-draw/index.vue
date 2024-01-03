<template>
  <CommonPage>
    <template #action>
      <n-button v-has="'add'" type="primary" @click="addGoods">
        <TheIcon icon="material-symbols:add" :size="18" class="mr-5" /> 新增抽奖
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
        <QueryBarItem label="活动名称" :label-width="65">
          <n-input
            v-model:value="queryItems.title"
            type="text"
            placeholder="活动名称"
            @keydown.enter="$table?.handleSearch"
          />
        </QueryBarItem>
        <QueryBarItem label="活动状态" :label-width="65">
          <n-select v-model:value="queryItems.use" :options="options" />
        </QueryBarItem>
      </template>
    </CrudTable>
  </CommonPage>
  <cowpea-double ref="cowpeaDoubleRef" @refresh="refresh" />
</template>

<script setup>
import { NButton, NSwitch } from 'naive-ui'
import { renderIcon } from '@/utils'
import { useMessage } from 'naive-ui'
import http from './api'
import cowpeaDouble from './cowpeaDouble/index.vue'
import { resolveDirective, withDirectives } from 'vue'
const has = resolveDirective('has')
import { usePermissionStore } from '@/store'
const permissionStore = usePermissionStore()
defineOptions({ name: 'luckyDraw' })

const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})
/**启用状态下拉列表 */
const options = [
  {
    label: '启用',
    value: 1,
  },
  {
    label: '关闭',
    value: 0,
  },
]

onMounted(() => {
  refresh()
})

function refresh() {
  $table.value?.handleSearch()
}
const operateList = {
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
            type: 'primary',
            secondary: true,
            onClick: () => opera(row, 1),
          },
          { default: () => '查看', icon: renderIcon('majesticons:eye-line', { size: 14 }) }
        ),
        [[has, 'xq']]
      ),
      withDirectives(
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            style: 'margin-left: 15px;',
            onClick: () => opera(row, 2),
          },
          { default: () => '编辑', icon: renderIcon('material-symbols:edit-outline', { size: 14 }) }
        ),
        [[has, 'edit']]
      ),
    ]
  },
}
const columns = [
  { title: '活动名称', key: 'title', align: 'center' },
  { title: '活动开始时间', key: 'start_date', align: 'center' },
  { title: '活动结束时间', key: 'end_date', align: 'center' },
  { title: '修改时间', key: 'update_time', align: 'center' },
  { title: '修改人', key: 'update_user', align: 'center' },
]
if (permissionStore.isRolesFun('disable')) {
  columns.push({
    title: '启用状态',
    key: 'use',
    align: 'center',
    render(row) {
      return h(NSwitch, {
        size: 'small',
        rubberBand: false,
        value: Boolean(row['use']),
        loading: !!row.publishing,
        onUpdateValue: () => handlePublish(row),
      })
    },
  })
}
if (permissionStore.isRolesFun('xq') || permissionStore.isRolesFun('edit')) {
  columns.push(operateList)
}

//提示展示
const message = useMessage()
//抽奖
const cowpeaDoubleRef = ref(null)
/** 查看 编辑 */
function opera(row, type) {
  cowpeaDoubleRef.value.show(type, row)
}
function addGoods() {
  cowpeaDoubleRef.value.show(3, '')
}
//状态启用
function handlePublish(row) {
  http
    .use({
      id: row.id,
      use: Number(!Boolean(row.use)),
    })
    .then((res) => {
      if (res.code == 1) {
        message.success(res.msg)
        $table.value?.handleSearch()
      } else {
        message.error(res.msg)
      }
    })
}
</script>

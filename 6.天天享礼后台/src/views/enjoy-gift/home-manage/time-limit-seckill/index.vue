<template>
  <CommonPage show-footer title="限时秒杀">
    <template #action>
      <n-button v-has="'add'" type="primary" @click="handleAdd">
        <TheIcon icon="material-symbols:add" :size="18" class="mr-5" /> 添加活动
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
            placeholder="请输活动名称"
            @keydown.enter="$table?.handleSearch"
          />
        </QueryBarItem>
        <QueryBarItem label="启用状态" :label-width="65">
          <n-select v-model:value="queryItems.status" :options="options" />
        </QueryBarItem>
        <QueryBarItem label="系统" :label-width="65">
          <n-select v-model:value="queryItems.p_type" :options="systemOptions" />
        </QueryBarItem>
      </template>
    </CrudTable>
  </CommonPage>
  <!-- 活动操作 -->
  <operat-tlc ref="operatTlcRef" @refresh="refresh" />
</template>

<script setup>
import { NButton, NSwitch } from 'naive-ui'
import { renderIcon } from '@/utils'
import { useMessage } from 'naive-ui'
import operatTlc from './operatTlc.vue'
import http from './api'
defineOptions({ name: 'TimeLimitSeckillList' })
//表格操作
const $table = ref(null)
//活动操作
const operatTlcRef = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})
/**启用状态下拉列表 */
const options = [
  {
    label: '已启用',
    value: 1,
  },
  {
    label: '未启用',
    value: 0,
  },
]
const systemOptions = [
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
})

function refresh() {
  $table.value?.handleSearch()
}

const columns = [
  { title: '活动名称', key: 'title', align: 'center' },
  {
    title: '活动模式',
    key: 'name',
    align: 'center',
    render(row) {
      return h('span', {
        innerText: row.mode == 1 ? '单次' : '每天',
      })
    },
  },
  {
    title: '活动时间',
    align: 'center',
    render(row) {
      return h('span', {
        innerText: row.start_time + '~' + row.end_time,
      })
    },
  },
  {
    title: '系统',
    key: 'p_type',
    align: 'center',
  },
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
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            style: { 'margin-right': '10px' },
            secondary: true,
            onClick: () => handleView(row),
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
            onClick: () => handleEdit(row),
          },
          { default: () => '编辑', icon: renderIcon('majesticons:eye-line', { size: 14 }) }
        ),
      ]
    },
  },
]

//提示展示
const message = useMessage()
/**查看 */
function handleView(row) {
  operatTlcRef.value.show(1, row)
}
/**编辑 */
function handleEdit(row) {
  operatTlcRef.value.show(3, row)
}
/**新增活动 */
function handleAdd() {
  operatTlcRef.value.show(2)
}

//状态启用
function handlePublish(row) {
  http
    .updateStatus({
      act_id: row.id,
      status: Number(!Boolean(row.status)),
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

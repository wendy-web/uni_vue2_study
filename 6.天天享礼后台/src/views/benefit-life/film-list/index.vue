<template>
  <CommonPage show-footer title="千猪电影">
    <!-- <template #action>
      <n-button type="primary" @click="handleAdd">
        <TheIcon icon="material-symbols:add" :size="18" class="mr-5" /> 添加活动
      </n-button>
    </template> -->
    <CrudTable
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="http.getList"
      :is-pagination="false"
    >
      <template #queryBar>
        <QueryBarItem label="影片名称" :label-width="65">
          <n-input
            v-model:value="queryItems.title"
            type="text"
            placeholder="请输影片名称"
            clearable
            @keydown.enter="$table?.handleSearch"
          />
        </QueryBarItem>
        <QueryBarItem label="上映状态" :label-width="65">
          <n-select v-model:value="queryItems.status" :options="options" clearable />
        </QueryBarItem>
        <QueryBarItem label="上映时间" :label-width="65" :content-width="340">
          <n-date-picker
            v-model:formatted-value="queryItems.create_time"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            type="datetimerange"
            clearable
          />
        </QueryBarItem>
      </template>
    </CrudTable>
  </CommonPage>
  <!-- 活动操作 -->
  <operat-tlc ref="operatTlcRef" @refresh="refresh" />
</template>

<script setup>
import { renderIcon } from '@/utils';
import { NButton, NSwitch, useMessage } from 'naive-ui';
import http from './api';
import operatTlc from './operatTlc.vue';
defineOptions({ name: 'TimeLimitSeckillList' })
//表格操作
const $table = ref(null)
//活动操作
const operatTlcRef = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})
/**上映状态下拉列表 */
const options = [
  {
    label: '正在上映',
    value: 1,
  },
  {
    label: '未上映',
    value: 0,
  },
]

onActivated(() => {
  refresh()
})

function refresh() {
  $table.value?.handleSearch()
}

const columns = [
  {
    title: '影片ID',
    key: 'id',
    align: 'center',
  },
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

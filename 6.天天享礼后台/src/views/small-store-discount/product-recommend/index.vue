<template>
  <CommonPage show-footer title="商品推荐">
    <template #action>
      <n-button type="primary" @click="handleAdd">
        <TheIcon icon="material-symbols:add" :size="18" class="mr-5" /> 添加活动
      </n-button>
    </template>
    <CrudTable ref="$table" :scroll-x="1200" :columns="columns" :get-data="http.getList"> </CrudTable>
  </CommonPage>
  <!-- 新增 编辑 查看操作 -->
  <operat ref="operatRef"></operat>
</template>

<script setup>
import { onMounted } from 'vue'
import { NButton, NSwitch } from 'naive-ui'
import { renderIcon } from '@/utils'
import { useMessage } from 'naive-ui'
import operat from './popup/operat.vue'
import http from './api'
defineOptions({ name: 'productRecommend' })
//表格操作
const $table = ref(null)

onMounted(() => {
  refresh()
})

function refresh() {
  $table.value?.handleSearch()
}
const columns = [
  { title: '标题', key: 'title', align: 'center' },
  {
    title: '系统',
    key: 'system',
    align: 'center',
    render(row) {
      return h('span', null, ['公共', '安卓机', '苹果机'][row.system])
    },
  },
  { title: '创建时间', key: 'create_time', align: 'center' },
  { title: '更新时间', key: 'update_time', align: 'center' },
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
//操作
const operatRef = ref()
/**查看 */
function handleView(row) {
  operatRef.value.show(1, row)
}
// 编辑
function handleEdit(row) {
  operatRef.value.show(2, row)
}
/**新增活动 */
function handleAdd() {
  operatRef.value.show(3)
}

//状态启用
function handlePublish(row) {
  http
    .use({
      id: row.id,
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

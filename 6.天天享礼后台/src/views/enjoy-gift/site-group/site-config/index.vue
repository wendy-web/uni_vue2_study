<template>
  <CommonPage show-footer title="配置">
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
    >
      <template #queryBar>
        <QueryBarItem label="类型" :label-width="65">
          <n-select v-model:value="queryItems.tag" :options="tagOptions" />
        </QueryBarItem>
      </template>
    </CrudTable>
  </CommonPage>
  <operat-group ref="operatGroupRef" @refresh="refresh" />
</template>

<script setup>
import { NButton } from 'naive-ui';
import { renderIcon } from '@/utils';
import { useMessage, useDialog } from 'naive-ui';
import operatGroup from './operatGroup.vue';
import http from './api'
defineOptions({ name: 'CouponGroup' })
//表格操作
const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})
const tagOptions = [
  {
    label: '默认消息',
    value: 'GZGZH',
  },
  {
    label: '拜雅耳机',
    value: 'GZGZH-2',
  },
  {
    label: '电费充值',
    value: 'GZGZH-3',
  },
  {
    label: '话费充值',
    value: 'GZGZH-4',
  },
  {
    label: '抓娃娃',
    value: 'GZGZH-5',
  },
]
onMounted(() => {
  refresh()
})

function refresh() {
  $table.value?.handleSearch()
}

const columns = [
  { title: '类型', key: 'tag', align: 'center' },
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
        )
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
  dialog.warning({
    title: '警告',
    content: '确定删除？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: function () {
      http.deleteGroup({ id: row.id }).then(function (res) {
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

<template>
  <CommonPage show-footer title="电商分组">
    <template #action>
      <n-button v-has="'add'" type="primary" @click="handleAdd">
        <TheIcon icon="material-symbols:add" :size="18" class="mr-5" /> 添加分组
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
            placeholder="分组名称"
            @keydown.enter="$table?.handleSearch"
          />
        </QueryBarItem>
        <QueryBarItem label="所属页面" :label-width="80">
          <n-select v-model:value="queryItems.page_index" :options="eliteIdOptions.pageOptions" />
        </QueryBarItem>
        <QueryBarItem label="电商类型" :label-width="80">
          <n-select v-model:value="queryItems.lx_type" :options="storeOptions" />
        </QueryBarItem>
        <QueryBarItem label="状态" :label-width="80">
          <n-select v-model:value="queryItems.status" :options="statusOptions" />
        </QueryBarItem>
      </template>
    </CrudTable>
  </CommonPage>
  <operat-group ref="operatGroupRef" @refresh="refresh" />
</template>

<script setup>
import { NButton, NSwitch } from 'naive-ui'
import { renderIcon } from '@/utils'
import { useMessage, useDialog } from 'naive-ui'
import operatGroup from './operatGroup.vue'
import http from './api'
import eliteIdOptions from './eliteIdOptions.js'
import { resolveDirective, withDirectives } from 'vue'
const has = resolveDirective('has')
import { usePermissionStore } from '@/store'
const permissionStore = usePermissionStore()

defineOptions({ name: 'CouponGroup' })
//表格操作
const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})

onActivated(() => {
  refresh()
  //handleAdd()
})

function refresh() {
  $table.value?.handleSearch()
}

/**状态下拉列表 */
const statusOptions = [
  {
    label: '停用',
    value: 1,
  },
  {
    label: '启用',
    value: 2,
  },
]
/*电商类型*/
const storeOptions = [
  {
    label: '京东',
    value: 1,
  },
  {
    label: '拼多多',
    value: 2,
  },
]
const columns = [
  { title: '分组ID', key: 'id', align: 'center' },
  { title: '分组名称', key: 'name', align: 'center' },
  {
    title: '电商类型',
    key: 'lx_type',
    align: 'center',
    render(row, index) {
      return ['京东', '拼多多'][row.lx_type - 1]
    },
  },
  {
    title: '分组类型',
    key: 'type',
    align: 'center',
    render(row, index) {
      return row.lx_type == 1
        ? ['猜你喜欢', '京东精选', '关键词查询', '选品库组合'][row.type - 1]
        : ['商品推荐', '关键词查询'][row.type - 1]
    },
  },
  { title: '关联内容', key: 'contentName', align: 'center' },
  {
    title: '所属页面',
    key: 'page',
    align: 'center',
    render(row, index) {
      return eliteIdOptions.pageOptions[row.page - 1].label
    },
  },
  { title: '创建时间', key: 'create_time', align: 'center' },
  { title: '创建人', key: 'add_uid', align: 'center' },
  { title: '修改时间', key: 'update_time', align: 'center' },
  { title: '修改人', key: 'up_uid', align: 'center' },
]
if (permissionStore.isRolesFun('disable')) {
  columns.push({
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
  })
}
columns.push({ title: '排序', key: 'sort', align: 'center' }, { title: '备注', key: 'note', align: 'center' })
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
            style: { 'margin-right': '10px' },
            secondary: true,
            onClick: () => lookCoupon(row),
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
            type: 'info',
            secondary: true,
            style: { 'margin-right': '10px' },
            onClick: () => editCoupon(row),
          },
          { default: () => '编辑', icon: renderIcon('majesticons:eye-line', { size: 14 }) }
        ),
        [[has, 'edit']]
      ),
      withDirectives(
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
        [[has, 'delete']]
      ),
    ]
  },
}
if (permissionStore.isIncludeRoles()) {
  columns.push(operateList)
}
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
//状态启用
function handlePublish(row) {
  http
    .updateStatus({
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

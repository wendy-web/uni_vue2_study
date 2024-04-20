<template>
  <CommonPage show-footer title="优惠券分组">
    <template #action>
      <div v-has="'add'" mr-50>
        导航栏开启状态：
        <n-switch v-model:value="isShowStatus" @update:value="handleChange" />
      </div>
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
      @getDataCallback="getDataCallbackHandle"
    >
      <template #queryBar>
        <QueryBarItem label="系统类型" :label-width="80">
          <n-select v-model:value="queryItems.type" :options="options" />
        </QueryBarItem>
        <QueryBarItem label="分组名称" :label-width="80">
          <n-input
            v-model:value="queryItems.name"
            type="text"
            placeholder="分组名称"
            @keydown.enter="$table?.handleSearch"
          />
        </QueryBarItem>
      </template>
    </CrudTable>
  </CommonPage>
  <operat-group ref="operatGroupRef" @refresh="refresh" />
</template>

<script setup>
import { usePermissionStore } from '@/store';
import { renderIcon } from '@/utils';
import { NButton, NSwitch, useDialog, useMessage } from 'naive-ui';
import { resolveDirective, withDirectives } from 'vue';
import http from './api';
import operatGroup from './operatGroup.vue';
const has = resolveDirective('has')
const permissionStore = usePermissionStore()
defineOptions({ name: 'CouponGroup' })
//表格操作
const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})
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
})

function refresh() {
  $table.value?.handleSearch()
}
const isShowStatus = ref(true)
function getDataCallbackHandle(data) {
  const { status } = data
  isShowStatus.value = !Boolean(status)
}
function handleChange(value) {
  http.coupnGroup({ status: Number(!value) }).then(function (res) {
    if (res.code == 1) {
      message.success(res.msg)
      refresh()
      return
    }
    message.error(res.msg)
  })
}
const columns = [
  { title: '分组名称', key: 'name', align: 'center' },
  {
    title: '系统类型',
    key: 'type',
    align: 'center',
    render(row) {
      return ['苹果机', '公共', '安卓机'][row.type - 1]
    },
  },
  { title: '创建时间', key: 'create_time', align: 'center' },
  { title: '修改时间', key: 'update_time', align: 'center' },
  { title: '推广位ID', key: 'positionId', align: 'center' },
  {
    title: '所属小程序',
    key: 'is_bfxl',
    align: 'center',
    render(row) {
      return ['天天享礼', '彬纷享礼'][row.is_bfxl]
    },
  },
  { title: '排序', key: 'sort', align: 'center' },
]

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
      http.deleteGroup({ group_id: row.id }).then(function (res) {
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
    .updateTopStatus({
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

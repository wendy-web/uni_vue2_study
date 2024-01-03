<template>
  <CommonPage show-footer title="图文管理(会员)">
    <template #action>
      <n-button v-has="'add'" type="primary" @click="handleAdd">
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
        <QueryBarItem label="导航名称" :label-width="80">
          <n-input
            v-model:value="queryItems.title"
            type="text"
            placeholder="请输入名称"
            clearable
            @keydown.enter="$table?.handleSearch"
          />
        </QueryBarItem>
        <QueryBarItem label="系统" :label-width="65">
          <n-select v-model:value="queryItems.device_type" :options="systemOptions" clearable />
        </QueryBarItem>
        <QueryBarItem label="状态" :label-width="65">
          <n-select v-model:value="queryItems.status" :options="statusOptions" clearable />
        </QueryBarItem>
      </template>
    </CrudTable>
  </CommonPage>
  <operat-single ref="operatSingleRef" @refresh="refresh" />
</template>

<script setup>
import { NButton, NImage } from 'naive-ui'
import { renderIcon } from '@/utils'
import { useMessage, useDialog, NSwitch } from 'naive-ui'
import operatSingle from './operatSingle.vue'
import http from './api'
import { resolveDirective, withDirectives } from 'vue'
const has = resolveDirective('has')
import { usePermissionStore } from '@/store'
const permissionStore = usePermissionStore()
defineOptions({ name: 'SingleColumnDiagram' })
//表格操作
const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({
  lx_type: 2,
})
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
const statusOptions = [
  {
    label: '启用',
    value: 1,
  },
  {
    label: '停用',
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
const columns = [
  { title: '导航名称', key: 'title', align: 'center' },
  {
    title: '系统',
    key: 'device_type',
    align: 'center',
    render(row, index) {
      return ['苹果机', '公共', '安卓'][row.device_type - 1]
    },
  },
  {
    title: '图片',
    key: 'image',
    align: 'center',
    render(row, index) {
      return h(NImage, {
        width: '100',
        src: row.image,
      })
    },
  },
  {
    title: '标签',
    key: 'tag',
    align: 'center',
    render(row, index) {
      return h(NImage, {
        width: '100',
        src: row.tag,
      })
    },
  },
  { title: '跳转页面', key: 'jump_title', align: 'center' },
  { title: '排序', key: 'sort', align: 'center' },
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
if (permissionStore.isIncludeRoles()) {
  columns.push(operateList)
}
//优惠券操作
const operatSingleRef = ref(null)
//提示展示
const message = useMessage()
/**查看 */
function lookCoupon(row) {
  operatSingleRef.value.show(1, row)
}
/**编辑 */
function editCoupon(row) {
  operatSingleRef.value.show(2, row)
}
/**新增活动 */
function handleAdd() {
  operatSingleRef.value.show(3)
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
      http.deleteSingleImage({ id: row.id, lx_type: 2 }).then(function (res) {
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
    .updateSingleImageStatus({
      id: row.id,
      lx_type: 2,
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

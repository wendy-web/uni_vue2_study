<template>
  <CommonPage show-footer title="商品专题">
    <template #action>
      <n-button v-has="'add'" type="primary" @click="handleAdd">
        <TheIcon icon="material-symbols:add" :size="18" class="mr-5" /> 添加专题
      </n-button>
    </template>
    <div style="padding-bottom: 8px">
      小程序页面路径：<span style="color: red">/pages/userModule/allowance/specialList/index?id=</span>&nbsp;列表ID
    </div>
    <CrudTable
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="http.getList"
    >
      <template #queryBar>
        <QueryBarItem label="电商类型" :label-width="80">
          <n-select v-model:value="queryItems.lx_type" :options="options" />
        </QueryBarItem>
        <QueryBarItem label="专题名称" :label-width="80">
          <n-input
            v-model:value="queryItems.title"
            type="text"
            placeholder="专题名称"
            @keydown.enter="$table?.handleSearch"
          />
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
import { usePermissionStore } from '@/store';
import { renderIcon } from '@/utils';
import { NButton, NImage, NSwitch, useDialog, useMessage } from 'naive-ui';
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
/**电商类型下拉列表 */
const options = [
  {
    label: '自选',
    value: 1,
  },
  {
    label: '京东',
    value: 2,
  },
  {
    label: '拼多多',
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

const columns = [
  { title: 'ID', key: 'id', align: 'center', width: 100 },
  { title: '专题名称', key: 'title', align: 'center' },
  {
    title: '电商类型',
    key: 'lx_type',
    align: 'center',
    render(row) {
      return ['自选', '京东', '拼多多'][row.lx_type - 1]
    },
  },
  { title: '分享标题', key: 'share_word', align: 'center' },
  {
    title: '商品图片',
    key: 'share_img',
    align: 'center',
    width: '100',
    render(row, index) {
      return h(NImage, {
        width: '100',
        src: row.share_img,
      })
    },
  },
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
      http.delete({ id: row.id }).then(function (res) {
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

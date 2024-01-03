<template>
  <CommonPage show-footer title="排行榜管理">
    <template #action>
      <div v-has="'add'" mr-50>
        开启状态：
        <n-switch v-model:value="active" @update:value="handleChange" />
      </div>
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
      :is-pagination="false"
      @getDataCallback="getDataCallbackHandle"
    >
      <template #queryBar>
        <QueryBarItem label="商品标题" :label-width="80">
          <n-input
            v-model:value="queryItems.title"
            type="text"
            placeholder="商品标题"
            @keydown.enter="$table?.handleSearch"
          />
        </QueryBarItem>
        <QueryBarItem label="系统" :label-width="65">
          <n-select v-model:value="queryItems.device_type" :options="systemOptions" />
        </QueryBarItem>
        <QueryBarItem label="启用状态" :label-width="65">
          <n-select v-model:value="queryItems.status" :options="statusOptions" />
        </QueryBarItem>
        <QueryBarItem label="排行榜类型" :label-width="80">
          <n-select v-model:value="queryItems.type" :options="typeOptions" />
        </QueryBarItem>
      </template>
    </CrudTable>
  </CommonPage>
  <operat-ranking ref="operatRankingRef" @refresh="refresh" />
</template>

<script setup>
import { NButton } from 'naive-ui'
import { renderIcon } from '@/utils'
import { useMessage, useDialog, NSwitch } from 'naive-ui'
import operatRanking from './operatRanking.vue'
import { resolveDirective, withDirectives } from 'vue'
const has = resolveDirective('has')
import { usePermissionStore } from '@/store'
const permissionStore = usePermissionStore()
import http from './api'
defineOptions({ name: 'RankingList' })
//表格操作
const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})
const active = ref(false)
function getDataCallbackHandle(data) {
  const { status } = data
  active.value = !Boolean(status)
}
function handleChange(value) {
  http.showTop({ status: Number(!value) }).then(function (res) {
    if (res.code == 1) {
      message.success(res.msg)
      refresh()
    } else {
      message.error(res.msg)
    }
  })
}

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
    label: '已启用',
    value: 1,
  },
  {
    label: '未启用',
    value: 0,
  },
]

const typeOptions = [
  {
    label: '兑换排行榜',
    value: 1,
  },
  {
    label: '超值排行榜',
    value: 2,
  },
]

onMounted(() => {
  refresh()
})

function refresh() {
  $table.value?.handleSearch()
}

const columns = [
  {
    title: '系统',
    key: 'device_type',
    align: 'center',
    render(row, index) {
      return ['苹果机', '公共', '安卓'][row.device_type - 1]
    },
  },
  {
    title: '类型',
    key: 'device_type',
    align: 'center',
    render(row, index) {
      return ['兑换排行榜', '超值排行榜'][row.type - 1]
    },
  },
  { title: '商品名称', key: 'coupon_title', align: 'center' },
  {
    title: '来源',
    key: 'lx_type',
    align: 'center',
    render(row, index) {
      return ['自建', '京东'][row.lx_type - 1]
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
const operatRankingRef = ref(null)
//提示展示
const message = useMessage()
/**查看 */
function lookCoupon(row) {
  operatRankingRef.value.show(1, row)
}
/**编辑 */
function editCoupon(row) {
  operatRankingRef.value.show(2, row)
}
/**新增活动 */
function handleAdd() {
  operatRankingRef.value.show(3)
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
      http.deleteTop({ top_id: row.id }).then(function (res) {
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
      top_id: row.id,
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

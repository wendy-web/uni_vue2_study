<template>
  <CommonPage show-footer title="捡漏专区">
    <template #action>
      <div v-has="'other'" class="timer_box">
        <n-space>
          <n-time-picker
            v-model:formatted-value="start_time"
            value-format="HH:mm"
            format="HH:mm"
            placeholder="开始时间"
            mr-12
          />
          <n-time-picker
            v-model:formatted-value="over_time"
            value-format="HH:mm"
            format="HH:mm"
            placeholder="结束时间"
          />
        </n-space>
        <n-button mr-20 ml-20 type="primary" @click="changeTimer">更改时间</n-button>
      </div>
      <n-button v-has="'add'" type="primary" @click="handleAdd">
        <TheIcon icon="material-symbols:add" :size="18" class="mr-5" /> 添加商品
      </n-button>
    </template>
    <CrudTable
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="http.leakList"
      @getDataCallback="getDataCallbackHandle"
    >
      <template #queryBar>
        <QueryBarItem label="商品编号" :label-width="80">
          <n-input
            v-model:value="queryItems.goods_code"
            type="text"
            placeholder="商品编号"
            clearable
            @keydown.enter="$table?.handleSearch"
          />
        </QueryBarItem>
        <QueryBarItem label="商品名称" :label-width="80">
          <n-input
            v-model:value="queryItems.goods_name"
            type="text"
            placeholder="商品名称"
            clearable
            @keydown.enter="$table?.handleSearch"
          />
        </QueryBarItem>
        <QueryBarItem label="商品状态" :label-width="80">
          <n-select v-model:value="queryItems.goods_status" :options="statusOptions" clearable />
        </QueryBarItem>
        <QueryBarItem label="商品类型" :label-width="80">
          <n-select v-model:value="queryItems.goods_type" :options="typeOptions" clearable />
        </QueryBarItem>
        <QueryBarItem label="系统类型" :label-width="80">
          <n-select v-model:value="queryItems.device_type" :options="options" clearable />
        </QueryBarItem>
      </template>
    </CrudTable>
  </CommonPage>
  <operat-group-detail ref="operatGroupDetailRef" :ck-ids="ckIds" @addList="addListHandle" />
</template>

<script setup>
import { NButton, NInputNumber } from 'naive-ui'
import { renderIcon } from '@/utils'
import { useMessage, useDialog } from 'naive-ui'
import operatGroupDetail from './operatGroupDetail.vue'
import http from './api'
import { resolveDirective, withDirectives } from 'vue'
import { usePermissionStore } from '@/store'
const permissionStore = usePermissionStore()
const has = resolveDirective('has')
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
// 商品状态
const statusOptions = [
  {
    label: '下架',
    value: 0,
  },
  {
    label: '系统下架',
    value: 1,
  },
  {
    label: '上架',
    value: 2,
  },
]
const typeOptions = [
  {
    label: '直充',
    value: 0,
  },
  {
    label: '卡券',
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
  {
    label: '深爱购',
    value: 4,
  },
]

onMounted(() => {
  refresh()
})

function refresh() {
  $table.value?.handleSearch()
}
// 时间选择
const start_time = ref(null)
const over_time = ref(null)
function changeTimer() {
  const params = {
    start_time: start_time.value,
    over_time: over_time.value,
  }
  http.leakTime(params).then((res) => {
    message.success(res.msg)
  })
}
const ckIds = ref([])
function getDataCallbackHandle(data) {
  const leak = data.leak
  start_time.value = leak.start_time
  over_time.value = leak.over_time
  ckIds.value = data.ckIds
}
const columns = [
  { title: '商品编号', key: 'goods_number', align: 'center' },
  { title: '商品名称', key: 'goods_name', align: 'center' },
  {
    title: '商品类型',
    key: 'goods_type',
    align: 'center',
    render(row) {
      return typeOptions[row.goods_type]?.label
    },
  },
  { title: '库存', key: 'coupon_num', align: 'center' },
  { title: '日常价(元)', key: 'salePrice', align: 'center' },
  { title: '捡漏价(元)', key: 'coupon_price', align: 'center' },
  { title: '成本价(元)', key: 'costPrice', align: 'center' },
  {
    title: '商品状态',
    key: 'status',
    align: 'center',
    render(row) {
      return statusOptions[row.status].label
    },
  },
  {
    title: '系统类型',
    key: 'device_type',
    align: 'center',
    render(row) {
      return options[row.device_type - 1].label
    },
  },
  {
    title: '无券',
    key: 'not_coupon',
    align: 'center',
    width: 80,
    render(row, index) {
      return row.lx_type == 2 ? (row.not_coupon == 1 ? '是' : '否') : ''
    },
  },
]
const sortList = {
  title: '排序',
  key: 'sort',
  align: 'center',
  render(row) {
    return h(NInputNumber, {
      value: row.sort || 0,
      min: 0,
      size: 'tiny',
      style: {
        'margin-right': '10px',
        width: '85px',
        display: 'inline-block',
      },
      onUpdateValue(value) {
        // console.log('value :>> ', value);
        // handSortUpdate(row.id, value)
      },
      onBlur(event) {
        // console.log('value :>onBlur> ', event.target.value);
        handSortUpdate(row.id, event.target.value)
      },
    })
  },
}
const operateList = {
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
          type: 'error',
          secondary: true,
          onClick: () => removeCoupon(row),
        },
        { default: () => '删除', icon: renderIcon('material-symbols:cancel-outline-rounded', { size: 14 }) }
      ),
    ]
  },
}
// 排序与删除的列表权限
if (permissionStore.isRolesFun('sort')) columns.push(sortList)
if (permissionStore.isRolesFun('delete')) columns.push(operateList)

// 提示展示
const message = useMessage()
const operatGroupDetailRef = ref(null)
/**新增活动 */
function handleAdd() {
  operatGroupDetailRef.value.show()
}
/** 自定义单元格 */
const dialog = useDialog()
function addListHandle(group) {
  http.leakGoods({ group }).then((res) => {
    if (res.code != 1) return
    message.success(res.msg)
    refresh()
  })
}
/**删除分组 */
function removeCoupon(row) {
  dialog.warning({
    title: '警告',
    content: '确定删除？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: function () {
      http.leakDel({ id: row.id }).then(function (res) {
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
// 排序的更改
function handSortUpdate(id, value) {
  http.leakSort({ id, sort: Number(value) }).then((res) => {
    if (res.code == 1) {
      message.success(res.msg)
      $table.value?.handleSearch()
      return
    }
    message.error(res.msg)
  })
}
</script>
<style>
.timer_box {
  flex: 1 1 auto;
  display: flex;
  align-items: center;
}
</style>

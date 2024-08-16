<template>
  <CommonPage show-footer title="优惠券管理">
    <template #action>
      <n-button v-has="'add'" type="primary" @click="handleAdd">
        <TheIcon icon="material-symbols:add" :size="18" class="mr-5" /> 新增优惠券
      </n-button>
    </template>
    <CrudTable
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="2200"
      :columns="columns"
      :get-data="http.getList"
    >
      <template #queryBar>
        <QueryBarItem label="优惠券名称" :label-width="80">
          <n-input
            v-model:value="queryItems.title"
            type="text"
            placeholder="优惠券名称"
            clearable
            @keydown.enter="$table?.handleSearch"
          />
        </QueryBarItem>
        <QueryBarItem label="商品编码" :label-width="80">
          <n-input
            v-model:value="queryItems.skuCode"
            type="text"
            placeholder="商品编码"
            clearable
            @keydown.enter="$table?.handleSearch"
          />
        </QueryBarItem>
        <QueryBarItem label="状态" :label-width="40">
          <n-select v-model:value="queryItems.status" clearable :options="options" />
        </QueryBarItem>
        <QueryBarItem label="券类型" :label-width="60">
          <n-select v-model:value="queryItems.d_type" clearable :options="dtOptions" @update:value="dtChange" />
        </QueryBarItem>
        <QueryBarItem label="系统" :label-width="80">
          <n-select v-model:value="queryItems.device_type" clearable :options="deviceOptions" />
        </QueryBarItem>
        <QueryBarItem v-if="queryItems.d_type === 1" label="商品上架状态" :label-width="100">
          <n-select v-model:value="queryItems.goods_ls_status" clearable :options="options" />
        </QueryBarItem>
        <QueryBarItem v-if="queryItems.d_type === 1" label="商品启用状态" :label-width="100">
          <n-select v-model:value="queryItems.goods_status" clearable :options="lsOptions" />
        </QueryBarItem>
      </template>
    </CrudTable>
  </CommonPage>
  <!-- 优惠券操作 -->
  <operat-coupon ref="operatCouponRef" @refresh="refresh" />
</template>

<script setup>
import { usePermissionStore } from '@/store';
import { renderIcon } from '@/utils';
import { NButton, NSwitch, useMessage } from 'naive-ui';
import { resolveDirective, withDirectives } from 'vue';
import http from './api';
import operatCoupon from './operatCoupon/index.vue';
import { deviceOptions, dtOptions, lsOptions, options } from './options.js';
const has = resolveDirective('has')
const permissionStore = usePermissionStore()
defineOptions({ name: 'CouponList' })
//表格操作
const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})

function dtChange() {
  if (queryItems.value.d_type !== 1) {
    queryItems.value.goods_ls_status = ''
    queryItems.value.goods_status = ''
  }
}

onActivated(() => {
  $table.value?.handleSearch()
})

function refresh(type) {
  type === 3 ? $table.value?.handleSearch() : $table.value?.handleRefreshCurr()
}

const columns = [
  { title: '优惠券ID', key: 'id', align: 'center', width: 150 },
  { title: '优惠券名称', key: 'title', align: 'center', width: 150 },
  {
    title: '券类型',
    key: 'd_type',
    align: 'center',
    width: 150,
    render(row, index) {
      return [
        '商品',
        '公众号',
        '视频号',
        '小程序',
        '千猪外链',
        '小程序内页',
        '视频组件',
        '乐唯抓娃娃',
        '多商品滑动',
        '广告推券',
        '小程序h5',
        '惠吃喝囤券',
        '高返现商品',
        '橙券商品',
      ][row.d_type - 1]
    },
  },
  {
    title: '面值(元)',
    key: 'face_value',
    width: 100,
    align: 'center',
  },
  { title: '兑换价格(牛金豆)', key: 'credits', align: 'center', width: 150 },
  { title: '发放数量', key: 'stock_num', align: 'center', width: 100 },
  { title: '实际兑换', key: 'exch_user_num', align: 'center', width: 100 },
  { title: '有效期(天)', key: 'expiry_date', align: 'center', width: 100 },
  { title: '创建时间', key: 'create_time', align: 'center', width: 252 },
  { title: '更新时间', key: 'update_time', align: 'center', width: 252 },
  {
    title: '商品上架状态',
    key: 'goods_ls_status',
    width: 150,
    align: 'center',
    render(row, index) {
      return row.goods_ls_status === 0 ? '下架' : '上架'
    },
  },
  {
    title: '商品启用状态',
    key: 'goods_status',
    width: 150,
    align: 'center',
    render(row, index) {
      if (row.d_type > 1) {
        return '启用'
      }
      return row.goods_status < 2 ? '未启用' : '已启用'
    },
  },
  {
    title: '上架状态',
    key: 'status',
    align: 'center',
    width: 100,
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
    title: '系统',
    key: 'device_type',
    align: 'center',
    width: 100,
    className: 'nowrap',
    render(row, index) {
      return row.device_type == 1 ? '苹果' : row.device_type == 2 ? '公共' : '安卓'
    },
  },
]
const operateList = {
  title: '操作',
  key: 'actions',
  align: 'center',
  fixed: 'right',
  width: 260,
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
            onClick: () => editCoupon(row),
          },
          { default: () => '编辑', icon: renderIcon('majesticons:eye-line', { size: 14 }) }
        ),
        [[has, 'edit']]
      ),
    ]
  },
}
if (permissionStore.isIncludeRoles()) {
  columns.push(operateList)
}
//优惠券操作
const operatCouponRef = ref(null)
//提示展示
const message = useMessage()
/**查看 */
function lookCoupon(row) {
  operatCouponRef.value.show(1, row)
}
/**编辑 */
function editCoupon(row) {
  operatCouponRef.value.show(2, row)
}
/**新增活动 */
function handleAdd() {
  console.log('add优惠券：', operatCouponRef.value)
  operatCouponRef.value.show(3)
}

//状态启用
function handlePublish(row) {
  http
    .updateStatus({
      coupon_id: row.id,
      status: Number(!Boolean(row.status)),
    })
    .then((res) => {
      if (res.code == 1) {
        message.success(res.msg)
        $table.value?.handleRefreshCurr()
      } else {
        message.error(res.msg)
      }
    })
}
</script>
<style lang="scss">
.nowrap_class {
  white-space: nowrap;
}
</style>

<template>
  <CommonPage show-footer title="乐刷商品">
    <template #action>
      <n-button v-has="'sync'" type="primary" @click="synchronization"> 同步 </n-button>
    </template>
    <CrudTable
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="http.getList"
      :extra-params="extraParams"
      @export="exportGoods"
    >
      <template #queryBar>
        <QueryBarItem label="商品编号" :label-width="80">
          <n-input
            v-model:value="queryItems.skuCode"
            type="text"
            placeholder="请输商品编号"
            @keydown.enter="$table?.handleSearch"
          />
        </QueryBarItem>
        <QueryBarItem label="商品名称" :label-width="80">
          <n-input
            v-model:value="queryItems.title"
            type="text"
            placeholder="请输商品名称"
            @keydown.enter="$table?.handleSearch"
          />
        </QueryBarItem>
        <QueryBarItem label="spuName" :label-width="80">
          <n-input
            v-model:value="queryItems.spuName"
            type="text"
            placeholder="请输spuName"
            @keydown.enter="$table?.handleSearch"
          />
        </QueryBarItem>
        <QueryBarItem label="商品类型" :label-width="80">
          <n-select v-model:value="queryItems.type" :options="goodsTypeOptions" />
        </QueryBarItem>
        <QueryBarItem label="商品状态" :label-width="80">
          <n-select v-model:value="queryItems.ls_status" :options="lsStatusOptions" />
        </QueryBarItem>
        <QueryBarItem label="启用状态" :label-width="80">
          <n-select v-model:value="queryItems.status" :options="goodsStatusOptions" />
        </QueryBarItem>
      </template>
    </CrudTable>
  </CommonPage>
  <!-- 优惠券操作 -->
  <operat-goods ref="operatGoodsRef" @refresh="refresh" />
</template>

<script setup>
import { renderIcon } from '@/utils';
import axios from 'axios';
import { NButton, NSwitch, useMessage } from 'naive-ui';
import http from './api';
import operatGoods from './operatGoods/index.vue';
defineOptions({ name: 'GoodsManageList' })
//表格操作
const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})
/**商品类型下拉列表 */
const goodsTypeOptions = [
  {
    label: '直冲',
    value: 0,
  },
  {
    label: '卡券',
    value: 1,
  },
]
/**商品状态下拉列表 */
const goodsStatusOptions = [
  {
    label: '启用',
    value: 2,
  },
  {
    label: '未启用',
    value: 0,
  },
  {
    label: '系统停用',
    value: 1,
  },
]
const lsStatusOptions = [
  {
    label: '下架',
    value: 0,
  },
  {
    label: '上架',
    value: 1,
  },
]
const extraParams = {
  isExport: true,
}
onMounted(() => {
  refresh()
})

function refresh() {
  $table.value?.handleRefreshCurr()
}

const columns = [
  { title: '商品ID', key: 'id', align: 'center' },
  { title: '商品编号', key: 'skuCode', align: 'center' },
  { title: '商品名称', key: 'title', align: 'center' },
  { title: 'spuName', key: 'spuName', align: 'center' },
  { title: '参考名称', key: 'skuName', align: 'center' },
  {
    title: '商品类型',
    key: 'type',
    align: 'center',
    render(row, index) {
      return row.type == 0 ? '直充' : '卡券'
    },
  },
  {
    title: '面值(元)',
    key: 'marketPrice',
    align: 'center',
    render(row, index) {
      return Number(row.marketPrice / 100).toFixed(2)
    },
  },
  {
    title: '成本价(元)',
    key: 'costPrice',
    align: 'center',
    render(row, index) {
      return Number(row.costPrice / 100).toFixed(2)
    },
  },
  {
    title: '售价(元)',
    key: 'salePrice',
    align: 'center',
    render(row, index) {
      return Number(row.salePrice / 100).toFixed(2)
    },
  },
  {
    title: '商品状态',
    key: 'ls_status',
    align: 'center',
    render(row, index) {
      return row.ls_status == 0 ? '下架' : '上架'
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
        value: Boolean(row['status'] == 2),
        loading: !!row.publishing,
        onUpdateValue: () => handlePublish(row),
      })
    },
  },
  { title: '修改时间', key: 'update_time', align: 'center' },
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
            onClick: () => editCoupon(row),
          },
          { default: () => '编辑', icon: renderIcon('majesticons:eye-line', { size: 14 }) }
        ),
      ]
    },
  },
]
//优惠券操作
const operatGoodsRef = ref(null)
//提示展示
const message = useMessage()
/**查看 */
function lookCoupon(row) {
  operatGoodsRef.value.show(1, row)
}
/**编辑 */
function editCoupon(row) {
  operatGoodsRef.value.show(2, row)
}

//同步
function synchronization() {
  http.syncGoods().then(function (res) {
    refresh()
  })
}

//状态启用
function handlePublish(row) {
  http
    .updateStatus({
      goods_id: row.id,
      status: row['status'] == 2 ? 0 : 2,
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
// 导出商品
function exportGoods(params) {
  axios
    .post(
      // "/api/apios/Goods/export",
      '/apios/Goods/export',
      params,
      { responseType: 'blob' }
    )
    .then((res) => {
      if (!res) {
        return
      }
      let url = window.URL.createObjectURL(
        new Blob([res.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
      )
      let a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.target = '_blank'
      a.setAttribute('download', '商品列表.xls')
      document.body.appendChild(a)
      a.click() //执行下载
      window.URL.revokeObjectURL(a.href)
      document.body.removeChild(a)
    })
    .catch((err) => {
      console.log(err)
    })
}
</script>

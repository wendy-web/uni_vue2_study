<template>
  <CommonPage show-footer title="商品列表">
    <template #action>
      <n-button type="primary" @click="addGoods">
        <TheIcon icon="material-symbols:add" :size="18" class="mr-5" /> 新增商品
      </n-button>
    </template>
    <CrudTable
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="http.goodsList"
    >
      <template #queryBar>
        <QueryBarItem label="商品名称" :label-width="80">
          <n-input
            v-model:value="queryItems.goods_name"
            type="text"
            placeholder="请输商品名称"
            clearable
            @keydown.enter="$table?.handleSearch"
          />
        </QueryBarItem>
        <QueryBarItem label="上架状态" :label-width="80">
          <n-select v-model:value="queryItems.status" :options="goodsStatusOptions" clearable />
        </QueryBarItem>
      </template>
    </CrudTable>
  </CommonPage>
  <!-- 商品操作 -->
  <operat-goods ref="operatGoodsRef" @refresh="refresh" />
</template>

<script setup>
import { renderIcon } from '@/utils';
import { NButton, NSwitch, useMessage } from 'naive-ui';
import http from './api';
import operatGoods from './operatGoods/index.vue';
import { goodsStatusOptions } from './options';
defineOptions({ name: 'storeGoodsList' })
// 表格操作
const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})

onMounted(() => {
  refresh()
})

function refresh() {
  $table.value?.handleRefreshCurr()
}
const columns = [
  { title: '商品ID', key: 'id', align: 'center' },
  { title: '商品名称', key: 'goods_name', align: 'center' },
  {
    title: '商品原价',
    key: 'original_price',
    align: 'center',
    render(row, index) {
      return Number(row.original_price).toFixed(2)
    },
  },
  {
    title: '商品售价',
    key: 'selling_price',
    align: 'center',
    render(row, index) {
      return Number(row.selling_price).toFixed(2)
    },
  },
  {
    title: '商品库存',
    key: 'inventory',
    align: 'center',
  },
  {
    title: '销售状态',
    key: 'status',
    align: 'center',
    render(row, index) {
      return row.status == 0 ? '下架' : '上架'
    },
  },
  {
    title: '启用状态',
    key: 'status',
    align: 'center',
    render(row, index) {
      return [
        h(
          NSwitch,
          {
            size: 'small',
            rubberBand: false,
            value: Boolean(row['status'] == 1),
            loading: !!row.publishing,
            style: 'margin-left:10px',
            onUpdateValue: () => handlePublish(row),
          },
          {
            checked: () => '上架',
            unchecked: () => '下架',
          }
        ),
      ]
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
            onClick: () => lookGoods(row),
          },
          { default: () => '查看', icon: renderIcon('majesticons:eye-line', { size: 14 }) }
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'info',
            secondary: true,
            onClick: () => editGoods(row),
          },
          { default: () => '编辑', icon: renderIcon('majesticons:edit-pen-4-line', { size: 14 }) }
        ),
      ]
    },
  },
]
// 提示展示
const message = useMessage()
// 优惠券操作
const operatGoodsRef = ref(null)
/**查看 */
function lookGoods(row) {
  operatGoodsRef.value.show(1, row)
}
/**编辑 */
function editGoods(row) {
  operatGoodsRef.value.show(2, row)
}
/**新增 */
function addGoods() {
  operatGoodsRef.value.show(3)
}
// 状态启用
function handlePublish(row) {
  http
    .goodsStatus({
      id: row.id,
      status: row['status'] == 1 ? 0 : 1,
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

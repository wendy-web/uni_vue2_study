<template>
  <CommonPage show-footer title="商品列表">
    <template #action>
      <n-button type="primary" @click="addGoods">
        <TheIcon icon="material-symbols:add" :size="18" class="mr-5" /> 新增商品
      </n-button>
      <n-button type="primary" style="margin-left: 30px" @click="synchronization"> 同步 </n-button>
    </template>
    <CrudTable
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="http.getList"
    >
      <template #queryBar>
        <QueryBarItem label="商品编号" :label-width="80">
          <n-input
            v-model:value="queryItems.goods_number"
            type="text"
            placeholder="请输商品编号"
            @keydown.enter="$table?.handleSearch"
          />
        </QueryBarItem>
        <QueryBarItem label="商品名称" :label-width="80">
          <n-input
            v-model:value="queryItems.goods_name"
            type="text"
            placeholder="请输商品名称"
            @keydown.enter="$table?.handleSearch"
          />
        </QueryBarItem>
        <QueryBarItem label="spu名称" :label-width="80">
          <n-input
            v-model:value="queryItems.spuName"
            type="text"
            placeholder="请输spu名称"
            @keydown.enter="$table?.handleSearch"
          />
        </QueryBarItem>
        <QueryBarItem label="商品类型" :label-width="80">
          <n-select v-model:value="queryItems.goods_type" :options="goodsTypeOptions" />
        </QueryBarItem>
        <QueryBarItem label="启用状态" :label-width="80">
          <n-select v-model:value="queryItems.use" :options="goodsStatusOptions" />
        </QueryBarItem>
        <QueryBarItem label="系统类型" :label-width="80">
          <n-select v-model:value="queryItems.device_type" :options="systemOptions" />
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
import { goodsStatusOptions, goodsTypeOptions, systemOptions } from './options';
defineOptions({ name: 'storeGoodsList' })
//表格操作
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
  { title: '商品编号', key: 'goods_number', align: 'center' },
  { title: '商品名称', key: 'goods_name', align: 'center' },
  { title: 'spuName', key: 'spuName', align: 'center' },
  { title: '参考名称', key: 'skuName', align: 'center' },
  {
    title: '商品类型',
    key: 'goods_type',
    align: 'center',
    render(row, index) {
      //return row.goods_type == 0 ? '直充' : '卡券'
      switch (row.goods_type) {
        case 0:
          return '直充'
          break
        case 1:
          return '卡券'
          break
        case 2:
          return '公众号'
          break
        case 3:
          return '视频号'
          break
        case 4:
          return '小程序'
          break
      }
    },
  },
  {
    title: '面值(元)',
    key: 'marketPrice',
    align: 'center',
    render(row, index) {
      return Number(row.price / 100).toFixed(2)
    },
  },
  {
    title: '成本(元)',
    key: 'cost',
    align: 'center',
    render(row, index) {
      return Number(row.cost / 100).toFixed(2)
    },
  },
  {
    title: '差价(元)',
    key: 'price_difference',
    align: 'center',
    render(row, index) {
      return Number(row.price_difference / 100).toFixed(2)
    },
  },
  {
    title: '抵扣金额(元)',
    key: 'deduction_price',
    align: 'center',
    render(row, index) {
      return Number(row.deduction_price / 100).toFixed(2)
    },
  },
  { title: '抵扣积分', key: 'deduction_credits', align: 'center' },
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
      return ['停用', '启用', '系统停用'][row.use]
    },
  },
  {
    title: '系统',
    key: 'device_type',
    align: 'center',
    render(row, index) {
      return ['苹果', '公共', '安卓'][row.device_type - 1]
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
        h(
          NSwitch,
          {
            size: 'small',
            rubberBand: false,
            value: Boolean(row['use'] == 1),
            loading: !!row.publishing,
            style: 'margin-left:10px',
            onUpdateValue: () => handlePublish(row),
          },
          {
            checked: () => '启用',
            unchecked: () => '停用',
          }
        ),
      ]
    },
  },
]
//提示展示
const message = useMessage()
//优惠券操作
const operatGoodsRef = ref(null)
//同步
function synchronization() {
  http.syncGoods().then(function (res) {
    refresh()
  })
}
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
//状态启用
function handlePublish(row) {
  http
    .updateStatus({
      id: row.id,
      use: row['use'] == 1 ? 0 : 1,
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

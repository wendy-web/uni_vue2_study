<template>
  <CommonPage show-footer title="惠吃喝商品">
    <CrudTable
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="http.goodsList"
    >
      <template #queryBar>
        <QueryBarItem label="商品类别" :label-width="80">
          <n-select v-model:value="queryItems.type" :options="goodsTypeOptions" />
        </QueryBarItem>
        <QueryBarItem label="商品名称" :label-width="80">
          <n-input
            v-model:value="queryItems.keyword"
            type="text"
            placeholder="商品名称"
            clearable
            @keydown.enter="$table?.handleSearch"
          />
        </QueryBarItem>
      </template>
    </CrudTable>
  </CommonPage>
</template>

<script setup>
import { NImage, useMessage } from 'naive-ui'
import http from './api'
defineOptions({ name: 'GoodsList' })
//表格操作
const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({
  type: 1,
})
/**产品类别下拉列表 */
const goodsTypeOptions = [
  {
    label: '海威 - 瑞幸',
    value: 1,
  },
  {
    label: '海威 - 麦当劳',
    value: 2,
  },
  {
    label: '千猪 - 肯德基',
    value: 3,
  },
]
onMounted(() => {
  refresh()
})

function refresh() {
  $table.value?.handleRefreshCurr()
}

const columns = [
  { title: '商品ID', key: 'product_id', align: 'center', width: 200 },
  {
    title: '商品图片',
    key: 'product_img',
    align: 'center',
    width: '100',
    render(row, index) {
      return h(NImage, {
        width: '100',
        src: row.product_img,
      })
    },
  },
  { title: '商品名称', key: 'product_name', align: 'center' },
  {
    title: '价格(元)',
    key: 'product_price',
    align: 'center',
    render(row, index) {
      return row.product_price
    },
  },
]
</script>

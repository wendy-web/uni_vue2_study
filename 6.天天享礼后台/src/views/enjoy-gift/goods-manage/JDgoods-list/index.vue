<template>
  <CommonPage show-footer title="京东商品">
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
            v-model:value="queryItems.skuId"
            type="text"
            placeholder="请输商品编号"
            clearable
            @keydown.enter="$table?.handleSearch"
          />
        </QueryBarItem>
        <QueryBarItem label="商品名称" :label-width="80">
          <n-input
            v-model:value="queryItems.skuName"
            type="text"
            placeholder="请输商品名称"
            clearable
            @keydown.enter="$table?.handleSearch"
          />
        </QueryBarItem>
        <QueryBarItem label="商品分类" :label-width="80">
          <n-select v-model:value="queryItems.cid1" :options="goodsTypeOptions" clearable />
        </QueryBarItem>
      </template>
    </CrudTable>
  </CommonPage>
</template>

<script setup>
import { NButton, NImage, useMessage } from 'naive-ui'
import http from './api'
defineOptions({ name: 'GoodsList' })
//表格操作
const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})
/**商品分类下拉列表 */
const goodsTypeOptions = ref([])
function getCategory() {
  http.getCategory().then((res) => {
    if (res.code == 1) {
      const list = res.data
      goodsTypeOptions.value = list.map((res) => {
        return {
          label: res.name,
          value: res.cid,
        }
      })
    }
  })
}
onMounted(() => {
  refresh()
  getCategory()
})

function refresh() {
  $table.value?.handleRefreshCurr()
}

const columns = [
  { title: '商品ID', key: 'id', align: 'center', width: 100 },
  { title: '商品编号', key: 'skuId', align: 'center' },
  { title: '店铺名称', key: 'shopName', align: 'center' },
  { title: '商品名称', key: 'skuName', align: 'center', width: 400 },
  {
    title: '商品图片',
    key: 'whiteImage',
    align: 'center',
    render(row, index) {
      return h(NImage, {
        width: '100',
        src: row.whiteImage,
      })
    },
  },
  {
    title: '价格(元)',
    key: 'price',
    align: 'center',
    width: 100,
    render(row, index) {
      return Number(row.price / 100).toFixed(2)
    },
  },
  {
    title: '优惠券',
    key: 'discount',
    align: 'center',
    width: 100,
    render(row, index) {
      return Number(row.discount / 100).toFixed(2)
    },
  },
  {
    title: '券后价',
    key: 'salePrice',
    align: 'center',
    width: 100,
    render(row, index) {
      return Number((row.price - row.discount) / 100).toFixed(2)
    },
  },
  { title: '一级分类', key: 'cid1Name', align: 'center' },
  { title: '二级分类', key: 'cid2Name', align: 'center' },
  { title: '三级分类', key: 'cid3Name', align: 'center' },
]
//提示展示
const message = useMessage()
// 同步类目的选项
const selectCid1 = ref()
function synchronization() {
  http
    .syncGoods({
      cid1: selectCid1.value,
    })
    .then((res) => {
      if (res.code == 1) {
        message.success(res.msg)
      } else {
        message.error(res.msg)
      }
      refresh()
    })
}
</script>

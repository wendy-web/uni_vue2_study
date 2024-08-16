<template>
  <CommonPage show-footer title="橙券商品">
    <template #action>
      <n-upload
        action="/apios/Goods/goodsImport"
        name="file"
        class="import_btn"
        @finish="handleFinish"
        @before-upload="beforeUpload"
      >
        <n-button type="primary">导入</n-button>
      </n-upload>
    </template>
    <CrudTable
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="http.goodsList"
      :extra-params="extraParams"
    >
      <template #queryBar>
        <QueryBarItem label="商品编号" :label-width="80">
          <n-input
            v-model:value="queryItems.goods_no"
            type="text"
            placeholder="请输商品编号"
            @keydown.enter="$table?.handleSearch"
          />
        </QueryBarItem>
        <QueryBarItem label="商品名称" :label-width="80">
          <n-input
            v-model:value="queryItems.name"
            type="text"
            placeholder="请输商品名称"
            @keydown.enter="$table?.handleSearch"
          />
        </QueryBarItem>
      </template>
    </CrudTable>
  </CommonPage>
</template>

<script setup>
import { NButton, useMessage } from 'naive-ui';
import http from './api';
defineOptions({ name: 'goodsListCq' })
const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})
const extraParams = {
  isExport: true,
}
async function beforeUpload(data) {
  console.log('data :>> ', data)
}
function handleFinish({ event }) {
  let { response, responseText } = event.currentTarget
  let res = JSON.parse(response || responseText)
  if (!res.code) return message.error(res.msg)
  message.success('导入成功')
}
onMounted(() => {
  refresh()
})

function refresh() {
  $table.value?.handleRefreshCurr()
}

const columns = [
  { title: '商品编号', key: 'goods_no', align: 'center', width: 200 },
  { title: '商品名称', key: 'name', align: 'center' },
  {
    title: '市场价(元)',
    key: 'official_price',
    align: 'center',
    render(row, index) {
      return Number(row.official_price).toFixed(2)
    },
  },
  {
    title: '售价(元)',
    key: 'price',
    align: 'center',
    render(row, index) {
      return Number(row.price).toFixed(2)
    },
  },
]
// 提示展示
const message = useMessage()
// 同步
function synchronization() {
  http.syncGoods().then(function (res) {
    refresh()
  })
}
</script>

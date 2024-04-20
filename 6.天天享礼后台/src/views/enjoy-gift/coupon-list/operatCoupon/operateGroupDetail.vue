<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    preset="dialog"
    title="商品添加"
    :style="{
      width: '2000px',
    }"
    @negative-click="onNegativeClick"
  >
    <n-form
      :model="model"
      label-placement="left"
      label-width="140px"
      require-mark-placement="right-hanging"
      :style="{
        maxWidth: '2000px',
      }"
    >
      <n-form-item label="商品名称" w-600>
        <n-input
          v-model:value="queryItems.keyword"
          placeholder="请输入商品名称"
          clearable
          @keydown.enter="$table?.handleSearch"
          @input="$table?.handleSearch"
        >
          <template #prefix>
            <icon-simple-line-icons:magnifier />
          </template>
        </n-input>
      </n-form-item>
      <n-form-item label="商品列表" path="group">
        <CrudTable
          ref="$table"
          v-model:query-items="queryItems"
          :max-height="700"
          :scroll-x="1200"
          row-key="coupon_id"
          :columns="columns"
          :get-data="http.goodsList"
          @onItemClick="itemClickHandle"
        >
        </CrudTable>
      </n-form-item>
    </n-form>
  </n-modal>
</template>
<script setup>
import { NImage } from 'naive-ui';
import http from '../api';
/**弹窗显示控制 */
const showModal = ref(false)
/**弹窗取消 */
function onNegativeClick() {}
/**展示弹窗 */
const queryItems = ref({
  type: 2,
  keyword: '',
})
//表单数据
const model = ref({})
//优惠券列表选择相关
const columns = ref([
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
    title: '售价(元)',
    key: 'sale_price',
    align: 'center',
    render(row, index) {
      return row.sale_price
    },
  },
  {
    title: '价格(元)',
    key: 'product_price',
    align: 'center',
    render(row, index) {
      return row.product_price
    },
  },
])
const $table = ref(null)

/**回调父组件函数注册 */
const emit = defineEmits(['selectItem'])
const itemClickHandle = (rowKeys) => {
  showModal.value = false
  emit('selectItem', rowKeys)
}
/**展示弹窗 */
async function show(is_main) {
  showModal.value = true
  await nextTick()
  $table.value?.handleRefreshCurr()
}
/**暴露给父组件使用 */
defineExpose({
  show,
})
</script>

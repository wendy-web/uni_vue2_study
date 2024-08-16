<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    preset="dialog"
    title="橙券商品列表"
    :style="{ width: '1800px' }"
    @after-leave="onNegativeClickLeave"
  >
    <n-form
      :model="model"
      label-placement="left"
      label-width="140px"
      require-mark-placement="right-hanging"
      :style="{
        maxWidth: '1800px',
      }"
    >
      <n-form-item label="商品列表" path="group">
        <CrudTable
          ref="$table"
          :scroll-x="1200"
          :max-height="700"
          :columns="columns"
          :get-data="http.goodsCqList"
          @onItemClick="onItemClickHandle"
        >
        </CrudTable>
      </n-form-item>
    </n-form>
  </n-modal>
</template>
<script setup>
import { ref } from 'vue';
import http from '../api';
/**弹窗显示控制 */
const showModal = ref(false)
const defaultCouponFilter = ref('')
//优惠券列表选择相关
const columns = [
  { title: '编号', key: 'goods_no', align: 'center', width: 200 },
  { title: '产品名称', key: 'name', align: 'center' },
  { title: '官方面值(单位：元)', key: 'official_price', align: 'center' },
  { title: '产品价格(单位：元)', key: 'price', align: 'center' },
  {
    title: '上架状态',
    key: 'sell_status',
    align: 'center',
    render(row) {
      return row.status == 1 ? '上架' : '未上架'
    },
  },
]
//表格操作
const $table = ref(null)
/**回调父组件函数注册 */
const emit = defineEmits(['selectList'])
/**展示弹窗 */
async function show() {
  showModal.value = true
  await nextTick()
  $table.value?.handleSearch()
}
const typeListOptions = ref([])
onMounted(async () => {
  const res = await http.typeList()
  if (!res.code) return
  typeListOptions.value = res.data
})
function onItemClickHandle(selectList) {
  emit('selectList', selectList)
  showModal.value = false
}
function onNegativeClickLeave() {
  // queryItems.value = {}
}
/**暴露给父组件使用 */
defineExpose({
  show,
})
</script>

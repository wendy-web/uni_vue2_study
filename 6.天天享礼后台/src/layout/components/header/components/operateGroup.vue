<template>
  <n-drawer v-model:show="showModal" :width="drawerWidth">
    <n-drawer-content title="下架商品" closable>
      <CrudTable
        ref="$table"
        v-model:query-items="queryItems"
        :max-height="1000"
        :scroll-x="1200"
        row-key="old_skuId"
        :columns="columns"
        :get-data="http.delistLog"
      >
        <template #queryBar>
          <QueryBarItem label="查找时间" :label-width="80" :content-width="340">
            <n-date-picker
              v-model:formatted-value="queryItems.create_time"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="datetimerange"
              clearable
            />
          </QueryBarItem>
        </template>
      </CrudTable>
    </n-drawer-content>
  </n-drawer>
</template>
<script setup>
import { ref, watch } from 'vue';
import http from '../api';

/**抽屉宽度 */
const drawerWidth = window.innerWidth - 220 + 'px'
/**弹窗显示控制 */
const showModal = ref(false)
/**表单 */
const formRef = ref(null)
//表单数据
const model = ref({})
const queryItems = ref({})
//优惠券列表选择相关
const columns = [
  {
    title: 'ID',
    key: 'old_skuId',
    align: 'center',
    width: 200,
    fixed: 'left',
    size: 'large',
  },
  {
    title: '商品名称',
    key: 'goods_name',
    align: 'center',
    fixed: 'left',
    size: 'large',
  },
  {
    title: '品牌供应商',
    key: 'goods_type',
    align: 'center',
    width: 200,
    fixed: 'left',
    size: 'large',
  },
  {
    title: '商品分组名称',
    key: 'name',
    align: 'center',
    width: 200,
    fixed: 'left',
    size: 'large',
  },
  {
    title: '下架时间',
    key: 'create_time',
    align: 'center',
    fixed: 'left',
    size: 'large',
    width: 180,
  },
  {
    title: '下架原因',
    key: 'msg',
    align: 'center',
    fixed: 'left',
    size: 'large',
  },
]
// 时间的格式化
function initProcessTime(date) {
  if (date) {
    return new Date(date.replace(new RegExp(/-/gm), '/')).getTime()
  }
  return null
}
/**回调父组件函数注册 */
const emit = defineEmits(['refresh', 'close'])

/**展示弹窗 */
const $table = ref(null)
async function show() {
  showModal.value = true
  await nextTick()

  $table.value?.handleSearch()
}
watch(
  () => showModal.value,
  (newValue) => {
    if (newValue) return
    emit('close')
  }
)
/**暴露给父组件使用 */
defineExpose({
  show,
})
</script>
<style scoped>
.wen_className2 {
  left: 60px !important;
}
</style>

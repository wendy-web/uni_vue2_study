<template>
  <n-drawer v-model:show="showModal" :width="drawerWidth" :placement="placement">
    <n-drawer-content title="下架商品" closable>
      <n-form
        ref="formRef"
        :model="model"
        :rules="rules"
        label-placement="left"
        label-width="140px"
        require-mark-placement="right-hanging"
      >
        <n-form-item label="商品列表" path="group">
          <CrudTable
            ref="$table"
            :max-height="1000"
            :scroll-x="1200"
            row-key="old_skuId"
            :columns="columns"
            :get-data="http.delistLog"
          >
          </CrudTable>
        </n-form-item>
      </n-form>
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
    title: '下架时间',
    key: 'create_time',
    align: 'center',
    fixed: 'left',
    size: 'large',
    width: 322,
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

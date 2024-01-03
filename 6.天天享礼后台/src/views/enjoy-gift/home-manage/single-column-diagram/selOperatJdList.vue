<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    preset="dialog"
    title="京东商品列表"
    :style="{
      width: '3000px',
    }"
    @negative-click="onNegativeClick"
  >
    <CrudTable
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="http.goodsQueryList"
      @onItemClick="onItemClickHandle"
    >
    <template #queryBar>
        <QueryBarItem label="搜索商品" :label-width="80">
          <n-input
            v-model:value="queryItems.keyword"
            placeholder="请输入商品名称"
            clearable
          />
        </QueryBarItem>
      </template>
    </CrudTable>
  </n-modal>
</template>
<script setup>
import { ref } from 'vue';
import http from './api';
/**弹窗显示控制 */
const showModal = ref(false)
/**弹窗取消 */
function onNegativeClick() {}
//优惠券列表选择相关
const columns = [
  { title: 'ID', key: 'coupon_id', align: 'center' },
  {
    title: '商品名称',
    key: 'title',
    align: 'center',
    filter(value, row) {
      return ~row.title.indexOf(value)
    },
  },
  { title: '面值(元)', key: 'face_value', align: 'center' },
  { title: '兑换价格(牛金豆)', key: 'credits', align: 'center' },
  { title: '发放数量', key: 'used_num', align: 'center' },
  { title: '剩余数量', key: 'stock_num', align: 'center' },
  { title: '有效期(天)', key: 'expiry_date', align: 'center' },
  {
    title: '创建时间',
    key: 'create_time',
    align: 'center',
  },
  {
    title: '上架状态',
    key: 'status',
    align: 'center',
    render(row) {
      return row.status == 1 ? '上架' : '未上架'
    },
  },
]
//表格操作
const $table = ref(null)
/**回调父组件函数注册 */
const emit = defineEmits(['selectList']);
/**展示弹窗 */
const queryItems = ref({})
function show() {
  showModal.value = true;
  setTimeout(() => {
    $table.value?.handleSearch();
  }, 100);
}

function onItemClickHandle(selectList) {
  emit('selectList', selectList);
  showModal.value = false;
}
/**暴露给父组件使用 */
defineExpose({
  show
});
</script>

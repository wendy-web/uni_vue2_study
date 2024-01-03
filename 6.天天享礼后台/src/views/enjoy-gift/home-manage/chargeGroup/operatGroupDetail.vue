<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    preset="dialog"
    title="商品添加"
    positive-text="确认"
    negative-text="关闭"
    :style="{
      width: '2000px',
    }"
    @positive-click="handleValidateButtonClick"
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
      <div flex>
        <n-form-item label="商品名称" path="coupon_id" w-600>
          <n-input
            v-model:value="defaultCouponFilter"
            @input="handleUpdateFilter"
            placeholder="请输入商品名称"
            clearable
          />
        </n-form-item>
        <n-form-item label="选择状态" path="lx_type">
          <n-select
            v-model:value="status_type"
            :options="statusOptions"
            style="width: 200px"
            clearable
            @update:value="status_type_handleUpdate"
          />
        </n-form-item>
      </div>
      <n-form-item label="商品列表" path="group">
        <CrudTable
          ref="$table"
          :listData="tableData"
          v-model:query-items="queryItems"
          :maxHeight="700"
          :scroll-x="1200"
          rowKey="coupon_id"
          :columns="columns"
          :get-data="http.goodsQueryList"
          :checked-row-keys="checkedRowKeys"
          @onChecked="handleCheck"
          @onFilter="handleUpdateFilter"
        >
      </CrudTable>
      </n-form-item>
    </n-form>
  </n-modal>
</template>
<script setup>
import { ref } from 'vue';
import http from './api';

/**弹窗显示控制 */
const showModal = ref(false)
/**弹窗取消 */
function onNegativeClick() {}
/**展示弹窗 */
const queryItems = ref({})
//表单数据
const model = ref({})
//查询参数

//优惠券列表选择相关
const columns = ref([
  {
    type: 'selection',
    key:'coupon_id',
  },
  { title: 'ID', key: 'coupon_id', align: 'center' },
  {
    title: '商品名称',
    key: 'title',
    align: 'center',
    filter(value, row) {
      return ~row.title.indexOf(value);
    },
  },
  {
    title: '佣金率',
    key: 'commissionShare',
    align: 'center',
    render(row) {
      return row.commissionShare || 0;
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
  }
]);

const tableData = ref([]);
const status_type = ref(null);
const statusOptions = ref([
  {
    label: '上架',
    value: 1,
  },
  {
    label: '未上架',
    value: 0,
  },
]);
function status_type_handleUpdate(value) {
  status_type.value = value;
  handleUpdateFilter()
}
const $table = ref(null);

/**回调父组件函数注册 */
const emit = defineEmits(['addList'])
/** 表单过滤 */
let timer = null;
const handleUpdateFilter = () => {
  const inputValue = defaultCouponFilter.value.trim();
  if(timer) {
    timer = null;
    clearTimeout(timer);
  };
  timer = setTimeout(() => {
    queryItems.value.keyword = inputValue;
    const searchList = tableData.value.filter(item => {
      if(status_type.value !== null) {
        if(item.title.includes(inputValue) && status_type.value == item.status){
          return true;
        }
        return;
      }
      if(item.title.includes(inputValue)){
        return true;
      }
    });
    $table.value.showGetList(searchList);
    clearTimeout(timer);
    timer = null;
  }, 100);
}
// 过滤优惠券
const defaultCouponFilter = ref('');
const checkedRowKeys = ref([]);
const handleCheck = (rowKeys) => {
  checkedRowKeys.value = rowKeys;
}

/** 表单的提交 */
function handleValidateButtonClick() {
  let list = $table.value.getTableData();
  let group = checkedRowKeys.value;
  const selectList = group && list.filter(item => group.includes(item.coupon_id));
  emit('addList', selectList);
  return true;
}
/**展示弹窗 */
async function show(shopOptions) {
  defaultCouponFilter.value = '';
  showModal.value = true;
  tableData.value = shopOptions;
  model.value.group = [];
  checkedRowKeys.value = [];
  await nextTick();
  $table.value.showGetList(shopOptions);
}
/**暴露给父组件使用 */
defineExpose({
  show
});
</script>

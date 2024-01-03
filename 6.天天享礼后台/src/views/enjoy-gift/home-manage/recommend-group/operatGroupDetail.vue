<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    preset="dialog"
    title="商品添加"
    positive-text="确认"
    negative-text="关闭"
    :style="{
      width: '1500px',
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
        maxWidth: '1500px',
      }"
    >
      <n-form-item label="来源" path="lx_type">
        <n-select
          v-model:value="lx_type"
          :options="pageOptions"
          style="width: 200px"
          @update:value="lx_type_handleUpdate"
        />
      </n-form-item>
      <n-form-item label="选品库" path="groupId" v-if="lx_type == 3" w-600>
        <n-input
          v-model:value="defaultCouponFilter2"
          @input="handleUpdateFilter"
          placeholder="请输入选品库ID"
          clearable
        />
      </n-form-item>
      <div flex v-else>
        <n-form-item label="商品名称" path="coupon_id" w-600>
          <n-input
            v-model:value="defaultCouponFilter"
            @input="handleUpdateFilter"
            placeholder="请输入商品名称"
            clearable
          />
        </n-form-item>
        <n-form-item label="选择状态" path="status_type" v-if="lx_type==1">
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
    title: '系统类型',
    key: 'p_type',
    align: 'center',
    render(row) {
      let txt = row.p_type
      if(row.lx_type) {
        txt = ['苹果机', '公共', '安卓机'][row.lx_type - 1]
      }
      return txt;
    }
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
const lx_type = ref(1);
// 来源
const pageOptions = ref([
  {
    label: '自建',
    value: 1,
    _tableData: null
  },
  {
    label: '京东',
    value: 2,
    _tableData: null
  },
  {
    label: '选品库',
    value: 3,
    _tableData: null
  },
]);
const $table = ref(null);
// 来源的选择
function lx_type_handleUpdate(value, options) {
  status_type.value = null;
  defaultCouponFilter.value = '';
  defaultCouponFilter2.value = '';
  queryItems.value.keyword = '';
  checkedRowKeys.value = [];
  // 京东
  if(value == 2) {
    delete(queryItems.value.groupId);
    return $table.value?.handleSearch();
  }
  //选品库
  if(value == 3) {
    queryItems.value.groupId = '';
    return $table.value?.handleSearch();
  }
  $table.value.showGetList(tableData.value);
}

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
    if(lx_type.value == 2) {
      return $table.value?.handleSearch();
    }
    if(lx_type.value == 3) {
      const groupId = defaultCouponFilter2.value.trim();
      queryItems.value.groupId = groupId;
      return $table.value?.handleSearch();
    }
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
const defaultCouponFilter2 = ref('');
const checkedRowKeys = ref([]);
const handleCheck = (rowKeys) => {
  checkedRowKeys.value = rowKeys;
}

/** 表单的提交 */
function handleValidateButtonClick() {
  let group = checkedRowKeys.value;
  group = group.map(res => {
    return {
      coupon_id: res,
      is_flow: 0
    }
  });
  emit('addList', group);
  return true;
}
/**展示弹窗 */
async function show(shopOptions) {
  defaultCouponFilter.value = '';
  showModal.value = true;
  tableData.value = shopOptions;
  model.value.group = [];
  checkedRowKeys.value = [];
  lx_type.value = 1;
  pageOptions.value[0]._tableData = shopOptions;
  await nextTick();
  $table.value.showGetList(shopOptions);
}
/**暴露给父组件使用 */
defineExpose({
  show
});
</script>

<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    preset="dialog"
    title="商品添加"
    positive-text="确认"
    negative-text="关闭"
    :style="{
      width: '2100px',
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
        maxWidth: '2100px',
      }"
    >
      <n-form-item label="来源" path="lx_type">
        <n-select v-model:value="lx_type" :options="pageOptions" style="width: 200px" />
      </n-form-item>
      <n-form-item v-if="lx_type == 2" label="选品库" path="groupId" w-600>
        <n-input
          v-model:value="defaultCouponFilter2"
          placeholder="请输入选品库ID"
          clearable
          @input="handleUpdateFilter"
        />
      </n-form-item>
      <n-form-item v-else label="商品名称" path="coupon_id" w-600>
        <n-input
          v-model:value="defaultCouponFilter"
          placeholder="请输入商品名称"
          clearable
          @input="handleUpdateFilter"
        />
      </n-form-item>
      <n-form-item label="商品列表" path="group">
        <CrudTable
          ref="$table"
          v-model:query-items="queryItems"
          :max-height="700"
          :scroll-x="1200"
          row-key="coupon_id"
          :columns="columns"
          :get-data="requestGetData"
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
import { defineProps, ref } from 'vue';
const props = defineProps({
  ckIds: Array,
})
/**弹窗显示控制 */
const showModal = ref(false)
/**弹窗取消 */
function onNegativeClick() {}
/**展示弹窗 */
const queryItems = ref({
  not_coupon: 1,
})
//表单数据
const model = ref({})
//优惠券列表选择相关
const columns = ref([
  {
    type: 'selection',
    key: 'coupon_id',
    disabled(row) {
      return props.ckIds.indexOf(row.coupon_id) > -1
    },
  },
  { title: 'ID', key: 'coupon_id', align: 'center' },
  {
    title: '商品名称',
    key: 'title',
    align: 'center',
    filter(value, row) {
      return ~row.title.indexOf(value)
    },
  },
  {
    title: '佣金率',
    key: 'commissionShare',
    align: 'center',
    render(row) {
      return row.commissionShare || 0
    },
  },
  { title: '面值(元)', key: 'face_value', align: 'center' },
  { title: '价格(元)', key: 'price', align: 'center' },
  { title: '兑换价格(牛金豆)', key: 'credits', align: 'center' },
  { title: '发放数量', key: 'used_num', align: 'center' },
  { title: '剩余数量', key: 'stock_num', align: 'center' },
  { title: '有效期(天)', key: 'expiry_date', align: 'center' },
  { title: 'feed流类目ID', key: 'feedId', align: 'center' },
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
])
const lx_type = ref(2)
const requestGetData = ref()
// 来源
const pageOptions = ref([])
const $table = ref(null)
const defaultCouponFilter = ref('')
const defaultCouponFilter2 = ref('')
const checkedRowKeys = ref([])

/**回调父组件函数注册 */
const emit = defineEmits(['addList'])
/** 表单过滤 */
let timer = null
const handleUpdateFilter = () => {
  const inputValue = defaultCouponFilter.value.trim()
  if (timer) {
    timer = null
    clearTimeout(timer)
  }
  timer = setTimeout(() => {
    queryItems.value.keyword = inputValue
    if (lx_type.value == 3) {
      const groupId = defaultCouponFilter2.value.trim()
      queryItems.value.groupId = groupId
    }
    return $table.value?.handleSearch()
  }, 100)
}
// 过滤优惠券
const handleCheck = (rowKeys) => {
  checkedRowKeys.value = rowKeys
}
watch(
  () => lx_type.value,
  async (newValue, oldValue) => {
    requestGetData.value = pageOptions.value[newValue - 1].getData
    defaultCouponFilter.value = ''
    defaultCouponFilter2.value = ''
    queryItems.value.keyword = ''
    checkedRowKeys.value = []
    switch (newValue) {
      case 1:
        delete queryItems.value.groupId
        await nextTick()
        $table.value?.handleSearch()
        break
      case 2:
        queryItems.value.groupId = ''
        await nextTick()
        $table.value?.handleSearch()
        break
      case 3:
        delete queryItems.value.groupId
        await nextTick()
        $table.value?.handleSearch()
        break
    }
  },
  {
    deep: true,
    // immediate: true,
  }
)

/** 表单的提交 */
function handleValidateButtonClick() {
  let list = $table.value.getTableData()
  let group = checkedRowKeys.value
  const selectList =
    group &&
    list.filter((item) => {
      item.lx_type = lx_type
      return group.includes(item.coupon_id)
    })
  emit('addList', selectList)
  return true
}
/**展示弹窗 */
async function show(pageList) {
  defaultCouponFilter.value = ''
  showModal.value = true
  model.value.group = []
  checkedRowKeys.value = []
  lx_type.value = 1
  pageOptions.value = pageList
}
/**暴露给父组件使用 */
defineExpose({
  show,
})
</script>

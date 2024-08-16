<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    preset="dialog"
    title="商品列表"
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
      <n-form-item label="来源" path="lx_type">
        <n-select v-model:value="lx_type" :options="pageOptions" style="width: 200px" />
      </n-form-item>
      <n-form-item label="商品名称" path="coupon_id" w-600 v-if="lx_type > 1">
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
          :scroll-x="1200"
          :max-height="700"
          :columns="columns"
          :get-data="requestGetData"
          @onItemClick="onItemClickHandle"
        >
          <!-- <template #queryBar>
            <QueryBarItem label="搜索商品" :label-width="80">
              <n-input v-model:value="queryItems.keyword" placeholder="请输入商品名称" clearable />
            </QueryBarItem>
          </template> -->
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
const props = defineProps({
  ckSystem: 2,
})
function onNegativeClickLeave() {
  lx_type.value = 0
  queryItems.value = {}
}
const lx_type = ref(0)

const requestGetData = ref()
const defaultCouponFilter = ref('')

// 来源
const pageOptions = ref([
  {
    label: '自建',
    value: 1,
    getData: http.getGoods,
  },
  {
    label: '京东',
    value: 2,
    getData: http.goodsQueryList,
  },
  {
    label: '拼多多',
    value: 4,
    getData: http.goodsSearch,
  },
])
/** 表单过滤 */
let timer = null
const handleUpdateFilter = () => {
  const inputValue = defaultCouponFilter.value.trim()
  if (timer) {
    timer = null
    clearTimeout(timer)
  }
  timer = setTimeout(async () => {
    clearTimeout(timer)
    timer = null
    queryItems.value.keyword = inputValue
    await nextTick()
    $table.value?.handleSearch()
  }, 100)
}
watch(
  () => lx_type.value,
  async (newValue, oldValue) => {
    console.log('newValue', newValue)
    defaultCouponFilter.value = ''
    queryItems.value.keyword = ''
    queryItems.value.device_type = props.ckSystem
    switch (newValue) {
      case 1:
        requestGetData.value = pageOptions.value[0].getData
        await nextTick()
        $table.value?.handleSearch()
        break
      case 2:
        requestGetData.value = pageOptions.value[1].getData
        await nextTick()
        $table.value?.handleSearch()
        break
      case 4:
        requestGetData.value = pageOptions.value[2].getData
        await nextTick()
        $table.value?.handleSearch()
        break
    }
  },
  { deep: true }
)
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
  { title: '优惠金额(元)', key: 'face_value', align: 'center' },
  {
    title: '佣金率(%)',
    width: 100,
    key: 'commissionShare',
    align: 'center',
    render(row) {
      return row.commissionShare || 0
    },
  },
  { title: '兑换价格(积分)', key: 'credits', align: 'center' },
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
const emit = defineEmits(['selectList'])
/**展示弹窗 */
const queryItems = ref({})
function show() {
  showModal.value = true
  lx_type.value = 1
}

function onItemClickHandle(selectList) {
  emit('selectList', selectList)
  lx_type.value = 0
  queryItems.value = {}
  showModal.value = false
}
/**暴露给父组件使用 */
defineExpose({
  show,
})
</script>

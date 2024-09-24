<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    preset="dialog"
    title="选择商品"
    positive-text="确定"
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
      <n-form-item label="来源">
        <n-select
          v-model:value="lx_type"
          :options="sourceOptions"
          style="width: 200px"
          @update:value="lx_type_handleUpdate"
        />
      </n-form-item>
      <n-form-item v-if="lx_type == 2 || lx_type == 4" label="商品名称" path="coupon_id" w-600>
        <n-input
          v-model:value="queryItems.keyword"
          placeholder="请输入商品名称"
          clearable
          @input="$table?.handleSearch"
        />
      </n-form-item>
      <n-form-item v-if="lx_type == 3" label="选品库" path="groupId" w-600>
        <n-input
          v-model:value="queryItems.groupId"
          placeholder="请输入选品库ID"
          clearable
          @input="$table?.handleSearch"
        />
      </n-form-item>
      <!-- 自建商品 -->
      <CrudTable
        ref="$table"
        v-model:query-items="queryItems"
        :scroll-x="1000"
        :columns="columns"
        :get-data="requestGetData"
        :checked-row-keys="checkedRowKeys"
        @onChecked="onChecked"
      >
        <template v-if="lx_type == 1" #queryBar>
          <QueryBarItem label="商品编号" :label-width="80">
            <n-input
              v-model:value="queryItems.goods_number"
              type="text"
              placeholder="请输商品编号"
              @keydown.enter="$table?.handleSearch"
            />
          </QueryBarItem>
          <QueryBarItem label="商品名称" :label-width="80">
            <n-input
              v-model:value="queryItems.goods_name"
              type="text"
              placeholder="请输商品名称"
              @keydown.enter="$table?.handleSearch"
            />
          </QueryBarItem>
          <QueryBarItem label="spu名称" :label-width="80">
            <n-input
              v-model:value="queryItems.spuName"
              type="text"
              placeholder="请输spu名称"
              @keydown.enter="$table?.handleSearch"
            />
          </QueryBarItem>
          <QueryBarItem label="商品类型" :label-width="80">
            <n-select v-model:value="queryItems.goods_type" :options="goodsTypeOptions" />
          </QueryBarItem>
          <QueryBarItem label="启用状态" :label-width="80">
            <n-select v-model:value="queryItems.use" :options="goodsStatusOptions" />
          </QueryBarItem>
          <QueryBarItem label="系统类型" :label-width="80">
            <n-select v-model:value="queryItems.device_type" :options="systemOptions" />
          </QueryBarItem>
        </template>
      </CrudTable>
    </n-form>
  </n-modal>
</template>

<script setup>
import { nextTick, ref } from 'vue';
import eliteIdOptions from './eliteIdOptions.js';
//弹窗操作
const showModal = ref(false)
//表格操作
const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})
//表单数据
const model = ref({})
// 来源
const sourceOptions = eliteIdOptions.sourceOptions
const lx_type = ref(1)
const requestGetData = ref()
let columns = ref([])
const checkedRowKeys = ref([])
let checkedRows = []
let checkedRowsShow = []
watch(
  () => lx_type.value,
  (newValue, oldValue) => {
    delete queryItems.value.keyword
    delete queryItems.value.groupId
    if (newValue === 3) queryItems.value.groupId = ''
    requestGetData.value = sourceOptions[newValue - 1].getData
    columns.value = [
      {
        type: 'selection',
        multiple: true,
        disabled(row) {
          // console.log('checkedRowsShow', checkedRowsShow)
          return checkedRowsShow.findIndex((item) => item.id == row.id) > -1
        },
      },
      {
        title: '商品编号',
        key: 'goods_number',
        align: 'center',
        render(row) {
          return row.goods_number || row.coupon_id
        },
      },
      {
        title: '商品名称',
        key: 'goods_name',
        align: 'center',
        render(row) {
          return row.goods_name || row.title
        },
      },
    ]
    columns.value.push(
      {
        title: '面值(元)',
        key: 'marketPrice',
        align: 'center',
        render(row, index) {
          return row.lx_type == 1 ? Number(row.price / 100).toFixed(2) : row.face_value
        },
      },
      {
        title: '佣金率(%)',
        width: 100,
        key: 'commissionShare',
        align: 'center',
        render(row) {
          return row.commissionShare || 0
        },
      }
    )
    if (newValue == 1) {
      columns.value.push(
        { title: '抵扣积分', key: 'deduction_credits', align: 'center' },
        {
          title: '启用状态',
          key: 'status',
          align: 'center',
          render(row, index) {
            return ['停用', '启用', '系统停用'][row.use]
          },
        }
      )
    } else {
      columns.value.push(
        { title: '抵扣积分(牛金豆)', key: 'credits', align: 'center' },
        { title: '有效期(天)', key: 'expiry_date', align: 'center' },
        {
          title: '创建时间',
          key: 'create_time',
          align: 'center',
        }
      )
    }
    columns.value.push(
      {
        title: '销售状态',
        key: 'status',
        align: 'center',
        render(row, index) {
          return row.status == 0 ? '下架' : '上架'
        },
      },
      {
        title: '系统',
        key: 'device_type',
        align: 'center',
        render(row, index) {
          if (newValue == 1) return ['苹果', '公共', '安卓'][row.device_type - 1]
          return '公共'
        },
      }
    )
  },
  {
    deep: true,
    immediate: true,
  }
)
// 来源的选择
async function lx_type_handleUpdate(value, options) {
  if (value == 1 && isRebate.value == 1) {
    lx_type.value = 2
  }
  await nextTick()
  $table.value?.handleSearch()
}

/**商品类型下拉列表 */
const goodsTypeOptions = eliteIdOptions.goodsTypeOptions
/**商品状态下拉列表 */
const goodsStatusOptions = eliteIdOptions.goodsStatusOptions
const systemOptions = eliteIdOptions.systemOptions
const isRebate = ref(0)
function show(data, system, is_rebate = 0) {
  if (is_rebate == 1) {
    lx_type.value = 2
    queryItems.value.not_coupon = 1
  } else {
    lx_type.value = 1
    queryItems.value.not_coupon = 0
  }
  checkedRowKeys.value = []
  // checkedRowKeys.value = data.map((item) => item.id)
  checkedRowsShow = data
  showModal.value = true
  isRebate.value = is_rebate
  // queryItems.value.system = system === 1 ? 3 : 1
  nextTick(() => {
    $table.value?.handleRefreshCurr()
  })
}

function onChecked(data) {
  checkedRowKeys.value = data
  let arr = checkedRows.concat(
    $table.value?.tableData.filter(function (item) {
      return checkedRows.map((v) => v.id).indexOf(item.id) === -1
    })
  )
  checkedRows = arr.filter((item) => data.includes(item.id)).map((v) => ({ ...v }))
}

// 确认
function handleValidateButtonClick() {
  emit('selectSave', checkedRows)
}
// 取消
function onNegativeClick() {}

/**暴露给父组件使用 */
defineExpose({
  show,
})
/**回调父组件函数注册 */
const emit = defineEmits(['selectSave'])
</script>

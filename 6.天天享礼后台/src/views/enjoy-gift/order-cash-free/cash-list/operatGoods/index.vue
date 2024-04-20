<template>
  <n-drawer v-model:show="showModal" :default-width="drawerWidth" resizable>
    <n-drawer-content :title="modalTitle" closable>
      <n-form
        ref="formRef"
        :model="model"
        :rules="rules"
        label-placement="left"
        label-width="140px"
        require-mark-placement="right-hanging"
      >
        <n-form-item label="标题" path="title" w-400>
          <n-input v-model:value="model.title" :disabled="modalType === 1" />
        </n-form-item>
        <n-form-item label="排序" path="sort" w-400>
          <n-input-number v-model:value="model.sort" :min="0" :max="100" :precision="0" :disabled="modalType === 1" />
        </n-form-item>
        <n-form-item label="京东推广位ID" path="positionId" w-400>
          <n-input v-model:value="model.positionId" :disabled="modalType === 1" />
        </n-form-item>
        <n-form-item label="拼多多推广位ID" path="pdd_positionId" w-400>
          <n-input v-model:value="model.pdd_positionId" :disabled="modalType === 1" />
        </n-form-item>
        <n-form-item label="选择的电商分组" path="channel" w-800>
          <n-select v-model:value="model.channel" :filterable="modalType === 1" :options="channelOptions" multiple />
        </n-form-item>
        <n-form-item label="添加商品" w-300>
          <n-button mr-10 :disabled="modalType === 1" @click="selectHandle"> 选择商品列表 </n-button>
        </n-form-item>
        <n-form-item label="商品列表" path="group">
          <n-data-table
            id="dragTable"
            ref="tableRef"
            :scroll-x="drawerWidth - 140"
            :columns="columns"
            :data="tableData"
            :checked-row-keys="model.group"
            :row-key="(row) => row['coupon_id']"
            :pagination="false"
            max-height="620px"
            @update:checked-row-keys="handleCheck"
            @update:filters="handleUpdateFilter"
          />
        </n-form-item>
        <div flex justify-center w-1000>
          <n-button mr-10 @click="closeModel"> 关闭 </n-button>
          <n-button v-if="modalType !== 1" type="info" @click="handleValidate"> 保存 </n-button>
        </div>
      </n-form>
    </n-drawer-content>
  </n-drawer>
  <operate-group-detail ref="operateGroupDetailRef" :ck-ids="ckIds" @addList="addListHandle" />
</template>
<script setup>
import { renderIcon } from '@/utils';
import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import { NButton, NInputNumber, useMessage } from 'naive-ui';
import { onBeforeUnmount, ref } from 'vue';
import http from '../api';
import operateGroupDetail from './operateGroupDetail.vue';
/**弹窗显示控制 */
const showModal = ref(false)
const channelOptions = ref([])

/**抽屉宽度 */
const drawerWidth = window.innerWidth - 220 + 'px'
/**弹窗类型 1.查看 2.修改 3新增*/
const modalType = ref(1)
let goods_id = 0
const modalTitle = ref('')
//提示展示
const message = useMessage()
/**表单 */
const formRef = ref(null)
//表单数据
const model = ref({})
const tableRef = ref(null)
const ckIds = ref([])

//校验数据
const rules = ref({
  title: {
    required: true,
    trigger: ['blur', 'input'],
    message: '商品名称不能为空',
  },
})

/**展示弹窗 */
function show(operateType, data) {
  goods_id = data?.id
  modalType.value = operateType
  modalTitle.value = ['查看', '编辑', '新增'][operateType - 1]
  init()
}
onMounted(() => {
  initChannelOptions()
})
async function initChannelOptions() {
  const res = await http.shopGroup()
  if (res.code != 1 || !res.data) return
  channelOptions.value = res.data
}
// 查询参数
const tableData = ref([])
const operateGroupDetailRef = ref(null) // 选择商品的列表
// 来源
const pageOptions = ref([
  {
    label: '京东',
    value: 1,
    getData: http.goodsQueryList,
  },
  {
    label: '选品库',
    value: 2,
    getData: http.goodsQueryList,
  },
  {
    label: '拼多多',
    value: 3,
    getData: http.goodsSearch,
  },
])

// 该列表的初始化
async function init() {
  if (modalType.value != 3) {
    const res = await http.groupDetail({ id: goods_id })
    let { title, sort, status, channel, create_time, list, positionId, pdd_positionId } = res.data
    const group = list.map((item) => item.coupon_id)
    channel = channel.map((res) => Number(res))
    model.value = {
      title,
      sort,
      status,
      channel,
      create_time,
      list,
      group,
      positionId,
      pdd_positionId,
    }
    let _list = list.filter((item, index) => {
      item._index = index + 1
      item.current_index = index
      return true
    })
    tableData.value = _list
    ckIds.value = res.data.ckIds
    showModal.value = true
    return
  }
  model.value = {
    group: [],
  }
  tableData.value = []
  ckIds.value = []
  showModal.value = true
}
// 添加数组内容
function addListHandle(addList) {
  console.log('addList', addList)
  addList &&
    addList.forEach((item) => {
      model.value.group.push(item.coupon_id)
      tableData.value.push({
        ...item,
        _index: tableData.value.length + 1,
        current_index: tableData.value.length,
      })
    })
  // // 滑动到底部
  setTimeout(() => {
    tableRef.value.scrollTo({
      left: 0,
      top: 10000,
    })
  }, 100)
}
// 商品；列表
const columns = [
  {
    type: 'selection',
    key: 'id',
    fixed: 'left',
    size: 'large',
    width: 50,
    disabled(row) {
      return modalType.value == 1
    },
    render() {
      return true
    },
  },
  { title: 'ID', key: 'coupon_id', align: 'center', width: 100, fixed: 'left', size: 'large' },
  {
    title: '商品名称',
    key: 'title',
    align: 'center',
    fixed: 'left',
    size: 'large',
    width: 322,
    render(row) {
      return row.title || row.skuName
    },
  },
  { title: '佣金比例', key: 'commissionShare', align: 'center', width: 80 },
  { title: '商品排序', key: 'sort', align: 'center', width: 80 },
  { title: '成本金额', key: 'costPrice', align: 'center', width: 80 },
  { title: '面值', key: 'face_value', align: 'center', width: 80 },
  { title: '售价', key: 'salePrice', align: 'center', width: 80 },
  { title: '兑换牛金豆', key: 'credits', align: 'center', width: 80 },
  {
    title: '来源',
    key: 'lx_type',
    width: 60,
    align: 'center',
    render(row, index) {
      return ['自建', '京东', '拼多多'][row.lx_type - 1]
    },
  },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    fixed: 'right',
    size: 'large',
    width: 200,
    render(row, index) {
      return [
        h(
          NButton,
          {
            size: 'tiny',
            type: 'primary',
            style: {
              'margin-right': '10px',
            },
            disabled: modalType.value == 1,
            secondary: true,
            onClick: () => {
              const currentIndex = row.current_index
              const currData = tableData.value[currentIndex]
              tableData.value.splice(currentIndex, 1)
              tableData.value.unshift(currData)
              resetIndex()
            },
          },
          { icon: renderIcon('typcn:arrow-up-thick', { size: 14 }) }
        ),
        h(NInputNumber, {
          value: row._index,
          min: 1,
          size: 'tiny',
          max: tableData.value.length,
          style: {
            'margin-right': '10px',
            width: '90px',
            display: 'inline-block',
          },
          disabled: modalType.value == 1,
          onUpdateValue(value) {
            const currentIndex = row.current_index
            tableData.value[currentIndex]._index = value
          },
          onBlur(value) {
            const currInputIndex = row.current_index
            const inputValue = row._index - 1
            if (currInputIndex === inputValue) return
            const currData = tableData.value[currInputIndex]
            const targetIndex = tableData.value[inputValue]
            tableData.value[inputValue] = currData
            tableData.value[currInputIndex] = targetIndex
            resetIndex()
          },
        }),
        h(
          NButton,
          {
            size: 'tiny',
            type: 'primary',
            style: {
              'margin-right': '10px',
            },
            secondary: true,
            disabled: modalType.value == 1,
            onClick: () => {
              const currentIndex = row.current_index
              const currData = tableData.value[currentIndex]
              tableData.value.splice(currentIndex, 1)
              tableData.value.push(currData)
              resetIndex()
            },
          },
          { icon: renderIcon('typcn:arrow-down-thick', { size: 14 }) }
        ),
      ]
    },
  },
]
// 重置数组的排序
function resetIndex() {
  tableData.value.forEach((item, index) => {
    item._index = index + 1
    item.current_index = index
  })
}

// 关闭弹窗
function closeModel() {
  showModal.value = false
}

function selectHandle() {
  operateGroupDetailRef.value.show(pageOptions.value)
}
const handleCheck = (rowKeys) => {
  model.value.group = rowKeys
}

/**校验表单 */
function handleValidate() {
  formRef.value?.validate(async (errors) => {
    if (errors) return
    let { title, sort, channel, positionId, pdd_positionId, group } = model.value
    group = tableData.value
      .filter((item) => group.includes(item.coupon_id))
      .map((item) => ({
        coupon_id: item.coupon_id,
        sort: item.sort,
        goods_sign: item.goods_sign,
        itemId: item.itemId,
      }))
    const params = {
      id: goods_id,
      title,
      sort,
      group,
      channel,
      positionId,
      pdd_positionId,
    }
    console.log('params', params)
    // return
    const res = await http.groupCreate(params)
    if (res.code == 1) {
      message.success(res.msg)
      emit('refresh')
      showModal.value = false
      return
    }
    message.error(res.msg)
  })
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {})

/**暴露给父组件使用 */
defineExpose({
  show,
})
/**回调父组件函数注册 */
const emit = defineEmits(['refresh'])
</script>

<style lang="scss"></style>

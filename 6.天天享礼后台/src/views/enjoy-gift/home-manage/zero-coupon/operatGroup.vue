<template>
  <n-drawer v-model:show="showModal" :width="drawerWidth">
    <n-drawer-content :title="modalTitle" closable>
      <n-form
        ref="formRef"
        :model="model"
        :rules="rules"
        label-placement="left"
        label-width="140px"
        require-mark-placement="right-hanging"
        :style="{
          maxWidth: '4000px',
        }"
      >
        <n-form-item label="名称" path="title" w-300>
          <n-input v-model:value="model.title" :disabled="modalType === 1" />
        </n-form-item>
        <n-form-item label="京东推广位ID" path="positionId" w-300>
          <n-input-number
            v-model:value="model.positionId"
            :show-button="false"
            placeholder="京东推广位ID"
            clearable
            :disabled="modalType === 1"
            @input="handleUpdateFilter"
          />
        </n-form-item>
        <n-form-item label="拼多多推广位ID" path="pdd_positionId" w-300>
          <n-input
            v-model:value="model.pdd_positionId"
            :show-button="false"
            placeholder="拼多多推广位ID"
            clearable
            :disabled="modalType === 1"
            @input="handleUpdateFilter"
          />
        </n-form-item>
        <n-form-item label="更多按钮" path="has_btn" w-400>
          <n-switch v-model:value="model.has_btn" :disabled="modalType === 1" />
        </n-form-item>
        <n-form-item label="跳转半屏" path="is_half" w-400>
          <n-switch v-model:value="model.is_half" :disabled="modalType === 1" />
        </n-form-item>
        <n-form-item label="跳转页面路径" path="path" w-500>
          <n-input v-model:value="model.path" :disabled="modalType === 1" />
        </n-form-item>
        <n-form-item label="添加商品" path="coupon_id" w-600>
          <n-button mr-10 :disabled="modalType === 1" @click="selectHandle"> 选择商品列表 </n-button>
        </n-form-item>
        <n-form-item label="搜索商品" path="defaultCouponFilter" w-400>
          <n-input v-model:value="defaultCouponFilter" @input="handleUpdateFilter" />
        </n-form-item>
        <n-form-item label="商品列表" path="group">
          <n-data-table
            id="dragTable"
            ref="tableRef"
            :scroll-x="1200"
            :columns="columns"
            :data="tableData"
            :checked-row-keys="model.group"
            :row-key="(row) => row['coupon_id']"
            :pagination="false"
            max-height="820px"
            @update:checked-row-keys="handleCheck"
            @update:filters="handleUpdateFilter"
          />
        </n-form-item>
        <div flex justify-center w-1000>
          <n-button mr-10 @click="showModal = false"> 关闭 </n-button>
          <n-button v-if="modalType !== 1" type="info" @click="handleValidateButtonClick"> 保存 </n-button>
        </div>
      </n-form>
      <!-- </n-modal> -->
    </n-drawer-content>
  </n-drawer>
  <operat-group-detail ref="operatGroupDetailRef" :ck-ids="ckIds" @addList="addListHandle" />
</template>
<script setup>
import { renderIcon } from '@/utils';
import { NButton, NInput, NInputNumber, NSwitch, useMessage } from 'naive-ui';
import { ref } from 'vue';
import http from './api';
import operatGroupDetail from './operatGroupDetail.vue';
/**抽屉宽度 */
const drawerWidth = window.innerWidth - 220 + 'px'
/**弹窗显示控制 */
const showModal = ref(false)
/**弹窗类型 1.查看 2.修改,3.新增*/
const modalType = ref(3)
const modalTitle = ref('新增')
/**弹窗取消 */
function onNegativeClick() {}
/**表单 */
const formRef = ref(null)
const end_time = ref([])
// 商品选择
const shopOptions = ref([])

const operatGroupDetailRef = ref(null)
function selectHandle() {
  operatGroupDetailRef.value.show(shopOptions.value)
}
// 添加数组内容
function addListHandle(addList) {
  addList &&
    addList.forEach((item) => {
      shopOptions.value = shopOptions.value.filter((optionItem) => optionItem.coupon_id != item.coupon_id)
      model.value.group.push(item.coupon_id)
      tableData.value.push({
        ...item,
        _index: tableData.value.length + 1,
        current_index: tableData.value.length,
      })
    })
  // 滑动到底部
  setTimeout(() => {
    tableRef.value.scrollTo({
      left: 0,
      top: 10000,
    })
  }, 100)
  defaultCouponFilter.value = ''
  tableRef.value.filter({
    title: [],
  })
}
//图片上传
function handleFinish({ event }, dataType) {
  let { response, responseText } = event.currentTarget
  let res = JSON.parse(response || responseText)
  if (res.code != 1) {
    message.error(res.msg)
    return
  }
  model.value[dataType] = res.data.url
}
function removeFileList(dataType) {
  model.value[dataType] = ''
}
//提示展示
const message = useMessage()
//表单数据
const model = ref({})
//校验数据
const rules = ref({
  title: {
    required: true,
    trigger: ['blur', 'input'],
    message: '分组名称不能为空',
  },
  group: {
    required: true,
    validator: function (rule, value) {
      return value.length > 0
    },
    trigger: ['blur', 'input'],
    message: '请勾选该分组下的优惠券',
  },
})
//查询参数
const tableData = ref([])
//优惠券列表选择相关
const columns = [
  {
    type: 'selection',
    key: 'coupon_id',
    disabled(row) {
      return modalType.value == 1
    },
    render() {
      return true
    },
  },
  { title: 'ID', key: 'coupon_id', align: 'center', width: 160 },
  {
    title: '商品名称',
    key: 'title',
    align: 'center',
    width: 252,
    filter(value, row) {
      return ~row.title.indexOf(value)
    },
    render(row) {
      return row.title
    },
  },
  {
    title: '佣金率',
    width: 80,
    key: 'commissionShare',
    align: 'center',
    render(row) {
      return row.commissionShare || 0
    },
  },
  {
    title: '面值(元)',
    key: 'face_value',
    align: 'center',
    width: 100,
    render(row) {
      return row.face_value
    },
  },
  {
    title: '价格(元)',
    key: 'salePrice',
    align: 'center',
    width: 100,
    render(row) {
      return row.salePrice
    },
  },
  {
    title: '券后价格(元)',
    key: 'costPrice',
    align: 'center',
    width: 100,
    render(row) {
      return row.costPrice
    },
  },
  { title: '兑换价格(牛金豆)', key: 'credits', align: 'center', width: 150 },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    fixed: 'right',
    size: 'large',
    width: 260,
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
          { default: () => '置顶', icon: renderIcon('typcn:arrow-up-thick', { size: 14 }) }
        ),
        h(NInputNumber, {
          value: row._index,
          min: 1,
          size: 'tiny',
          max: tableData.value.length,
          style: {
            'margin-right': '10px',
            width: '85px',
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
            // tableData.value[inputValue] = currData
            // tableData.value[currInputIndex] = targetIndex
            tableData.value.splice(currInputIndex, 1)
            tableData.value.splice(inputValue, 0, currData)
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
          { default: () => '置底', icon: renderIcon('typcn:arrow-down-thick', { size: 14 }) }
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
/**回调父组件函数注册 */
const emit = defineEmits(['refresh'])
/** 表单过滤 */
const handleUpdateFilter = () => {
  let arr = []
  arr.push(defaultCouponFilter.value)
  tableRef.value.filter({
    title: arr,
  })
}

// 过滤优惠券
const defaultCouponFilter = ref('')
const tableRef = ref(null)
const handleCheck = (rowKeys) => {
  model.value.group = rowKeys
}

/**表单验证 */
function handleValidateButtonClick() {
  formRef.value?.validate((errors) => {
    if (!errors) {
      let { group } = model.value
      group = tableData.value
        .filter((item) => group.includes(item.coupon_id))
        .map((item) => ({
          coupon_id: item.coupon_id,
          is_flow: item.is_flow,
          goods_sign: item.goods_sign || '',
          itemId: item.itemId || '',
        }))
      http
        .operatGroup({
          ...model.value,
          group,
        })
        .then((res) => {
          if (res.code == 1) {
            message.success(res.msg)
            emit('refresh')
            showModal.value = false
          } else {
            message.error(res.msg)
          }
        })
    }
  })

  return false
}
const showType = ref()
const showData = ref()
const ckIds = ref([])
function activity_handleUpdateValue(value) {}
/**展示弹窗 */
async function show(operatType, data) {
  defaultCouponFilter.value = ''
  modalTitle.value = ['查看', '编辑', '新增'][operatType - 1]
  modalType.value = operatType
  model.value = {
    id: 0,
    title: '',
    group: [],
    positionId: null, //京东推广位ID
    pdd_positionId: null, //拼多多推广位ID
    has_btn: 1,
    is_half: 0,
    path: '',
  }
  model.value.has_btn = Boolean(model.value.has_btn)
  model.value.is_half = Boolean(model.value.is_half)
  showType.value = operatType
  showData.value = data
  ckIds.value = []
  getTableData(data?.id)
}
function getTableData(type) {
  if (showType.value !== 3) {
    return getGroupDetails(type)
  }
  showModal.value = true
}

function getGroupDetails(type) {
  http
    .getGroupDetails({
      id: showData.value.id,
    })
    .then(async (res) => {
      let { id, title, positionId, pdd_positionId, has_btn, is_half, path, list } = res.data
      let _list = list.filter((item, index) => {
        if (item.coupon_id) {
          item._index = index + 1
          item.current_index = index
          return true
        }
        return false
      })
      const group = _list.map((item) => item.coupon_id)
      model.value = {
        id,
        title,
        group,
        positionId,
        pdd_positionId,
        has_btn,
        is_half,
        path,
      }
      tableData.value = _list
      showModal.value = true
      ckIds.value = res.data.ckIds
      model.value.has_btn = Boolean(model.value.has_btn)
      model.value.is_half = Boolean(model.value.is_half)
    })
}

/**暴露给父组件使用 */
defineExpose({
  show,
})
</script>

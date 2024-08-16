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
      >
        <div flex>
          <n-form-item label="分组名称" path="name" w-300>
            <n-input v-model:value="model.name" :disabled="modalType === 1" />
          </n-form-item>
          <n-form-item v-if="model.user_group != 2" label="系统类型" path="type" w-300 ml-50>
            <n-select
              v-model:value="model.type"
              :options="typeOptions"
              :disabled="modalType === 1"
              @update:value="deviceTypeOptionsUpdate"
            />
          </n-form-item>
          <n-form-item label="排序" path="sort" w-300 ml-50>
            <n-input-number v-model:value="model.sort" :disabled="modalType === 1" />
          </n-form-item>
          <n-form-item label="京东推广位ID" path="positionId" w-300 ml-50>
            <n-input v-model:value="model.positionId" :show-button="false" placeholder="京东推广位ID" clearable />
          </n-form-item>
          <n-form-item label="拼多多推广位ID" path="pdd_positionId" w-340 ml-50>
            <n-input v-model:value="model.pdd_positionId" :show-button="false" placeholder="拼多多推广位ID" clearable />
          </n-form-item>
        </div>
        <div v-if="model.user_group != 2" flex>
          <n-form-item label="订单权重(%)" path="amount_power" w-300>
            <n-input-number
              v-model:value="model.amount_power"
              :show-button="false"
              placeholder="请输入"
              clearable
              min="0"
              max="100"
            />
          </n-form-item>
          <n-form-item label="佣金权重(%)" path="commission_power" w-300 ml-50>
            <n-input-number
              v-model:value="model.commission_power"
              :show-button="false"
              placeholder="请输入"
              clearable
              min="0"
              max="100"
            />
          </n-form-item>
          <n-form-item label="复购权重(%)" path="again_power" w-300 ml-50>
            <n-input-number
              v-model:value="model.again_power"
              :show-button="false"
              placeholder="请输入"
              clearable
              min="0"
              max="100"
            />
          </n-form-item>
          <n-form-item label="点击转化权重(%)" path="click_power" w-300 ml-50>
            <n-input-number
              v-model:value="model.click_power"
              :show-button="false"
              placeholder="请输入"
              clearable
              min="0"
              max="100"
            />
          </n-form-item>
        </div>
        <div v-if="model.user_group != 2" flex>
          <n-form-item label="复购量统计周期(d)" path="again_time" w-300>
            <n-input-number
              v-model:value="model.again_time"
              :show-button="false"
              placeholder="单位天"
              min="0"
              clearable
            />
          </n-form-item>
          <n-form-item label="排序间隔时长(h)" path="keep" w-300 ml-50>
            <n-input-number v-model:value="model.keep" :show-button="false" placeholder="请输入" clearable min="0" />
          </n-form-item>
          <n-form-item label="排序统计周期(h)" path="circle" w-400 ml-50>
            <n-input v-model:value="model.circle" :show-button="false" placeholder="多个周期用'-'分隔" clearable />
          </n-form-item>
          <n-form-item label="商品延后周期(d)" path="delayed_period" w-400 ml-50>
            <n-input-number v-model:value="model.delayed_period" :show-button="false" placeholder="" clearable />
          </n-form-item>
        </div>
        <div flex>
          <n-form-item v-if="model.user_group != 2" label="佣金降幅(%)" path="commission_num" w-300>
            <n-input v-model:value="model.commission_num" :show-button="false" placeholder="" clearable />
          </n-form-item>
          <n-form-item v-if="model.user_group != 2" label="最终佣金(%)" path="commission" w-300 ml-50>
            <n-input v-model:value="model.commission" :show-button="false" placeholder="" clearable />
          </n-form-item>
          <n-form-item label="所属小程序" path="is_bfxl" w-300>
            <n-select v-model:value="model.is_bfxl" :options="yyOptions" :disabled="modalType === 1" />
          </n-form-item>
          <n-form-item v-if="model.is_bfxl == 0" label="用户组" path="user_group" w-300>
            <n-select v-model:value="model.user_group" :options="userOptions" :disabled="modalType === 1" />
          </n-form-item>
          <n-form-item v-if="model.is_bfxl == 1" label="彬纷享礼页面" path="path_type" w-300>
            <n-select
              v-model:value="model.path_type"
              :options="pathOptions"
              :disabled="modalType === 1"
              @update:value="pathOptionsUpdate"
            />
          </n-form-item>
          <n-form-item v-if="model.is_bfxl == 1" label="跳转方式" path="jump_type" w-300>
            <n-select
              v-model:value="model.jump_type"
              :options="tyOptionsUpdate"
              :disabled="modalType === 1"
              @update:value="tyOptionsUpdate"
            />
          </n-form-item>
        </div>
        <div flex>
          <n-form-item label="添加商品" path="coupon_id" w-300>
            <n-button mr-10 :disabled="modalType === 1" @click="selectHandle"> 选择商品列表 </n-button>
          </n-form-item>
          <n-form-item label="上架状态" path="defaultStatusFilter" w-300 ml-50>
            <n-select
              v-model:value="defaultStatusFilter"
              :options="typeStatus"
              :disabled="modalType === 1"
              clearable
              @update:value="handleUpdateFilter"
            />
          </n-form-item>
          <n-form-item label="搜索商品" path="defaultCouponFilter" w-400 ml-50>
            <n-input v-model:value="defaultCouponFilter" clearable @input="handleUpdateFilter" />
          </n-form-item>
          <n-form-item v-if="model.user_group != 2" label="配置状态" path="defaultAddFilter" w-300 ml-50>
            <n-select
              v-model:value="defaultAddFilter"
              :options="typeAdd"
              :disabled="modalType === 1"
              clearable
              @update:value="handleUpdateFilter"
            />
          </n-form-item>
        </div>
        <div flex ml-140>
          <div v-if="end_index && modalType != 3" w-250 mb-20 style="color: #316c72ff">
            当前统计周期：{{ end_index }}
          </div>
          <div v-if="end_index && modalType != 3" w-280 mb-20 style="color: #316c72ff">
            即将排序时间：{{ end_time }}
          </div>
        </div>
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
          <n-button mr-10 @click="doClose"> 关闭 </n-button>
          <n-button v-if="modalType !== 1" type="info" @click="handleValidateButtonClick"> 保存 </n-button>
        </div>
      </n-form>
      <!-- </n-modal> -->
    </n-drawer-content>
  </n-drawer>
  <operat-group-detail
    ref="operatGroupDetailRef"
    :ck-ids="ckIds"
    :page-options="model.is_bfxl"
    @addList="addListHandle"
  />
</template>
<script setup>
import { formatDateTime, renderIcon } from '@/utils';
import { NButton, NDatePicker, NInput, NInputNumber, NSelect, NSwitch, useMessage } from 'naive-ui';
import { ref } from 'vue';
import http from './api';
import {
  initPageOptions,
  pathOptions,
  tyOptionsUpdate,
  typeAdd,
  typeOptions,
  typeStatus,
  userOptions,
  yyOptions,
} from './configOptions.js';
import operatGroupDetail from './operatGroupDetail.vue';
/**抽屉宽度 */
const drawerWidth = window.innerWidth - 220 + 'px'
/**弹窗显示控制 */
const showModal = ref(false)
/**弹窗类型 1.查看 2.修改,3.新增*/
const modalType = ref(3)
const modalTitle = ref('新增')
/**表单 */
const formRef = ref(null)

const end_time = ref()
const end_index = ref()
// 商品选择
const shopOptions = ref([])
function deviceTypeOptionsUpdate(value, option) {
  model.value.type = value
  // getCouponList();
  getTableData(value)
}
// 添加数组内容
function addListHandle(addList) {
  addList &&
    addList.forEach((item) => {
      shopOptions.value = shopOptions.value.filter((optionItem) => optionItem.coupon_id != item.coupon_id)
      model.value.group.unshift(item.coupon_id)
      tableData.value.unshift({
        ...item,
      })
    })
  tableData.value = tableData.value.map((item, index) => {
    return {
      ...item,
      _index: index + 1,
      current_index: index,
    }
  })
  // 滑动到底部
  setTimeout(() => {
    tableRef.value.scrollTo({
      left: 0,
      top: 0,
    })
  }, 100)
  defaultCouponFilter.value = ''
  tableRef.value.filter({
    title: [],
    status: [],
  })
}

//提示展示
const message = useMessage()
//表单数据
const model = ref({})
// 来源
const pageOptions = ref([])
watch(
  () => model.value.is_bfxl,
  (newValue, oldValue) => {
    //pageOptions.value = newValue ? initPageOptions.slice(0, 3) : initPageOptions
    pageOptions.value = initPageOptions
    //shopOptions.value = newValue ? shopOptions.value.filter((optionItem) => optionItem.type == 11) : shopOptions.value
    shopOptions.value = shopOptions.value
  },
  {
    deep: true,
    // immediate: true,
  }
)
const operatGroupDetailRef = ref(null)
function selectHandle() {
  operatGroupDetailRef.value.show(shopOptions.value, pageOptions.value)
}
//校验数据
const rules = ref({
  name: {
    required: true,
    trigger: ['blur', 'input'],
    message: '分组名称不能为空',
  },
  type: {
    required: true,
    trigger: ['blur', 'input'],
    validator: function (rule, value) {
      return true
    },
    message: '请选择系统类型',
  },
  group: {
    required: true,
    validator: function (rule, value) {
      return value.length > 0
    },
    trigger: ['blur', 'input'],
    message: '请勾选该分组下的优惠券',
  },
  is_bfxl: {
    required: true,
    trigger: ['blur', 'input'],
    validator: function (rule, value) {
      return true
    },
    message: '请选择所属小程序',
  },
})
const status_options = [
  {
    label: '半屏跳转',
    value: 0,
  },
  {
    label: 'feed流',
    value: 1,
  },
  {
    label: '中转详情',
    value: 2,
  },
]
//查询参数
const tableData = ref([])
//优惠券列表选择相关
const columns = [
  {
    type: 'selection',
    key: 'id',
    fixed: 'left',
    size: 'large',
    width: 50,
    className: 'wen_className',
    disabled(row) {
      return modalType.value == 1
    },
    render() {
      return true
    },
  },
  {
    title: 'ID',
    key: 'coupon_id',
    align: 'center',
    width: 100,
    fixed: 'left',
    size: 'large',
    className: 'wen_className2',
  },
  {
    title: '商品名称',
    key: 'title',
    align: 'center',
    fixed: 'left',
    size: 'large',
    width: 322,
    filterMode: 'and',
    filter(value, row) {
      return ~row.title.indexOf(value)
    },
    render(row) {
      return row.title || row.skuName
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
  },
  {
    title: '面值(元)',
    width: 80,
    key: 'face_value',
    align: 'center',
    render(row) {
      return row.face_value || row.discount
    },
  },
  { title: '兑换牛金豆', key: 'credits', align: 'center', width: 100 },
  {
    title: '上架状态',
    key: 'status',
    width: 80,
    align: 'center',
    filterMode: 'and',
    filter(value, row) {
      if (value === null) return true
      return ~[row.status].indexOf(value)
    },
    render(row) {
      if (row.lx_type == 1) {
        return row.status == 1 ? '上架' : '未上架'
      }
      return h(NSwitch, {
        size: 'small',
        value: Boolean(row.status),
        onUpdateValue: (updateValue) => {
          const currentIndex = row.current_index
          tableData.value[currentIndex].status = updateValue
        },
      })
    },
  },
  {
    title: '个性推荐',
    key: 'show_tj',
    width: 80,
    align: 'center',
    filterMode: 'and',
    filter(value, row) {
      if (value === null) return true
      return ~[row.show_tj].indexOf(value)
    },
    render(row) {
      if (row.lx_type == 1) {
        return ''
      }
      return h(NSwitch, {
        size: 'small',
        value: Boolean(row.show_tj),
        onUpdateValue: (updateValue) => {
          const currentIndex = row.current_index
          tableData.value[currentIndex].show_tj = updateValue
        },
      })
    },
  },
  {
    title: '零豆特权',
    key: 'zero_credits',
    width: 80,
    align: 'center',
    filterMode: 'and',
    filter(value, row) {
      if (value === null) return true
      return ~[row.zero_credits].indexOf(value)
    },
    render(row) {
      return h(NSwitch, {
        size: 'small',
        value: Boolean(row.zero_credits),
        onUpdateValue: (updateValue) => {
          const currentIndex = row.current_index
          tableData.value[currentIndex].zero_credits = updateValue
        },
      })
    },
  },
  {
    title: '来源',
    key: 'lx_type',
    width: 70,
    align: 'center',
    render(row, index) {
      return ['自建', '京东', '拼多多'][row.lx_type - 1]
    },
  },
  {
    title: '配置',
    key: 'is_add_to',
    width: 100,
    align: 'center',
    filterMode: 'and',
    filter(value, row) {
      if (value === null) return true
      return ~[row.is_add_to].indexOf(value)
    },
    render(row, index) {
      return ['', '系统上架'][row.is_add_to]
    },
  },
  {
    title: '无券',
    key: 'not_coupon',
    align: 'center',
    width: 80,
    render(row, index) {
      return row.lx_type == 2 ? (row.not_coupon == 1 ? '是' : '否') : ''
    },
  },
  {
    title: '打开方式',
    key: 'is_flow',
    width: 130,
    align: 'center',
    render(row, index) {
      return h(NSelect, {
        options: status_options,
        size: 'small',
        value: row.is_flow,
        'label-field': 'label',
        'value-field': 'value',
        disabled: row.lx_type == 1,
        onUpdateValue: (updateValue) => {
          const currentIndex = row.current_index
          tableData.value[currentIndex].is_flow = updateValue
        },
      })
    },
  },
  {
    title: '选品库',
    key: 'groupId',
    align: 'center',
    size: 'large',
    width: 150,
    render(row, index) {
      return h(NInput, {
        value: row.groupId || '',
        size: 'tiny',
        style: {
          'margin-right': '10px',
          width: 100,
          display: 'inline-block',
        },
        disabled: modalType.value == 1 || row.lx_type != 2,
        onUpdateValue(value) {
          const currentIndex = row.current_index
          tableData.value[currentIndex].groupId = value
        },
      })
    },
  },
  {
    title: '排位保护时间(h)',
    key: 'protect',
    align: 'center',
    size: 'large',
    width: 150,
    render(row, index) {
      return h(NInputNumber, {
        value: row.protect || 0,
        min: 0,
        size: 'tiny',
        max: 100,
        style: {
          'margin-right': '10px',
          width: '85px',
          display: 'inline-block',
        },
        disabled: modalType.value == 1 || row.lx_type == 1,
        onUpdateValue(value) {
          const currentIndex = row.current_index
          tableData.value[currentIndex].protect = value
        },
      })
    },
  },
  { title: '购买人数', key: 'amount', align: 'center', width: 100 },
  { title: '佣金(元)', key: 'commission', align: 'center', width: 100 },
  { title: '复购人数', key: 'again', align: 'center', width: 100 },
  { title: '排序权值', key: 'sort_num', align: 'center', width: 100 },
  { title: '累计订单', key: 'orderNum', align: 'center', width: 100 },
  { title: '点击次数', key: 'clickNum', align: 'center', width: 100 },
  { title: '转化率(%)', key: 'promotion', align: 'center', width: 100 },
  {
    title: '显示时间',
    key: 'date',
    align: 'center',
    width: 210,
    render(row) {
      return h(NDatePicker, {
        type: 'datetime',
        placeholder: '请选择时间',
        value: initProcessTime(row.show_time),
        onUpdateValue: (updateValue) => {
          const currentIndex = row.current_index
          tableData.value[currentIndex].show_time = updateValue ? formatDateTime(updateValue) : updateValue
        },
      })
    },
  },
  {
    title: '隐藏时间',
    key: 'date',
    align: 'center',
    width: 210,
    render(row) {
      return h(NDatePicker, {
        type: 'datetime',
        clearable: true,
        placeholder: '请选择时间',
        value: initProcessTime(row.hide_time),
        onUpdateValue: (updateValue) => {
          const currentIndex = row.current_index
          tableData.value[currentIndex].hide_time = updateValue ? formatDateTime(updateValue) : updateValue
        },
      })
    },
  },
  { title: '上轮位置系数', key: 'prev_position_num', align: 'center', width: 110 },
  {
    title: '位置系数',
    key: 'position_num',
    align: 'center',
    size: 'large',
    width: 160,
    render(row, index) {
      return h(NInputNumber, {
        value: row.position_num || 0,
        min: 0,
        size: 'tiny',
        max: 60,
        style: {
          'margin-right': '10px',
          width: '85px',
          display: 'inline-block',
        },
        disabled: modalType.value == 1 || row.lx_type == 1,
        onUpdateValue(value) {
          const currentIndex = row.current_index
          tableData.value[currentIndex].position_num = value
        },
      })
    },
  },
  {
    title: '创建时间',
    key: 'create_time',
    align: 'center',
    width: 120,
  },
  {
    title: '佣金降幅(%)',
    key: 'commission_num',
    align: 'center',
    size: 'large',
    width: 110,
    render(row, index) {
      return h(NInput, {
        value: row.commission_num || '0',
        min: 0,
        size: 'tiny',
        style: {
          'margin-right': '10px',
          width: '85px',
          display: 'inline-block',
        },
        disabled: modalType.value == 1 || row.lx_type == 1,
        onUpdateValue(value) {
          const currentIndex = row.current_index
          tableData.value[currentIndex].commission_num = value
        },
      })
    },
  },
  {
    title: '最终佣金(%)',
    key: 'commission_end',
    align: 'center',
    size: 'large',
    width: 110,
    render(row, index) {
      return h(NInput, {
        value: row.commission_end || '0',
        min: 0,
        size: 'tiny',
        style: {
          'margin-right': '10px',
          width: '85px',
          display: 'inline-block',
        },
        disabled: modalType.value == 1 || row.lx_type == 1,
        onUpdateValue(value) {
          const currentIndex = row.current_index
          tableData.value[currentIndex].commission_end = value
        },
      })
    },
  },
  {
    title: '延后周期(d)',
    key: 'delayed_period',
    align: 'center',
    size: 'large',
    width: 110,
    render(row, index) {
      return h(NInputNumber, {
        value: row.delayed_period || 0,
        min: 0,
        size: 'tiny',
        style: {
          'margin-right': '10px',
          width: '85px',
          display: 'inline-block',
        },
        disabled: modalType.value == 1,
        onUpdateValue(value) {
          const currentIndex = row.current_index
          tableData.value[currentIndex].delayed_period = value
        },
      })
    },
  },
  { title: '下架原因', key: 'msg', align: 'center', width: 252 },
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
            tableData.value.splice(currInputIndex, 1)
            tableData.value.splice(inputValue, 0, currData)

            // tableData.value[inputValue] = currData;
            // tableData.value[currInputIndex] = targetIndex
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
// 时间的格式化
function initProcessTime(date) {
  if (date) {
    return new Date(date.replace(new RegExp(/-/gm), '/')).getTime()
  }
  return null
}
// 重置数组的排序
function resetIndex() {
  tableData.value.forEach((item, index) => {
    item._index = index + 1
    item.current_index = index
  })
}
/**回调父组件函数注册 */
const emit = defineEmits(['refresh'])
const defaultStatusFilter = ref(null)
const defaultAddFilter = ref(null)
/** 表单过滤 */
const handleUpdateFilter = () => {
  let arr = []
  let statusArr = []
  let addArr = []
  arr.push(defaultCouponFilter.value)
  statusArr.push(defaultStatusFilter.value)
  addArr.push(defaultAddFilter.value)
  tableRef.value.filter({
    title: arr,
    status: statusArr,
    is_add_to: addArr,
  })
}
// 过滤优惠券
const defaultCouponFilter = ref('')
// table ref
const tableRef = ref(null)
const handleCheck = (rowKeys) => {
  model.value.group = rowKeys
}

/**表单验证 */
function handleValidateButtonClick() {
  formRef.value?.validate((errors) => {
    if (!errors) {
      let group = model.value.group
      group = tableData.value
        .filter((item) => group.includes(item.coupon_id))
        .map((item) => ({
          coupon_id: item.coupon_id,
          is_flow: item.is_flow,
          show_time: item.show_time,
          hide_time: item.hide_time,
          protect: item.protect,
          position_num: item.position_num,
          commission_num: item.commission_num,
          commission: item.commission_end,
          groupId: item.groupId,
          status: Number(item.status),
          goods_sign: item.goods_sign || '',
          itemId: item.itemId || '',
          delayed_period: item.delayed_period || 0,
          show_tj: Number(item.show_tj),
          zero_credits: Number(item.zero_credits),
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
/**展示弹窗 */
function show(operatType, data) {
  defaultCouponFilter.value = ''
  modalTitle.value = ['查看', '编辑', '新增'][operatType - 1]
  modalType.value = operatType
  model.value = {
    name: '',
    group: [],
    type: 2,
    sort: 0,
    positionId: 0,
    pdd_positionId: 0,
    amount_power: 0,
    commission_power: 0,
    again_power: 0,
    click_power: 0,
    keep: 0,
    circle: '',
    commission_num: '',
    commission: '',
    again_time: '',
    is_bfxl: 0,
    user_group: 0,
    jump_type: 0,
    path_type: 0,
  }
  showType.value = operatType
  showData.value = data
  getTableData(data?.type)
  ckIds.value = []
}
function getTableData(type) {
  if (showType.value !== 3) {
    return getGroupDetails(type)
  }
  getCouponList()
}
const lists = ref()
const load = ref()
function getGroupDetails(type) {
  const p_type = type
  http
    .getGroupDetails({
      group_id: showData.value.id,
      type: showType.value === 1 ? 1 : 0,
      p_type,
      sort: 0,
      positionId: 0,
      pdd_positionId: 0,
      amount_power: 0,
      commission_power: 0,
      again_power: 0,
      click_power: 0,
      keep: 0,
      circle: '',
      commission_num: '',
      commission: '',
      again_time: '',
      is_bfxl: 0,
      user_group: 0,
      jump_type: 0,
      path_type: 0,
      delayed_period: 0,
    })
    .then((res) => {
      let {
        id: group_id,
        name,
        list,
        list2,
        type,
        sort,
        positionId,
        pdd_positionId,
        amount_power,
        commission_power,
        again_power,
        click_power,
        keep,
        circle,
        commission_num,
        commission,
        again_time,
        is_bfxl,
        user_group,
        jump_type,
        path_type,
        delayed_period,
      } = res.data
      let _list = list.filter((item, index) => {
        if (item.id) {
          item._index = index + 1
          item.current_index = index
          return true
        }
        return false
      })
      lists.value = _list
      // 供选中 - 未搜索的使用
      shopOptions.value = list2
      const group = _list.map((item) => item.coupon_id)
      model.value = {
        group_id,
        name,
        group,
        type: p_type || type,
        sort,
        positionId,
        pdd_positionId,
        amount_power,
        commission_power,
        again_power,
        click_power,
        keep,
        circle,
        commission_num,
        commission,
        again_time,
        is_bfxl,
        user_group,
        jump_type,
        path_type,
        delayed_period,
      }
      end_time.value = res.data.end_time || ''
      end_index.value = res.data.end_index || ''
      tableData.value = _list.slice(0, 10)
      showModal.value = true
      ckIds.value = res.data.ckIds
      load.value = setInterval(function () {
        let length = tableData.value.length
        let length2 = lists.value.length
        if (length < length2) {
          for (var i = length; i < length + 10; i++) {
            if (!lists.value[i] || i >= length2) {
              clearInterval(load.value)
              break
            }
            tableData.value.push(lists.value[i])
          }
        } else {
          clearInterval(load.value)
        }
      }, 400)
    })
}
function doClose() {
  showModal.value = false
  clearInterval(load.value)
}
// 新增获取的列表
function getCouponList() {
  const deviceType = model.value.type
  http.couponList({ p_type: deviceType, is_zero: 1 }).then((res) => {
    let { list } = res.data
    list.forEach((item) => {
      item['coupon_id'] = item.id
    })
    tableData.value = []
    shopOptions.value = list
    showModal.value = true
  })
}
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

<template>
  <n-drawer v-model:show="showModal" :width="drawerWidth" :placement="placement">
    <n-drawer-content :title="modalTitle" closable>
      <n-form
        ref="formRef"
        :model="model"
        :rules="rules"
        label-placement="left"
        label-width="140px"
        require-mark-placement="right-hanging"
        :style="{
          maxWidth: '3000px',
        }"
      >
        <n-form-item label="分类" path="typeClass">
          <n-radio-group v-model:value="typeClass" name="radiogroup" :disabled="modalType === 1 || modalType === 2">
            <n-space>
              <n-radio v-for="item in classType" :key="item.value" :value="item.value">
                {{ item.label }}
              </n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        <template v-if="typeClass == 1">
          <n-form-item label="一级分类" path="name" w-300>
            <n-input v-model:value="model.name" :disabled="modalType === 1" />
          </n-form-item>
          <n-form-item label="系统类型" path="device" w-300>
            <n-select
              v-model:value="model.device"
              :options="typeOptions"
              :disabled="modalType === 1"
              @update:value="deviceTypeOptionsUpdate"
            />
          </n-form-item>
        </template>
        <template v-if="typeClass == 2">
          <n-form-item label="一级分类" w-400 path="pid">
            <n-select
              v-model:value="model.pid"
              :options="parentOption"
              label-field="name"
              value-field="id"
              filterable
              clearable
              remote
              placeholder="选择一级分类"
            />
          </n-form-item>
          <n-form-item label="二级分类" path="name" w-300>
            <n-input v-model:value="model.name" :disabled="modalType === 1" />
          </n-form-item>
          <n-form-item label="图标" path="img">
            <n-upload
              action="/apios/Tools/uploadImg"
              list-type="image-card"
              :default-file-list="fileList"
              :max="1"
              name="img"
              @finish="handleFinish($event, 'img')"
              @before-upload="beforeUpload"
            >
              <n-button quaternary>上传文件</n-button>
            </n-upload>
          </n-form-item>
        </template>
        <n-form-item label="排序" path="sort" w-300>
          <n-input-number v-model:value="model.sort" :disabled="modalType === 1" />
        </n-form-item>
        <template v-if="typeClass == 2">
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
              :scroll-x="2200"
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
        </template>
        <div flex justify-center w-1000>
          <n-button mr-10 @click="showModal = false"> 关闭 </n-button>
          <n-button v-if="modalType !== 1" type="info" @click="handleValidateButtonClick"> 保存 </n-button>
        </div>
      </n-form>
      <!-- </n-modal> -->
    </n-drawer-content>
  </n-drawer>
  <operat-group-detail ref="operatGroupDetailRef" @addList="addListHandle" />
</template>
<script setup>
import { formatDateTime, renderIcon } from '@/utils';
import { NButton, NDatePicker, NInput, NInputNumber, useMessage } from 'naive-ui';
import { ref } from 'vue';
import http from './api';
import operatGroupDetail from './operatGroupDetail.vue';
const typeClass = ref(1)
//券类型
const classType = [
  {
    value: 1,
    label: '一级分类',
  },
  {
    value: 2,
    label: '二级分类',
  },
]

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

/**抽屉宽度 */
const drawerWidth = window.innerWidth - 220 + 'px'
/**弹窗显示控制 */
const showModal = ref(false)
/**弹窗类型 1.查看 2.修改,3.新增*/
const modalType = ref(3)
const modalTitle = ref('新增')
/**表单 */
const formRef = ref(null)
/**系统下拉 */
const typeOptions = [
  {
    label: '苹果机',
    value: 1,
  },
  {
    label: '公共',
    value: 2,
  },
  {
    label: '安卓机',
    value: 3,
  },
]
defineProps({
  parentOption: {
    type: Array,
    default: [],
  },
})
// 商品选择
const shopOptions = ref([])
function deviceTypeOptionsUpdate(value, option) {
  model.value.type = value
  //getTableData(value);
}

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
// 时间的格式化
function initProcessTime(date) {
  if (date) {
    return new Date(date.replace(new RegExp(/-/gm), '/')).getTime()
  }
  return null
}

//提示展示
const message = useMessage()
//表单数据
const model = ref({})
//校验数据
const rules = ref({
  name: {
    required: true,
    trigger: ['blur', 'input'],
    message: '类目名称不能为空',
  },
  device: {
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
  img: {
    required: true,
    trigger: ['blur', 'input'],
    message: '图片不能为空',
  },
})
//查询参数
const tableData = ref([])
//优惠券列表选择相关
const columns = [
  {
    type: 'selection',
    key: 'id',
    disabled(row) {
      return modalType.value == 1
    },
    render() {
      return true
    },
  },
  { title: 'ID', key: 'coupon_id', align: 'center', width: 100 },
  {
    title: '商品名称',
    key: 'title',
    align: 'center',
    width: 200,
    filter(value, row) {
      return ~row.title.indexOf(value)
    },
    render(row) {
      return row.title || row.skuName
    },
  },
  {
    title: '面值(元)',
    key: 'face_value',
    align: 'center',
    width: 100,
    render(row) {
      return row.face_value || row.discount
    },
  },
  { title: '兑换价格(牛金豆)', key: 'credits', align: 'center', width: 150 },
  { title: '发放数量', key: 'used_num', align: 'center', width: 100 },
  { title: '实际兑换', key: 'exch_user_num', align: 'center', width: 100 },
  { title: '剩余数量', key: 'stock_num', align: 'center', width: 100 },
  { title: '有效期(天)', key: 'expiry_date', align: 'center', width: 100 },
  {
    title: '创建时间',
    key: 'create_time',
    align: 'center',
    width: 220,
  },
  {
    title: '上架状态',
    key: 'status',
    align: 'center',
    width: 100,
    render(row) {
      // 京东商品默认是上架
      return row.status == 1 || row.lx_type == 2 ? '上架' : '未上架'
    },
  },
  {
    title: '显示时间',
    key: 'date',
    align: 'center',
    width: 252,
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
    width: 252,
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
            tableData.value.splice(currInputIndex, 1)
            tableData.value.splice(inputValue, 0, currData)
            // tableData.value[inputValue] = currData
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
  console.log('arr:', arr)
  tableRef.value.filter({
    title: arr,
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
      model.value.pid = model.value.pid ? model.value.pid : 0
      let group = model.value.group
      group = tableData.value
        .filter((item) => group.includes(item.coupon_id))
        .map((item) => ({
          coupon_id: item.coupon_id,
          show_time: item.show_time,
          hide_time: item.hide_time,
        }))
      http
        .createCategory({
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
const fileList = ref([])
/**展示弹窗 */
function show(operatType, data) {
  defaultCouponFilter.value = ''
  modalTitle.value = ['查看', '编辑', '新增'][operatType - 1]
  modalType.value = operatType
  model.value = {
    pid: null,
    name: '',
    img: '',
    group: [],
    sort: 0,
  }
  showType.value = operatType
  fileList.value = []
  showData.value = data
  getTableData()
}
function getTableData() {
  if (showType.value !== 3) {
    return getGroupDetails()
  }
  typeClass.value = 1
  tableData.value = []
  getCouponList()
}
function getGroupDetails() {
  http
    .categoryXq({
      id: showData.value.id,
    })
    .then((res) => {
      let { pid, id, name, img, sort, device, coupon, group } = res.data
      // 供选中 - 未搜索的使用
      model.value = {
        id,
        pid,
        name,
        img,
        group,
        device,
        sort,
      }
      if (img) {
        fileList.value.push({
          id: 'c',
          name: '已上传的图片',
          status: 'finished',
          url: img,
        })
      }
      tableData.value = coupon.map((item, index) => {
        return {
          ...item,
          _index: index + 1,
          current_index: index,
        }
      })
      // 父级id有值 - 是二级类目
      console.log(pid)
      if (pid > 0) {
        typeClass.value = 2
        getCouponList(group)
      } else {
        typeClass.value = 1
      }
      showModal.value = true
    })
}
// 新增获取的列表
function getCouponList(group) {
  const deviceType = model.value.device
  http.couponList({ p_type: deviceType }).then((res) => {
    let { list } = res.data
    list.forEach((item) => {
      item['coupon_id'] = item.id
    })
    shopOptions.value = list
    group &&
      group.forEach((item) => {
        shopOptions.value = shopOptions.value.filter((optionItem) => optionItem.coupon_id != item)
      })
    showModal.value = true
  })
}

/**暴露给父组件使用 */
defineExpose({
  show,
})
</script>

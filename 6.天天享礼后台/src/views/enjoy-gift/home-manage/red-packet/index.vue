<template>
  <CommonPage show-footer title="外卖红包">
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
      <div style="font-size: 20px" pl-12 h-40 flex items-center mb-10 font-600>背景</div>
      <n-form-item label="背景图片" path="bg_img">
        <n-upload
          action="/apios/Tools/uploadImg"
          list-type="image-card"
          :default-file-list="bgFileList"
          :max="1"
          name="img"
          @remove="removeFileList('bg_img')"
          @finish="handleFinish($event, 'bg_img')"
          @before-upload="beforeUpload"
        >
          <n-button quaternary>上传文件</n-button>
        </n-upload>
      </n-form-item>
      <n-form-item label="背景颜色" path="bg_color" w-300>
        <n-color-picker v-model:value="model.bg_color" :show-alpha="false" :actions="['clear']" />
      </n-form-item>
      <!-- 左右图模块 -->
      <div style="font-size: 20px" pl-12 h-40 flex items-center mb-10 font-600>左右图</div>
      <div flex>
        <div class="img_left">
          <n-form-item label="左图" path="left_img">
            <n-upload
              action="/apios/Tools/uploadImg"
              list-type="image-card"
              :default-file-list="leftFileList"
              :max="1"
              name="img"
              @remove="removeFileList('left_img')"
              @finish="handleFinish($event, 'left_img')"
              @before-upload="beforeUpload"
            >
              <n-button quaternary>上传文件</n-button>
            </n-upload>
          </n-form-item>
          <n-form-item label="打开方式" w-400 path="left_open_mini_type">
            <n-select
              v-model:value="model.left_open_mini_type"
              :options="openMiniType"
              filterable
              clearable
              remote
              placeholder="打开方式"
            />
          </n-form-item>
          <n-form-item label="小程序ID" path="left_appid">
            <n-input
              v-model:value="model.left_appid"
              :style="{
                maxWidth: '400px',
              }"
            />
          </n-form-item>
          <n-form-item label="页面路径" path="left_path">
            <n-input
              v-model:value="model.left_path"
              :style="{
                maxWidth: '400px',
              }"
            />
          </n-form-item>
        </div>
        <div class="img_right">
          <n-form-item label="右图" path="right_img">
            <n-upload
              action="/apios/Tools/uploadImg"
              list-type="image-card"
              :default-file-list="rightFileList"
              :max="1"
              name="img"
              @remove="removeFileList('right_img')"
              @finish="handleFinish($event, 'right_img')"
              @before-upload="beforeUpload"
            >
              <n-button quaternary>上传文件</n-button>
            </n-upload>
          </n-form-item>
          <n-form-item label="打开方式" w-400 path="right_open_mini_type">
            <n-select
              v-model:value="model.right_open_mini_type"
              :options="openMiniType"
              filterable
              clearable
              remote
              placeholder="打开方式"
            />
          </n-form-item>
          <n-form-item label="小程序ID" path="right_appid">
            <n-input
              v-model:value="model.right_appid"
              :style="{
                maxWidth: '400px',
              }"
            />
          </n-form-item>
          <n-form-item label="页面路径" path="right_path">
            <n-input
              v-model:value="model.right_path"
              :style="{
                maxWidth: '400px',
              }"
            />
          </n-form-item>
        </div>
      </div>
      <!-- 单列图 -->
      <div style="font-size: 20px" pl-12 h-40 flex items-center mb-10 font-600>单列图</div>
      <n-form-item label="图片">
        <n-upload
          action="/apios/Tools/uploadImg"
          list-type="image-card"
          :default-file-list="fileList"
          :max="1"
          name="img"
          @remove="removeFileList('img')"
          @finish="handleFinish($event, 'img')"
          @before-upload="beforeUpload"
        >
          <n-button quaternary>上传文件</n-button>
        </n-upload>
      </n-form-item>
      <n-form-item label="跳转类型" w-400 path="jump_type">
        <n-select v-model:value="model.jump_type" :options="jumpType" filterable remote placeholder="跳转类型" />
      </n-form-item>
      <template v-if="model.jump_type == 0">
        <n-form-item label="优惠券" w-400>
          <n-select
            v-model:value="model.coupon_id"
            :options="couponOptions"
            filterable
            :loading="loading"
            clearable
            remote
            placeholder="请选择优惠券"
            @search="handleSearch"
            @update:value="coupon_id_handleUpdate"
          />
        </n-form-item>
      </template>

      <template v-if="model.jump_type == 1">
        <n-form-item label="小程序ID" path="appid">
          <n-input
            v-model:value="model.appid"
            :style="{
              maxWidth: '400px',
            }"
          />
        </n-form-item>
        <n-form-item label="页面路径">
          <n-input
            v-model:value="model.path"
            :style="{
              maxWidth: '400px',
            }"
          />
        </n-form-item>
      </template>

      <!-- 优惠券分组 -->
      <div style="font-size: 20px" pl-12 h-40 flex items-center mb-10 font-600>优惠券列表</div>
      <n-form-item label="添加商品" w-600>
        <n-button mr-10 @click="selectHandle"> 选择商品列表 </n-button>
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
      <div v-has="'add'" flex justify-center>
        <n-button type="info" size="large" @click="handleValidateButtonClick"> 保存 </n-button>
      </div>
    </n-form>
  </CommonPage>
  <operat-group-detail ref="operatGroupDetailRef" @addList="addListHandle" />
</template>

<script setup>
import { formatDateTime, renderIcon } from '@/utils';
import { NButton, NDatePicker, NInput, NInputNumber, useMessage } from 'naive-ui';
import { onMounted, ref } from 'vue';
import http from './api';
import operatGroupDetail from './operatGroupDetail.vue';

// 小程序的打开方式
const openMiniType = ref([
  {
    label: '跳转打开',
    value: 1,
  },
  {
    label: '半屏打开',
    value: 2,
  },
])
// 跳转类型
const jumpType = ref([
  {
    label: '优惠券',
    value: 0,
  },
  {
    label: '小程序',
    value: 1,
  },
])
//表单数据
const model = ref({
  id: '',
  bg_img: '',
  bg_color: '#18A058',
  left_img: '',
  left_open_mini_type: 1,
  left_appid: '',
  left_path: '',
  right_img: '',
  right_open_mini_type: 1,
  right_appid: '',
  right_path: '',
  img: '', // 单例图
  jump_type: 0,
  appid: '',
  path: '',
  coupon_id: null,
  group: [],
})
//校验数据
const rules = ref({
  bg_img: {
    required: true,
    trigger: ['blur', 'input'],
    message: '背景图片不能为空',
  },
  left_img: {
    required: true,
    trigger: ['blur', 'input'],
    message: '图片不能为空',
  },
  right_img: {
    required: true,
    trigger: ['blur', 'input'],
    message: '图片不能为空',
  },
  bg_color: {
    required: true,
    trigger: 'change',
    validator(rule, value) {
      return Boolean(value)
    },
    message: '请输入背景颜色',
  },
  left_appid: {
    required: true,
    trigger: ['blur', 'input'],
    message: '左图的小程序ID不能为空',
  },
  left_path: {
    required: true,
    trigger: ['blur', 'input'],
    message: '左图的路径不能为空',
  },
  right_appid: {
    required: true,
    trigger: ['blur', 'input'],
    message: '右图的小程序ID不能为空',
  },
  right_path: {
    required: true,
    trigger: ['blur', 'input'],
    message: '右图的路径不能为空',
  },
  type_sid: {
    required: true,
    trigger: ['blur', 'input'],
    message: '不能为空',
  },
})
/**表单 */
const formRef = ref(null)
//提示展示
const message = useMessage()
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
async function beforeUpload(data) {
  if (!/image\/(png|jpg|jpeg|gif)/i.test(data.file.file?.type)) {
    message.error('只能上传png|jpg|gif格式的图片文件，请重新上传')
    return false
  }
  return true
}

//优惠券
const couponOptions = ref([])
const loading = ref(false)
function handleSearch(query = '') {
  loading.value = true
  const deviceType = 2
  const coupon_id = model.value.coupon_id
  http.getCouponList({ title: query, p_type: deviceType }).then((res) => {
    loading.value = false
    let list = res.data.list.filter(function (item) {
      return item.status == 1 || item.id == coupon_id
    })
    couponOptions.value = list.map(function (item) {
      return {
        label: item.status == 0 ? item.title + '（已下架）' : item.title,
        value: item.id,
        disabled: item.status == 0,
      }
    })
  })
}
// 优惠券的选择
function coupon_id_handleUpdate(value, options) {
  console.log('value :>> ', value)
}
// 商品选择
const shopOptions = ref([])
const operatGroupDetailRef = ref(null)
//查询参数
const tableData = ref([])
// 过滤优惠券
const defaultCouponFilter = ref('')
// table ref
const tableRef = ref(null)
const handleCheck = (rowKeys) => {
  model.value.group = rowKeys
}
// 时间的格式化
function initProcessTime(date) {
  if (date) {
    return new Date(date.replace(new RegExp(/-/gm), '/')).getTime()
  }
  return null
}
//优惠券列表选择相关
const columns = [
  {
    type: 'selection',
    key: 'id',
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
// 新增获取的列表
function getCouponList(group) {
  loading.value = true
  const deviceType = 2
  http.getCouponList({ p_type: deviceType }).then((res) => {
    loading.value = false
    let { list } = res.data
    const coupon_id = model.value.coupon_id
    let filterList = list.filter(function (item) {
      return item.status == 1 || item.id == coupon_id
    })
    // 优惠券的呈现
    couponOptions.value = filterList.map(function (item) {
      return {
        label: item.status == 0 ? item.title + '（已下架）' : item.title,
        value: item.id,
        disabled: item.status == 0,
      }
    })
    shopOptions.value = list.map((item) => {
      return {
        ...item,
        coupon_id: item.id,
      }
    })
    group &&
      group.forEach((item) => {
        shopOptions.value = shopOptions.value.filter((optionItem) => optionItem.coupon_id != item)
      })
  })
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
/** 表单过滤 */
const handleUpdateFilter = () => {
  let arr = []
  arr.push(defaultCouponFilter.value)
  console.log('arr:', arr)
  tableRef.value.filter({
    title: arr,
  })
}
// 重置数组的排序
function resetIndex() {
  tableData.value.forEach((item, index) => {
    item._index = index + 1
    item.current_index = index
  })
}
function selectHandle() {
  operatGroupDetailRef.value.show(shopOptions.value)
}
onMounted(() => {
  init()
})
const fileList = ref([])
const bgFileList = ref([])
const leftFileList = ref([])
const rightFileList = ref([])

function init() {
  http.takeXq().then((res) => {
    if (res.code != 1) return
    const {
      id,
      bg_img,
      bg_color,
      left_img,
      left_open_mini_type,
      left_appid,
      left_path,
      right_img,
      right_open_mini_type,
      right_appid,
      right_path,
      img, // 单例图
      jump_type,
      appid,
      path,
      coupon_id,
      coupon,
      group,
    } = res.data
    model.value = {
      id,
      bg_img,
      bg_color,
      left_img,
      left_open_mini_type,
      left_appid,
      left_path,
      right_img,
      right_open_mini_type,
      right_appid,
      right_path,
      img, // 单例图
      jump_type,
      appid,
      path,
      coupon_id: Number(coupon_id),
      group,
    }
    if (bg_img) {
      bgFileList.value.push({
        id: 'c',
        name: '已上传的图片',
        status: 'finished',
        url: bg_img,
      })
    }
    if (left_img) {
      leftFileList.value.push({
        id: 'c',
        name: '已上传的图片',
        status: 'finished',
        url: left_img,
      })
    }
    if (right_img) {
      rightFileList.value.push({
        id: 'c',
        name: '已上传的图片',
        status: 'finished',
        url: right_img,
      })
    }
    if (img) {
      fileList.value.push({
        id: 'c',
        name: '已上传的图片',
        status: 'finished',
        url: img,
      })
    }
    let couponList = coupon.map((item, index) => {
      return {
        ...item,
        _index: index + 1,
        current_index: index,
      }
    })
    tableData.value = couponList
    getCouponList(group) // 选择商品的弹窗
  })
}

/**表单验证 */
function handleValidateButtonClick() {
  console.log('model.value :>> ', model.value)
  formRef.value?.validate((errors) => {
    if (!errors) {
      let group = model.value.group
      group = tableData.value
        .filter((item) => group.includes(item.coupon_id))
        .map((item) => ({
          coupon_id: item.coupon_id,
          show_time: item.show_time,
          hide_time: item.hide_time,
        }))
      http
        .createTake({
          ...model.value,
          group,
        })
        .then((res) => {
          message.success(res.msg)
        })
    }
  })
  return false
}
</script>

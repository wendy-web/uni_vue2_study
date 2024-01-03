<template>
  <CommonPage show-footer title="推荐商品">
    <template #action>
      <n-button type="primary" @click="handleAdd">
        <TheIcon icon="material-symbols:add" :size="18" class="mr-5" /> 新增商品
      </n-button>
    </template>
    <CrudTable
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="2200"
      :columns="columns"
      :get-data="http.scoreList"
    >
      <template #queryBar>
        <QueryBarItem label="商品名称" :label-width="80">
          <n-input
            v-model:value="queryItems.goods_name"
            type="text"
            placeholder="商品名称"
            @keydown.enter="$table?.handleSearch"
          />
        </QueryBarItem>
      </template>
    </CrudTable>
  </CommonPage>
  <operat-group-detail ref="operatGroupDetailRef" @addList="addListHandle" />
</template>

<script setup>
import { NButton, NSwitch, NInput } from 'naive-ui'
import { renderIcon } from '@/utils'
import { useMessage, useDialog } from 'naive-ui'
import operatGroupDetail from './operatGroupDetail.vue'
import http from './api'
defineOptions({ name: 'CouponGroup' })
//表格操作
const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})

onMounted(() => {
  getCouponList()
  refresh()
})

function refresh() {
  $table.value?.handleSearch()
}

const columns = [
  { title: 'ID', key: 'coupon_id', align: 'center', width: 160 },
  {
    title: '商品名称',
    key: 'title',
    align: 'center',
    width: 352,
    filter(value, row) {
      return ~row.title.indexOf(value)
    },
    render(row) {
      return row.title || row.skuName
    },
  },
  {
    title: '佣金率',
    key: 'commissionShare',
    align: 'center',
    width: 100,
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
    width: 200,
  },
  {
    title: '系统类型',
    key: 'type',
    align: 'center',
    width: 100,
    render(row) {
      return ['苹果机', '公共', '安卓机'][row.device_type - 1]
    },
  },
  // { title: '创建人', key: 'create_name', align: 'center' },
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
    title: '来源',
    key: 'lx_type',
    align: 'center',
    width: 100,
    render(row, index) {
      return ['自建', '京东'][row.lx_type - 1]
    },
  },
  {
    title: 'feed流',
    key: 'is_flow',
    align: 'center',
    width: 120,
    render(row, index) {
      return h(NSwitch, {
        size: 'small',
        value: Boolean(row.is_flow),
        loading: !!row.publishing,
        disabled: row.lx_type == 1,
        onUpdateValue: (updateValue) => {
          changeHandle(row)
        },
      })
    },
  },
  {
    title: '按钮文案',
    key: 'btn_name',
    align: 'center',
    width: 100,
    render(row, index) {
      return h(NInput, {
        value: row.num,
        type: 'text',
        onUpdateValue(updateValue) {
          // console.log('updateValue :>> ', updateValue);
        },
        onBlur($event) {
          const inputValue = $event.target.value
          changeHandle(row, inputValue)
        },
      })
    },
  },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    fixed: 'right',
    width: 100,
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            secondary: true,
            onClick: () => removeCoupon(row),
          },
          { default: () => '删除', icon: renderIcon('material-symbols:cancel-outline-rounded', { size: 14 }) }
        ),
      ]
    },
  },
]
//提示展示
const message = useMessage()

// 商品选择
const shopOptions = ref([])
const operatGroupDetailRef = ref(null)
function handleAdd() {
  operatGroupDetailRef.value.show(shopOptions.value)
}
// 新增获取的列表
function getCouponList() {
  const deviceType = 2
  http.couponList({ p_type: deviceType }).then((res) => {
    let { list } = res.data
    list.forEach((item) => {
      item['coupon_id'] = item.id
    })
    shopOptions.value = list
  })
}
/** 自定义单元格 */
const dialog = useDialog()
/**删除分组 */
function removeCoupon(row) {
  dialog.warning({
    title: '警告',
    content: '确定删除？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: function () {
      http.scoreDel({ id: row.id }).then(function (res) {
        if (res.code == 1) {
          message.success(res.msg)
          refresh()
        } else {
          message.error(res.msg)
        }
      })
    },
  })
}
//状态启用
function changeHandle(row, inputValue = '') {
  const { coupon_id, is_flow } = row
  const params = {}
  if (inputValue) {
    params.btn_name = inputValue.trim()
    params.group = [
      {
        coupon_id,
        is_flow: Boolean(is_flow),
      },
    ]
  } else {
    params.group = [
      {
        coupon_id,
        is_flow: !Boolean(is_flow),
      },
    ]
  }
  http.scoreCoupon(params).then((res) => {
    if (res.code == 1) {
      message.success(res.msg)
      $table.value?.handleSearch()
    } else {
      message.error(res.msg)
    }
  })
}
function addListHandle(group) {
  http.scoreCoupon({ group }).then((res) => {
    if (res.code != 1) return
    message.success(res.msg)
    refresh()
  })
}
</script>

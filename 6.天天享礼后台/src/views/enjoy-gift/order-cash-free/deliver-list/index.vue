<template>
  <CommonPage show-footer title="活动列表">
    <CrudTable
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="http.giftList"
      :extra-params="extraParams"
      is-api="/apios/free/import"
      @export="exportOrders"
      @getDataCallback="getDataHandle"
      @finishImport="finishImportHandle"
    >
       <template #queryBar>
        <QueryBarItem label="发货状态" :label-width="80">
          <n-select v-model:value="queryItems.status" :options="lsStatusOptions" clearable />
        </QueryBarItem>
       <QueryBarItem label="用户ID" :label-width="80">
           <n-input
               v-model:value="queryItems.uid"
               type="text"
               clearable
               @keydown.enter="$table?.handleSearch"
           />
       </QueryBarItem>
       <QueryBarItem label="活动时间" :label-width="80" :content-width="340">
           <n-date-picker
               v-model:formatted-value="queryItems.create_time"
               value-format="yyyy-MM-dd"
               format="yyyy-MM-dd"
               type="datetimerange"
               clearable
           />
       </QueryBarItem>
      </template>
    </CrudTable>
  </CommonPage>
  <!-- 优惠券操作 -->
  <operat-goods ref="operatGoodsRef" @refresh="refresh" />
</template>

<script setup>
import { renderIcon } from '@/utils';
import { NButton, NImage, useDialog, useMessage } from 'naive-ui';
import axios from 'axios'
import http from './api';
import operatGoods from './operatGoods/index.vue';
defineOptions({ name: 'GoodsList' })
//表格操作
const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})
const extraParams = {
  isExport: true,
  isImport2: true,
}
const lsStatusOptions = [
  {
    label: '全部',
    value: 0,
  },
  {
    label: '已发货',
    value: 1,
  },
  {
    label: '未发货',
    value: 2,
  },
]
onMounted(() => {
  refresh()
})

function refresh() {
  $table.value?.handleRefreshCurr()
}

const columns = [
  { title: '活动ID', key: 'id', align: 'center', fixed: 'left' },
  { title: '奖品名称', key: 'gift_name', align: 'center' },
  {
    title: '奖品图片',
    key: 'gift_img',
    align: 'center',
    render(row, index) {
      return h(NImage, {
        width: '100',
        src: row.img,
      })
    },
  },
  { title: '收货人', key: 'username', align: 'center' },
  { title: '联系电话', key: 'mobile', align: 'center' },
  { title: '收货地区', key: 'area', align: 'center' },
  { title: '详细地址', key: 'address', align: 'center' },
  { title: '用户ID', key: 'uid', align: 'center' },
  { title: '活动时间', key: 'active_time', align: 'center' },
  { title: '任务单数', key: 'order_num', align: 'center' },
  { title: '已凑单数', key: 'have_order', align: 'center' },
  { title: '收货单数', key: 'complete_order', align: 'center' },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    fixed: 'right',
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            style: { 'margin-right': '10px' },
            secondary: true,
            onClick: () => lookCoupon(row),
          },
          { default: () => '查看', icon: renderIcon('majesticons:eye-line', { size: 14 }) }
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'info',
            style: { 'margin-right': '10px' },
            secondary: true,
            onClick: () => editCoupon(row),
          },
          { default: () => '编辑', icon: renderIcon('majesticons:eye-line', { size: 14 }) }
        ),
      ]
    },
  },
]
// 优惠券操作
const operatGoodsRef = ref(null)
// 提示展示
const message = useMessage()
// 查看
function lookCoupon(row) {
  operatGoodsRef.value.show(1, row)
}
// 编辑
function editCoupon(row) {
  operatGoodsRef.value.show(2, row)
}
/** 自定义单元格 */
const dialog = useDialog()
async function itemStatusHandle(row) {
  const res = await http.groupStatus({
    id: row.id,
    status: Number(!Boolean(row.status)),
  })
  if (res.code == 1) {
    message.success(res.msg)
    $table.value?.handleRefreshCurr()
    return
  }
  message.error(res.msg)
}
// 导出商品
function exportOrders(params) {
    axios
        .post('/apios/free/export', params, { responseType: 'blob' })
        .then((res) => {
            if (!res) {
                return
            }
            let url = window.URL.createObjectURL(
                new Blob([res.data], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                })
            )
            let a = document.createElement('a')
            a.style.display = 'none'
            a.href = url
            a.target = '_blank'
            a.setAttribute('download', '免单订单.xls')
            document.body.appendChild(a)
            a.click() //执行下载
            window.URL.revokeObjectURL(a.href)
            document.body.removeChild(a)
        })
        .catch((e) => {
            console.log(e)
        })
}
</script>

<template>
  <CommonPage show-footer title="列表">
    <template #action>
      <n-button
        type="primary"
        style="margin-right: 20px; background: #18a058ff"
        @click="lookEchart({ position_id: 0 }, 2)"
      >
        <TheIcon icon="majesticons:eye-line" :size="14" class="mr-5" /> echarts
      </n-button>
      <n-button v-has="'add'" type="primary" @click="handleAdd">
        <TheIcon icon="material-symbols:add" :size="18" class="mr-5" /> 添加
      </n-button>
    </template>
    <CrudTable
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :children-key="child"
      :get-data="http.getList"
      :is-pagination="false"
      :max-height="windowHeight"
    >
      <template #queryBar>
        <QueryBarItem label="来源" :label-width="40">
          <n-select v-model:value="queryItems.name" :options="Options" />
        </QueryBarItem>
        <QueryBarItem label="时间" :label-width="40" :content-width="340">
          <n-date-picker
            v-model:formatted-value="queryItems.create_time"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            type="daterange"
            clearable
            :shortcuts="rangeShortcuts"
          />
        </QueryBarItem>
      </template>
    </CrudTable>
  </CommonPage>
  <operate-single ref="operateSingleRef" :cid="queryItems.cid" @refresh="refresh" />
  <operate-chart ref="operateChartRef" @refresh="refresh" />
</template>
<script setup>
import { renderIcon } from '@/utils';
import { NButton, NTag, NTooltip, useDialog, useMessage } from 'naive-ui';
import http from './api';
import operateChart from './operateChart.vue';
import operateSingle from './operateSingle.vue';
const operateSingleRef = ref(null)
const operateChartRef = ref(null)
const queryItems = ref({
  cid: 1,
})
const $table = ref(null)
const Options = ref([])
const timestamp = ref(1183135260000)
const myDate = new Date() // 获取系统当前时间
const cur = myDate.getTime()
const curWeekArr = getWeekDates(myDate)
const rangeShortcuts = ref({
  //   间隔: [1629216000000, 1631203200000],
  今天: () => {
    return [cur, cur]
  },
  昨天: () => {
    return [cur - 24 * 60 * 60 * 1000, cur]
  },
  本周: () => {
    return [curWeekArr.start, curWeekArr.end]
  },
  上周: () => {
    return [curWeekArr.firstDayOfLastWeek, curWeekArr.lastDayOfLastWeek]
  },
  本月: () => {
    return [curWeekArr.firstDayOfMonth, curWeekArr.lastDayOfMonth]
  },
  上月: () => {
    return [curWeekArr.firstDayOfLastMonth, curWeekArr.lastDayOfLastMonth]
  },
  //   全部: () => {
  //     timestamp.value = null
  //     return null
  //   },
})
// 屏幕高度
const windowHeight = ref(0)
onMounted(async () => {
  http.getLists().then((res) => {
    if (res.code == 1) {
      Options.value = res.data
    }
  })
  getWindowResize()
  window.addEventListener('resize', getWindowResize)
  refresh()
})
// 获取屏幕尺寸
const getWindowResize = function () {
  windowHeight.value = window.innerHeight * 0.674
}
function refresh() {
  $table.value?.handleSearch()
}
function getWeekDates(today) {
  // 获取当前是星期几
  const day = today.getDay()
  const curYear = today.getFullYear()
  const curMonth = today.getMonth()
  const curDate = today.getDate()
  let startDate = 0
  let endDate = 0
  let firstDayOfWeek = 0 //本周的第一天
  let lastDayOfWeek = 0 //本周的最后一天
  let firstDayOfLastWeek = 0 // 获取上周的第一天
  let lastDayOfLastWeek = 0 // 获取上周的最后一天
  if (day == 0) {
    startDate = new Date(curYear, curMonth, curDate - day - 6)
    endDate = new Date(curYear, curMonth, curDate - day)

    firstDayOfWeek = new Date(today.setDate(curDate - day - 6))
    lastDayOfWeek = new Date(curYear, curMonth, curDate - day)
  } else {
    startDate = new Date(curYear, curMonth, curDate - day + 1)
    endDate = new Date(curYear, curMonth, curDate - day + 7)
    firstDayOfWeek = new Date(today.setDate(curDate - day + 1))
    lastDayOfWeek = new Date(today.setDate(curDate - day + 7))
  }
  firstDayOfLastWeek = new Date(firstDayOfWeek.setDate(firstDayOfWeek.getDate() - 7))
  lastDayOfLastWeek = new Date(lastDayOfWeek.setDate(lastDayOfWeek.getDate() - 7))
  // 获取本月的第一天
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  // 获取本月的最后一天
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  // 获取上月的第一天
  const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
  // 获取上月的最后一天
  const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0)
  console.log('当周firstDayOfWeek', firstDayOfWeek, lastDayOfWeek)
  console.log('山寨过后firstDayOfLastWeek', firstDayOfLastWeek)
  return {
    start: new Date(startDate).getTime(),
    end: new Date(endDate).getTime(),
    firstDayOfWeek: formatGetTime(firstDayOfWeek),
    lastDayOfWeek: formatGetTime(lastDayOfWeek),
    firstDayOfLastWeek: formatGetTime(firstDayOfLastWeek),
    lastDayOfLastWeek: formatGetTime(lastDayOfLastWeek),
    firstDayOfMonth: formatGetTime(firstDayOfMonth),
    lastDayOfMonth: formatGetTime(lastDayOfMonth),
    firstDayOfLastMonth: formatGetTime(firstDayOfLastMonth),
    lastDayOfLastMonth: formatGetTime(lastDayOfLastMonth),
  }
}
function formatGetTime(day) {
  return new Date(day).getTime()
}
const renderTooltip = (trigger, content) => {
  return h(NTooltip, null, {
    trigger: () => trigger,
    default: () => content,
  })
}
const columns = [
  { title: '名称', key: 'name', align: 'center', width: 420 },
  { title: '注册用户数', key: 'reg_number', align: 'center' },
  { title: '标记用户数', key: 'user_number', align: 'center' },
  { title: 'UV', key: 'uv_number', align: 'center' },
  { title: '下单用户数', key: 'buy_number', align: 'center' },
  { title: 'GMV(元)', key: 'gmv_amount', align: 'center' },
  { title: '有效交易金额(元)', key: 'order_amount', align: 'center' },
  { title: '有效订单数', key: 'order_number', align: 'center' },
  {
    title(column) {
      return renderTooltip(
        h(
          NTag,
          {
            size: 'large',
            type: 'default',
            bordered: false,
            style: {
              backgroundColor: 'transparent',
            },
          },
          { default: () => '转化率(%)', icon: renderIcon('raphael:question', { size: 14 }) }
        ),
        '有效订单数/UV'
      )
    },
    key: 'rate_number',
    align: 'center',
    width: 110,
  },
  { title: '收益(元)', key: 'total_profit', align: 'center' },
  {
    title(column) {
      return renderTooltip(
        h(
          NTag,
          {
            size: 'large',
            type: 'default',
            bordered: false,
            style: {
              backgroundColor: 'transparent',
            },
          },
          { default: () => 'ARPU(元)', icon: renderIcon('raphael:question', { size: 14 }) }
        ),
        '收益/UV'
      )
    },
    key: 'arpu',
    align: 'center',
    width: 110,
  },
  { title: 'ID', key: 'position_id', align: 'center' },
  { title: '页面路径', key: 'path', align: 'center' },
  { title: '创建时间', key: 'create_time', align: 'center' },
  { title: '更新时间', key: 'update_time', align: 'center' },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    fixed: 'right',
    render(row) {
      const list = [
        h(
          NButton,
          {
            size: 'small',
            type: 'info',
            secondary: true,
            style: { 'margin-right': '10px' },
            onClick: () => editCoupon(row),
          },
          { default: () => '编辑', icon: renderIcon('majesticons:eye-line', { size: 14 }) }
        ),
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
      if (row.level == 1) {
        list.unshift(
          h(
            NButton,
            {
              size: 'small',
              type: 'info',
              secondary: true,
              style: { 'margin-right': '10px' },
              onClick: () => addCoupon(row),
            },
            { default: () => '添加', icon: renderIcon('majesticons:eye-line', { size: 14 }) }
          )
        )
      }
      list.unshift(
        h(
          NButton,
          {
            size: 'small',
            type: row.level == 2 ? 'success' : 'warning',
            secondary: true,
            onClick: () => lookEchart(row, row.level == 2 ? 0 : 1),
          },
          { default: () => 'echarts', icon: renderIcon('majesticons:eye-line', { size: 14 }) }
        )
      )
      return list
    },
  },
]
//提示展示
const message = useMessage()
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
      http.delete({ id: row.id }).then(function (res) {
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
/**新增活动 */
function handleAdd() {
  operateSingleRef.value.show(3)
}
/**编辑 */
function editCoupon(row) {
  operateSingleRef.value.show(2, row)
}
// 添加二级
function addCoupon(row) {
  operateSingleRef.value.show(1, row)
}
function doChange(value) {
  queryItems.value.cid = value
  refresh()
}
//查看echars折线图
function lookEchart(row, type = 0) {
  operateChartRef.value.show(row, type)
}
</script>

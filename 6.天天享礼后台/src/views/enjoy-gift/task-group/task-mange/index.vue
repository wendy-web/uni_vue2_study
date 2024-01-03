<template>
  <CommonPage :show-header="false">
    <CrudTable
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="http.getList"
      :is-pagination="false"
    >
      <template #queryBar>
        <QueryBarItem label="任务名称" :label-width="65">
          <n-input
            v-model:value="queryItems.name"
            type="text"
            placeholder="请输任务名称"
            @keydown.enter="$table?.handleSearch"
          />
        </QueryBarItem>
        <QueryBarItem label="启用状态" :label-width="65">
          <n-select v-model:value="queryItems.status" :options="options" />
        </QueryBarItem>
      </template>
    </CrudTable>
  </CommonPage>
  <!-- 扫码拉环得豆 -->
  <scanning-tab ref="scanTabRef" @refresh="refresh" />
  <!-- 换购券快过期 -->
  <coupon-expires ref="couponExpiresRef" @refresh="refresh" />
  <!-- 每日打卡 -->
  <clock-every-day ref="clockEveryDayRef" @refresh="refresh" />
  <!-- 关注公众号 -->
  <follow-official-account ref="foaRef" @refresh="refresh" />
  <!-- 趣味闯关 -->
  <funny-pass ref="funnyPassRef" @refresh="refresh" />
  <!-- 看文有奖 -->
  <reading-reward ref="readingRewardRef" @refresh="refresh" />
  <!-- 积分升级 -->
  <points-upgrade ref="pointsUpgradeRef" @refresh="refresh" />
  <!-- 星座特权 -->
  <constella-privilege ref="constellaPrivilegeRef" @refresh="refresh" />
  <!-- 幸运大转盘 -->
  <lucky-wheel ref="luckyWheelRef" @refresh="refresh" />
  <!-- 牛金豆翻倍 -->
  <cowpea-double ref="cowpeaDoubleRef" @refresh="refresh" />
  <!-- 付款提醒 -->
  <cash-withdrawal ref="cashWithdrawalRef" @refresh="refresh" />
  <!-- 点亮中国 -->
  <light-china ref="lightChinaRef"></light-china>
</template>

<script setup>
import { NButton, NSwitch } from 'naive-ui'
import { formatDateTime, renderIcon } from '@/utils'
import { useMessage } from 'naive-ui'
import http from './api'
import scanningTab from './common/scanningTab.vue'
import couponExpires from './common/couponExpires.vue'
import clockEveryDay from './common/clockEveryDay.vue'
import followOfficialAccount from './common/followOfficialAccount.vue'
import funnyPass from './common/funnyPass.vue'
import readingReward from './common/readingReward.vue'
import pointsUpgrade from './common/pointsUpgrade.vue'
import constellaPrivilege from './common/constellaPrivilege.vue'
import luckyWheel from './common/luckWheel/index.vue'
import cowpeaDouble from './common/cowpeaDouble/index.vue'
import cashWithdrawal from './common/cashWithdrawal.vue'
import lightChina from './common/lightChina.vue'
defineOptions({ name: 'TaskMangeList' })

const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})
/**启用状态下拉列表 */
const options = [
  {
    label: '已启用',
    value: 1,
  },
  {
    label: '未启用',
    value: 0,
  },
]

onMounted(() => {
  refresh()
})

function refresh() {
  $table.value?.handleSearch()
}

const columns = [
  { title: '任务名称', key: 'name', ellipsis: { tooltip: true } },
  {
    title: '修改时间',
    key: 'update_time',
    render(row) {
      return h('span', formatDateTime(row['update_time']))
    },
  },
  { title: '描述', key: 'describe', ellipsis: { tooltip: true } },
  {
    title: '启用状态',
    key: 'status',
    align: 'center',
    render(row) {
      return h(NSwitch, {
        size: 'small',
        rubberBand: false,
        value: Boolean(row['status']),
        loading: !!row.publishing,
        onUpdateValue: () => handlePublish(row),
      })
    },
  },
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
            secondary: true,
            onClick: () => opera(row, 1),
          },
          { default: () => '查看', icon: renderIcon('majesticons:eye-line', { size: 14 }) }
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            style: 'margin-left: 15px;',
            onClick: () => opera(row, 2),
          },
          { default: () => '编辑', icon: renderIcon('material-symbols:edit-outline', { size: 14 }) }
        ),
      ]
    },
  },
]
//扫码拉环得豆操作
const scanTabRef = ref(null)
//扫码拉环得豆操作
const couponExpiresRef = ref(null)
//扫每日打卡
const clockEveryDayRef = ref(null)
//关注公众号
const foaRef = ref(null)
//趣味闯关
const funnyPassRef = ref(null)
//看文有奖
const readingRewardRef = ref(null)
//积分升级
const pointsUpgradeRef = ref(null)
//星座特权
const constellaPrivilegeRef = ref(null)
//幸运大转盘
const luckyWheelRef = ref(null)
//牛金豆翻倍
const cowpeaDoubleRef = ref(null)
//付款提醒
const cashWithdrawalRef = ref(null)
//点亮中国
const lightChinaRef = ref(null)
//提示展示
const message = useMessage()
/**查看 */
function opera(row, type) {
  switch (row.tag) {
    case 'SCAN_PULL':
      scanTabRef.value.show(type, row)
      break
    case 'CARD_EXPIRE':
      couponExpiresRef.value.show(type, row, '换购券')
      break
    case 'COUPON_EXPIRE':
      couponExpiresRef.value.show(type, row, '优惠券')
      break
    case 'DAILY_SIGN':
      clockEveryDayRef.value.show(type, row)
      break
    case 'WATCH_VIDEO':
    case 'FOLLOW_EMS_CNPL':
      foaRef.value.show(type, row)
      break
    case 'QUIZ_ANSWER':
      funnyPassRef.value.show(type, row)
      break
    case 'READ_ARTICLE':
      readingRewardRef.value.show(type, row)
      break
    case 'RCREDITS_UPGRADE':
      pointsUpgradeRef.value.show(type, row)
      break
    case 'HOROSCOPE':
      constellaPrivilegeRef.value.show(type, row)
      break;
    case 'BIG_WHEEL':
    case 'BIG_WHEEL_IOS':
      luckyWheelRef.value.show(type, row)
      break
    case 'CREDITS_DOUBLE':
      cowpeaDoubleRef.value.show(type, row)
      break
    case 'PAYMENT_REMINDER':
      cashWithdrawalRef.value.show(type, row)
      break
    case 'MINI_PROGRAM':
      lightChinaRef.value.show(type, row)
      break
  }
}
//状态启用
function handlePublish(row) {
  http
    .updateStatus({
      task_id: row.id,
      status: Number(!Boolean(row.status)),
    })
    .then((res) => {
      if (res.code == 1) {
        message.success(res.msg)
        $table.value?.handleSearch()
      } else {
        message.error(res.msg)
      }
    })
}
</script>

<template>
  <CommonPage show-footer title="价格管理">
    <template #action>
      <n-button type="primary" @click="handleAdd">
        <TheIcon icon="material-symbols:add" :size="18" class="mr-5" /> 添加
      </n-button>
    </template>
    <CrudTable
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="http.getList"
      :is-pagination="true"
    >
      <template #queryBar>
        <QueryBarItem label="品牌" :label-width="65">
          <n-select v-model:value="queryItems.tag" :options="statusOptions" />
        </QueryBarItem>
      </template>
    </CrudTable>
  </CommonPage>
  <operat-single ref="operatSingleRef" @refresh="refresh" />
</template>

<script setup>
import { renderIcon } from '@/utils';
import { NButton, useDialog, useMessage } from 'naive-ui';
import http from './api';
import operatSingle from './operatSingle.vue';
import { statusOptions } from './options';
defineOptions({ name: 'SCleRule' })
//表格操作
const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})

onMounted(() => {
  refresh()
})

function refresh() {
  $table.value?.handleSearch()
}

const columns = [
  {
    title: '品牌',
    key: 'tag',
    align: 'center',
    render(row, index) {
      return [
        '乐刷',
        '京东',
        '海威',
        '千猪',
        '拼多多',
        '心链',
        '聚推客-库迪',
        '1分购',
        '聚推客-奈雪的茶',
        '聚推客-瑞幸',
        '聚推客-必胜客',
        '聚推客-麦当劳',
        '聚推客-星巴克',
        '聚推客-肯德基',
        '聚推客-电影',
        '聚推客-打车出行',
        '橙券',
      ][row.tag - 1]
    },
  },
  {
    title: '小店一级分佣%',
    key: 'one_scale',
    align: 'center',
    render(row, index) {
      return row.one_scale || 0
    },
  },
  {
    title: '小店团长分佣%',
    key: 'two_scale',
    align: 'center',
    render(row, index) {
      return row.two_scale || 0
    },
  },
  {
    title: '天天返利分佣(非省钱卡)%',
    key: 'user_scale',
    align: 'center',
    render(row, index) {
      return row.user_scale || 0
    },
  },
  {
    title: '天天返利分佣(省钱卡)%',
    key: 'vip_scale',
    align: 'center',
    render(row, index) {
      return row.vip_scale || 0
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
    },
  },
]
//优惠券操作
const operatSingleRef = ref(null)
//提示展示
const message = useMessage()
/**查看 */
function lookCoupon(row) {
  operatSingleRef.value.show(1, row)
}
/**编辑 */
function editCoupon(row) {
  operatSingleRef.value.show(2, row)
}
/**新增活动 */
function handleAdd() {
  operatSingleRef.value.show(3)
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
</script>

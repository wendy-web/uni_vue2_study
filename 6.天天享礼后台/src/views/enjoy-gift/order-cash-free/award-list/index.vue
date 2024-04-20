<template>
  <CommonPage show-footer title="奖品列表">
    <template #action>
      <n-button type="primary" @click="handleAdd">
        <TheIcon icon="material-symbols:add" :size="18" class="mr-5" /> 新增
      </n-button>
    </template>
    <CrudTable
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="http.giftList"
      :extra-params="extraParams"
    >
      <!-- <template #queryBar>
        <QueryBarItem label="商品名称" :label-width="80">
          <n-input
            v-model:value="queryItems.title"
            type="text"
            placeholder="请输商品名称"
            clearable
            @keydown.enter="$table?.handleSearch"
          />
        </QueryBarItem>
        <QueryBarItem label="启用状态" :label-width="80">
          <n-select v-model:value="queryItems.status" :options="lsStatusOptions" clearable />
        </QueryBarItem>
      </template> -->
    </CrudTable>
  </CommonPage>
  <!-- 优惠券操作 -->
  <operat-goods ref="operatGoodsRef" @refresh="refresh" />
</template>

<script setup>
import { renderIcon } from '@/utils';
import { NButton, NImage, useDialog, useMessage } from 'naive-ui';
import http from './api';
import operatGoods from './operatGoods/index.vue';
defineOptions({ name: 'GoodsList' })
//表格操作
const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})
const extraParams = {
  isExport: false,
}
onMounted(() => {
  refresh()
})

function refresh() {
  $table.value?.handleRefreshCurr()
}

const columns = [
  { title: '商品ID', key: 'id', align: 'center', fixed: 'left' },
  { title: '商品名称', key: 'title', align: 'center' },
  {
    title: '商品图片',
    key: 'img',
    align: 'center',
    render(row, index) {
      return h(NImage, {
        width: '100',
        src: row.img,
      })
    },
  },
  { title: '奖品销售价格', key: 'price', align: 'center' },
  { title: '奖品成本价格', key: 'cost_price', align: 'center' },
  { title: '排序值', key: 'sort', align: 'center' },
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
// 新增
function handleAdd() {
  operatGoodsRef.value.show(3)
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
      http.groupDelete({ id: row.id }).then(function (res) {
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
</script>

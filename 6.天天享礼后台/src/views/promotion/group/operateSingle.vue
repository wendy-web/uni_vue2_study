<template>
  <n-drawer v-model:show="showModal" :width="drawerWidth">
    <n-drawer-content title="待发列表" closable>
      <div class="mb-20 flex justify-between">
        <div class="flex">
          <div class="flex">
            <n-select
              v-model:value="lxTypeValue"
              :options="lxTypeOptions"
              style="width: 200px"
              label-field="label"
              value-field="path"
            />
            <n-button type="primary" class="mr-5 ml-5" @click="gotoMerchandise">
              <TheIcon icon="bxs:add-to-queue" :size="18" class="mr-5" /> 选品
            </n-button>
          </div>
        </div>
        <div class="flex">
          <n-button
            type="primary"
            style="margin-right: 20px; background: #18a058ff"
            @click="importGoods"
          >
            <TheIcon icon="majesticons:eye-line" :size="18" class="mr-5" /> 导入首页苹果、安卓分组商品
          </n-button>
          <n-button type="warning" class="mr-5" @click="queueDelList">
            <TheIcon icon="fa6-regular:trash-can" :size="18" class="mr-5" /> 清空代发
          </n-button>
          <n-button type="info" class="mr-5" @click="updateTable">
            <TheIcon icon="fa6-solid:arrow-rotate-right" :size="18" class="mr-5" /> 更新
          </n-button>
        </div>
      </div>
      <CrudTable
        ref="$table"
        v-model:query-items="queryItems"
        :max-height="1000"
        :scroll-x="1200"
        row-key="old_skuId"
        :columns="columns"
        :edit-key-value="inputExtendWord"
        :get-data="http.queueList"
      >
      </CrudTable>
    </n-drawer-content>
  </n-drawer>
</template>
<script setup>
import { renderIcon } from '@/utils';
import { NButton, NImage, NInput, NInputNumber, useMessage, useDialog } from 'naive-ui';
import { ref, watch } from 'vue';
import http from './api';
/** 自定义单元格 */
const dialog = useDialog()
/**抽屉宽度 */
const drawerWidth = window.innerWidth - 220 + 'px'
/**弹窗显示控制 */
const showModal = ref(false)
const queryItems = ref({})
const lxTypeValue = ref('merchandise/merchandiseJD')
// 类型
const lxTypeOptions = [
  {
    label: '京东',
    path: 'merchandise/merchandiseJD',
  },
  {
    label: '拼多多',
    path: 'merchandise/merchandisePDD',
  },
]
const message = useMessage()
const inputExtendWord = ref(null)
//优惠券列表选择相关
const columns = [
  {
    title: '商品ID',
    key: 'id',
    align: 'center',
    width: 120,
    fixed: 'left',
    size: 'large',
  },
  {
    title: '商品图片',
    key: 'goods_image',
    align: 'center',
    width: 110,
    render(row, index) {
      return h(NImage, {
        width: 110,
        src: row.goods_image,
      })
    },
  },
  {
    title: '商品内容(不可修改)',
    key: 'normal_content',
    size: 'large',
    align: 'center',
    render(row, index) {
      return h(NInput, {
        value: row.normal_content,
        type: 'textarea',
        style: {
          margin: '0 10px',
          'text-align': 'left',
        },
        // disabled: true,
        autosize: { minRows: 5, maxRows: 5 },
      })
    },
  },
  {
    title: '商品标题',
    key: 'goods_name',
    size: 'large',
    align: 'center',
    render(row, index) {
      return h(NInput, {
        value: row.goods_name || '',
        type: 'textarea',
        autosize: { minRows: 5, maxRows: 5 },
        style: {
          'text-align': 'left',
        },
        onUpdateValue(updateValue) {
          inputExtendWord.value = {
            index,
            key: 'goods_name',
            value: updateValue,
          }
        },
        async onBlur($event) {
          const inputValue = $event.target.value
          console.log('inputValue', inputValue)
          const { id } = row
          const params = {
            group_id: queryItems.value.group_id,
            id,
            goods_name: inputValue,
            do_type: 2
          }
          updateQueueEdit(params)
        },
      })
    },
  },
  {
    title: '商品券后价',
    key: 'coupon_price',
    size: 'large',
    align: 'center',
    render(row, index) {
      return h(NInput, {
        value: row.coupon_price || '',
        type: 'input',
        style: {
          'text-align': 'center',
          'width': '120px',
        },
        onUpdateValue(updateValue) {
          inputExtendWord.value = {
            index,
            key: 'coupon_price',
            value: updateValue,
          }
        },
        async onBlur($event) {
          const inputValue = $event.target.value
          console.log('inputValue', inputValue)
          const { id } = row
          const params = {
            group_id: queryItems.value.group_id,
            id,
            coupon_price: inputValue,
            do_type: 3
          }
          updateQueueEdit(params)
        },
      })
    },
  },
  {
    title: '附加文案',
    key: 'extend_word',
    size: 'large',
    align: 'center',
    render(row, index) {
      return h(NInput, {
        value: row.extend_word || '',
        type: 'textarea',
        autosize: { minRows: 5, maxRows: 5 },
        style: {
          'text-align': 'left',
        },
        onUpdateValue(updateValue) {
          inputExtendWord.value = {
            index,
            key: 'extend_word',
            value: updateValue,
          }
        },
        async onBlur($event) {
          const inputValue = $event.target.value
          console.log('inputValue', inputValue)
          const { id } = row
          const params = {
            group_id: queryItems.value.group_id,
            id,
            extend_word: inputValue,
            do_type: 1
          }
          updateQueueEdit(params)
        },
      })
    },
  },
  {
    title: '商品来源',
    key: 'lx_type',
    size: 'large',
    align: 'center',
    width: 120,
    render(row, index) {
      return row.lx_type == 2 ? '京东' : '拼多多'
    },
  },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    fixed: 'right',
    render(row, index) {
      const list = [
        h(
          NButton,
          {
            size: 'tiny',
            type: 'primary',
            secondary: true,
            style: {
              'margin-right': '10px',
            },
            onClick: () => {
              const { id } = row
              const params = {
                group_id: queryItems.value.group_id,
                id,
                is_top: 1,
              }
              updateQueueEdit(params)
            },
          },
          { icon: renderIcon('typcn:arrow-up-thick', { size: 14 }) }
        ),
        h(NInputNumber, {
          value: row.sort,
          min: 0,
          size: 'tiny',
          style: {
            'margin-right': '10px',
            width: '90px',
            display: 'inline-block',
          },
          onUpdateValue(value) {
            inputExtendWord.value = {
              index,
              key: 'sort',
              value,
            }
          },
          onBlur($event) {
            const inputValue = $event.target.value
            const { id } = row
            const params = {
              group_id: queryItems.value.group_id,
              id,
              sort: inputValue || 0,
            }
            updateQueueEdit(params)
          },
        }),
        // h(
        //   NButton,
        //   {
        //     size: 'tiny',
        //     type: 'primary',
        //     style: {
        //       'margin-right': '10px',
        //     },
        //     secondary: true,
        //     onClick: () => {},
        //   },
        //   { icon: renderIcon('typcn:arrow-down-thick', { size: 14 }) }
        // ),
        h(
          NButton,
          {
            type: 'warning',
            size: 'tiny',
            secondary: true,
            style: { 'margin-left': '10px' },
            onClick: async () => {
              $dialog.confirm({
                title: '提示',
                type: 'info',
                content: '确认删除该商品？',
                confirm: async () => {
                  const { id } = row
                  const params = {
                    group_id: queryItems.value.group_id,
                    id,
                  }
                  const res = await http.queueDel(params)
                  if (!res.code) return message.error(res.msg)
                  message.success(res.msg)
                  $table.value?.handleSearch()
                },
              })
            },
          },
          { default: () => '删除', icon: renderIcon('fa6-regular:trash-can', { size: 14 }) }
        ),
      ]
      return list
    },
  },
]
async function updateQueueEdit(params) {
  const res = await http.queueEdit(params)
  if (!res.code) return message.error(res.msg)
  message.success(res.msg)
  $table.value?.handleSearch()
}
/**回调父组件函数注册 */
const emit = defineEmits(['refresh', 'close'])

/**展示弹窗 */
const $table = ref(null)
async function show(id) {
  showModal.value = true
  queryItems.value.group_id = id
  await nextTick()
  $table.value?.handleSearch()
}
function updateTable() {
  $table.value?.handleSearch()
}
function queueDelList() {
  dialog.warning({
    title: '警告',
    content: '确定全部清空？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: function () {
      http.queueDel({group_id: queryItems.value.group_id, del_all: 1}).then(function (res) {
        if (res.code == 1) {
          message.success(res.msg)
          $table.value?.handleSearch()
        } else {
          message.error(res.msg)
        }
      })
    }
  })
}
function importGoods() {
  dialog.warning({
    title: '警告',
    content: '确定导入？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: function () {
      http.importGoods({id: queryItems.value.group_id}).then(function (res) {
        if (res.code == 1) {
          message.success(res.msg)
          $table.value?.handleSearch()
        } else {
          message.error(res.msg)
        }
      })
    }
  })
}
watch(
  () => showModal.value,
  (newValue) => {
    if (newValue) return
    emit('close')
  }
)
const router = useRouter()
function gotoMerchandise() {
  router.push({ path: lxTypeValue.value })
}
/**暴露给父组件使用 */
defineExpose({
  show,
})
</script>
<style scoped></style>

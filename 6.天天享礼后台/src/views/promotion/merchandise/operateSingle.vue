<template>
  <n-drawer v-model:show="showModal" :width="drawerWidth">
    <n-drawer-content title="添加列表" closable>
      <n-form
        ref="formRef"
        :model="model"
        :rules="rules"
        label-placement="left"
        label-width="140px"
        require-mark-placement="right-hanging"
      >
        <n-form-item label="群名称" path="group_id">
          <n-checkbox-group v-if="pageOptions?.length" v-model:value="model.group_id">
            <n-button type="primary" class="mb-5" @click="allCheckOut">
              <TheIcon icon="bxs:message-square-check" :size="18" class="mr-5" />
              {{ model.group_id.length >= pageOptions.length ? '取消全选' : '全选' }}
            </n-button>
            <n-space item-style="display: flex;">
              <n-checkbox v-for="item in pageOptions" :key="item.id" :value="item.id" :label="item.group_name" />
            </n-space>
          </n-checkbox-group>
          <span v-else>请前往群管理 - 开启群状态</span>
        </n-form-item>
        <n-form-item label="商品列表" path="group">
          <n-data-table
            ref="tableRef"
            :scroll-x="drawerWidth - 140"
            :columns="columns"
            :data="tableData"
            max-height="820px"
          />
        </n-form-item>
        <div flex justify-center w-1000>
          <n-button mr-10 @click="closeModel"> 关闭 </n-button>
          <n-button v-if="modalType !== 1" type="info" @click="handleValidate">确认添加 </n-button>
        </div>
      </n-form>
    </n-drawer-content>
  </n-drawer>
</template>
<script setup>
import { renderIcon } from '@/utils';
import { NButton, NImage, NInput, NInputNumber, useMessage } from 'naive-ui';
import { ref, watch } from 'vue';
import http from './api';
const props = defineProps({
  lxType: String,
})
const pageOptions = ref([])
/**抽屉宽度 */
const drawerWidth = window.innerWidth - 520 + 'px'
/**弹窗显示控制 */
const showModal = ref(false)
const model = ref({
  group_id: [],
  group: [],
})

const tableData = ref([])
const formRef = ref(null)
const message = useMessage()

const rules = ref({
  group_id: {
    required: true,
    message: '请选择加入群',
  },
})
/**关闭弹窗 */
function closeModel() {
  showModal.value = false
}
//优惠券列表选择相关
const columns = [
  {
    title: '商品ID',
    key: `${props.lxType == 'jd' ? 'itemId' : 'goods_sign'}`,
    align: 'center',
    width: 220,
    fixed: 'left',
    size: 'large',
  },
  {
    title: '商品图片',
    key: 'image',
    align: 'center',
    width: '120',
    fixed: 'left',
    render(row, index) {
      return h(NImage, {
        width: 110,
        'object-fit': 'cover',
        src: row.image,
      })
    },
  },
  {
    title: '商品名称',
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
          tableData.value[index].goods_name  = updateValue
        },
        async onBlur($event) {},
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
        autosize: { minRows: 5, maxRows: 5 },
        style: {
          'text-align': 'center',
          'width': '120px'
        },
        onUpdateValue(updateValue) {
          tableData.value[index].coupon_price  = updateValue
        },
        async onBlur($event) {},
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
          tableData.value[index].extend_word = updateValue
        },
        async onBlur($event) {},
      })
    },
  },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    fixed: 'right',
    width: 300,
    style: {
      'align-items': 'center',
    },
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
              console.log('first', row.current_index)
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
          min: 0,
          size: 'tiny',
          style: {
            'margin-right': '10px',
            width: '90px',
            display: 'inline-block',
          },
          onUpdateValue(value) {
            const currentIndex = row.current_index
            tableData.value[currentIndex]._index = value
          },
          onBlur($event) {
            // const inputValue = $event.target.value
            const currInputIndex = row.current_index
            const inputValue = row._index - 1
            if (currInputIndex === inputValue) return
            const currData = tableData.value[currInputIndex]
            const targetIndex = tableData.value[inputValue]
            tableData.value.splice(currInputIndex, 1)
            tableData.value.splice(inputValue, 0, currData)
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
          { icon: renderIcon('typcn:arrow-down-thick', { size: 14 }) }
        ),
        h(
          NButton,
          {
            type: 'warning',
            size: 'tiny',
            secondary: true,
            style: { 'margin-left': '10px' },
            onClick: async () => {
              tableData.value.splice(index, 1)
            },
          },
          { default: () => '删除', icon: renderIcon('fa6-regular:trash-can', { size: 14 }) }
        ),
      ]
      return list
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
const emit = defineEmits(['refresh', 'close'])

/**展示弹窗 */
async function show(group) {
  showModal.value = true
  // id && (model.value.group_id = id)
  tableData.value = group.map((item, index) => {
    return {
      ...item,
      _index: index + 1,
      current_index: index,
    }
  })
}
function allCheckOut() {
  if (model.value.group_id.length == pageOptions.value.length) return (model.value.group_id = [])
  model.value.group_id = pageOptions.value.map((item) => item.id)
}
onMounted(async () => {
  const res = await http.groupList({ get_all: 1 })
  if (!res.code || !res.data) return
  pageOptions.value = res.data.list
  model.value.group_id = res.data.list.map((res) => res.id)
})
watch(
  () => showModal.value,
  (newValue) => {
    if (newValue) return
    emit('close')
  }
)
/**表单验证 */
function handleValidate() {
  if (!tableData.value.length) return (showModal.value = false)
  formRef.value?.validate(async (errors) => {
    if (errors) return
    const params = {
      group_id: model.value.group_id,
      group: tableData.value.map((item) => {
        const listItem = {
          extend_word: item.extend_word,
          goods_name: item.goods_name,
          coupon_price: item.coupon_price,
        }
        if (props.lxType == 'jd') {
          listItem.itemId = item.itemId
        } else {
          listItem.goods_sign = item.goods_sign
        }
        return listItem
      }),
    }
    const res = await http.queueCreate(params)
    if (res.code == 1) {
      message.success(res.msg)
      emit('refresh')
      showModal.value = false
      // router.push({ path: '/group', query: { groupId: model.value.group_id } })
    } else {
      message.error(res.msg)
    }
  })

  return false
}
/**暴露给父组件使用 */
defineExpose({
  show,
})
</script>
<style scoped></style>

<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    preset="dialog"
    :title="operateTitle"
    :style="{ width: '800px' }"
    positive-text="确认"
    negative-text="取消"
    @positive-click="handleValidateButtonClick"
    @negative-click="onNegativeClick"
  >
    <n-form
      ref="formRef"
      :model="model"
      label-placement="left"
      label-width="100px"
      require-mark-placement="right-hanging"
      :rules="rules"
      :style="{
        maxWidth: '1200px',
      }"
    >
      <QueryBarItem label="订单编号:" class="mt-40" :content-width="340">
        <!-- <n-input v-model:value="model.order_number" :disabled="true" clearable /> -->
        {{ model.order_number }}
      </QueryBarItem>
      <div class="flex mb-20 mt-10">
        <n-image width="80" height="80" src="图片加载失败" :fallback-src="model.goods_image" />
        <div class="ml-20 flex flex-col justify-between">
          <div class="fw-bold">{{ model.goods_name }}</div>
          <div>
            ￥{{ model.price }} <text class="ml-10 color-gray">x{{ model.buy_num }}</text>
          </div>
        </div>
      </div>
      <block v-if="modelType == 3">
        <QueryBarItem label="实付金额:">
          <div class="fw-bold color-red-6">￥{{ model.pay_price }}</div>
        </QueryBarItem>
        <QueryBarItem label="退回金额:" mt-10>
          <div class="fw-bold color-red-6">￥{{ model.pay_price }}</div>
        </QueryBarItem>
        <QueryBarItem label="退款方式:" mt-10>
          <div class="fw-bold">原路退回</div>
        </QueryBarItem>
      </block>
      <block v-else>
        <QueryBarItem label="物流公司" path="company" :label-width="80" :content-width="340">
          <n-select v-model:value="model.company" :options="companyTypeOptions" />
        </QueryBarItem>
        <QueryBarItem label="快递单号" path="tracking_number" :content-width="340" class="mt-20">
          <n-input
            v-model:value="model.tracking_number"
            type="text"
            placeholder="请输入快递单号"
            @keydown.enter="$table?.handleSearch"
          />
        </QueryBarItem>
      </block>
    </n-form>
  </n-modal>
</template>
<script setup>
import { useMessage } from 'naive-ui';
import { ref } from 'vue';
import http from '../api';

/**弹窗显示控制 */
const showModal = ref(false)
/**弹窗取消 */
function onNegativeClick() {}
/**表单 */
const formRef = ref(null)
//提示展示
const message = useMessage()
//表单数据
const model = ref({})
const operateTitle = ref('订单退款（谨慎操作，一经退款不可撤回）')
const modelType = ref(1)
const rowId = ref(0)
const orderApi = computed(() => (modelType.value == 3 ? 'orderRefund' : 'orderSend'))
const props = defineProps({
  companyTypeOptions: {
    type: Array,
    default: [],
  },
})
const rules = ref({
  tracking_number: [
    {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入快递单号',
    },
  ],
  company: [
    {
      required: true,
      message: '请选择物流公司',
    },
  ],
})

/**表单验证 */
async function handleValidateButtonClick() {
  formRef.value?.validate(async (errors) => {
    if (errors) return
    /** 还原数据 */
    const params = { id: rowId.value }
    if (modelType.value < 3) {
      params.company = model.value.company
      params.tracking_number = model.value.tracking_number
    }
    const res = await http[orderApi.value](params)
    if (res.code == 1) {
      message.success(res.msg)
      emit('refresh')
      showModal.value = false
    } else {
      message.error(res.msg)
    }
  })

  return false
}

async function show(id, type = 0) {
  rowId.value = id
  modelType.value = type
  operateTitle.value = ['订单发货', '修改物流', '订单退款（谨慎操作，一经退款不可撤回）'][type - 1]
  model.value = {}
  if (id) {
    model.value.id = id
    const res = await http.orderXq({ id })
    if (!res.code) return
    const { order_number, goods_image, price, pay_price, goods_name, buy_num, company, tracking_number } = res.data
    model.value = {
      order_number,
      goods_image,
      price,
      pay_price,
      goods_name,
      buy_num,
      company,
      tracking_number,
    }
  }
  showModal.value = true
}

/**暴露给父组件使用 */
defineExpose({
  show,
})
/**回调父组件函数注册 */
const emit = defineEmits(['refresh'])
</script>
<style scoped>
.pos_lab {
  position: absolute;
  top: 100%;
  color: #666;
  font-size: 3rem;
  text-align: right;
}
</style>

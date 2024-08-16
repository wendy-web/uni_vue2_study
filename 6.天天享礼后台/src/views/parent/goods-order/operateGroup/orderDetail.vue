<template>
  <n-drawer v-model:show="showModal" :width="drawerWidth">
    <n-drawer-content :title="contextTitle" closable>
      <div style="background-color: #f0f8ff" pl-12 h-40 flex items-center mb-10 font-600>订单概况</div>
      <div class="flex contFlex">
        <div w-600 class="flex">
          <text w-100 mb-20 fw-bold text-align-right mr-10 class="lab_text">订单号:</text>
          {{ model.order_number }}
        </div>
        <div w-600 class="flex">
          <text w-100 mb-20 fw-bold text-align-right mr-10 class="lab_text">下单时间:</text>
          {{ model.create_time }}
        </div>
        <div w-600 class="flex">
          <text w-100 mb-20 fw-bold text-align-right mr-10 class="lab_text">订单状态:</text>
          {{ statusTxt }}
        </div>
        <div w-600 class="flex">
          <text w-100 mb-20 fw-bold text-align-right mr-10 class="lab_text">用户ID:</text>
          {{ model.user_id }}
        </div>
        <div w-600 class="flex">
          <text w-100 mb-20 fw-bold text-align-right mr-10 class="lab_text">昵称:</text>
          {{ model.nick_name }}
        </div>
        <div w-600 class="flex">
          <text w-100 mb-20 fw-bold text-align-right mr-10 class="lab_text">订单金额(元):</text>
          ￥{{ model.price }}
        </div>
        <div w-600 class="flex">
          <text w-100 mb-20 fw-bold text-align-right mr-10 class="lab_text">支付金额:</text>
          ￥{{ model.pay_price }}
        </div>
        <div w-600 class="flex">
          <text w-100 mb-20 fw-bold text-align-right mr-10 class="lab_text">支付时间:</text>
          {{ model.pay_date }}
        </div>

        <div v-if="model.status == 2" w-600 class="flex">
          <text w-100 mb-20 fw-bold text-align-right mr-10 class="lab_text">完成时间:</text>
          {{ model.over_date }}
        </div>
        <block v-if="model.status == 6">
          <div w-600 class="flex">
            <text w-100 mb-20 fw-bold text-align-right mr-10 class="lab_text">退款金额:</text>
            ￥{{ model.pay_price }}
          </div>
          <div w-600 class="flex">
            <text w-100 mb-20 fw-bold text-align-right mr-10 class="lab_text">退款时间:</text>
            {{ model.refund_date }}
          </div>
        </block>
      </div>
      <div mt-40 style="background-color: #f0f8ff" pl-12 h-40 flex items-center mb-10 font-600>收货人信息</div>
      <div class="flex contFlex">
        <div w-600 class="flex">
          <text w-100 mb-20 fw-bold text-align-right mr-10 class="lab_text">收货人:</text>
          <div ref="nameRefs">{{ model.name }}</div>
          <n-button ref="copyBtn" strong secondary type="info" size="small" ml-10 @click="copyHandle(model.name, '1')">
            复制
          </n-button>
        </div>
        <div w-600 class="flex">
          <text w-100 mb-20 fw-bold text-align-right mr-10 class="lab_text">手机号:</text>
          {{ model.mobile }}
          <n-button ref="copyBtn" strong secondary type="info" size="small" ml-10 @click="copyHandle(model.mobile)">
            复制
          </n-button>
        </div>
        <div w-600 class="flex">
          <text w-100 mb-20 fw-bold text-align-right mr-10 class="lab_text">收货地址:</text>
          {{ model.address }}
          <n-button ref="copyBtn" strong secondary type="info" size="small" ml-10 @click="copyHandle(model.address)">
            复制
          </n-button>
        </div>
      </div>
      <div mt-40 style="background-color: #f0f8ff" pl-12 h-40 flex items-center mb-10 font-600>
        物流信息
        <n-button ref="copyBtn" strong secondary type="info" size="small" ml-10 @click="copyAddressHandle">
          复制
        </n-button>
      </div>
      <div class="contFlex">
        <div w-600 class="flex">
          <text w-100 mb-20 fw-bold text-align-right mr-10 class="lab_text">物流公司:</text>
          {{ addressTxt }}
        </div>
        <div w-600 class="flex">
          <text w-100 mb-20 fw-bold text-align-right mr-10 class="lab_text">快递单号:</text>
          {{ model.tracking_number }}
        </div>
        <div w-600 class="flex">
          <text w-100 mb-20 fw-bold text-align-right mr-10 class="lab_text">发货时间:</text>
          {{ model.delivery_time }}
        </div>
      </div>

      <div mt-40 style="background-color: #f0f8ff" pl-12 h-40 flex items-center mb-10 font-600>商品信息</div>
      <n-table :bordered="false" :single-line="false">
        <thead>
          <tr>
            <th>商品ID</th>
            <th>商品名称</th>
            <th>原价(￥)</th>
            <th>售价(￥)</th>
            <th>购买数量</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ model.goods_id }}</td>
            <td>{{ model.goods_name }}</td>
            <td>{{ model.price }}</td>
            <td>{{ model.pay_price }}</td>
            <td>{{ model.buy_num }}</td>
          </tr>
        </tbody>
      </n-table>
    </n-drawer-content>
  </n-drawer>
</template>
<script setup>
import { useMessage } from 'naive-ui';
import { ref } from 'vue';
import useClipboard from 'vue-clipboard3';
import http from '../api';
import { statusOptions } from '../options';
/**抽屉宽度 */
const drawerWidth = window.innerWidth - 220 + 'px'
/**弹窗显示控制 */
const showModal = ref(false)
const message = useMessage()
const contextTitle = ref('')
//表单数据
const model = ref({})
/**回调父组件函数注册 */
const emit = defineEmits(['refresh', 'close'])
const statusTxt = computed(() => statusOptions.find((entry) => entry.value == model.value.status)?.label)

const props = defineProps({
  companyTypeOptions: {
    type: Array,
    default: [],
  },
})
let copyBtn = ref(null) //定义按钮的dom对象
const addressTxt = computed(() => props.companyTypeOptions.find((entry) => entry.value == model.value.company)?.label)
const { toClipboard } = useClipboard()
const nameRefs = ref(null)
async function copyHandle(cont) {
  try {
    // 复制
    await toClipboard(cont, copyBtn.value.$el)
    message.success('复制成功')
    // 复制成功
  } catch (e) {
    // 复制失败
    message.error('复制失败')
  }
}

async function copyAddressHandle() {
  const addressCopy = `
    物流公司:${addressTxt.value}
    快递单号:${model.value.tracking_number}
    发货时间:${model.value.delivery_time}
    `
  copyHandle(addressCopy)
}
async function show(id) {
  const res = await http.orderXq({ id })
  if (!res.code) return
  const {
    order_number,
    create_time,
    status,
    user_id,
    nick_name,
    price,
    pay_price,
    pay_date,
    over_date,
    refund_date,
    name,
    mobile,
    address,
    company,
    goods_name,
    buy_num,
    tracking_number,
    delivery_time,
    goods_id,
  } = res.data
  model.value = {
    order_number,
    create_time,
    status,
    user_id,
    nick_name,
    price,
    pay_price,
    pay_date,
    over_date,
    refund_date,
    name,
    mobile,
    address,
    company,
    goods_name,
    buy_num,
    company,
    tracking_number,
    delivery_time,
    goods_id,
  }
  contextTitle.value = statusOptions.find((entry) => entry.value == status)?.label
  showModal.value = true
}
/**暴露给父组件使用 */
defineExpose({
  show,
})
</script>
<style scoped lang="scss">
.lab_text {
  text-align: right;
}
.contFlex {
  flex-wrap: wrap;
}
.contFlex .flex {
  width: 30%;
  flex: 0 0 30%;
}
</style>

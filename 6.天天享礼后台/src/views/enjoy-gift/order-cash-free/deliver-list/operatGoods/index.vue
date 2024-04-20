<template>
  <n-drawer v-model:show="showModal" :default-width="drawerWidth" resizable>
    <n-drawer-content :title="modalTitle" closable>
      <n-form
        ref="formRef"
        :model="model"
        :rules="rules"
        label-placement="left"
        label-width="140px"
        require-mark-placement="right-hanging"
      >
        <n-form-item label="收货人" path="username" w-400>
          <n-input v-model:value="model.username" :disabled="modalType === 1" />
        </n-form-item>
        <n-form-item label="联系电话" path="mobile" w-400>
          <n-input v-model:value="model.mobile" :disabled="modalType === 1" />
        </n-form-item>
        <n-form-item label="收货地区" path="area" w-400>
          <n-input v-model:value="model.area" :disabled="modalType === 1" />
        </n-form-item>
        <n-form-item label="详细地址" path="address" w-400>
          <n-input v-model:value="model.address" :disabled="modalType === 1" />
        </n-form-item>
        <n-form-item label="物流公司" path="logistics_company" w-400>
          <n-input v-model:value="model.logistics_company" :disabled="modalType === 1" />
        </n-form-item>
        <n-form-item label="物流单号" path="logistics_number" w-400>
          <n-input v-model:value="model.logistics_number" :disabled="modalType === 1" />
        </n-form-item>
        <div flex justify-center w-1000>
          <n-button mr-10 @click="closeModel"> 关闭 </n-button>
          <n-button v-if="modalType !== 1" type="info" @click="handleValidate"> 保存 </n-button>
        </div>
      </n-form>
    </n-drawer-content>
  </n-drawer>
</template>
<script setup>
import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import { NButton, NInputNumber, useMessage } from 'naive-ui';
import { onBeforeUnmount, ref } from 'vue';
import http from '../api';
/**弹窗显示控制 */
const showModal = ref(false)

/**抽屉宽度 */
const drawerWidth = window.innerWidth - 220 + 'px'
/**弹窗类型 1.查看 2.修改 3新增*/
const modalType = ref(1)
let id = 0
const modalTitle = ref('')
//提示展示
const message = useMessage()
/**表单 */
const formRef = ref(null)
//表单数据
const model = ref({})

//校验数据
const rules = ref({
  logistics_company: {
    required: true,
    trigger: ['blur', 'input'],
    message: '物流公司不能为空',
  },
  logistics_number: {
    required: true,
    trigger: ['blur', 'input'],
    message: '物流单号不能为空',
  }
})

/**展示弹窗 */
function show(operateType, data) {
  id = data?.id
  modalType.value = operateType
  modalTitle.value = ['查看', '编辑'][operateType - 1]
  init()
}
onMounted(() => {})
// 该列表的初始化
async function init() {
  if (modalType.value != 3) {
    const res = await http.giftXq({ id: id })
    let { username, mobile, area, address, logistics_company, logistics_number } = res.data
    model.value = {
      username,
      mobile,
      area,
      address,
      logistics_company,
      logistics_number
    }
  }
  showModal.value = true
}
// 关闭弹窗
function closeModel() {
  showModal.value = false
}

/**校验表单 */
function handleValidate() {
  formRef.value?.validate(async (errors) => {
    if (errors) return
    let { username, mobile, area, address, logistics_company, logistics_number } = model.value
    const params = {
      id: id,
      username,
      mobile,
      area,
      address,
      logistics_company,
      logistics_number
    }
    console.log('params', params)
    const res = await http.giftCreate(params)
    if (res.code == 1) {
      message.success(res.msg)
      emit('refresh')
      showModal.value = false
      return
    }
    message.error(res.msg)
  })
}
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {})
/**暴露给父组件使用 */
defineExpose({
  show,
})
/**回调父组件函数注册 */
const emit = defineEmits(['refresh'])
</script>
<style lang="scss"></style>

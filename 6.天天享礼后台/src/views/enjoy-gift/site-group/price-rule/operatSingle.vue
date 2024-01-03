<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    preset="dialog"
    :title="modalTitle"
    :positive-text="modalType === 1 ? '' : '确认'"
    negative-text="关闭"
    :style="{
      width: '800px',
    }"
    @positive-click="handleValidateButtonClick"
    @negative-click="onNegativeClick"
  >
    <n-form
      ref="formRef"
      :model="model"
      :rules="rules"
      label-placement="left"
      label-width="120px"
      require-mark-placement="right-hanging"
      :style="{
        maxWidth: '800px',
      }"
    >
      <n-form-item label="品牌" path="type">
        <n-select
                v-model:value="model.type"
                :options="pageOptions"
                :disabled="modalType === 1"
                style="width: 200px"
        />
      </n-form-item>
      <n-form-item label="价格类型" path="price_index">
        <n-radio-group
                v-model:value="model.price_index"
                name="radiogroup"
                :disabled="modalType === 1"
                @change="typeChange"
        >
          <n-space>
            <n-radio v-for="song in songs" :key="song.value" :value="song.value">
              {{ song.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
      <n-form-item label="增幅数值" path="price" w-400 v-if="model.price_index == 0">
        <n-input-number v-model:value="model.price" :disabled="modalType === 1" />
      </n-form-item>
      <n-form-item label="增幅百分比" path="price_lv" w-400 v-if="model.price_index == 1">
        <n-input-number v-model:value="model.price_lv" :disabled="modalType === 1" /> %
      </n-form-item>
    </n-form>
  </n-modal>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import http from './api'

/**弹窗显示控制 */
const showModal = ref(false)
/**弹窗类型 1.查看 2.修改,3.新增*/
const modalType = ref(3)
const modalTitle = ref('新增')
/**弹窗取消 */
function onNegativeClick() {}
/**表单 */
const formRef = ref(null)
//提示展示
const message = useMessage()
//表单数据
const model = ref({})
//校验数据
const rules = ref({

});
//品牌
const pageOptions = [
  {
    label: '瑞幸',
    value: 1,
  },
  {
    label: '麦当劳',
    value: 2,
  }
]
//价格类型
const songs = [
  {
    label: '数值',
    value: 0,
  },
  {
    label: '百分比',
    value: 1
  }
]
/**表单验证 */
function handleValidateButtonClick() {
  formRef.value?.validate((errors) => {
    if (!errors) {
      http.operatSingleImage(model.value).then((res) => {
        if (res.code == 1) {
          message.success(res.msg)
          emit('refresh')
          showModal.value = false
        } else {
          message.error(res.msg)
        }
      })
    }
  })

  return false
}
/**展示弹窗 */
function show(operatType, data) {
  modalTitle.value = ['查看', '编辑', '新增'][operatType - 1]
  modalType.value = operatType

  if (operatType !== 3) {
    http.getSingleImage({ id: data.id }).then((res) => {
      let { id, type, price, price_lv, price_index } = res.data
      model.value = { id, type, price, price_lv, price_index}
      showModal.value = true
    })
  } else {
    model.value = {
      type: 1,
      price: 0,
      price_lv: 0,
      price_index : 0
    }
    setTimeout(() => {
      showModal.value = true
    }, 0)
  }
}

/**暴露给父组件使用 */
defineExpose({
  show,
})
/**回调父组件函数注册 */
const emit = defineEmits(['refresh'])
</script>

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
      <n-form-item label="图片" path="image">
        <n-upload
          v-if="showModal"
          action="/apios/Tools/uploadImg"
          :disabled="modalType === 1"
          list-type="image-card"
          :default-file-list="fileList"
          :max="1"
          name="img"
          @finish="handleFinish"
          @before-upload="beforeUpload"
        >
          <n-button quaternary>上传文件</n-button>
        </n-upload>
      </n-form-item>
      <n-form-item label="优惠券" path="coupon_id" w-700>
        <n-select
          v-model:value="model.coupon_id"
          filterable
          :disabled="modalType === 1"
          :options="couponOptions"
          :loading="loading"
          clearable
          remote
          @search="handleSearch"
        />
      </n-form-item>
      <n-form-item label="排序" path="sort" w-700>
        <n-input-number
          v-model:value="model.sort"
          :min="1"
          :precision="0"
          :disabled="modalType === 1"
          :style="{ width: '150px' }"
        />
      </n-form-item>
      <n-form-item label="系统" path="device_type">
        <n-radio-group
          v-model:value="model.device_type"
          :disabled="modalType === 1"
          name="radiogroup"
          @update:value="checkedRadioHandle"
        >
          <n-space>
            <n-radio :key="1" :value="1"> 苹果机 </n-radio>
            <n-radio :key="2" :value="2"> 公共 </n-radio>
            <n-radio :key="3" :value="3"> 安卓机 </n-radio>
          </n-space>
        </n-radio-group>
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
  image: {
    required: true,
    trigger: ['blur', 'input'],
    message: '轮播图片不能为空',
  },
  coupon_id: [
    {
      required: true,
      trigger: ['blur', 'input'],
      validator: function (rule, value) {
        return Boolean(value)
      },
      message: '请选择需关联的优惠券',
    },
  ],
});

function checkedRadioHandle(value) {
  model.value.device_type = value;
  model.value.coupon_id = '';
  handleSearch('');
}

//优惠券
const couponOptions = ref([])
const loading = ref([false])

function handleSearch(query) {
  loading.value = true;
  const deviceType = model.value.device_type;
  const coupon_id = model.value.coupon_id;
  http.getCouponList({ title: query, p_type: deviceType }).then((res) => {
    loading.value = false;
    let list = res.data.list.filter(function (item) {
      return item.status == 1 || item.id == coupon_id
    })
    couponOptions.value = list.map(function (item) {
      return {
        label: item.status == 0 ? item.title+'（已下架）' : item.title,
        value: item.id,
        disabled: item.status == 0
      }
    })
  })
}

//已上传的图片
const fileList = ref([])
//图片上传
function handleFinish({ event }) {
  let { response, responseText } = event.currentTarget
  let res = JSON.parse(response || responseText)
  if (res.code == 1) {
    model.value.image = res.data.url
  } else {
    useMessage.error(res.msg)
  }
}
async function beforeUpload(data) {
  if (!/image\/(png|jpg|jpeg|gif)/i.test(data.file.file?.type)) {
    message.error('只能上传png|jpg|gif格式的图片文件，请重新上传')
    return false
  }
  return true
}
/**表单验证 */
function handleValidateButtonClick() {
  formRef.value?.validate((errors) => {
    if (!errors) {
      http.operatBanner(model.value).then((res) => {
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
  fileList.value = []
  modalTitle.value = ['查看', '编辑', '新增'][operatType - 1]
  modalType.value = operatType;

  if (operatType !== 3) {
    let { id: banner_id, image, coupon_id, device_type, sort, coupon_title } = data
    model.value = { banner_id, image, coupon_id, device_type, sort }
    /**图片预览 */
    if (image) {
      fileList.value = [
        {
          id: 'c',
          name: '已上传的图片',
          status: 'finished',
          url: image,
        },
      ]
    }
    handleSearch('')
  } else {
    model.value = {
      image: '',
      title: '',
      coupon_id: '',
      device_type: 2,
      sort: 0,
    }
    handleSearch('')
  }
  setTimeout(() => {
    showModal.value = true
  }, 0)
}

/**暴露给父组件使用 */
defineExpose({
  show,
})
/**回调父组件函数注册 */
const emit = defineEmits(['refresh'])
</script>

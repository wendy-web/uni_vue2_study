<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    preset="dialog"
    :title="modalType === 1 ? '新增' : '编辑'"
    :positive-text="modalType === 1 ? '确认' : '确认'"
    negative-text="关闭"
    :style="{
      width: '700px',
    }"
    @positive-click="handleValidateButtonClick"
    @negative-click="onNegativeClick"
  >
    <n-form
      ref="formRef"
      :model="model"
      :rules="rules"
      label-placement="left"
      label-width="100px"
      require-mark-placement="right-hanging"
      :style="{
        maxWidth: '500px',
      }"
    >
      <n-form-item label="奖品名称" path="title">
        <n-input v-model:value="model.title" />
      </n-form-item>
      <n-form-item label="奖品类型" path="type">
        <n-select v-model:value="model.type" :options="options" />
      </n-form-item>
      <n-form-item v-if="model.type == 2" label="优惠券" path="coupon_id">
        <n-select
          v-model:value="model.coupon_id"
          :options="couponOptions"
          filterable
          :loading="loading"
          clearable
          remote
          @search="handleSearch"
        />
      </n-form-item>
      <n-form-item v-if="model.type != 3" label="奖品数量" path="credits">
        <n-input-group>
          <n-input-number v-model:value="model.credits" :min="1" :precision="0" :style="{ width: '150px' }" />
        </n-input-group>
      </n-form-item>
      <n-form-item v-if="model.type != 3" label="奖品份额" path="num">
        <n-input-group>
          <n-input-number v-model:value="model.num" :min="1" :precision="0" :style="{ width: '150px' }" />
          <n-input-group-label>份</n-input-group-label>
        </n-input-group>
      </n-form-item>
      <n-form-item label="活动图片" path="image">
        <n-upload
          action="/apios/Tools/uploadImg"
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
    </n-form>
  </n-modal>
</template>
<script setup>
import { ref } from 'vue'
import { useMessage } from 'naive-ui'
import http from '../../api'
/**弹窗显示控制 */
const showModal = ref(false)
/**弹窗类型 1.新增 2.编辑*/
const modalType = ref(1)
/**弹窗取消 */
function onNegativeClick() {}
/**表单 */
const formRef = ref(null)
//提示展示
const message = useMessage()
//表单数据
const model = ref({})
//商品类型
const options = [
  {
    label: '牛金豆',
    value: 1,
  },
  {
    label: '优惠券',
    value: 2,
  },
  {
    label: '未中奖',
    value: 3,
  },
]
//优惠券
const couponOptions = ref([])
const loading = ref([false])

function handleSearch(query) {
  loading.value = true
  http.getCouponList({ title: query }).then((res) => {
    loading.value = false
    let list = res.data.list.filter(function (item) {
      return item.status == 1
    })
    couponOptions.value = list.map(function (item) {
      return {
        label: item.title,
        value: item.id,
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
  model.value.image = res.data.url
}

async function beforeUpload(data) {
  if (!/image\/(png|jpg|jpeg|gif)/i.test(data.file.file?.type)) {
    message.error('只能上传png|jpg|gif格式的图片文件，请重新上传')
    return false
  }
  return true
}

//校验数据
const rules = ref({
  image: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请上传活动图片',
  },
  num: {
    required: true,
    validator: function (rule, value) {
      if (model.value.type === 3) {
        return true
      }
      return Boolean(value)
    },
    trigger: ['blur', 'input'],
    message: '请输入累计扫码次数',
  },
  credits: {
    required: true,
    validator: function (rule, value) {
      if (model.value.type === 3) {
        return true
      }
      return Boolean(value)
    },
    trigger: ['blur', 'input'],
    message: '请输入累计扫码奖励',
  },
  coupon_id: {
    required: true,
    validator: function (rule, value) {
      if (model.value.type !== 2) {
        return true
      }

      return Boolean(value)
    },
    trigger: ['blur', 'input'],
    message: '请选择优惠券',
  },
  describe: [
    {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入活动描述',
    },
  ],
})

/**表单验证 */
function handleValidateButtonClick() {
  formRef.value?.validate((errors) => {
    if (!errors) {
      let parmas = model.value;

      if (model.value.type == 3) {
        parmas = {
          title: parmas.title,
          type: parmas.type,
          image: parmas.image,
          tag: parmas.tag,
        }
        if (model.value.award_id) parmas.award_id = model.value.award_id
      }
      parmas.device_type = deviceType.value;
      http.createAward(parmas).then((res) => {
        message.success('操作成功')
        emit('refresh')
        showModal.value = false
      })
    }
  })

  return false
}
const deviceType = ref();
/**展示弹窗 */
function show(operatType, data, device_type) {
  deviceType.value = device_type;
  modalType.value = operatType;
  fileList.value = []
  if (data) {
    let {
      id: award_id,
      title,
      type,
      num,
      image,
      credits,
      coupon_id,
      coupon_title
    } = data;
    model.value = {
      award_id,
      title,
      type,
      num,
      image,
      credits,
      coupon_id: coupon_id || '',
      tag: 'BIG_WHEEL',
    }
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
    if (coupon_title) {
      handleSearch('')
    }
  } else {
    model.value = {
      title: '',
      type: '',
      num: 0,
      image: '',
      credits: 0,
      coupon_id: '',
      tag: 'BIG_WHEEL',
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

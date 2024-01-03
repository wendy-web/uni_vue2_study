<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    preset="dialog"
    :title="modalType === 1 ? '查看' : '新增'"
    :positive-text="modalType === 1 ? '' : '确认'"
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
      label-width="140px"
      require-mark-placement="right-hanging"
      :style="{
        maxWidth: '600px',
      }"
    >
      <n-form-item label="活动名称" path="title">
        <n-input v-model:value="model.title" :disabled="modalType === 1" :maxlength="20" />
      </n-form-item>
      <n-form-item label="活动图片" path="image">
        <n-upload
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
      <n-form-item label="活动模式" path="mode" @change="modeChange">
        <n-radio-group v-model:value="model.mode" :disabled="modalType === 1" name="radiogroup">
          <n-space>
            <n-radio :key="1" :value="1"> 单次 </n-radio>
            <n-radio :key="2" :value="2"> 每天 </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
      <n-form-item v-if="model.mode == 1" label="活动时间" path="datetimerange">
        <n-date-picker
          v-model:formatted-value="model.datetimerange"
          :disabled="modalType === 1"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          clearable
      /></n-form-item>
      <n-form-item v-else label="活动时间" path="datetimerange">
        <n-time-picker
          v-model:formatted-value="timeStart"
          value-format="HH:mm:ss"
          placeholder="开始时间"
          mr-12
          @confirm="timeConfirm" />
        <n-time-picker
          v-model:formatted-value="timeEnd"
          value-format="HH:mm:ss"
          placeholder="结束时间"
          @confirm="timeConfirm"
      /></n-form-item>
      <n-form-item label="活动预热" path="preheat_hour">
        <n-input-group>
          <n-input-group-label>活动开始前</n-input-group-label>
          <n-input-number
            v-model:value="model.preheat_hour"
            :min="0"
            :disabled="modalType === 1"
            :precision="0"
            :style="{ width: '150px' }"
          />
          <n-input-group-label>小时进行预告</n-input-group-label>
        </n-input-group>
      </n-form-item>
      <n-form-item label="活动显示" path="display_hour">
        <n-input-group>
          <n-input-group-label>结束后继续显示</n-input-group-label>
          <n-input-number
            v-model:value="model.display_hour"
            :min="0"
            :disabled="modalType === 1"
            :precision="0"
            :style="{ width: '150px' }"
          />
          <n-input-group-label>小时</n-input-group-label>
        </n-input-group>
      </n-form-item>

      <n-form-item label="系统类型" path="device_type">
        <n-select
          v-model:value="model.device_type"
          filterable
          :disabled="modalType === 1"
          :options="deviceTypeOptions"
          clearable
          remote
          @update:value="deviceTypeOptionsUpdate"
        />
      </n-form-item>

      <n-form-item label="优惠券" path="coupon_id">
        <n-select
          v-model:value="model.coupon_id"
          filterable
          :disabled="modalType === 1"
          :options="couponOptions"
          :loading="loading"
          clearable
          remote
          @update:value="handleUpdateValue"
          @search="handleSearch"
        />
      </n-form-item>
      <n-form-item label="优惠券系统类型">
        {{ system }}
      </n-form-item>
      <n-form-item label="优惠券活动价" path="credits">
        <n-input-group>
          <n-input-number
            v-model:value="model.credits"
            :min="1"
            :disabled="modalType === 1"
            :precision="0"
            :style="{ width: '150px' }"
          />
          <n-input-group-label>牛金豆</n-input-group-label>
        </n-input-group>
      </n-form-item>
      <n-form-item label="可参与人数" path="num">
        <n-input-group>
          <n-input-number
            v-model:value="model.num"
            :min="1"
            :disabled="modalType === 1"
            :precision="0"
            :style="{ width: '150px' }"
          />
          <n-input-group-label>人</n-input-group-label>
        </n-input-group>
      </n-form-item>
      <n-form-item label="初始数量" path="user_num">
        <n-input-group>
          <n-input-number
            v-model:value="model.user_num"
            :min="0"
            :disabled="modalType === 1"
            :precision="0"
            :style="{ width: '150px' }"
          />
          <n-input-group-label>人</n-input-group-label>
        </n-input-group>
      </n-form-item>
    </n-form>
  </n-modal>
</template>
<script setup>
import { ref } from 'vue'
import { useMessage } from 'naive-ui'
import http from './api'

/**弹窗显示控制 */
const showModal = ref(false)
/**弹窗类型 1.查看 2.修改*/
const modalType = ref(1)
/**弹窗取消 */
function onNegativeClick() {}
/**表单 */
const formRef = ref(null)
//提示展示
const message = useMessage()
//表单数据
const model = ref({})
//已上传的图片
const fileList = ref([])
/**优惠券列表 */
//优惠券
const couponOptions = ref([])
const loading = ref(false);

function handleSearch(query, isUpdate) {
  loading.value = true;
  let device_type = model.value.device_type || 2;
  http.getCouponList({ title: query, p_type: device_type}).then((res) => {
    loading.value = false
    let list = res.data.list.filter(function (item) {
      return item.status == 1
    })
    couponOptions.value = list.map(function (item) {
      return {
        label: item.title,
        value: item.id,
        p_type: item.p_type,
      }
    });

    if (isUpdate) {
      handleUpdateValue(model.value.coupon_id)
    }
  })
}

// 系统类型
const deviceTypeOptions = ref([
  {
    label: 'IOS',
    value: 1,
  },
  {
    label: '公共',
    value: 2,
  },
  {
    label: 'Android',
    value: 3,
  },
]);
function deviceTypeOptionsUpdate(value, option) {
  model.value.device_type = value;
  model.value.coupon_id = '';
  handleSearch();
}
const system = ref('')
function handleUpdateValue(data) {
  if (data) {
    let index = couponOptions.value.findIndex((item) => item.value === data)
    if (index > -1) system.value = couponOptions.value[index].p_type
  }
}

//时间选择
const timeStart = ref(null)
const timeEnd = ref(null)
function timeConfirm() {
  if (model.value.mode !== 2) return
  if (timeStart.value && timeEnd.value) {
    model.value.datetimerange = [timeStart.value, timeEnd.value]
  } else {
    model.value.datetimerange = ''
  }
}

function modeChange() {
  timeStart.value = null
  timeEnd.value = null
  model.value.datetimerange = ''
}

//图片上传
function handleFinish({ event }) {
  let { response, responseText } = event.currentTarget
  let res = JSON.parse(response || responseText)
  model.value.image = res.data.url
}

async function beforeUpload(data) {
  if (!/image\/(png|jpeg|gif)/i.test(data.file.file?.type)) {
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
  preheat_hour: {
    required: true,
    validator: function (rule, value) {
      return value >= 0
    },
    trigger: ['blur', 'input'],
    message: '请输入活动预热时间',
  },
  display_hour: {
    required: true,
    validator: function (rule, value) {
      return value >= 0
    },
    trigger: ['blur', 'input'],
    message: '请输入活动显示时间',
  },
  credits: {
    required: true,
    validator: function (rule, value) {
      return Boolean(value)
    },
    trigger: ['blur', 'input'],
    message: '请输入优惠券活动价',
  },
  num: {
    required: true,
    validator: function (rule, value) {
      return Boolean(value)
    },
    trigger: ['blur', 'input'],
    message: '请输入参与人数',
  },
  title: [
    {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入活动名称',
    },
  ],
  device_type: [
    {
      required: true,
      trigger: ['blur', 'input'],
      validator: function (rule, value) {
        return Boolean(value)
      },
      message: '请选择系统类型',
    },
  ],
  coupon_id: [
    {
      required: true,
      trigger: ['blur', 'input'],
      validator: function (rule, value) {
        return Boolean(value)
      },
      message: '请选择优惠券',
    },
  ],
  datetimerange: [
    {
      required: true,
      trigger: ['blur', 'input'],
      validator: function (rule, value) {
        return value.length > 0
      },
      message: '请选择预热时间',
    },
  ],
})

/**表单验证 */
function handleValidateButtonClick() {
  formRef.value?.validate((errors) => {
    if (!errors) {
      let params = {
        ...model.value,
        start_time: model.value.datetimerange[0],
        end_time: model.value.datetimerange[1],
      }

      delete params.datetimerange

      http.createCoupon(params).then((res) => {
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
  modalType.value = operatType
  fileList.value = []
  /**1查看 2新增 3编辑*/
  if (operatType != 2) {
    http.getCoupon({ act_id: data.id }).then((res) => {
      let {
        id: act_id,
        display_hour,
        end_time,
        start_time,
        image,
        mode,
        preheat_hour,
        title,
        credits,
        coupon_id,
        num,
        user_num,
        device_type,
      } = res.data

      let params = {
        act_id,
        display_hour: +display_hour,
        datetimerange: start_time ? [start_time, end_time] : '',
        image,
        mode: +mode,
        preheat_hour: +preheat_hour,
        title,
        credits: +credits,
        coupon_id,
        num,
        datetimerange: '',
        user_num,
        device_type
      }

      let _timeStart = null
      let _timeEnd = null

      if (mode === 1 && start_time) {
        params.datetimerange = [start_time, end_time]
      } else if (mode === 2 && start_time) {
        _timeStart = start_time
        _timeEnd = end_time
      }

      model.value = params
      timeStart.value = _timeStart
      timeEnd.value = _timeEnd
      timeConfirm()

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
      handleSearch('', true);
      showModal.value = true;
    })
  } else {
    //新增
    model.value = {
      display_hour: 1,
      datetimerange: '',
      image: '',
      mode: 1,
      preheat_hour: 1,
      title: '',
      credits: 0,
      coupon_id: '',
      num: 0,
      user_num: 0,
      device_type: 2
    }
    timeStart.value = null
    timeEnd.value = null
    showModal.value = true
    system.value = ''
    handleSearch('', false)
  }
}

/**暴露给父组件使用 */
defineExpose({
  show,
})
/**回调父组件函数注册 */
const emit = defineEmits(['refresh'])
</script>

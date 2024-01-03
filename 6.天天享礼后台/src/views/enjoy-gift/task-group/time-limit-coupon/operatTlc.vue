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
      label-width="120px"
      require-mark-placement="right-hanging"
      :style="{
        maxWidth: '500px',
      }"
    >
      <n-form-item label="活动名称" path="title">
        <n-input v-model:value="model.title" :disabled="modalType === 1" :maxlength="20" />
      </n-form-item>
      <n-form-item label="消息名称" path="wx_msg_title">
        <n-input v-model:value="model.wx_msg_title" :disabled="modalType === 1" :maxlength="20" />
      </n-form-item>
      <n-form-item label="消息提示" path="wx_msg_content">
        <n-input v-model:value="model.wx_msg_content" :disabled="modalType === 1" :maxlength="20" />
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
      <n-form-item label="活动模式" path="mode">
        <n-radio-group v-model:value="model.mode" :disabled="modalType === 1" name="radiogroup" @change="modeChange">
          <n-space>
            <n-radio :key="1" :value="1"> 单次 </n-radio>
            <n-radio :key="2" :value="2"> 每天 </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
      <n-form-item label="系统" path="device_type">
        <n-radio-group v-model:value="model.device_type" :disabled="modalType === 1" name="radiogroup">
          <n-space>
            <n-radio :key="1" :value="1"> 苹果机 </n-radio>
            <n-radio :key="2" :value="2"> 公共 </n-radio>
            <n-radio :key="3" :value="3"> 安卓机 </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
      <n-form-item v-if="model.mode == 1 && showModal" label="活动时间" path="datetimerange">
        <n-date-picker
          v-model:formatted-value="model.datetimerange"
          :disabled="modalType === 1"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          clearable
        />
      </n-form-item>
      <n-form-item v-if="model.mode == 2 && showModal" label="活动时间" path="datetimerange">
        <n-time-picker
          v-model:formatted-value="timeStart"
          value-format="HH:mm:ss"
          placeholder="开始时间"
          mr-12
          @confirm="timeConfirm"
        />
        <n-time-picker
          v-model:formatted-value="timeEnd"
          value-format="HH:mm:ss"
          placeholder="结束时间"
          @confirm="timeConfirm"
        />
      </n-form-item>
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
        </n-input-group></n-form-item
      >
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
      <n-form-item label="小程序AppID" path="app_id">
        <n-input v-model:value="model.app_id" :disabled="modalType === 1" />
      </n-form-item>
      <n-form-item label="小程序路径" path="path">
        <n-input v-model:value="model.path" :disabled="modalType === 1" />
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
  debugger
  timeStart.value = null
  timeEnd.value = null
  model.value.datetimerange = ''
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
      return Boolean(value)
    },
    trigger: ['blur', 'input'],
    message: '请输入可参与人数',
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
  title: [
    {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入活动名称',
    },
  ],
  // wx_msg_title: [
  //   {
  //     required: true,
  //     trigger: ['blur', 'input'],
  //     message: '请输入消息名称',
  //   },
  // ],
  // wx_msg_content: [
  //   {
  //     required: true,
  //     trigger: ['blur', 'input'],
  //     message: '请输入消息提示',
  //   },
  // ],
  app_id: [
    {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入小程序AppID',
    },
  ],
  path: [
    {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入小程序路径',
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
  /**查看 */
  if (operatType != 2) {
    http.getCoupon({ act_id: data.id }).then((res) => {
      let {
        id: act_id,
        app_id,
        display_hour,
        end_time,
        start_time,
        image,
        mode,
        num,
        path,
        preheat_hour,
        title,
        wx_msg_title,
        wx_msg_content,
        device_type,
      } = res.data
      let params = {
        act_id,
        app_id,
        display_hour: +display_hour,
        datetimerange: '',
        image,
        mode: +mode,
        num: +num,
        path,
        preheat_hour: +preheat_hour,
        title,
        wx_msg_title,
        wx_msg_content,
        device_type,
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

      showModal.value = true
    })
  } else {
    //新增
    model.value = {
      app_id: '',
      display_hour: 1,
      datetimerange: '',
      image: '',
      mode: 1,
      num: 1,
      path: '',
      preheat_hour: 1,
      device_type: 2,
      title: '',
      wx_msg_title: '',
      wx_msg_content: '',
    }
    timeStart.value = null
    timeEnd.value = null
    showModal.value = true
  }
}

/**暴露给父组件使用 */
defineExpose({
  show,
})
/**回调父组件函数注册 */
const emit = defineEmits(['refresh'])
</script>

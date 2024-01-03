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
      <n-form-item label="来源" path="lx_type">
        <n-select
          v-model:value="model.lx_type"
          :options="pageOptions"
          :disabled="modalType === 1"
          style="width: 200px"
          @update:value="lx_type_handleUpdate"
        />
      </n-form-item>

      <n-form-item label="优惠券" path="coupon_id" w-700 v-if="model.lx_type == 1">
        <n-select
          v-model:value="model.coupon_id"
          :options="couponOptions"
          filterable
          :loading="loading"
          clearable
          remote
          @update:value="coupon_id_handleUpdate"
          @search="handleSearch"
        />
      </n-form-item>
      <n-form-item label="京东" path="coupon_id" v-else>
        <n-input
          v-model:value="pageOptions[1].coupon_title"
          :maxlength="20"
          disabled
        />
        <n-button
          ml-10
          @click="selectJdListHandle"
          :disabled="modalType === 1"
        > 选择京东商品 </n-button>
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
      <n-form-item label="类型" path="type">
        <n-radio-group v-model:value="model.type" :disabled="modalType === 1" name="radiogroup">
          <n-space>
            <n-radio :key="1" :value="1"> 兑换排行榜 </n-radio>
            <n-radio :key="2" :value="2"> 超值排行榜 </n-radio>
          </n-space>
        </n-radio-group>
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
    </n-form>
  </n-modal>
  <sel-operat-jd-list ref="selOperatJdListRef" @selectList="selectListHandle" />
</template>
<script setup>
import selOperatJdList from './selOperatJdList.vue';
import { ref } from 'vue';
import { useMessage } from 'naive-ui';
import http from './api';

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

// 来源
const pageOptions = ref([
  {
    label: '自建',
    value: 1,
    coupon_id: null,
    coupon_title: null
  },
  {
    label: '京东',
    value: 2,
    coupon_id: null,
    coupon_title:'前往选择京东商品',
  },
]);
// 来源的选择
function lx_type_handleUpdate(value, options) {
  console.log('options :>> ', options);
  model.value.coupon_id = options.coupon_id;
}
// 优惠券的选择
function coupon_id_handleUpdate(value, options) {
  const lx_type = model.value.lx_type;
  pageOptions.value[lx_type-1].coupon_id = value;
}
const selOperatJdListRef = ref(null);
// 打开京东可选
function selectJdListHandle() {
  selOperatJdListRef.value.show();
}
// 京东商品的选择
function selectListHandle(selectList){
  // console.log('selectList :>> ', selectList);
  pageOptions.value[1].coupon_id = selectList.coupon_id;
  pageOptions.value[1].coupon_title = selectList.title;
  model.value.coupon_id = selectList.coupon_id;
}

// 类型充值的判断
function checkedRadioHandle(value) {
  model.value.device_type = value;
  if(model.value.lx_type === 2) return; // 京东不进行商品的重置
  model.value.coupon_id = '';
  handleSearch('');
}
//校验数据
const rules = ref({
  image: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请上传活动图片',
  },
  coupon_id: [
    {
      required: true,
      trigger: ['blur', 'input'],
      validator: function (rule, value) {
        return Boolean(value)
      },
      message: '请选择需关联的商品',
    },
  ],
})

//优惠券
const couponOptions = ref([])
const loading = ref([false])

function handleSearch(query) {
  loading.value = true;
  const deviceType = model.value.device_type;
  const coupon_id = model.value.coupon_id;
  http.getCouponList({ title: query, p_type: deviceType }).then((res) => {
    loading.value = false
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
  modalType.value = operatType
  if (operatType !== 3) {
    let {
      id: top_id,
      coupon_id,
      device_type,
      sort,
      type,
      image,
      lx_type,
      coupon_title
    } = data;
    model.value = {
      top_id,
      coupon_id,
      device_type,
      sort,
      type,
      image,
      lx_type
    }
    pageOptions.value[lx_type-1].coupon_id = coupon_id;
    pageOptions.value[lx_type-1].coupon_title = coupon_title;
    handleSearch('');
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
  } else {
    model.value = {
      title: '',
      coupon_id: '',
      device_type: 2,
      sort: 0,
      type: 1,
      image: '',
      lx_type: 1
    }
    handleSearch('');
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

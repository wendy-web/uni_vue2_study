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
      <n-form-item label="标题" path="title" w-400>
        <n-input v-model:value="model.title" :disabled="modalType === 1" />
      </n-form-item>
      <n-form-item label="设备类型" path="device_type">
        <n-select
          v-model:value="model.device_type"
          :options="isJumpOptions"
          :disabled="modalType === 1"
          style="width: 200px"
          @update:value="handleSearch"
        />
      </n-form-item>
      <n-form-item label="排序" path="sort" w-400>
        <n-input v-model:value="model.sort" :disabled="modalType === 1" />
      </n-form-item>
      <!--<n-form-item label="商品" path="goods_id" w-700>
        <n-select
          v-model:value="model.goods_id"
          :options="couponOptions"
          filterable
          :loading="loading"
          clearable
          remote
          @search="handleSearch"
        />
      </n-form-item>-->
      <n-form-item label="选择商品" path="goods_id" w-800 mb-10>
        <n-button ml-10 @click="selectJdListHandle"> 选择商品 </n-button>
      </n-form-item>
      <div style="padding-left: 120px;margin-top:-30px;">
        <p>{{model.skuName}}</p>
        <p>{{model.type_id}}</p>
      </div>
      <n-form-item label="彬纷图片" path="image">
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
          @remove="handleRemove"
        >
          <n-button quaternary>上传文件</n-button>
        </n-upload>
      </n-form-item>
      <!--<n-form-item label="彬纷图片2" path="image3">
        <n-upload
          v-if="showModal"
          action="/apios/Tools/uploadImg"
          :disabled="modalType === 1"
          list-type="image-card"
          :default-file-list="fileList3"
          :max="1"
          name="img"
          @finish="handleFinish3"
          @before-upload="beforeUpload"
          @remove="handleRemove3"
        >
          <n-button quaternary>上传文件</n-button>
        </n-upload>
      </n-form-item>-->
      <n-form-item label="弹窗图片" path="image2">
        <n-upload
          v-if="showModal"
          action="/apios/Tools/uploadImg"
          :disabled="modalType === 1"
          list-type="image-card"
          :default-file-list="fileList2"
          :max="1"
          name="img"
          @finish="handleFinish2"
          @before-upload="beforeUpload"
          @remove="handleRemove2"
        >
          <n-button quaternary>上传文件</n-button>
        </n-upload>
      </n-form-item>
    </n-form>
  </n-modal>
  <!-- 商品 -->
  <sel-operat-jd-list ref="selOperatJdListRef" @selectList="selectListHandle" :ck-system="ckSystem" />
</template>
<script setup>
import { ref } from 'vue';
import { useMessage } from 'naive-ui';
import http from './api';
import selOperatJdList from './selOperatJdList.vue';
/**弹窗显示控制 */
const showModal = ref(false)
/**弹窗类型 1.查看 2.修改,3.新增*/
const modalType = ref(3)
const modalTitle = ref('新增')
const selOperatJdListRef = ref(null)
const ckSystem = ref(0)
// 打开京东可选
function selectJdListHandle() {
    selOperatJdListRef.value.show()
}
// 京东商品的选择
function selectListHandle(selectList) {
  model.value.skuName = selectList.title
  model.value.type_id = selectList.coupon_id
  model.value.itemId = selectList.itemId
  model.value.goods_sign = selectList.goods_sign
}
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
  title: {
    required: true,
    trigger: ['blur', 'input'],
    message: '标题不能为空',
  },
  image: {
    required: true,
    trigger: ['blur', 'input'],
    message: '彬纷图片不能为空',
  },
  image3: {
    required: true,
    trigger: ['blur', 'input'],
    message: '彬纷图片2不能为空',
  },
});
//跳转方式
const isJumpOptions = [
  {
    label: '苹果',
    value: 1,
  },
  {
    label: '公共',
    value: 2,
  },
  {
    label: '安卓',
    value: 3,
  },
]
//已上传的图片
const fileList = ref([])
const fileList2 = ref([])
const fileList3 = ref([])
const mainfileList = ref([])
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
function handleFinish2({ event }) {
  let { response, responseText } = event.currentTarget
  let res = JSON.parse(response || responseText)
  if (res.code == 1) {
    model.value.image2 = res.data.url
  } else {
    useMessage.error(res.msg)
  }
}
function handleFinish3({ event }) {
  let { response, responseText } = event.currentTarget
  let res = JSON.parse(response || responseText)
  if (res.code == 1) {
    model.value.image3 = res.data.url
  } else {
    useMessage.error(res.msg)
  }
}
function handleRemove(){
  model.value.image = "";
}
function handleRemove2(){
  model.value.image2 = "";
}
function handleRemove3(){
  model.value.image3 = "";
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
  fileList.value = []
  fileList2.value = []
  fileList3.value = []
  modalTitle.value = ['查看', '编辑', '新增'][operatType - 1]
  modalType.value = operatType

  if (operatType !== 3) {
    http.getSingleImage({ id: data.id }).then((res) => {
      let {
        id,
        title,
        goods_id,
        type_id,
        skuName,
        image,
        image2,
        image3,
        device_type,
        sort
      } = res.data;
      model.value = {
        id,
        title,
        goods_id: goods_id || null,
        type_id: type_id || null,
        skuName: skuName || null,
        image,
        image2,
        image3,
        device_type,
        sort
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
      if (image2) {
        fileList2.value = [
          {
            id: 'c',
            name: '已上传的图片',
            status: 'finished',
            url: image2,
          },
        ]
      }
      if (image3) {
        fileList3.value = [
          {
            id: 'c',
            name: '已上传的图片',
            status: 'finished',
            url: image3,
          },
        ]
      }
      handleSearch();
      showModal.value = true
    })
  } else {
    model.value = {
      title: '',
      goods_id: null,
      image: '',
      image2: '',
      image3: '',
      device_type: 2,
      sort: ''
    }
    setTimeout(() => {
      handleSearch();
      showModal.value = true
    }, 0)
  }
}

//const couponOptions = ref([])
const loading = ref([false])
function handleSearch(goods_name = '') {
  loading.value = true;
  const goods_id = model.value.goods_id;
  const system = model.value.device_type;
  ckSystem.value = system;
  const params = {
    goods_name,
    system,
  };
  /*http.getCouponList(params).then((res) => {
    loading.value = false
    let list = res.data.list.filter(function (item) {
      return item.status == 1 || item.id == goods_id;
    })
    couponOptions.value = list.map(function (item) {
      return {
        label: (item.status == 0 ? item.goods_name+'（已下架）' : item.goods_name ) || item.goods_number,
        value: item.id,
        disabled: item.status == 0,
      }
    })
  })*/
}
/**暴露给父组件使用 */
defineExpose({
  show,
})
/**回调父组件函数注册 */
const emit = defineEmits(['refresh'])
</script>

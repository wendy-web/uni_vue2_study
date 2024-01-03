<template>
  <div min-h-60 p-15 flex items-start justify-between b-1 bc-ccc rounded-8 bg="#fafafc">
    <n-space wrap :size="[35, 15]">
      <slot />
    </n-space>
    <div flex-shrink-0>
      <!-- <view class="primary_btn"> -->
      <n-upload
        v-if="isImport"
        :action="isApi"
        name="img"
        class="import_btn"
        @finish="handleFinish"
        @before-upload="beforeUpload"
      >
        <n-button v-has="'import'" quaternary>导入心链订单</n-button>
      </n-upload>
      <!-- <n-button mr-20 type="primary">导入心链商品</n-button> -->
      <!-- </view> -->
      <n-button v-if="isExport" v-has="'export'" mr-20 type="primary" @click="emit('export')">导出</n-button>
      <n-button secondary type="primary" @click="emit('reset')">重置</n-button>
      <n-button ml-20 type="primary" @click="emit('search')">搜索</n-button>
    </div>
  </div>
</template>

<script setup>
import { useMessage } from 'naive-ui'
const emit = defineEmits(['search', 'reset', 'export', 'finishImport'])
defineProps({
  isExport: {
    type: Boolean,
    default: false,
  },
  isImport: {
    type: Boolean,
    default: false,
  },
  isApi: {
    type: String,
    default: '',
  },
})
//提示展示
const message = useMessage()
function handleFinish({ event }) {
  let { response, responseText } = event.currentTarget
  let res = JSON.parse(response || responseText)
  console.log('res :>> ', res)
  if (!res.code) {
    message.error(res.msg)
    return
  }
  emit('finishImport')
}
async function beforeUpload(data) {
  console.log('data :>> ', data)
}
</script>
<style lang="scss">
.primary_btn {
  position: relative;
  height: 34rpx !important;
  overflow: hidden;
  z-index: 0;
  .import_btn {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    // opacity: 0;
  }
}
</style>

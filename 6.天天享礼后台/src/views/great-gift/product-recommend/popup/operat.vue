<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    preset="dialog"
    :title="modalTitle"
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
        maxWidth: '700px',
      }"
    >
      <n-form-item label="标题" path="title" w-400>
        <n-input v-model:value="model.title" :disabled="modalType === 1" :maxlength="20" />
      </n-form-item>
      <n-form-item label="系统" path="system">
        <n-radio-group v-model:value="model.system" :disabled="modalType === 1" name="radiogroup">
          <n-space>
            <n-radio :key="0" :value="0"> 公共 </n-radio>
            <n-radio :key="1" :value="1"> 安卓机</n-radio>
            <n-radio :key="2" :value="2"> 苹果机</n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
      <n-form-item label="图片" path="list">
        <div class="gids-list">
          <div v-for="(item, index) in model.list" :key="index" class="gids-item">
            <n-upload
              w-auto
              mr-10
              action="/apios/Tools/uploadImg"
              :disabled="modalType === 1"
              list-type="image-card"
              :default-file-list="item.fileList"
              :max="1"
              name="img"
              @finish="({ event }) => handleFinish(event, index)"
              @before-upload="(data) => beforeUpload(data, index)"
              @remove="() => handleRemove(index)"
            >
              <n-button quaternary>上传文件</n-button>
            </n-upload>
            <div class="gids-item-right">
              <div class="git-title">图{{ index + 1 }}</div>
              <div v-if="modalType !== 1" class="git-select" @click="seletGoods(item)">
                {{ item.goods_name || '点击选择' }}
              </div>
              <div v-else class="git-select disabled">{{ item.goods_name || '点击选择' }}</div>
            </div>
          </div>
        </div>
      </n-form-item>
    </n-form>
  </n-modal>
  <selec-goods ref="selecGoodsRef" />
</template>
<script setup>
import { ref } from 'vue'
import { useMessage } from 'naive-ui'
import http from '../api'
import selecGoods from './selecGoods.vue'

/**弹窗显示控制 */
const showModal = ref(false)
/**弹窗类型 1.查看 2.修改 3.新增*/
const modalType = ref(1)
/**弹窗title */
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
  title: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入标题',
  },
  list: {
    required: true,
    validator: function (rule, value) {
      let flag = true
      for (let i = 0; i < value.length; i++) {
        let item = value[i]
        if (!item.url || !item.id || !item.goods_name) {
          flag = false
          break
        }
      }
      return flag
    },
    trigger: ['blur', 'input'],
    message: '图片模块请上传完整内容',
  },
})

//图片上传
function handleFinish(event, index) {
  let { response, responseText } = event.currentTarget
  let res = JSON.parse(response || responseText)
  model.value.list[index].url = res.data.url
}

async function beforeUpload(data) {
  if (!/image\/(png|jpg|jpeg|gif)/i.test(data.file.file?.type)) {
    message.error('只能上传png|jpg|gif格式的图片文件，请重新上传')
    return false
  }
  return true
}

function handleRemove(index) {
  model.value.list[index].url = ''
}

//选择商品
const selecGoodsRef = ref(null)
function seletGoods(item) {
  selecGoodsRef.value.show(item)
}

/**表单验证 */
function handleValidateButtonClick() {
  formRef.value?.validate((errors) => {
    if (!errors) {
      let { type, title, system, list, id } = model.value
      let gids = list.map((item) => item.id).toString()
      let imgs = list.map((item) => item.url)
      let params = { type, title, system, gids, imgs }
      if (id) {
        params.id = id
      }
      http.dos(params).then((res) => {
        if (res.code == 1) {
          message.success(res.msg)
          emit('refresh')
        } else {
          message.error(res.msg)
        }
        showModal.value = false
      })
    }
  })

  return false
}
/**展示弹窗 */
function show(operatType, data) {
  modalType.value = operatType
  modalTitle.value = ['查看', '编辑', '新增'][operatType - 1]
  //操作处理
  switch (operatType) {
    //编辑//查看
    case 1:
    case 2:
      http.xq({ id: data.id }).then((res) => {
        let { title, system, goods_list, id } = res.data
        model.value = {
          title,
          system,
          id,
          type: 'edit',
          list: goods_list.map(function (item, index) {
            return {
              url: item.picList,
              id: item.id,
              goods_name: item.goods_name,
              fileList: [
                {
                  id: 'c' + index,
                  name: '已上传的图片',
                  status: 'finished',
                  url: item.picList,
                },
              ],
            }
          }),
        }
        showModal.value = true
      })
      break
    //新增
    case 3:
      model.value = {
        list: [
          {
            url: '',
            id: '',
            goods_name: '',
            fileList: [],
          },
          {
            url: '',
            id: '',
            goods_name: '',
            fileList: [],
          },
          {
            url: '',
            id: '',
            goods_name: '',
            fileList: [],
          },
        ],
        type: 'add',
        title: '',
        system: 0,
      }

      showModal.value = true

      break
  }
}

/**暴露给父组件使用 */
defineExpose({
  show,
})
/**回调父组件函数注册 */
const emit = defineEmits(['refresh'])
</script>
<style lang="scss">
.gids-list {
  width: 100%;
  .gids-item {
    display: flex;
    background-color: rgb(224, 239, 245);
    padding: 10px 10px;
  }
  .gids-item-right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
  }
  .gids-item + .gids-item {
    margin-top: 10px;
  }
  .git-select {
    cursor: pointer;
    border: 1px solid #dcdfe6;
    width: 100%;
    box-sizing: border-box;
    padding: 5px 10px;
    margin-top: 5px;
    border-radius: 5px;
    color: #333;
  }
  .disabled {
    cursor: no-drop;
  }
}
</style>

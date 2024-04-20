<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    preset="dialog"
    :title="modalTitle"
    :positive-text="modalType === 1 ? '' : '确认'"
    negative-text="关闭"
    :style="{
      width: '1200px',
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
        maxWidth: '1200px',
      }"
    >
      <n-form-item label="导航标题" path="title" w-400>
        <n-input v-model:value="model.title" :disabled="modalType === 1" />
      </n-form-item>
      <div flex>
        <n-form-item label="字体颜色" path="color" w-300>
          <n-color-picker v-model:value="model.color" :show-alpha="false" :actions="['clear']" />
        </n-form-item>
        <n-form-item label="字体加粗" path="bold" w-300>
          <n-switch v-model:value="model.bold" />
        </n-form-item>
      </div>
      <n-form-item label="高亮提示文案" path="jd_word" w-400>
        <n-input v-model:value="model.jd_word" :disabled="modalType === 1" />
      </n-form-item>
      <n-form-item label="系统" path="device_type">
        <n-select
          v-model:value="model.device_type"
          :options="pageOptions"
          :disabled="modalType === 1"
          style="width: 200px"
        />
      </n-form-item>
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
      <!--      <n-form-item label="标签" path="tag" w-400>-->
      <!--        <n-input v-model:value="model.tag" :disabled="modalType === 1" />-->
      <!--      </n-form-item>-->
      <n-form-item label="标签" path="tag">
        <n-upload
          v-if="showModal"
          action="/apios/Tools/uploadImg"
          :disabled="modalType === 1"
          list-type="image-card"
          :default-file-list="fileList2"
          :max="1"
          name="img"
          @remove="handleRemove"
          @finish="tagHandleFinish"
          @before-upload="beforeUpload"
        >
          <n-button quaternary>上传文件</n-button>
        </n-upload>
      </n-form-item>
      <n-form-item label="排序" path="sort" w-400>
        <n-input-number
          v-model:value="model.sort"
          :min="1"
          :precision="0"
          :style="{ width: '150px' }"
          :disabled="modalType === 1"
        />
      </n-form-item>
      <n-form-item label="跳转页面" path="jump_title" w-400>
        <n-input v-model:value="model.jump_title" :disabled="modalType === 1" />
      </n-form-item>
      <n-form-item label="页面类型" path="type">
        <n-radio-group
          v-model:value="model.type"
          :disabled="modalType === 1"
          name="radiogroup"
          @update:value="checkedRadioHandle"
        >
          <!-- 1-优惠券 2-公众号 3-视频号 4-小程序 5-千猪外链 6-领券中心 -->
          <n-space>
            <n-radio :key="1" :value="1"> 优惠券 </n-radio>
            <n-radio :key="2" :value="2"> 公众号 </n-radio>
            <n-radio :key="3" :value="3"> 视频号 </n-radio>
            <n-radio :key="4" :value="4"> 小程序 </n-radio>
            <n-radio :key="5" :value="5"> 千猪页面 </n-radio>
            <n-radio :key="6" :value="6"> 领券中心 </n-radio>
            <n-radio :key="7" :value="7"> 惠吃喝 </n-radio>
            <n-radio :key="8" :value="8"> 海威瑞幸 </n-radio>
            <n-radio :key="8" :value="9"> 小程序内页 </n-radio>
            <n-radio :key="10" :value="10"> 乐唯娃娃机 </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
      <!--  公众号-->
      <div v-if="model.type == 2">
        <n-form-item label="同主体" path="is_main">
          <n-radio-group
            v-model:value="model.is_main"
            :disabled="modalType === 1"
            name="radiogroup"
            @update:value="checkedRadioHandle"
          >
            <n-space>
              <n-radio :key="1" :value="1"> 同主体 </n-radio>
              <n-radio :key="2" :value="2"> 非同主体 </n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        <n-form-item v-if="model.is_main == 1" label="文章地址" path="article_url">
          <n-input
            v-model:value="model.article_url"
            type="textarea"
            :style="{
              maxWidth: '400px',
            }"
            :disabled="modalType === 1"
          />
        </n-form-item>
        <n-form-item v-else label="网页图片" path="main_url">
          <n-upload
            v-if="showModal"
            action="/apios/Tools/uploadImg"
            :disabled="modalType === 1"
            list-type="image-card"
            :default-file-list="mainfileList"
            :max="1"
            name="img"
            @finish="mainHandleFinish"
            @before-upload="beforeUpload"
          >
            <n-button quaternary>上传文件</n-button>
          </n-upload>
        </n-form-item>
      </div>
      <!--小程序-->
      <div v-if="model.type == 4">
        <n-form-item label="小程序类型" path="is_main">
          <n-radio-group
            v-model:value="model.is_main"
            :disabled="modalType === 1"
            name="radiogroup"
            @update:value="checkedRadioHandle2"
          >
            <n-space>
              <n-radio :key="1" :value="1"> 默认 </n-radio>
              <n-radio :key="2" :value="2"> 拼多多营销工具 </n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        <n-form-item label="打开方式" path="open_mini_type">
          <n-radio-group
            v-model:value="model.open_mini_type"
            :disabled="modalType === 1"
            name="radiogroup"
            @update:value="checkedRadioHandle"
          >
            <n-space>
              <n-radio :key="1" :value="1"> 全屏打开 </n-radio>
              <n-radio :key="2" :value="2"> 半屏打开 </n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        <n-form-item v-if="model.is_main == 1" label="小程序ID" path="type_id" w-400>
          <n-input v-model:value="model.type_id" :disabled="modalType === 1" />
        </n-form-item>
        <n-form-item v-if="model.is_main == 1" label="页面路径" path="type_sid" w-400>
          <n-input v-model:value="model.type_sid" :disabled="modalType === 1" />
        </n-form-item>
        <n-form-item v-if="model.is_main == 2" label="拼多多推广位" path="type_id" w-400>
          <n-input v-model:value="model.type_id" :disabled="modalType === 1" />
        </n-form-item>
        <n-form-item v-if="model.is_main == 2" label="营销工具" path="type_sid">
          <n-select
            v-model:value="model.type_sid"
            :options="pddOptions"
            :disabled="modalType === 1"
            style="width: 200px"
            @update:value="pddChange"
          />
        </n-form-item>
        <div v-if="model.is_main == 2">
          <!-- 选择红包金额类型 -->
          <n-form-item
            v-if="model.type_sid == 0 || model.type_sid == 2"
            label="商品金额"
            path="diy_red_packet_param.amounttype"
          >
            <n-select
              v-model:value="model.diy_red_packet_param.amounttype"
              :options="amounttypeOptions"
              :disabled="modalType === 1"
              style="width: 200px"
            />
          </n-form-item>
          <!-- 指定红包金额amount_probability多选 -->
          <n-form-item
            v-if="model.diy_red_packet_param.amounttype == 2 && (model.type_sid == 0 || model.type_sid == 2)"
            label="指定红包金额"
            path="diy_red_packet_param.amount_probability"
          >
            <n-checkbox-group v-model:value="model.diy_red_packet_param.amount_probability" flex flex-wrap>
              <n-space v-for="item in amountOptions" :key="item.value" item-style="display: flex;" mr-10 mb-10>
                <n-checkbox :value="item.value" :label="item.label" />
              </n-space>
            </n-checkbox-group>
          </n-form-item>
          <n-form-item
            v-if="model.diy_red_packet_param.amounttype == 3 && (model.type_sid == 0 || model.type_sid == 2)"
            label="红包抵后价"
            path="diy_red_packet_param.range_items[0]"
          >
            <n-input-number
              v-model:value="model.diy_red_packet_param.range_items[0].range_from"
              :min="0"
              :precision="0"
              :style="{ width: '120px' }"
              :disabled="modalType === 1"
            />元
            <span style="padding: 0 15px">-</span>
            <n-input-number
              v-model:value="model.diy_red_packet_param.range_items[0].range_to"
              :min="0"
              :precision="0"
              :style="{ width: '120px' }"
              :disabled="modalType === 1"
            />元
          </n-form-item>
          <n-form-item
            v-if="model.type_sid == 0 || model.type_sid == 2 || model.type_sid == 12"
            label="商品佣金"
            path="diy_red_packet_param.range_items[1]"
          >
            <n-input-number
              v-model:value="model.diy_red_packet_param.range_items[1].range_from"
              :min="0"
              :precision="0"
              :style="{ width: '120px' }"
              :disabled="modalType === 1"
            />%
            <span style="padding: 0 15px">-</span>
            <n-input-number
              v-model:value="model.diy_red_packet_param.range_items[1].range_to"
              :min="0"
              :precision="0"
              :style="{ width: '120px' }"
              :disabled="modalType === 1"
            />%
          </n-form-item>
          <!-- 推广页设置not_show_background -->
          <n-form-item
            v-if="model.type_sid == 0 || model.type_sid == 2"
            label="设置推广页"
            path="diy_red_packet_param.not_show_background"
          >
            <n-radio-group
              v-model:value="model.diy_red_packet_param.not_show_background"
              :disabled="modalType === 1"
              name="radiogroup"
            >
              <n-space>
                <n-radio :key="0" :value="0"> 红包开启页 </n-radio>
                <n-radio :key="1" :value="1"> 红包领取页 </n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
          <div v-if="model.type_sid == 3">
            <!-- 刮刮卡指定金额scratch_card_amount单选 -->
            <n-form-item label="刮刮卡金额" path="diy_red_packet_param.scratch_card_amount_type">
              <n-radio-group
                v-model:value="model.diy_red_packet_param.scratch_card_amount_type"
                :disabled="modalType === 1"
                name="radiogroup"
              >
                <n-space>
                  <n-radio :key="0" :value="0"> 默认推荐金额 </n-radio>
                  <n-radio :key="1" :value="1"> 固定金额 </n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item>
            <n-form-item
              v-if="model.diy_red_packet_param.scratch_card_amount_type == 1"
              label="固定金额"
              path="diy_red_packet_param.scratch_card_amount"
            >
              <n-input-number
                v-model:value="model.diy_red_packet_param.scratch_card_amount"
                :min="2"
                :max="10"
                :precision="0"
                :style="{ width: '120px' }"
                :disabled="modalType === 1"
              />元
            </n-form-item>
          </div>
          <div v-if="model.type_sid == 12">
            <n-form-item label="砸金蛋金额" path="diy_red_packet_param.scratch_card_amount_type">
              <n-radio-group
                v-model:value="model.diy_red_packet_param.scratch_card_amount_type"
                :disabled="modalType === 1"
                name="radiogroup"
              >
                <n-space>
                  <n-radio :key="0" :value="0"> 默认推荐金额 </n-radio>
                  <n-radio :key="1" :value="1"> 指定金额 </n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item>
            <n-form-item
              v-if="model.diy_red_packet_param.scratch_card_amount_type == 1"
              label="指定金额"
              path="diy_red_packet_param.amount_probability"
            >
              <n-checkbox-group v-model:value="model.diy_red_packet_param.amount_probability" flex flex-wrap>
                <n-space v-for="item in amount2Options" :key="item.value" item-style="display: flex;" mr-10 mb-10>
                  <n-checkbox :value="item.value" :label="item.label" />
                </n-space>
              </n-checkbox-group>
            </n-form-item>
          </div>
        </div>
      </div>
      <!--  视频号-->
      <div v-if="model.type == 3">
        <n-form-item label="视频号ID" path="video_id" w-400>
          <n-input v-model:value="model.video_id" :disabled="modalType === 1" />
        </n-form-item>
        <n-form-item label="视频ID" path="video_account_id">
          <n-input
            v-model:value="model.video_account_id"
            type="textarea"
            :style="{
              maxWidth: '400px',
            }"
            :disabled="modalType === 1"
          />
        </n-form-item>
      </div>
      <!-- 千猪-->
      <div v-if="model.type == 5 || model.type == 9">
        <n-form-item v-if="model.type == 9" label="跳转类型" path="is_main">
          <n-radio-group
            v-model:value="model.is_main"
            :disabled="modalType === 1"
            name="radiogroup"
            @update:value="checkedRadioHandle"
          >
            <n-space>
              <n-radio :key="1" :value="1"> 小程序页面 </n-radio>
              <n-radio :key="2" :value="2"> webview </n-radio>
              <n-radio :key="3" :value="3"> 海威比价寄 </n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        <n-form-item label="跳转地址" path="qz_url">
          <n-input
            v-model:value="model.qz_url"
            type="textarea"
            :style="{
              maxWidth: '400px',
            }"
            :disabled="modalType === 1"
          />
        </n-form-item>
      </div>
      <!--优惠券-->
      <div v-if="model.type == 1 && model.lx_type == 1">
        <n-form-item label="优惠券ID" path="coupon_id_android" w-400>
          安卓<n-input
            v-model:value="model.coupon_id_android"
            style="width: 240px; margin-left: 4px"
            :disabled="modalType === 1"
          />
        </n-form-item>
        <n-form-item label="优惠券ID" path="coupon_id_ios" w-400>
          苹果<n-input
            v-model:value="model.coupon_id_ios"
            style="width: 240px; margin-left: 4px"
            :disabled="modalType === 1"
          />
        </n-form-item>
      </div>
      <div v-if="model.type == 1 && model.lx_type == 2">
        <n-form-item label="优惠券ID" path="coupon_id_android" w-400>
          <n-input
            v-model:value="model.coupon_id_android"
            style="width: 240px; margin-left: 4px"
            :disabled="modalType === 1"
          />
        </n-form-item>
      </div>
      <!-- 领券中心 - 频道选择 -->
      <div v-if="model.type == 6">
        <n-form-item label="频道选择">
          <n-select
            v-model:value="model.type_id"
            label-field="name"
            value-field="id_index"
            :options="centerOptions"
            :disabled="modalType === 1"
            style="width: 400px"
            clearable
          />
        </n-form-item>
      </div>
      <n-form-item label="彬纷菜单" path="position_id">
        <n-checkbox-group v-model:value="model.position_id" flex flex-wrap>
          <n-space v-for="item in menuOptions" :key="item.value" item-style="display: flex;" mr-10 mb-10>
            <n-checkbox :value="item.value" :label="item.label" />
          </n-space>
        </n-checkbox-group>
      </n-form-item>
      <n-form-item label="高亮次数" path="xf_type" w-400>
        <n-input v-model:value="model.xf_type" :disabled="modalType === 1" />
      </n-form-item>
    </n-form>
  </n-modal>
</template>
<script setup>
import { useMessage } from 'naive-ui';
import { onMounted, ref } from 'vue';
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
    message: '弹窗图片不能为空',
  },
  coupon_id_android: {
    required: true,
    trigger: ['blur', 'input'],
    message: '优惠券ID不能为空',
  },
})
// 系统
const pageOptions = [
  {
    label: '苹果机',
    value: 1,
  },
  {
    label: '公共',
    value: 2,
  },
  {
    label: '安卓机',
    value: 3,
  },
]
//红包金额
const amountOptions = [
  {
    label: '2元',
    value: 200,
  },
  {
    label: '3元',
    value: 300,
  },
  {
    label: '5元',
    value: 500,
  },
  {
    label: '10元',
    value: 1000,
  },
  {
    label: '20元',
    value: 2000,
  },
  {
    label: '30元',
    value: 3000,
  },
  {
    label: '40元',
    value: 4000,
  },
]
//砸金蛋金额
const amount2Options = [
  {
    label: '10元',
    value: 1000,
  },
  {
    label: '15元',
    value: 1500,
  },
  {
    label: '20元',
    value: 2000,
  },
  {
    label: '25元',
    value: 2500,
  },
  {
    label: '30元',
    value: 3000,
  },
  {
    label: '35元',
    value: 3500,
  },
  {
    label: '40元',
    value: 4000,
  },
]
//红包金额类型
const amounttypeOptions = [
  {
    label: '红包金额个性化',
    value: 1,
  },
  {
    label: '指定红包金额',
    value: 2,
  },
  {
    label: '红包抵后价',
    value: 3,
  },
]
function pddChange() {
  model.value.diy_red_packet_param.amount_probability = []
}
//营销工具
const pddOptions = [
  {
    label: '红包',
    value: 0,
  },
  {
    label: '新人红包',
    value: 2,
  },
  {
    label: '刮刮卡',
    value: 3,
  },
  {
    label: '员工内购',
    value: 5,
  },
  {
    label: '砸金蛋',
    value: 12,
  },
  {
    label: '千万补贴B端页面',
    value: 14,
  },
  {
    label: '充值中心B端页面',
    value: 15,
  },
  {
    label: '千万补贴C端页面',
    value: 16,
  },
  {
    label: '超级红包',
    value: 23,
  },
  {
    label: '礼金全场N折活动B端页面',
    value: 24,
  },
  {
    label: '带货赢千万',
    value: 27,
  },
  {
    label: '千万神券C端页面',
    value: 34,
  },
  {
    label: '千万神券B端页面',
    value: 35,
  },
  {
    label: '超级红包B端推品页',
    value: 37,
  },
]
function checkedRadioHandle2() {
  model.value.type_id = ''
  model.value.type_sid = ''
}
//已上传的图片
const fileList = ref([])
const fileList2 = ref([])
const mainfileList = ref([])
const menuOptions = ref([])
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
function tagHandleFinish({ event }) {
  let { response, responseText } = event.currentTarget
  let res = JSON.parse(response || responseText)
  if (res.code == 1) {
    model.value.tag = res.data.url
  } else {
    useMessage.error(res.msg)
  }
}
function handleRemove() {
  model.value.tag = '1'
}
function mainHandleFinish({ event }) {
  let { response, responseText } = event.currentTarget
  let res = JSON.parse(response || responseText)
  if (res.code == 1) {
    model.value.main_url = res.data.url
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
      model.value.position_id && (model.value.position_id = model.value.position_id.join(','))
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

const centerOptions = ref([])
onMounted(() => {
  http.getLists().then((res) => {
    if (res.code == 1) {
      centerOptions.value = res.data
    }
  })
})
const icon_id = ref()
/**展示弹窗 */
function show(operatType, data) {
  fileList.value = []
  fileList2.value = []
  mainfileList.value = []
  modalTitle.value = ['查看', '编辑', '新增'][operatType - 1]
  modalType.value = operatType

  if (operatType !== 3) {
    http.getSingleImage({ id: data.id, lx_type: 2 }).then((res) => {
      let {
        id,
        title,
        image,
        device_type,
        jump_title,
        type,
        is_jump,
        is_main,
        article_url,
        main_url,
        open_mini_type,
        type_id,
        type_sid,
        video_id,
        video_account_id,
        qz_url,
        coupon_id_android,
        coupon_id_ios,
        tag,
        sort,
        lx_type,
        people_type,
        diy_red_packet_param,
        color,
        bold,
        jd_word,
        position_id,
        xf_type,
      } = res.data
      if (type == 6) type_id = Number(type_id)
      model.value = {
        id,
        title,
        image,
        device_type,
        jump_title,
        type,
        is_jump,
        is_main,
        article_url,
        main_url,
        open_mini_type,
        type_id,
        type_sid,
        video_id,
        video_account_id,
        qz_url,
        coupon_id_android,
        coupon_id_ios,
        tag,
        sort,
        lx_type,
        people_type,
        diy_red_packet_param: diy_red_packet_param || {
          amount_probability: [],
          range_items: [
            {
              range_from: 0,
              range_id: 1,
              range_to: 0,
            },
            {
              range_from: 0,
              range_id: 2,
              range_to: 0,
            },
          ],
          amounttype: 1,
          not_show_background: 0,
          scratch_card_amount_type: 0,
          scratch_card_amount: 2,
        },
        color: color || '#666',
        bold: Boolean(bold),
        jd_word,
        position_id,
        xf_type,
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
      if (tag) {
        fileList2.value = [
          {
            id: 'c',
            name: '已上传的图片',
            status: 'finished',
            url: tag,
          },
        ]
      }
      if (main_url) {
        mainfileList.value = [
          {
            id: 'c',
            name: '已上传的图片',
            status: 'finished',
            url: main_url,
          },
        ]
      }
      showModal.value = true
    })
    icon_id.value = data.id
  } else {
    model.value = {
      title: '',
      image: '',
      device_type: 1,
      datetimerange: '',
      jump_title: '',
      type: 1,
      is_jump: 1,
      is_main: 1,
      article_url: '',
      main_url: '',
      open_mini_type: 1,
      type_id: null,
      type_sid: '',
      video_id: '',
      video_account_id: '',
      qz_url: '',
      coupon_id_android: '',
      coupon_id_ios: '',
      tag: '',
      sort: 1,
      lx_type: 2,
      people_type: 1,
      diy_red_packet_param: {
        amount_probability: [],
        range_items: [
          {
            range_from: 0,
            range_id: 1,
            range_to: 0,
          },
          {
            range_from: 0,
            range_id: 2,
            range_to: 0,
          },
        ],
        amounttype: 1,
        not_show_background: 0,
        scratch_card_amount_type: 0,
        scratch_card_amount: 2,
      },
      color: '#666',
      bold: false,
      jd_word: '',
      position_id: '',
      xf_type: '',
    }
    setTimeout(() => {
      showModal.value = true
    }, 0)
    icon_id.value = 0
  }
  model.value.lx_type = 2
  http.getPosition({ people_type: 1, id: icon_id.value }).then((res) => {
    menuOptions.value = res.data
  })
}
/**暴露给父组件使用 */
defineExpose({
  show,
})
/**回调父组件函数注册 */
const emit = defineEmits(['refresh'])
</script>

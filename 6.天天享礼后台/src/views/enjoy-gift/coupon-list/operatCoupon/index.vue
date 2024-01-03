<template>
  <n-drawer v-model:show="showModal" :default-width="drawerWidth" resizable>
    <n-drawer-content :title="modalTitle" closable>
      <n-form
        ref="formRef"
        :model="model"
        :rules="rules"
        label-placement="left"
        label-width="120px"
        require-mark-placement="right-hanging"
      >
        <div class="form-title" pb-15 fw-600>优惠券类型信息</div>
        <n-form-item label="类型" path="detail.type">
          <n-radio-group
            v-model:value="model.detail.type"
            name="radiogroup"
            :disabled="modalType === 1"
            @update:value="typeChange"
          >
            <n-space>
              <n-radio v-for="song in songs" :key="song.value" :value="song.value">
                {{ song.label }}
              </n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        <!-- 商品类/视频组件 - 删除跳转方式 -->
        <template v-if="isShowJumpType">
          <n-form-item label="跳转方式" w-400 path="detail.is_jump">
            <n-select
              v-model:value="model.detail.is_jump"
              :disabled="modalType === 1"
              :options="jumpType"
              filterable
              clearable
              remote
              placeholder="跳转方式"
            />
          </n-form-item>
        </template>
        <!-- 公众号 -->
        <template v-if="model.detail.type === 2 || model.detail.type === 8">
          <n-form-item label="主体关系" path="detail.is_main">
            <n-select
              v-model:value="model.detail.is_main"
              :options="isMainOptions"
              :disabled="modalType === 1"
              style="width: 200px"
            />
          </n-form-item>
          <n-form-item v-if="model.detail.is_main === 1" label="文章地址" path="detail.article_url">
            <n-input
              v-model:value="model.detail.article_url"
              type="textarea"
              :style="{
                maxWidth: '400px',
              }"
              :disabled="modalType === 1"
            />
          </n-form-item>
          <n-form-item v-else label="网页图片" path="detail.main_url">
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
        </template>
        <!-- 视频号 -->
        <template v-if="model.detail.type === 3 || model.detail.type === 7">
          <n-form-item label="视频号ID" path="detail.video_id">
            <n-input
              v-model:value="model.detail.video_id"
              :style="{
                maxWidth: '400px',
              }"
              :disabled="modalType === 1"
            />
          </n-form-item>
          <n-form-item label="视频ID" path="detail.video_account_id">
            <n-input
              v-model:value="model.detail.video_account_id"
              type="textarea"
              :style="{
                maxWidth: '400px',
              }"
              :disabled="modalType === 1"
            />
          </n-form-item>
        </template>
        <!-- 小程序 -->
        <template v-if="model.detail.type === 4">
          <n-form-item label="打开方式" w-400 path="detail.open_mini_type">
            <n-select
              v-model:value="model.detail.open_mini_type"
              :disabled="modalType === 1"
              :options="openMiniType"
              filterable
              clearable
              remote
              placeholder="跳转方式"
            />
          </n-form-item>
          <n-form-item label="选择小程序" w-400 path="xcx">
            <n-select
              v-model:value="xcx"
              :disabled="modalType === 1"
              :options="xcxType"
              filterable
              clearable
              remote
              placeholder="小程序名称"
              @change="xcxCk"
              @clear="querykey"
            />
          </n-form-item>
          <n-form-item v-if="xcx == 3" label="小程序类型" path="detail.is_main">
            <n-radio-group
              v-model:value="model.detail.is_main"
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
          <n-form-item v-if="model.detail.is_main == 1" label="小程序ID" path="detail.type_id">
            <n-input
              v-model:value="model.detail.type_id"
              :style="{
                maxWidth: '400px',
              }"
              :disabled="modalType === 1"
            />
          </n-form-item>
          <n-form-item v-if="model.detail.is_main == 1" label="页面路径" path="detail.type_sid">
            <n-input
              v-model:value="model.detail.type_sid"
              :style="{
                maxWidth: '400px',
              }"
              :disabled="modalType === 1"
            />
          </n-form-item>
          <n-form-item v-if="xcx == 1" label="京喜红包" path="detail.is_gift">
            <n-radio-group
              v-model:value="model.detail.is_gift"
              name="radiogroup"
              :disabled="modalType === 1"
              @change="typeChange2"
            >
              <n-space>
                <n-radio v-for="song in gift" :key="song.value" :value="song.value">
                  {{ song.label }}
                </n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
          <n-form-item v-if="model.detail.is_main == 2" label="拼多多推广位" path="detail.type_id" w-400>
            <n-input v-model:value="model.detail.type_id" :disabled="modalType === 1" />
          </n-form-item>
          <n-form-item v-if="model.detail.is_main == 2" label="营销工具" path="detail.type_sid">
            <n-select
              v-model:value="model.detail.type_sid"
              :options="pddOptions"
              :disabled="modalType === 1"
              style="width: 200px"
            />
          </n-form-item>
          <div v-if="model.detail.is_main == 2">
            <!-- 选择红包金额类型 -->
            <n-form-item
              v-if="model.detail.type_sid == 0 || model.detail.type_sid == 2"
              label="商品金额"
              path="detail.diy_red_packet_param.amounttype"
            >
              <n-select
                v-model:value="model.detail.diy_red_packet_param.amounttype"
                :options="amounttypeOptions"
                :disabled="modalType === 1"
                style="width: 200px"
              />
            </n-form-item>
            <!-- 指定红包金额amount_probability多选 -->
            <n-form-item
              v-if="
                model.detail.diy_red_packet_param.amounttype == 2 &&
                (model.detail.type_sid == 0 || model.detail.type_sid == 2)
              "
              label="指定红包金额"
              path="detail.diy_red_packet_param.amount_probability"
            >
              <n-checkbox-group v-model:value="model.detail.diy_red_packet_param.amount_probability" flex flex-wrap>
                <n-space v-for="item in amountOptions" :key="item.value" item-style="display: flex;" mr-10 mb-10>
                  <n-checkbox :value="item.value" :label="item.label" />
                </n-space>
              </n-checkbox-group>
            </n-form-item>
            <n-form-item
              v-if="
                model.detail.diy_red_packet_param.amounttype == 3 &&
                (model.detail.type_sid == 0 || model.detail.type_sid == 2)
              "
              label="红包抵后价"
              path="detail.diy_red_packet_param.range_items[0]"
            >
              <n-input-number
                v-model:value="model.detail.diy_red_packet_param.range_items[0].range_from"
                :min="0"
                :precision="0"
                :style="{ width: '120px' }"
                :disabled="modalType === 1"
              />元
              <span style="padding: 0 15px">-</span>
              <n-input-number
                v-model:value="model.detail.diy_red_packet_param.range_items[0].range_to"
                :min="0"
                :precision="0"
                :style="{ width: '120px' }"
                :disabled="modalType === 1"
              />元
            </n-form-item>
            <n-form-item
              v-if="model.detail.type_sid == 0 || model.detail.type_sid == 2 || model.detail.type_sid == 12"
              label="商品佣金"
              path="detail.diy_red_packet_param.range_items[1]"
            >
              <n-input-number
                v-model:value="model.detail.diy_red_packet_param.range_items[1].range_from"
                :min="0"
                :precision="0"
                :style="{ width: '120px' }"
                :disabled="modalType === 1"
              />%
              <span style="padding: 0 15px">-</span>
              <n-input-number
                v-model:value="model.detail.diy_red_packet_param.range_items[1].range_to"
                :min="0"
                :precision="0"
                :style="{ width: '120px' }"
                :disabled="modalType === 1"
              />%
            </n-form-item>
            <!-- 推广页设置not_show_background -->
            <n-form-item
              v-if="model.detail.type_sid == 0 || model.detail.type_sid == 2"
              label="设置推广页"
              path="detail.diy_red_packet_param.not_show_background"
            >
              <n-radio-group
                v-model:value="model.detail.diy_red_packet_param.not_show_background"
                :disabled="modalType === 1"
                name="radiogroup"
              >
                <n-space>
                  <n-radio :key="0" :value="0"> 红包开启页 </n-radio>
                  <n-radio :key="1" :value="1"> 红包领取页 </n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item>
            <div v-if="model.detail.type_sid == 3">
              <!-- 刮刮卡指定金额scratch_card_amount单选 -->
              <n-form-item label="刮刮卡金额" path="detail.diy_red_packet_param.scratch_card_amount_type">
                <n-radio-group
                  v-model:value="model.detail.diy_red_packet_param.scratch_card_amount_type"
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
                v-if="model.detail.diy_red_packet_param.scratch_card_amount_type == 1"
                label="固定金额"
                path="detail.diy_red_packet_param.scratch_card_amount"
              >
                <n-input-number
                  v-model:value="model.detail.diy_red_packet_param.scratch_card_amount"
                  :min="2"
                  :max="10"
                  :precision="0"
                  :style="{ width: '120px' }"
                  :disabled="modalType === 1"
                />元
              </n-form-item>
            </div>
            <div v-if="model.detail.type_sid == 12">
              <n-form-item label="砸金蛋金额" path="detail.diy_red_packet_param.scratch_card_amount_type">
                <n-radio-group
                  v-model:value="model.detail.diy_red_packet_param.scratch_card_amount_type"
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
                v-if="model.detail.diy_red_packet_param.scratch_card_amount_type == 1"
                label="指定金额"
                path="detail.diy_red_packet_param.amount_probability"
              >
                <n-checkbox-group v-model:value="model.detail.diy_red_packet_param.amount_probability" flex flex-wrap>
                  <n-space v-for="item in amount2Options" :key="item.value" item-style="display: flex;" mr-10 mb-10>
                    <n-checkbox :value="item.value" :label="item.label" />
                  </n-space>
                </n-checkbox-group>
              </n-form-item>
            </div>
          </div>
        </template>
        <!-- 千猪外链 -->
        <template v-if="model.detail.type === 5">
          <n-form-item label="跳转地址" path="detail.qz_url">
            <n-input
              v-model:value="model.detail.qz_url"
              :style="{
                maxWidth: '400px',
              }"
              :disabled="modalType === 1"
            />
          </n-form-item>
        </template>
        <!-- 小程序内页 -->
        <template v-if="model.detail.type === 6">
          <n-form-item label="页面地址" path="detail.page_index" w-400>
            <n-select
              v-model:value="model.detail.page_index"
              :disabled="modalType === 1"
              :options="pathOptions"
              filterable
              clearable
              remote
              placeholder="请选择页面路径"
            />
            <!-- @update:value="pathOptionsUpdate" -->
          </n-form-item>
          <n-form-item v-if="model.detail.page_index == 3" label="频道选择" path="detail.eliteId_index" w-400>
            <n-select
              v-model:value="model.detail.eliteId_index"
              :disabled="modalType === 1"
              label-field="name"
              value-field="id_index"
              :options="centerOptions"
              filterable
              clearable
              remote
              placeholder="请选择频道"
            />
          </n-form-item>
          <!--输入页面路径-->
          <n-form-item v-if="model.detail.page_index == 5" label="页面路径" path="detail.type_sid">
            <n-input
              v-model:value="model.detail.type_sid"
              :style="{
                maxWidth: '300px',
              }"
              :disabled="modalType === 1"
              placeholder="请输入页面路径"
            />
          </n-form-item>
          <!-- 指定商品的id -->
          <n-form-item v-if="[4, 6, 7].includes(model.detail.page_index)" label="单品ID:">
            <n-input
              v-model:value="model.detail.type_sid"
              :style="{
                maxWidth: '300px',
              }"
              :disabled="modalType === 1"
              placeholder="请输入单品ID"
            />
          </n-form-item>
        </template>
        <div class="form-title" pb-15 fw-600>优惠券信息</div>
        <n-form-item label="优惠券名称" path="title">
          <n-input
            v-model:value="model.title"
            :style="{
              maxWidth: '300px',
            }"
            :disabled="modalType === 1"
            clearable
          />
        </n-form-item>
        <template v-if="model.detail.type !== 7 && model.detail.type !== 9">
          <n-form-item label="广告位" path="detail.is_banner" w-400>
            <n-switch v-model:value="model.detail.is_banner" :disabled="model.detail.type == 10 || model.detail.type == 11" />
          </n-form-item>
          <template v-if="model.detail.type === 1">
            <n-form-item label="选择商品" path="goods_id" w-400>
              <n-select
                v-model:value="model.goods_id"
                :disabled="modalType === 1"
                :options="shopOptions"
                filterable
                :loading="loading"
                clearable
                remote
                @search="handleSearch"
                @update:value="shopOptionsUpdate"
              />
            </n-form-item>
            <n-form-item label="商品详情">
              <n-data-table w-1000 :columns="shopColumns" :data="shopData" :pagination="false" />
            </n-form-item>

            <!-- 充值类型 - 直充类型 -->
            <template v-if="isRecharge">
              <!-- <template> -->
              <n-form-item label="充值类型" w-400>
                <n-select
                  v-model:value="model.cz_type"
                  :disabled="modalType === 1"
                  :options="rechargeOptions"
                  filterable
                  clearable
                  remote
                  placeholder="请选择充值类型"
                  @update:value="rechargeOptionsUpdate"
                />
              </n-form-item>
              <n-form-item label="提示文案" path="cz_type_intro">
                <n-input
                  v-model:value="model.cz_type_intro"
                  :style="{
                    maxWidth: '300px',
                  }"
                  :disabled="modalType === 1"
                  placeholder="请输入提示文案"
                />
              </n-form-item>
            </template>
          </template>
          <!-- 系统类型 -->
          <n-form-item label="系统类型" path="device_type" w-400>
            <n-select
              v-model:value="model.device_type"
              :disabled="modalType === 1"
              :options="deviceTypeOptions"
              filterable
              clearable
              remote
              placeholder="请选择系统类型"
              @update:value="deviceTypeOptionsUpdate"
            />
          </n-form-item>
          <n-form-item label="面值" path="face_value" v-if="model.detail.type !== 10 && model.detail.type !== 11">
            <n-input-group>
              <n-input-number
                v-model:value="model.face_value"
                :min="0"
                :precision="2"
                :disabled="modalType === 1"
                :style="{ width: '150px' }"
              />
              <n-input-group-label>元</n-input-group-label>
            </n-input-group>
          </n-form-item>
          <n-form-item v-if="model.detail.type == 1" label="省钱卡金额" path="saving_money">
            <n-input-group>
              <n-input-number
                v-model:value="model.saving_money"
                :min="0"
                :precision="2"
                :disabled="modalType === 1"
                :style="{ width: '150px' }"
              />
              <n-input-group-label>元</n-input-group-label>
            </n-input-group>
          </n-form-item>
          <n-form-item label="兑换价格" path="credits" v-if="model.detail.type !== 10 && model.detail.type !== 11">
            <n-input-group>
              <n-input-number
                v-model:value="model.credits"
                :min="0"
                :precision="0"
                :disabled="modalType === 1"
                :style="{ width: '150px' }"
              />
              <n-input-group-label>牛金豆</n-input-group-label>
            </n-input-group>
            <div class="rem_lab">注：牛金豆不为0，将生成优惠券</div>
          </n-form-item>
          <template v-if="model.detail.type !== 1 && model.detail.type != 10 && model.detail.type !== 11">
            <n-form-item label="兑换按钮" path="btn_word">
              <n-input
                v-model:value="model.detail.btn_word"
                :style="{
                  maxWidth: '200px',
                }"
                :disabled="modalType === 1"
                placeholder="请输按钮文案"
                clearable
              />
            </n-form-item>
          </template>
          <n-form-item label="发放数量" path="stock_num" v-if="model.detail.type !== 10 && model.detail.type !== 11">
            <n-input-number
              v-model:value="model.stock_num"
              :min="1"
              :precision="0"
              :disabled="modalType === 1"
              :style="{ width: '150px' }"
            />
          </n-form-item>
          <n-form-item label="有效期" path="expiry_date" v-if="model.detail.type !== 10 && model.detail.type !== 11">
            <n-input-group>
              <n-input-group-label>领券后</n-input-group-label>
              <n-input-number
                v-model:value="model.expiry_date"
                :min="1"
                :precision="0"
                :disabled="modalType === 1"
                :style="{ width: '150px' }"
              />
              <n-input-group-label>天内有效</n-input-group-label>
            </n-input-group>
          </n-form-item>
          <n-form-item label="优惠券图片" path="image">
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
          <n-form-item label="兑换人数" path="user_num" v-if="model.detail.type !== 10 && model.detail.type !== 11">
            <n-input-group>
              <n-input-number
                v-model:value="model.user_num"
                :min="1"
                :precision="0"
                :disabled="modalType === 1"
                :style="{ width: '150px' }"
              />
              <n-input-group-label>人</n-input-group-label>
            </n-input-group>
          </n-form-item>
          <n-form-item label="兑换须知" path="explain" v-if="model.detail.type !== 10 && model.detail.type !== 11">
            <div style="border: 1px solid #ccc">
              <Toolbar
                style="border-bottom: 1px solid #ccc"
                :editor="editorRef"
                :default-config="toolbarConfig"
                mode="default"
              />
              <Editor
                v-model="model.explain"
                style="height: 500px; overflow-y: hidden"
                :default-config="editorConfig"
                mode="default"
                @onCreated="handleCreated"
              />
            </div>
          </n-form-item>
        </template>
        <template v-if="model.detail.type == 9">
          <n-form-item label="零豆专区" path="detail.type_id" w-400>
            <n-select
              v-model:value="model.detail.type_id"
              :disabled="modalType === 1"
              :options="zeroOptions"
              filterable
              clearable
              remote
              placeholder="请选择专区"
            />
          </n-form-item>
        </template>
        <template v-if="model.detail.type == 10">
            <n-form-item label="分组列表" path="type_id">
                <n-select
                        v-model:value="model.detail.type_id"
                        :options="couponOptions"
                        :disabled="modalType === 1"
                        style="width: 200px"
                />
            </n-form-item>
            <n-form-item label="持续时长" path="type_sid">
                <n-input-number v-model:value="model.detail.type_sid" :disabled="modalType === 1" min="0" style="width: 200px" />
                <span style="padding-left: 8px">小时</span>
            </n-form-item>
        </template>
        <template v-if="model.detail.type === 11">
          <n-form-item label="h5地址" path="detail.qz_url">
            <n-input
                    v-model:value="model.detail.qz_url"
                    :style="{
                maxWidth: '400px',
              }"
                    :disabled="modalType === 1"
            />
          </n-form-item>
        </template>
        <div flex justify-center w-500>
          <n-button mr-10 @click="closeModel"> 关闭 </n-button>
          <n-button v-if="modalType !== 1" type="info" @click="handleValidate"> 保存 </n-button>
        </div>
      </n-form>
    </n-drawer-content>
  </n-drawer>
</template>
<script setup>
import { ref, onBeforeUnmount, shallowRef } from 'vue'
import { useMessage } from 'naive-ui'
import http from '../api'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { escape2Html } from '@/utils'
/**弹窗显示控制 */
const showModal = ref(false)
/**抽屉宽度 */
const drawerWidth = window.innerWidth - 220 + 'px'
/**弹窗类型 1.查看 2.修改 3新增*/
const modalType = ref(1)
/**modalTitle */
const modalTitle = ref('')
//提示展示
const message = useMessage()
/**表单 */
const formRef = ref(null)
const couponOptions = ref([])
//表单数据
const model = ref({
  award: [],
  reward_rules: [],
})
//券类型
const songs = [
  {
    value: 1,
    label: '商品类',
  },
  {
    value: 2,
    label: '公众号',
  },
  {
    value: 3,
    label: '视频号',
  },
  {
    value: 4,
    label: '小程序',
  },
  {
    value: 5,
    label: '千猪外链',
  },
  {
    value: 6,
    label: '小程序内页',
  },
  {
    value: 7,
    label: '视频组件',
  },
  {
    value: 8,
    label: '乐唯娃娃机',
  },
  {
    value: 9,
    label: '多商品滑动',
  },
  {
    value: 10,
    label: '广告推券'
  },
  {
    value: 11,
    label: '小程序h5'
  }
]
const gift = [
  {
    value: 0,
    label: '否',
  },
  {
    value: 1,
    label: '是',
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
  model.value.detail.diy_red_packet_param.amount_probability = []
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
//是否为直冲
const isRecharge = ref(false)

function typeChange(value) {
  if(value == 10 || value == 11){
      model.value.detail.is_banner = 1;
      model.value.detail.is_banner = Boolean(model.value.detail.is_banner)
  }
  /*model.value.detail = {
    type: model.value.detail.type,
    is_main: model.value.detail.is_main || 1,
    article_url: model.value.detail.article_url || '',
    main_url: model.value.detail.main_url || '',
    type_id: model.value.detail.type_id || '',
    open_mini_type: model.value.detail.open_mini_type || 1,
    type_sid: model.value.detail.type_sid || '',
    video_id: model.value.detail.video_id || '',
    video_account_id: model.value.detail.video_account_id || '',
  }
  model.value.goods_id = ''
  shopData.value = []*/
}
let type_id = ''
let type_sid = ''
let xcx = ref(false)
let xcxs = 0
const tyArr = {
  0: {
    type_id: '',
    type_sid: '',
  },
  1: {
    type_id: 'wx91d27dbf599dff74',
    type_sid: '/pages/union/proxy/proxy?spreadUrl=',
  },
  2: {
    type_id: 'wxde8ac0a21135c07d',
    type_sid: '',
  },
  3: {
    type_id: 'wxa918198f16869201',
    type_sid: '/pages/share/index?src=',
  },
  4: {
    type_id: '',
    type_sid: '',
  },
}
function xcxCk(e) {
  if (e > 0) {
    model.value.detail.type_id = tyArr[e].type_id
    model.value.detail.type_sid = tyArr[e].type_sid
    xcx.value = e
  } else if (e === 0) {
    xcx.value = 0
    model.value.detail.type_id = ''
    model.value.detail.type_sid = ''
  }
}
function querykey() {
  model.value.detail.type_id = type_id
  model.value.detail.type_sid = type_sid
  xcx.value = xcxs
  this.$forceUpdate()
}

//优惠券id
let coupon_id = ''
//校验数据
const rules = ref({
  cz_type_intro: {
    required: true,
    trigger: ['blur', 'input'],
    message: '提示文案不能为空',
  },
  title: {
    required: true,
    trigger: ['blur', 'input'],
    message: '优惠券名称不能为空',
  },
  goods_id: {
    required: true,
    validator: function (rule, value) {
      return Boolean(value)
    },
    trigger: ['blur', 'input'],
    message: '请选择优惠券对应的商品',
  },
  device_type: {
    required: true,
    validator: function (rule, value) {
      return Boolean(value)
    },
    trigger: ['blur', 'input'],
    message: '请选择系统类型',
  },
  credits: {
    required: true,
    validator: function (rule, value) {
      const ruleValidator = model.value.detail.type == 1 ? Boolean(value) : Boolean(value >= 0)
      return ruleValidator
    },
    trigger: ['blur', 'input'],
    message: '请输入兑换价格',
  },
  stock_num: {
    required: true,
    validator: function (rule, value) {
      return Boolean(value)
    },
    trigger: ['blur', 'input'],
    message: '请输入发放数量',
  },
  expiry_date: {
    required: true,
    validator: function (rule, value) {
      return Boolean(value)
    },
    trigger: ['blur', 'input'],
    message: '请输入有效期',
  },
  image: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请选择优惠券图片',
  },
  user_num: {
    required: true,
    validator: function (rule, value) {
      return Boolean(value)
    },
    trigger: ['blur', 'input'],
    message: '请输入兑换人数',
  },
  face_value: {
    required: true,
    validator: function (rule, value) {
      return Boolean(value)
    },
    trigger: ['blur', 'input'],
    message: '请输入面值',
  },
  explain: {
    required: true,
    trigger: ['change', 'input'],
    validator: function (rule, value) {
      return value != '<p><br></p>' && Boolean(value)
    },
    message: '兑换须知不能为空',
  },
  detail: {
    type: {
      type: 'number',
      required: true,
      trigger: ['blur', 'change'],
      message: '请选择优惠券类型',
    },
    is_main: {
      type: 'number',
      required: true,
      trigger: ['blur', 'change'],
      message: '请选择公众号类型',
    },
    article_url: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入文章地址',
    },
    main_url: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请上传网页图片',
    },
    is_jump: {
      type: 'number',
      required: true,
      trigger: ['blur', 'change'],
      message: '请选择跳转方式',
    },
    open_mini_type: {
      type: 'number',
      required: true,
      trigger: ['blur', 'change'],
      message: '请选择打开方式',
    },
    type_sid: {
      required: true,
      message: '不能为空',
    },
    qz_url: {
      required: true,
      trigger: ['blur', 'input'],
      message: '不能为空',
    },
    video_id: {
      required: true,
      trigger: ['blur', 'input'],
      message: '不能为空',
    },
    video_account_id: {
      required: true,
      trigger: ['blur', 'input'],
      message: '不能为空',
    },
  },
})
//主体关系
const isMainOptions = [
  {
    label: '同主体',
    value: 1,
  },
  {
    label: '非同主体',
    value: 2,
  },
]
const xcxType = [
  {
    label: '请选择',
    value: 0,
  },
  {
    label: '京东联盟',
    value: 1,
  },
  {
    label: '美团联盟',
    value: 2,
  },
  {
    label: '拼多多',
    value: 3,
  },
  {
    label: '其他',
    value: 4,
  },
]
//商品选择
const shopOptions = ref([])
const loading = ref([false])

function handleSearch(query) {
  loading.value = true
  http.getGoodsOption({ title: query }).then(function ({ data }) {
    loading.value = false
    shopOptions.value = data.list.map(function (item) {
      return {
        ...item,
        label: item.title,
        value: item.id,
      }
    })
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
])
function deviceTypeOptionsUpdate(value, option) {
  model.value.device_type = value
}

const pathOptions = ref([
  {
    label: '小程序内页',
    value: 5,
  },
  {
    label: '惠生活',
    value: 1,
  },
  {
    label: '福利中心',
    value: 2,
  },
  {
    label: '领券中心',
    value: 3,
  },
  {
    label: '海威瑞幸',
    value: 4,
  },
  {
    label: '海威麦当劳',
    value: 6,
  },
  {
    label: '海威肯德基',
    value: 7,
  },
])
// 充值的类型
const rechargeOptions = ref([
  {
    label: '手机号码充值',
    value: 1,
    placeholder: '请输入手机号码',
  },
  {
    label: '其他账号充值',
    value: 2,
    placeholder: '请输入手机号码或QQ账号',
  },
])
function rechargeOptionsUpdate(value, option) {
  model.value.cz_type = value
  model.value.cz_type_intro = option.placeholder
}

// 小程序的打开方式
const openMiniType = ref([
  {
    label: '跳转打开',
    value: 1,
  },
  {
    label: '半屏打开',
    value: 2,
  },
])
//商品状态
const isShowJumpType = computed(() => {
  const isShow = [1, 7, 8, 9, 10, 11].includes(Number(model.value.detail.type))
  return !isShow
})

// 跳转方式
const jumpType = ref([
  {
    label: '直接跳转',
    value: 1,
  },
  {
    label: '进入跳转',
    value: 2,
  },
])

//奖品数据
const shopData = ref([])
//奖品设置
const shopColumns = [
  { title: '商品编号', key: 'skuCode', align: 'center' },
  { title: '商品名称', key: 'title', align: 'center' },
  {
    title: '商品类型',
    key: 'type',
    align: 'center',
    render(row, index) {
      return row.type == 0 ? '直充' : '卡券'
    },
  },
  {
    title: '面值(元)',
    key: 'marketPrice',
    align: 'center',
    render(row) {
      return Number(row.marketPrice / 100).toFixed(2)
    },
  },
  {
    title: '成本价(元)',
    key: 'costPrice',
    align: 'center',
    render(row) {
      return Number(row.costPrice / 100).toFixed(2)
    },
  },
  // { title: '销售状态', key: 'status', align: 'center' },
  {
    title: '售价(元)',
    key: 'salePrice',
    align: 'center',
    render(row) {
      return Number(row.salePrice / 100).toFixed(2)
    },
  },
  {
    title: '商品状态',
    key: 'status',
    align: 'center',
    render(row, index) {
      return row.ls_status == 0 ? '下架' : '上架'
    },
  },
  {
    title: '启用状态',
    key: 'status',
    align: 'center',
    render(row) {
      return row.status <= 1 ? '未启用' : '已启用'
    },
  },
]
function shopOptionsUpdate(value, option) {
  if (value) {
    shopData.value = [{ ...option }]
    isRecharge.value = option.type === 0
  } else {
    handleSearch('')
    shopData.value = []
    isRecharge.value = false
  }
  model.value.cz_type = 1
  model.value.cz_type_intro = '请输入手机号码'
}
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()
const toolbarConfig = {}
const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      server: '/apios/Tools/uploadImg',
      fieldName: 'img',
      // 自定义插入图片
      customInsert(res, insertFn) {
        // res 即服务端的返回结果
        let { url } = res.data
        // 从 res 中找到 url alt href ，然后插入图片
        insertFn(url, '', '')
      },
    },
  },
}
const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
  if (modalType.value === 1) editorRef.value?.disable()
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

//网页图片
function mainHandleFinish({ event }) {
  let { response, responseText } = event.currentTarget
  let res = JSON.parse(response || responseText)
  model.value.detail.main_url = res.data.url
}
const mainfileList = ref([])
const centerOptions = ref([])
const zeroOptions = ref([])
/**展示弹窗 */
function show(operatType, data) {
  coupon_id = data?.id
  modalType.value = operatType
  modalTitle.value = ['查看', '编辑', '新增'][operatType - 1]
  if (operatType === 1) editorRef.value?.disable()
  initCenterOptions()
  init()
  //获取零豆专区列表
  http.getAll().then((res) => {
    console.log(res.data)
    zeroOptions.value = res.data
  })
}

function initCenterOptions() {
  http.getLists().then((res) => {
    if (res.code == 1) {
      centerOptions.value = res.data
    }
  })
}
function init() {
  fileList.value = []
  mainfileList.value = []
  if (modalType.value != 3) {
    http.getCoupon({ coupon_id }).then((res) => {
      let {
        id: coupon_id,
        title,
        face_value,
        saving_money,
        credits,
        image,
        expiry_date,
        stock_num,
        user_num,
        explain,
        goods,
        detail,
        cz_type,
        cz_type_intro,
        device_type,
      } = res.data
      // cz_type 充值类型 1-手机号码充值 2-其它账号充值
      // cz_type_intro 提示文案

      model.value = {
        coupon_id,
        title,
        face_value: +face_value,
        saving_money: +saving_money || 0,
        credits: +credits,
        image,
        expiry_date: +expiry_date,
        stock_num: +stock_num,
        user_num: +user_num,
        explain: escape2Html(explain),
        goods_id: goods?.id,
        cz_type: cz_type || 1,
        cz_type_intro: cz_type_intro || '请输入手机号码',
        device_type: device_type || 2,
        detail: detail || {
          type: 1,
          is_main: 1,
          article_url: '',
          main_url: '',
          type_id: '',
          open_mini_type: 1,
          is_jump: 1,
          type_sid: '',
          qz_url: '',
          video_id: '',
          video_account_id: '',
          btn_word: '领取成功',
          is_gift: 0,
          page_index: 1,
          eliteId_index: 0,
          is_banner: 0,
        },
      }
      model.value.detail.is_banner = Boolean(model.value.detail.is_banner)
      type_id = detail.type_id
      type_sid = detail.type_sid
      if (detail.type == 4 && type_id && type_id == 'wx91d27dbf599dff74') {
        xcxs = 1
        xcx.value = 1
      }
      if (detail.type == 4 && type_id && type_id == 'wxde8ac0a21135c07d') {
        xcxs = 2
        xcx.value = 2
      }
      if (detail.type == 4 && ((type_id && type_id == 'wxa918198f16869201') || detail.is_main == 2)) {
        xcxs = 3
        xcx.value = 3
      }
      if (
        detail.type == 4 &&
        type_id &&
        type_id != 'wx91d27dbf599dff74' &&
        type_id != 'wxde8ac0a21135c07d' &&
        type_id != 'wxa918198f16869201'
      ) {
        xcxs = 4
        xcx.value = 4
      }
      shopData.value = goods ? [goods] : []
      isRecharge.value = goods && goods.type === 0
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

      if (detail.main_url) {
        mainfileList.value = [
          {
            id: 'a',
            name: '已上传的图片',
            status: 'finished',
            url: detail.main_url,
          },
        ]
      }

      handleSearch('')

      showModal.value = true
    })
  } else {
    model.value = {
      title: '',
      face_value: 0,
      saving_money: 0,
      credits: 0,
      image: '',
      expiry_date: 1,
      stock_num: 1,
      user_num: 1,
      explain: '',
      goods_id: '',
      cz_type: 1,
      cz_type_intro: '',
      device_type: 2,
      detail: {
        type: 1,
        is_main: 1,
        article_url: '',
        main_url: '',
        type_id: '',
        open_mini_type: 1,
        is_jump: 1,
        type_sid: '',
        qz_url: '',
        video_id: '',
        video_account_id: '',
        btn_word: '领取成功',
        is_gift: 0,
        page_index: 1,
        eliteId_index: 0,
        is_banner: 0,
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
      },
    }
    shopData.value = []
    handleSearch('')
    showModal.value = true
    model.value.detail.is_banner = Boolean(model.value.detail.is_banner)
  }
  http.getGroup().then((res) => {
    couponOptions.value = res.data.list
  })
}

/**关闭弹窗 */
function closeModel() {
  showModal.value = false
}

/**校验表单 */
function handleValidate() {
  if (model.value.detail.type == 7 || model.value.detail.type == 9) {
    model.value.image = 'https://test-file.y1b.cn/store/1-0/23628/649bd84e361ea.jpg'
  }
  // return;
  formRef.value?.validate((errors) => {
    if (!errors) {
      /**还原数据 */
      http.createCoupon(model.value).then((res) => {
        if (res.code == 1) {
          message.success(res.msg)
          showModal.value = false
          emit('refresh', modalType.value)
        } else {
          message.error(res.msg)
        }
      })
    }
  })

  return false
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

/**暴露给父组件使用 */
defineExpose({
  show,
})
/**回调父组件函数注册 */
const emit = defineEmits(['refresh'])
</script>
<style>
.rem_lab {
  position: absolute;
  bottom: -20px;
  font-size: 12px;
  color: #666;
}
</style>

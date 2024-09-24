<template>
  <n-drawer v-model:show="showModal" :width="drawerWidth">
    <n-drawer-content :title="modalTitle" closable>
      <n-form
        ref="formRef"
        :model="model"
        :rules="rules"
        label-placement="left"
        label-width="140px"
        require-mark-placement="right-hanging"
        :style="{
          maxWidth: '1200px',
        }"
      >
        <n-form-item label="电商类型" path="lx_type" w-300>
          <n-radio-group
            v-model:value="model.lx_type"
            name="radiogroup"
            :disabled="modalType === 1"
            @update:value="lx_typeChange"
          >
            <n-space>
              <n-radio v-for="song in shoreOptions" :key="song.value" :value="song.value">
                {{ song.label }}
              </n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        <n-form-item label="分组名称" path="name" w-400>
          <n-input
            v-model:value="model.name"
            :disabled="modalType === 1"
            placeholder="最多8个字"
            clearable
            maxlength="8"
          />
        </n-form-item>
        <n-form-item label="所属页面" path="page" w-300>
          <n-select
            v-model:value="model.page"
            :options="eliteIdOptions.pageOptions"
            :disabled="modalType === 1"
            @update:value="page_typeChange"
          />
        </n-form-item>
        <n-form-item v-if="[10, 11].includes(model.page)" label="小程序插屏广告" path="is_advertise">
          <n-switch v-model:value="model.is_advertise" />
        </n-form-item>
        <n-form-item v-if="[1].includes(model.page)" label="浏览记录推品" path="is_advertise">
          <n-switch v-model:value="model.is_advertise" />
        </n-form-item>
        <n-form-item v-if="model.page == 10" label="用户类型" path="user_group" w-300>
          <n-select v-model:value="model.user_group" :options="userOptions2" :disabled="modalType === 1" />
        </n-form-item>
        <n-form-item v-if="model.page == 13" label="用户组" path="user_group" w-300>
          <n-select v-model:value="model.user_group" :options="userOptions" :disabled="modalType === 1" />
        </n-form-item>
        <n-form-item v-if="model.page == 15" label="彬纷享礼页面" path="path_type" w-300>
          <n-select v-model:value="model.path_type" :options="eliteIdOptions.pathOptions" :disabled="modalType === 1" />
        </n-form-item>
        <n-form-item label="排序" path="sort" w-300>
          <n-input-number v-model:value="model.sort" :disabled="modalType === 1" />
        </n-form-item>
        <block v-if="model.lx_type == 1">
          <n-form-item label="分组类型" path="type" w-300>
            <n-select
              v-model:value="model.type"
              :options="typeOptions"
              :disabled="modalType === 1"
              placeholder="请选择类型"
              clearable
              @update:value="type_handleUpdate"
              @change="doChange"
            />
          </n-form-item>
          <n-form-item v-if="currentEliteIdOptions" label="频道" path="eliteId" w-300>
            <n-select
              v-model:value="model.eliteId"
              :options="currentEliteIdOptions"
              :disabled="modalType === 1"
              placeholder="频道"
              clearable
            />
          </n-form-item>
          <n-form-item v-if="model.type == 3" label="关联内容" path="cid" w-900>
            <n-select
              v-model:value="model.cid"
              label-field="name"
              value-field="cid"
              :options="contOptions.cid"
              :disabled="modalType === 1"
              placeholder="请选择一级类目"
              clearable
              @update:value="cid_handleUpdate"
            />
            <div style="margin: 0 5px; color: #999">-</div>
            <n-select
              v-model:value="model.cid2"
              label-field="name"
              value-field="cid"
              :options="contOptions.cid2"
              :disabled="modalType === 1"
              placeholder="请选择二级类目"
              clearable
              @clear="doChange"
              @update:value="cid2_handleUpdate"
            />
            <div style="margin: 0 5px; color: #999">-</div>
            <n-select
              v-model:value="model.cid3"
              label-field="name"
              value-field="cid"
              :options="contOptions.cid3"
              :disabled="modalType === 1"
              placeholder="请选择三级类目"
              clearable
              @clear="doChange"
            />
          </n-form-item>
          <n-form-item
            v-if="currentEliteIdOptions && (model.eliteId == 1001 || model.eliteId == 519)"
            label="选品库ID"
            path="groupId"
            w-300
          >
            <n-input-number
              v-model:value="model.groupId"
              :show-button="false"
              placeholder="选品库ID"
              clearable
              :disabled="modalType === 1"
            />
          </n-form-item>
          <n-form-item v-if="model.type == 4" label="选品库ID，多个用英文'|'分隔" path="groupId" w-600>
            <n-input
              v-model:value="model.groupId"
              :show-button="false"
              placeholder="选品库ID，多个用英文'|'分隔"
              clearable
              :disabled="modalType === 1"
            />
          </n-form-item>
          <n-form-item label="推广位ID" path="positionId" w-400>
            <n-input v-model:value="model.positionId" :disabled="modalType === 1" clearable />
          </n-form-item>
          <n-form-item label="最优券面值" path="coupon" w-400>
            <n-input-number v-model:value="model.coupon[0]" :disabled="modalType === 1" placeholder="最小值" min="0" />
            <div style="margin: 0 5px; color: #999">-</div>
            <n-input-number
              v-model:value="model.coupon[1]"
              :min="model.coupon[0]"
              :disabled="modalType === 1"
              placeholder="最大值"
            />
          </n-form-item>
          <n-form-item label="券后价格" path="price" w-400>
            <n-input-number v-model:value="model.price[0]" :disabled="modalType === 1" placeholder="最小值" min="0" />
            <div style="margin: 0 5px; color: #999">-</div>
            <n-input-number
              v-model:value="model.price[1]"
              :min="model.price[0]"
              :disabled="modalType === 1"
              placeholder="最大值"
            />
          </n-form-item>
          <n-form-item label="佣金比例" path="commission" w-400>
            <n-input-number
              v-model:value="model.commission[0]"
              :disabled="modalType === 1"
              placeholder="最小值"
              min="0"
            />
            <div style="margin: 0 5px; color: #999">-</div>
            <n-input-number
              v-model:value="model.commission[1]"
              :disabled="modalType === 1"
              :min="model.commission[0]"
              placeholder="最大值"
            />
          </n-form-item>
          <n-form-item label="评论数" path="review" w-400>
            <n-input-number v-model:value="model.review[0]" :disabled="modalType === 1" placeholder="最小值" min="0" />
            <div style="margin: 0 5px; color: #999">-</div>
            <n-input-number
              v-model:value="model.review[1]"
              :min="model.review[0]"
              :disabled="modalType === 1"
              placeholder="最大值"
            />
          </n-form-item>
          <n-form-item v-if="model.page == 10" label="持续时长" path="end_time" w-400>
            <n-input-number v-model:value="model.end_time" :disabled="modalType === 1" placeholder="最小值" min="1" />
            <span style="padding-left: 8px">小时</span>
          </n-form-item>
          <n-form-item label="备注说明" path="note" w-400>
            <n-input
              v-model:value="model.note"
              :disabled="modalType === 1"
              placeholder="最多200个字"
              clearable
              maxlength="200"
            />
          </n-form-item>
        </block>
        <!-- 拼多多的内容 -->
        <block v-else>
          <n-form-item label="分组类型" path="type" w-300>
            <n-select
              v-model:value="model.type"
              :options="pddTypeOptions"
              :disabled="modalType === 1"
              placeholder="请选择类型"
              @update:value="pddType_handleUpdate"
            />
          </n-form-item>
          <n-form-item label="推广位ID" path="positionId" w-400>
            <n-input v-model:value="model.positionId" :disabled="modalType === 1" clearable />
          </n-form-item>
          <n-form-item label="活动商品类目" path="activity_tags">
            <n-checkbox-group v-model:value="model.activity_tags" flex flex-wrap>
              <n-space
                v-for="item in eliteIdOptions.activityOptions"
                :key="item.value"
                item-style="display: flex;"
                mr-10
                mb-10
              >
                <n-checkbox :value="item.value" :label="item.label" />
              </n-space>
            </n-checkbox-group>
          </n-form-item>
          <block v-if="model.type == 1">
            <n-form-item label="商品类目" path="cat_id" w-300>
              <n-select
                v-model:value="model.cat_id"
                :options="eliteIdOptions.catOptions"
                :disabled="modalType === 1"
                placeholder="请选择类型"
                clearable
              />
            </n-form-item>
            <n-form-item label="频道推广" path="eliteId" w-300>
              <n-select
                v-model:value="model.eliteId"
                :options="eliteIdOptions.channelOptions"
                :disabled="modalType === 1"
                placeholder="请选择频道"
                clearable
              />
            </n-form-item>
            <n-form-item v-if="model.eliteId == 3" label="推荐商品goods_sign" path="groupId" w-400>
              <n-input v-model:value="model.groupId" :disabled="modalType === 1" placeholder="" />
            </n-form-item>
            <n-form-item label="最优券面值" path="coupon" w-400>
              <n-input-number
                v-model:value="model.coupon[0]"
                :disabled="modalType === 1"
                placeholder="最小值"
                min="0"
              />
              <div style="margin: 0 5px; color: #999">-</div>
              <n-input-number
                v-model:value="model.coupon[1]"
                :min="model.coupon[0]"
                :disabled="modalType === 1"
                placeholder="最大值"
              />
            </n-form-item>
            <n-form-item label="券后价格" path="price" w-400>
              <n-input-number v-model:value="model.price[0]" :disabled="modalType === 1" placeholder="最小值" min="0" />
              <div style="margin: 0 5px; color: #999">-</div>
              <n-input-number
                v-model:value="model.price[1]"
                :min="model.price[0]"
                :disabled="modalType === 1"
                placeholder="最大值"
              />
            </n-form-item>
            <n-form-item label="佣金比例" path="commission" w-400>
              <n-input-number
                v-model:value="model.commission[0]"
                :disabled="modalType === 1"
                placeholder="最小值"
                min="0"
              />
              <div style="margin: 0 5px; color: #999">-</div>
              <n-input-number
                v-model:value="model.commission[1]"
                :disabled="modalType === 1"
                :min="model.commission[0]"
                placeholder="最大值"
              />
            </n-form-item>
          </block>
          <block v-if="model.type == 2">
            <n-form-item v-if="goodsCatList?.length" label="商品类目ID" path="cat_id" w-900>
              <view v-for="(item, index) in goodsCatList" :key="index" flex>
                <n-select
                  v-model:value="item.id"
                  label-field="cat_name"
                  value-field="cat_id"
                  :options="item.listOptions"
                  :disabled="modalType === 1"
                  placeholder="请选择一级类目"
                  clearable
                  w-252
                  @update:value="goodsCat_handleUpdate($event, index)"
                />
                <div v-if="index < goodsCatList.length - 1" style="margin: 0 5px; color: #999">-</div>
              </view>
            </n-form-item>
            <n-form-item v-if="goodsOptList?.length" label="商品标签" path="opt_id" w-900>
              <view v-for="(item, index) in goodsOptList" :key="index" flex>
                <n-select
                  v-model:value="item.id"
                  label-field="opt_name"
                  value-field="opt_id"
                  :options="item.listOptions"
                  :disabled="modalType === 1"
                  placeholder="请选择一级类目"
                  clearable
                  w-252
                  @update:value="goodsOpt_handleUpdate($event, index)"
                />
                <div v-if="index < goodsOptList.length - 1" style="margin: 0 5px; color: #999">-</div>
              </view>
            </n-form-item>
            <n-form-item label="筛选范围列表" path="range_list">
              <n-checkbox-group v-model:value="pddRangValue" flex flex-wrap @update:value="rang_handleUpdate">
                <n-space
                  v-for="item in eliteIdOptions.pddRangOptions"
                  :key="item.value"
                  item-style="display: flex;"
                  mr-10
                  mb-10
                >
                  <n-checkbox :value="item.value" :label="item.label" />
                </n-space>
              </n-checkbox-group>
            </n-form-item>
            <div v-for="item in pddRangSelectValue" :key="item.range_id">
              <n-form-item :label="item.label" path="coupon" w-400>
                <n-input-number
                  v-model:value="item.range_from"
                  :disabled="modalType === 1"
                  placeholder="最小值"
                  min="0"
                />
                <div style="margin: 0 5px; color: #999">-</div>
                <n-input-number
                  v-model:value="item.range_to"
                  :min="item.range_from"
                  :disabled="modalType === 1"
                  placeholder="最大值"
                />
              </n-form-item>
            </div>
          </block>
          <div style="color: red; padding-left: 50px">
            注：拼多多金额单位为分（如筛选金额为“1”请填写“100”）；佣金比例是千分比（如筛选佣金为“4”请填写“40”）
          </div>
        </block>
        <n-form-item label="推券最高金额" path="max_coupon_money" mt-30 w-400>
          <n-input-number v-model:value="model.max_coupon_money" placeholder="最高金额" min="0" />
        </n-form-item>

        <div flex justify-center w-500>
          <n-button mr-10 @click="showModal = false"> 关闭 </n-button>
          <n-button v-if="modalType !== 1" type="info" @click="handleValidateButtonClick"> 保存 </n-button>
        </div>
      </n-form>
      <!-- </n-modal> -->
    </n-drawer-content>
  </n-drawer>
</template>
<script setup>
import { NButton, NInput, NInputNumber, useMessage } from 'naive-ui';
import { ref } from 'vue';
import http from './api';
import eliteIdOptions from './eliteIdOptions.js';
/**抽屉宽度 */
// const drawerWidth = window.innerWidth - 220 + 'px';
const drawerWidth = '1200px'

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
  name: {
    required: true,
    trigger: ['blur', 'input'],
    message: '分组名称不能为空',
  },
  type: {
    required: true,
    trigger: ['change'],
    message: '频道不能为空',
    type: 'number',
  },
  eliteId: {
    required: true,
    trigger: ['change'],
    message: '分组类型不能为空',
    type: 'number',
  },
  // cid: {
  //   required: true,
  //   trigger: ['change'],
  //   message: '选择分类不能为空',
  //   type: 'number',
  // },
  positionId: {
    required: true,
    trigger: ['blur', 'input'],
    message: '推广位ID不能为空',
  },
})

let shoreOptions = [
  {
    label: '京东',
    value: 1,
  },
  {
    label: '拼多多',
    value: 2,
  },
]
const userOptions = [
  {
    label: '天天享礼',
    value: 0,
  },
  {
    label: '彬纷享礼',
    value: 1,
  },
]
const userOptions2 = [
  {
    label: '新用户',
    value: 0,
  },
  {
    label: '老用户',
    value: 1,
  },
]
function lx_typeChange(value) {
  model.value.type = 2
  model.value.eliteId = null
  model.value.cat_id = null
  model.value.opt_id = null
  if (value == 2 && model.value.page == 15) {
    model.value.lx_type = 1
  }
}

/**回调父组件函数注册 */
const emit = defineEmits(['refresh'])

/**表单验证 */
function handleValidateButtonClick() {
  formRef.value?.validate((errors) => {
    if (!errors) {
      const { lx_type, cid2, cid3, eliteId, type } = model.value
      if (lx_type == 1) {
        cid2 && (model.value.cid2Name = contOptions.value.cid2.find((res) => res.cid == cid2).name)
        cid3 && (model.value.cid3Name = contOptions.value.cid3.find((res) => res.cid == cid3).name)
        eliteId &&
          currentEliteIdOptions.value &&
          (model.value.cid2Name = currentEliteIdOptions.value.find((res) => res.value == eliteId).label)
      } else {
        if (type != 1) {
          model.value.cat_id = ''
          goodsCatList.value.forEach((res) => res.id != null && (model.value.cat_id += `${res.id},`))
        }
        model.value.opt_id = ''
        goodsOptList.value.forEach((res) => res.id != null && (model.value.opt_id += `${res.id},`))
        pddRangSelectValue.value.length &&
          pddRangSelectValue.value.forEach((res) => {
            const { range_from, range_id, range_to } = res
            model.value.range_list.push({
              range_from,
              range_id,
              range_to,
            })
          })
      }
      http.operatGroup({ ...model.value }).then((res) => {
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
const showType = ref()
const showData = ref()
// 类型选项
let typeOptions = [
  {
    label: '猜你喜欢',
    value: 1,
    eliteIdOptions: eliteIdOptions.youLike,
  },
  {
    label: '京东精选',
    value: 2,
    eliteIdOptions: eliteIdOptions.recommend,
  },
  {
    label: '关键词查询',
    value: 3,
    eliteIdOptions: null,
  },
  {
    label: '选品库组合',
    value: 4,
    eliteIdOptions: null,
  },
]
let pddTypeOptions = [
  {
    label: '推荐',
    value: 1,
  },
  {
    label: '关键词查询',
    value: 2,
  },
]

// 拼多多商品类目的筛选
const goodsCatList = ref([
  {
    id: null,
    listOptions: [],
  },
])
const goodsOptList = ref([
  {
    id: null,
    listOptions: [],
  },
])
function pddType_handleUpdate(value, option) {
  if (value == 2 && model.value.lx_type == 2) {
    goodsCatList.value = []
    goodsOptList.value = []
    goodCatsUpdate()
    goodOptUpdate()
    return
  }
  model.value.cat_id = null
  model.value.opt_id = null
}

async function goodCatsUpdate(id = 0, index = 0) {
  const res = await http.goodsCats({ parent_cat_id: id })
  if (res.code != 1 || !res.data?.length) return
  const currentObj = {
    listOptions: res.data,
    id: null,
  }
  goodsCatList.value[index] = currentObj
}
function goodCatOptionsInit(cat_id) {
  return new Promise(function (resolve, reject) {
    if (cat_id instanceof Array) {
      cat_id.forEach(async (res, index) => {
        const res2 = await http.goodsCats({ parent_cat_id: index == 0 ? 0 : cat_id[index - 1] })
        if (res2.code != 1 || !res2.data?.length) return
        goodsCatList.value[index] = {
          listOptions: res2.data,
          id: res == 0 ? null : res,
        }
        resolve()
      })
      return
    }
    goodCatsUpdate()
    resolve()
  })
}
async function goodOptUpdate(id = 0, index = 0) {
  const res = await http.goodsOpt({ parent_opt_id: id })
  if (res.code != 1 || !res.data?.length) return
  goodsOptList.value[index] = {
    listOptions: res.data,
    id: null,
  }
}
function goodOptionsInit(opt_id) {
  return new Promise(function (resolve, reject) {
    if (opt_id instanceof Array) {
      opt_id.forEach(async (res, index) => {
        const res2 = await http.goodsOpt({ parent_opt_id: index == 0 ? 0 : opt_id[index - 1] })
        if (res2.code != 1 || !res2.data?.length) return
        goodsOptList.value[index] = {
          listOptions: res2.data,
          id: res == 0 ? null : res,
        }
        resolve()
      })
      return
    }
    goodOptUpdate()
    resolve()
  })
}
function goodsCat_handleUpdate(value, index) {
  value && goodCatsUpdate(value, index + 1)
}
function goodsOpt_handleUpdate(value, index) {
  value && goodOptUpdate(value, index + 1)
}
const pddRangValue = ref([])
const pddRangOptions = eliteIdOptions.pddRangOptions
const pddRangSelectValue = ref([])
function rang_handleUpdate(value, options) {
  const isCheck = options.actionType == 'check'
  const selValue = options.value
  const selItem = pddRangOptions.find((res) => res.value == selValue)
  const { value: range_id, label } = selItem
  if (isCheck) {
    pddRangSelectValue.value.push({
      range_id,
      label,
      range_from: 0,
      range_to: 0,
    })
  } else {
    const pddRangIndex = pddRangSelectValue.value.findIndex((res) => res.range_id == selValue)
    if (pddRangIndex >= 0) {
      pddRangSelectValue.value.splice(pddRangIndex, 1)
    }
  }
}
// 推荐频道ID
const currentEliteIdOptions = computed(() => {
  let typeIndex = model.value.type - 1
  const eliteIdOptions = typeOptions[typeIndex]?.eliteIdOptions
  return eliteIdOptions
})
// 清空推荐频道的ID
function type_handleUpdate(value, options) {
  model.value.eliteId = null
  model.value.cat_id = null
  model.value.opt_id = null
}
// 类目内容
let contOptions = ref({
  cid: null,
  cid2: null,
  cid2: null,
})
async function cid_init(value) {
  let params = {
    parentId: value,
    grade: 0,
  }
  const res = await http.category(params)
  contOptions.value.cid = res.data
  contOptions.value.cid2 = null
  contOptions.value.cid3 = null
  model.value.cid2 = null
  model.value.cid3 = null
}
async function cid_handleUpdate(value, options) {
  let params = {
    parentId: value,
    grade: 1,
  }
  const res = await http.category(params)
  contOptions.value.cid2 = res.data
  if (options) {
    await cid2_handleUpdate(contOptions.value.cid2[0].cid)
    model.value.cid2 = null
    model.value.cid3 = null
  }
}
async function cid2_handleUpdate(value, options) {
  let params = {
    parentId: value,
    grade: 2,
  }
  const res = await http.category(params)
  contOptions.value.cid3 = res.data
  if (options) {
    model.value.cid3 = null
  }
}
async function cidOptionsInit(cid1, cid2) {
  await cid_init(0)
  await cid_handleUpdate(cid1 || contOptions.value.cid[0].cid)
  await cid2_handleUpdate(cid2 || contOptions.value.cid2[0].cid)
}
/**展示弹窗 */
async function show(operatType, data) {
  modalTitle.value = ['查看', '编辑', '新增'][operatType - 1]
  modalType.value = operatType
  model.value = {
    name: '',
    sort: 0,
    type: 2, // 分组类型
    groupId: null, // 选品库ID
    eliteId: null, // 频道ID
    cid: null,
    cid2: null,
    cid3: null,
    cid2Name: null,
    cid3Name: null,
    coupon: [0, 0], // 优惠券范围
    price: [0, 0], // 商品价格
    commission: [0, 0], // 佣金比例
    review: [0, 0], // 评论范围
    positionId: null, //推广位ID
    page: 1, //所属页面
    path_type: 0, //彬纷享礼归属页面
    user_group: 0, //用户组
    note: '', //备注说明
    end_time: '', //持续时长
    lx_type: 1, // 1 京东 2 拼多多
    activity_tags: [],
    cat_id: null,
    range_list: [],
    is_advertise: false,
    max_coupon_money: 0,
  }
  showType.value = operatType
  showData.value = data
  // await cidOptionsInit(0); // 类目选择的列表
  showModal.value = true
  if (operatType < 3) {
    getTableData(data?.id)
  }
  await cidOptionsInit(0) // 类目选择的列表
}
function getTableData(id) {
  if (showType.value !== 3) {
    return getGroupDetails(id)
  }
  showModal.value = true
}
function doChange(e) {
  model.value.cid2 = null
  model.value.cid3 = null
  model.value.cid2Name = null
  model.value.cid3Name = null
}
async function getGroupDetails(rowId) {
  http.getGroupDetails({ id: rowId }).then(async (res) => {
    let {
      id,
      name,
      sort,
      type,
      groupId,
      eliteId,
      cid,
      cid2,
      cid3,
      coupon,
      price,
      commission,
      review,
      positionId,
      cid2Name,
      cid3Name,
      page,
      path_type,
      user_group,
      note,
      end_time,
      lx_type,
      cat_id,
      opt_id,
      range_list: [],
      activity_tags,
      pddRangSelect,
      pddRang,
      is_advertise,
      max_coupon_money,
    } = res.data
    if (lx_type == 1) {
      //  京东类目选择的列表
      await cidOptionsInit(cid, cid2)
    } else {
      await goodCatOptionsInit(cat_id)
      await goodOptionsInit(opt_id)
    }
    model.value = {
      id,
      name,
      sort,
      type: type || 2,
      groupId,
      eliteId,
      cid: cid || null,
      coupon: coupon || [0, 0], // 优惠券范围
      price: price || [0, 0], // 商品价格
      commission: commission || [0, 0], // 佣金比例
      review: review || [0, 0], // 评论范围
      positionId, //推广位ID
      cid2Name: cid2Name || null,
      cid3Name: cid3Name || null,
      page,
      path_type,
      user_group,
      note,
      end_time,
      lx_type,
      cat_id,
      opt_id,
      range_list: [],
      activity_tags,
      is_advertise: Boolean(is_advertise),
      max_coupon_money,
    }
    model.value.cid = cid || null
    model.value.cid2 = cid2 || null
    model.value.cid3 = cid3 || null
    if (model.value.lx_type == 1 || (model.value.lx_type == 2 && model.value.type == 1)) return
    pddRangValue.value = pddRang
    pddRangSelectValue.value = pddRangSelect
  })
}
function page_typeChange(value) {
  console.log(value)
  if (value == 15) {
    model.value.lx_type = 1
    shoreOptions = [
      {
        label: '京东',
        value: 1,
      },
    ]
  } else {
    shoreOptions = [
      {
        label: '京东',
        value: 1,
      },
      {
        label: '拼多多',
        value: 2,
      },
    ]
  }
  model.value.page = value
}
/**暴露给父组件使用 */
defineExpose({
  show,
})
</script>

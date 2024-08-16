<template>
  <n-drawer v-model:show="showModal" :width="drawerWidth" resizable>
    <n-drawer-content :title="modalTitle" closable>
      <n-form
        ref="formRef"
        :model="model"
        :rules="rules"
        label-placement="left"
        label-width="120px"
        require-mark-placement="right-hanging"
      >
        <div flex>
          <div>
            <n-form-item label="分组名称" path="name" w-300>
              <n-input v-model:value="model.name" />
            </n-form-item>
            <n-form-item label="类别" path="lx_type" w-400>
              <n-select v-model:value="model.lx_type" :options="tyOptions" @update:value="lx_handleUpdate" />
            </n-form-item>
          </div>
        </div>
        <div>
          <block v-if="model.lx_type == 1">
            <n-form-item label="分组类型" path="type" w-300>
              <n-select
                v-model:value="model.type"
                :options="typeOptions"
                placeholder="请选择类型"
                clearable
                @update:value="type_handleUpdate"
              />
            </n-form-item>
            <n-form-item v-if="currentEliteIdOptions" label="频道" path="eliteId" w-300>
              <n-select
                v-model:value="model.eliteId"
                :options="currentEliteIdOptions"
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
              <n-input-number v-model:value="model.groupId" :show-button="false" placeholder="选品库ID" clearable />
            </n-form-item>
            <n-form-item v-if="model.type == 4" label="选品库ID，多个用英文'|'分隔" path="groupId" w-600>
              <n-input
                v-model:value="model.groupId"
                :show-button="false"
                placeholder="选品库ID，多个用英文'|'分隔"
                clearable
              />
            </n-form-item>
            <n-form-item label="推广位ID" path="positionId" w-400>
              <n-input v-model:value="model.positionId" clearable />
            </n-form-item>
            <n-form-item label="最优券面值" path="coupon" w-400>
              <n-input-number v-model:value="model.coupon[0]" placeholder="最小值" min="0" />
              <div style="margin: 0 5px; color: #999">-</div>
              <n-input-number v-model:value="model.coupon[1]" :min="model.coupon[0]" placeholder="最大值" />
            </n-form-item>
            <n-form-item label="券后价格" path="price" w-400>
              <n-input-number v-model:value="model.price[0]" placeholder="最小值" min="0" />
              <div style="margin: 0 5px; color: #999">-</div>
              <n-input-number v-model:value="model.price[1]" :min="model.price[0]" placeholder="最大值" />
            </n-form-item>
            <n-form-item label="佣金比例" path="commission" w-400>
              <n-input-number v-model:value="model.commission[0]" placeholder="最小值" min="0" />
              <div style="margin: 0 5px; color: #999">-</div>
              <n-input-number
                v-model:value="model.commission[1]"
                :min="model.commission[0]"
                placeholder="最大值"
              />
            </n-form-item>
            <n-form-item label="评论数" path="review" w-400>
              <n-input-number v-model:value="model.review[0]" placeholder="最小值" min="0" />
              <div style="margin: 0 5px; color: #999">-</div>
              <n-input-number v-model:value="model.review[1]" :min="model.review[0]" placeholder="最大值" />
            </n-form-item>
            <n-form-item label="备注说明" path="note" w-400>
              <n-input v-model:value="model.note" placeholder="最多200个字" clearable maxlength="200" />
            </n-form-item>
          </block>
          <!-- 拼多多的内容 -->
          <block v-else>
            <n-form-item label="分组类型" path="type" w-300>
              <n-select
                v-model:value="model.type"
                :options="pddTypeOptions"
                placeholder="请选择类型"
                @update:value="pddType_handleUpdates"
              />
            </n-form-item>
            <n-form-item label="推广位ID" path="positionId" w-400 v-if="model.is_rebate != 1">
              <n-input v-model:value="model.positionId" clearable />
            </n-form-item>
            <n-form-item label="活动商品类目" path="activity_tags">
              <n-checkbox-group
                v-model:value="model.activity_tags"
                flex
                flex-wrap
                @update:value="activity_handleUpdateValue"
              >
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
                  placeholder="请选择类型"
                  clearable
                />
              </n-form-item>
              <n-form-item label="频道推广" path="eliteId" w-300>
                <n-select
                  v-model:value="model.eliteId"
                  :options="eliteIdOptions.channelOptions"
                  placeholder="请选择频道"
                  clearable
                />
              </n-form-item>
              <n-form-item label="最优券面值" path="coupon" w-400>
                <n-input-number v-model:value="model.coupon[0]" placeholder="最小值" min="0" />
                <div style="margin: 0 5px; color: #999">-</div>
                <n-input-number
                  v-model:value="model.coupon[1]"
                  :min="model.coupon[0] || 0"
                  placeholder="最大值"
                />
              </n-form-item>
              <n-form-item label="券后价格" path="price" w-400>
                <n-input-number v-model:value="model.price[0]" placeholder="最小值" min="0" />
                <div style="margin: 0 5px; color: #999">-</div>
                <n-input-number v-model:value="model.price[1]" :min="model.price[0] || 0" placeholder="最大值" />
              </n-form-item>
              <n-form-item label="佣金比例" path="commission" w-400>
                <n-input-number v-model:value="model.commission[0]" placeholder="最小值" min="0" />
                <div style="margin: 0 5px; color: #999">-</div>
                <n-input-number
                  v-model:value="model.commission[1]"
                  :min="model.commission[0] || 0"
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
                    placeholder="请选择一级类目"
                    clearable
                    w-252
                    @update:value="goodsOpt_handleUpdate($event, index)"
                  />
                  <div v-if="index < goodsOptList.length - 1" style="margin: 0 5px; color: #999">-</div>
                </view>
              </n-form-item>
              <n-form-item label="筛选范围列表" path="range_list">
                <n-checkbox-group v-model:value="pddRang" flex flex-wrap @update:value="rang_handleUpdate">
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

              <div v-for="item in pddRangSelect" :key="item.range_id">
                <n-form-item :label="item.label" path="coupon" w-400>
                  <n-input-number v-model:value="item.range_from" placeholder="最小值" min="0" />
                  <div style="margin: 0 5px; color: #999">-</div>
                  <n-input-number v-model:value="item.range_to" :min="item.range_from" placeholder="最大值" />
                </n-form-item>
              </div>
            </block>
            <div style="color: red; padding-left: 50px">注：拼多多金额单位为分（如筛选金额为“1”请填写“100”）；佣金比例是千分比（如筛选佣金为“4”请填写“40”）</div>
          </block>
        </div>
        <div flex justify-center w-1000>
          <n-button mr-10 @click="closeModel"> 关闭 </n-button>
          <n-button type="info" @click="handleValidate"> 保存 </n-button>
        </div>
      </n-form>
    </n-drawer-content>
  </n-drawer>
</template>
<script setup>
import { renderIcon } from '@/utils';
import { NButton, NInput, NInputNumber, NSwitch, useMessage } from 'naive-ui';
import { ref } from 'vue';
import http from '../api';
import { lxtypeOptions } from '../options';
import eliteIdOptions from './eliteIdOptions.js';

/**弹窗显示控制 */
const showModal = ref(false)
/**抽屉宽度 */
const drawerWidth = window.innerWidth - 220 + 'px'
/**弹窗类型 1.修改 2新增*/
const modalType = ref(1)
/**modalTitle */
const modalTitle = ref('')
//提示展示
const message = useMessage()
/**表单 */
const formRef = ref(null)
//表单数据
const model = ref({
  name: null,
  type: 1, // 分组类型
  groupId: null, // 选品库ID
  eliteId: null, // 频道ID
  cid: null,
  cid2: null,
  cid3: null,
  cid2Name: null,
  cid3Name: null,
  coupon: ['', ''], // 优惠券范围
  price: ['', ''], // 商品价格
  commission: ['', ''], // 佣金比例
  review: ['', ''], // 评论范围
  positionId: null, //推广位ID
  note: '', //备注说明
  lx_type: 1, // 1 京东 2 拼多多
  activity_tags: [],
  cat_id: null,
  opt_id: null,
  range_list: [],
})
//校验数据
const rules = ref({
  name: {
    required: true,
    trigger: ['blur', 'input'],
    message: '分组名称不能为空',
  },
})
//商品cell
let couponColumns = ref([])
//删除选择
function delGoods(data) {
  let index = model.value.goods_list.findIndex((item) => item.id === data.id)
  model.value.goods_list.splice(index, 1)
  model.value.gids = model.value.goods_list.map((item) => item.id).join(',')
}
//类型
const tyOptions = [
  {
    label: '京东',
    value: 1,
  },
  {
    label: '拼多多',
    value: 2,
  },
]
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
/**展示弹窗 */
async function show(operateType, data) {
  modalType.value = operateType
  modalTitle.value = ['编辑', '新增'][operateType - 1]
  init(data)
}
function lx_handleUpdate(value) {
  console.log(value)
  if (value == 1) {
    model.value.lx_type = 1
    cidOptionsInit(0) // 类目选择的列表
  }
  if (value == 2) {
    model.value.lx_type = 2
    model.value.type = 1
    goodCatOptionsInit(0)
    goodOptionsInit(0)
  }
}
const pddRang = ref([])
const pddRangOptions = eliteIdOptions.pddRangOptions
const pddRangSelect = ref([])
function rang_handleUpdate(value, options) {
  const isCheck = options.actionType == 'check'
  const selValue = options.value
  const selItem = pddRangOptions.find((res) => res.value == selValue)
  const { value: range_id, label } = selItem
  if (isCheck) {
    pddRangSelect.value.push({
      range_id,
      label,
      range_from: 0,
      range_to: 0,
    })
  } else {
    const pddRangIndex = pddRangSelect.value.findIndex((res) => res.range_id == selValue)
    if (pddRangIndex >= 0) {
      pddRangSelect.value.splice(pddRangIndex, 1)
    }
  }
}
async function init(data = {}) {
  model.value = {
    name: null,
    type: 1, // 分组类型
    groupId: null, // 选品库ID
    eliteId: null, // 频道ID
    cid: null,
    cid2: null,
    cid3: null,
    cid2Name: null,
    cid3Name: null,
    coupon: ['', ''], // 优惠券范围
    price: ['', ''], // 商品价格
    commission: ['', ''], // 佣金比例
    review: ['', ''], // 评论范围
    positionId: null, //推广位ID
    note: '', //备注说明
    lx_type: 1, // 1 京东 2 拼多多
    activity_tags: [],
    cat_id: null,
    opt_id: null,
    range_list: [],
  }
  if (modalType.value === 1) {
    const { id: reid } = data
    const res = await http.getDetails({ id: reid })
    let { id, name, type, groupId, eliteId, cid, cid2, cid3, cid2Name, cid3Name, coupon, price, commission, positionId, review, note, lx_type, activity_tags, cat_id, opt_id, range_list } = res.data
    if (lx_type == 1) {
      await cidOptionsInit(cid, cid2)
    } else if (lx_type == 2) {
      await goodCatOptionsInit(cat_id)
      await goodOptionsInit(opt_id)
    }
    // 类目选择的列表
    model.value = {
      id,
      name,
      type, // 分组类型
      groupId, // 选品库ID
      eliteId, // 频道ID
      cid,
      cid2,
      cid3,
      cid2Name,
      cid3Name,
      coupon, // 优惠券范围
      price, // 商品价格
      commission, // 佣金比例
      review, // 评论范围
      positionId, //推广位ID
      note, //备注说明
      lx_type, // 1 京东 2 拼多多
      activity_tags,
      cat_id,
      opt_id,
      range_list,
    }
    showModal.value = true
    if (model.value.lx_type == 1 || (model.value.lx_type == 2 && model.value.type == 1)) return
    model.value.range_list = []
    pddRang.value = res.data.pddRang
    pddRangSelect.value = []
    pddRangSelect.value = res.data.pddRangSelect
    return
  }
  showModal.value = true
}

/**校验表单 */
function handleValidate() {
  formRef.value?.validate((errors) => {
    if (!errors) {
      if (model.value.lx_type == 1) {
        model.value.cid2 &&
          (model.value.cid2Name = contOptions.value.cid2.find((res) => res.cid == model.value.cid2).name)
        model.value.cid3 &&
          (model.value.cid3Name = contOptions.value.cid3.find((res) => res.cid == model.value.cid3).name)
        model.value.eliteId &&
          currentEliteIdOptions.value &&
          (model.value.cid2Name = currentEliteIdOptions.value.find((res) => res.value == model.value.eliteId).label)
      } else if (model.value.lx_type == 2) {
        if (model.value.type != 1) {
          model.value.cat_id = ''
          goodsCatList.value.forEach((res) => res.id != null && (model.value.cat_id += `${res.id},`))
        }
        model.value.opt_id = ''
        goodsOptList.value.forEach((res) => res.id != null && (model.value.opt_id += `${res.id},`))
        pddRangSelect.value.length &&
          pddRangSelect.value.forEach((res) => {
            const { range_from, range_id, range_to } = res
            model.value.range_list.push({
              range_from,
              range_id,
              range_to,
            })
          })
      }
      /**还原数据 */
      let params = {
        ...model.value,
      }
      delete params.goods_list
      http.dos(params).then((res) => {
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

//选择商品
const selecGoodsRef = ref()
function selectGoods() {
  selecGoodsRef.value.show(model.value.goods_list, model.value.system, model.value.is_rebate)
}
function selectSave(data) {
  // console.log('data :>> ', data)
  model.value.goods_list = data.map((item, index) => {
    return {
      ...item,
      _index: index + 1,
    }
  })
}
/**关闭弹窗 */
function closeModel() {
  showModal.value = false
}
// 清空推荐频道的ID
function type_handleUpdate(value, options) {
  console.log(value)
  if(value == 3){
    cidOptionsInit(0) // 类目选择的列表
  }
  model.value.eliteId = null
  model.value.cid2 = null
  model.value.cid3 = null
  model.value.cid2Name = null
  model.value.cid3Name = null
}
// 推荐频道ID
const currentEliteIdOptions = computed(() => {
  let typeIndex = model.value.type - 1
  const eliteIdOptions = typeOptions[typeIndex]?.eliteIdOptions
  return eliteIdOptions
})
// 类目内容
let contOptions = ref({
  cid: null,
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
  }
  if (!value) {
    await cidOptionsInit(0)
  }
  model.value.cid2 = null
  model.value.cid3 = null
}
async function cid2_handleUpdate(value, options) {
  let params = {
    parentId: value,
    grade: 2,
  }
  const res = await http.category(params)
  contOptions.value.cid3 = res.data
  if (!value) {
    model.value.cid3 = null
  }
}
async function cidOptionsInit(cid1, cid2) {
  await cid_init(0)
  await cid_handleUpdate(cid1 || contOptions.value.cid[0].cid)
  await cid2_handleUpdate(cid2 || contOptions.value.cid2[0].cid)
}

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
function pddType_handleUpdates(value) {
  console.log(value)
  if (value == 2) {
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
function activity_handleUpdateValue(value) {
  //   console.log('activity_handleUpdateValue', value)
}
function goodsCat_handleUpdate(value, index) {
  value && goodCatsUpdate(value, index + 1)
}
function goodsOpt_handleUpdate(value, index) {
  value && goodOptUpdate(value, index + 1)
}

/**暴露给父组件使用 */
defineExpose({
  show,
})
/**回调父组件函数注册 */
const emit = defineEmits(['refresh'])
</script>

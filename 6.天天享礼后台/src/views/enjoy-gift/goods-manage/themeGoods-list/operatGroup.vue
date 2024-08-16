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
          maxWidth: '4000px',
        }"
      >
        <n-form-item label="名称" path="title" w-300>
          <n-input v-model:value="model.title" :disabled="modalType === 1" />
        </n-form-item>
        <n-form-item label="背景图片" path="bg_img">
          <n-upload
            action="/apios/Tools/uploadImg"
            list-type="image-card"
            :default-file-list="bgFileList"
            :max="1"
            name="img"
            @remove="removeFileList('bg_img')"
            @finish="handleFinish($event, 'bg_img')"
          >
            <n-button quaternary>上传文件</n-button>
          </n-upload>
        </n-form-item>
        <n-form-item label="背景颜色" path="bg_color" w-300>
          <n-color-picker v-model:value="model.bg_color" :show-alpha="false" :actions="['clear']" />
        </n-form-item>
        <n-form-item label="分享标题" path="share_word" w-600>
          <n-input v-model:value="model.share_word" clearable />
        </n-form-item>
        <n-form-item label="分享图片" path="share_img">
          <n-upload
            action="/apios/Tools/uploadImg"
            list-type="image-card"
            :default-file-list="shareFileList"
            :max="1"
            name="img"
            @remove="removeFileList('share_img')"
            @finish="handleFinish($event, 'share_img')"
          >
            <n-button quaternary>上传文件</n-button>
          </n-upload>
        </n-form-item>
        <n-form-item label="类型" path="goods_lx_type" w-300>
          <n-select
            v-model:value="model.goods_lx_type"
            :options="lxOptions"
            :disabled="modalType === 1"
            @update:value="lxTypeOptionsUpdate"
          />
        </n-form-item>
        <n-form-item label="消耗牛金豆" path="has_credits" w-400>
          <n-switch v-model:value="model.has_credits" />
        </n-form-item>
        <!-- 自选 -->
        <div v-if="model.goods_lx_type == 1">
          <n-form-item label="京东推广位ID" path="jd_positionId" w-300>
            <n-input
              v-model:value="model.jd_positionId"
              :show-button="false"
              placeholder="京东推广位ID"
              clearable
              @input="handleUpdateFilter"
            />
          </n-form-item>
          <n-form-item label="拼多多推广位ID" path="pdd_positionId" w-340>
            <n-input
              v-model:value="model.pdd_positionId"
              :show-button="false"
              placeholder="拼多多推广位ID"
              clearable
              @input="handleUpdateFilter"
            />
          </n-form-item>
          <n-form-item label="添加商品" path="coupon_id" w-600>
            <n-button mr-10 :disabled="modalType === 1" @click="selectHandle"> 选择商品列表 </n-button>
          </n-form-item>
          <n-form-item label="搜索商品" path="defaultCouponFilter" w-400>
            <n-input v-model:value="defaultCouponFilter" @input="handleUpdateFilter" />
          </n-form-item>
          <n-form-item label="商品列表" path="group">
            <n-data-table
              id="dragTable"
              ref="tableRef"
              :scroll-x="1200"
              :columns="columns"
              :data="tableData"
              :checked-row-keys="model.group"
              :row-key="(row) => row['coupon_id']"
              :pagination="false"
              max-height="820px"
              @update:checked-row-keys="handleCheck"
              @update:filters="handleUpdateFilter"
            />
          </n-form-item>
        </div>
        <!-- 京东 -->
        <div v-if="model.goods_lx_type == 2">
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
          </n-form-item>
        </div>
        <!-- 拼多多 -->
        <div v-if="model.goods_lx_type == 3">
          <n-form-item label="分组类型" path="type" w-300>
            <n-select
              v-model:value="model.type"
              :options="pddTypeOptions"
              :disabled="modalType === 1"
              placeholder="请选择类型"
              clearable
              @update:value="pddType_handleUpdate"
            />
          </n-form-item>
          <n-form-item label="推广位ID" path="positionId" w-400>
            <n-input v-model:value="model.positionId" :disabled="modalType === 1" clearable />
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
            <n-form-item label="商品类目ID" path="cat_id" w-900>
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
            <n-form-item label="商品标签" path="opt_id" w-900>
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
        </div>
        <div flex justify-center w-1000>
          <n-button mr-10 @click="showModal = false"> 关闭 </n-button>
          <n-button v-if="modalType !== 1" type="info" @click="handleValidateButtonClick"> 保存 </n-button>
        </div>
      </n-form>
      <!-- </n-modal> -->
    </n-drawer-content>
  </n-drawer>
  <operat-group-detail ref="operatGroupDetailRef" :ck-ids="ckIds" @addList="addListHandle" />
</template>
<script setup>
import { renderIcon } from '@/utils';
import { NButton, NInputNumber, NSelect, useMessage } from 'naive-ui';
import { ref } from 'vue';
import http from './api';
import eliteIdOptions from './eliteIdOptions.js';
import operatGroupDetail from './operatGroupDetail.vue';
/**抽屉宽度 */
const drawerWidth = window.innerWidth - 220 + 'px'
/**弹窗显示控制 */
const showModal = ref(false)
/**弹窗类型 1.查看 2.修改,3.新增*/
const modalType = ref(3)
const modalTitle = ref('新增')
/**弹窗取消 */
function onNegativeClick() {}
/**表单 */
const formRef = ref(null)
/**类型下拉 */
const lxOptions = [
  {
    label: '自选',
    value: 1,
  },
  {
    label: '京东',
    value: 2,
  },
  {
    label: '拼多多',
    value: 3,
  },
]
const end_time = ref([])
// 商品选择
const shopOptions = ref([])
async function lxTypeOptionsUpdate(value, option) {
  model.value.type = 1
  model.value.cat_id = null
  model.value.opt_id = null
  if (value == 2) await cidOptionsInit() // 类目选择的列表
  if (value == 3) {
    goodsCatList.value = []
    goodsOptList.value = []
    goodCatsUpdate()
    goodOptUpdate()
  }
}

const operatGroupDetailRef = ref(null)
function selectHandle() {
  operatGroupDetailRef.value.show(shopOptions.value)
}
// 添加数组内容
function addListHandle(addList) {
  addList &&
    addList.forEach((item) => {
      shopOptions.value = shopOptions.value.filter((optionItem) => optionItem.coupon_id != item.coupon_id)
      model.value.group.push(item.coupon_id)
      tableData.value.push({
        ...item,
        _index: tableData.value.length + 1,
        current_index: tableData.value.length,
      })
    })
  // 滑动到底部
  setTimeout(() => {
    tableRef.value.scrollTo({
      left: 0,
      top: 10000,
    })
  }, 100)
  defaultCouponFilter.value = ''
  tableRef.value.filter({
    title: [],
  })
}
//图片上传
function handleFinish({ event }, dataType) {
  let { response, responseText } = event.currentTarget
  let res = JSON.parse(response || responseText)
  if (res.code != 1) {
    message.error(res.msg)
    return
  }
  model.value[dataType] = res.data.url
}
function removeFileList(dataType) {
  model.value[dataType] = ''
}
//提示展示
const message = useMessage()
//表单数据
const model = ref({})
//校验数据
const rules = ref({
  title: {
    required: true,
    trigger: ['blur', 'input'],
    message: '分组名称不能为空',
  },
  bg_img: {
    required: true,
    trigger: ['blur', 'input'],
    message: '背景图片不能为空',
  },
  lx_type: {
    required: true,
    trigger: ['blur', 'input'],
    validator: function (rule, value) {
      return true
    },
    message: '请选择',
  },
  group: {
    required: true,
    validator: function (rule, value) {
      return value.length > 0
    },
    trigger: ['blur', 'input'],
    message: '请勾选该分组下的优惠券',
  },
})
//查询参数
const tableData = ref([])
const status_options = [
  {
    label: '半屏跳转',
    value: 0,
  },
  {
    label: 'feed流',
    value: 1,
  },
  {
    label: '中转详情',
    value: 2,
  },
]
//优惠券列表选择相关
const columns = [
  {
    type: 'selection',
    key: 'coupon_id',
    disabled(row) {
      return modalType.value == 1
    },
    render() {
      return true
    },
  },
  { title: 'ID', key: 'coupon_id', align: 'center', width: 160 },
  {
    title: '商品名称',
    key: 'title',
    align: 'center',
    width: 252,
    filter(value, row) {
      return ~row.title.indexOf(value)
    },
    render(row) {
      return row.title
    },
  },
  {
    title: '佣金率',
    width: 80,
    key: 'commissionShare',
    align: 'center',
    render(row) {
      return row.commissionShare || 0
    },
  },
  {
    title: '面值(元)',
    key: 'face_value',
    align: 'center',
    width: 100,
    render(row) {
      return row.face_value
    },
  },
  { title: '兑换价格(牛金豆)', key: 'credits', align: 'center', width: 150 },
  {
    title: '来源',
    key: 'lx_type',
    align: 'center',
    width: 80,
    render(row, index) {
      return ['', '', '京东', '自建', '拼多多'][row.lx_type]
    },
  },
  {
    title: '打开方式',
    key: 'is_flow',
    align: 'center',
    width: 80,
    render(row, index) {
      return h(NSelect, {
        options: status_options,
        size: 'small',
        value: row.is_flow,
        'label-field': 'label',
        'value-field': 'value',
        disabled: row.lx_type == 3,
        onUpdateValue: (updateValue) => {
          const currentIndex = row.current_index
          tableData.value[currentIndex].is_flow = updateValue
        },
      })
    },
  },
  {
    title: '无券',
    key: 'not_coupon',
    align: 'center',
    width: 80,
    render(row, index) {
      return row.lx_type == 2 ? (row.not_coupon == 1 ? '是' : '否') : ''
    },
  },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    fixed: 'right',
    size: 'large',
    width: 260,
    render(row, index) {
      return [
        h(
          NButton,
          {
            size: 'tiny',
            type: 'primary',
            style: {
              'margin-right': '10px',
            },
            disabled: modalType.value == 1,
            secondary: true,
            onClick: () => {
              const currentIndex = row.current_index
              const currData = tableData.value[currentIndex]
              tableData.value.splice(currentIndex, 1)
              tableData.value.unshift(currData)
              resetIndex()
            },
          },
          { default: () => '置顶', icon: renderIcon('typcn:arrow-up-thick', { size: 14 }) }
        ),
        h(NInputNumber, {
          value: row._index,
          min: 1,
          size: 'tiny',
          max: tableData.value.length,
          style: {
            'margin-right': '10px',
            width: '85px',
            display: 'inline-block',
          },
          disabled: modalType.value == 1,
          onUpdateValue(value) {
            const currentIndex = row.current_index
            tableData.value[currentIndex]._index = value
          },
          onBlur(value) {
            const currInputIndex = row.current_index
            const inputValue = row._index - 1
            if (currInputIndex === inputValue) return
            const currData = tableData.value[currInputIndex]
            const targetIndex = tableData.value[inputValue]
            tableData.value.splice(currInputIndex, 1)
            tableData.value.splice(inputValue, 0, currData)
            // tableData.value[inputValue] = currData
            // tableData.value[currInputIndex] = targetIndex
            resetIndex()
          },
        }),
        h(
          NButton,
          {
            size: 'tiny',
            type: 'primary',
            style: {
              'margin-right': '10px',
            },
            secondary: true,
            disabled: modalType.value == 1,
            onClick: () => {
              const currentIndex = row.current_index
              const currData = tableData.value[currentIndex]
              tableData.value.splice(currentIndex, 1)
              tableData.value.push(currData)
              resetIndex()
            },
          },
          { default: () => '置底', icon: renderIcon('typcn:arrow-down-thick', { size: 14 }) }
        ),
      ]
    },
  },
]
// 重置数组的排序
function resetIndex() {
  tableData.value.forEach((item, index) => {
    item._index = index + 1
    item.current_index = index
  })
}
/**回调父组件函数注册 */
const emit = defineEmits(['refresh'])
/** 表单过滤 */
const handleUpdateFilter = () => {
  let arr = []
  arr.push(defaultCouponFilter.value)
  tableRef.value.filter({
    title: arr,
  })
}

// 过滤优惠券
const defaultCouponFilter = ref('')
const tableRef = ref(null)
const handleCheck = (rowKeys) => {
  model.value.group = rowKeys
}

/**表单验证 */
function handleValidateButtonClick() {
  formRef.value?.validate((errors) => {
    if (!errors) {
      let { group, goods_lx_type, type } = model.value
      group = tableData.value
        .filter((item) => group.includes(item.coupon_id))
        .map((item) => ({
          coupon_id: item.coupon_id,
          is_flow: item.is_flow,
          goods_sign: item.goods_sign || '',
          itemId: item.itemId || '',
        }))
      // 拼多多的类目选择
      if (goods_lx_type == 3) {
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
      http
        .operatGroup({
          ...model.value,
          group,
        })
        .then((res) => {
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
const ckIds = ref([])
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
  if (value == 2 && model.value.goods_lx_type == 3) {
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
  goodsCatList.value[index] = {
    listOptions: res.data,
    id: null,
  }
}
async function goodOptUpdate(id = 0, index = 0) {
  const res = await http.goodsOpt({ parent_opt_id: id })
  if (res.code != 1 || !res.data?.length) return
  goodsOptList.value[index] = {
    listOptions: res.data,
    id: null,
  }
}
function activity_handleUpdateValue(value) {}
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
  defaultCouponFilter.value = ''
  modalTitle.value = ['查看', '编辑', '新增'][operatType - 1]
  modalType.value = operatType
  model.value = {
    id: 0,
    title: '',
    bg_img: '',
    bg_color: '#18A058',
    group: [],
    goods_lx_type: 1,
    has_credits: 1,
    jd_positionId: '',
    pdd_positionId: '',
    type: 2, // 分组类型
    groupId: null, // 选品库ID
    eliteId: null, // 频道ID
    cid: null,
    cid2: null,
    cid3: null,
    coupon: [0, 0], // 优惠券范围
    price: [0, 0], // 商品价格
    commission: [0, 0], // 佣金比例
    review: [0, 0], // 评论范围
    positionId: null, //推广位ID
    lx_type: 2,
    activity_tags: [],
    cat_id: null,
    range_list: [],
    share_word: '',
    share_img: '',
  }
  model.value.has_credits = Boolean(model.value.has_credits)
  showType.value = operatType
  showData.value = data
  ckIds.value = []
  getTableData(data?.id)
  bgFileList.value = []
  shareFileList.value = []
}
function getTableData(type) {
  if (showType.value !== 3) {
    return getGroupDetails(type)
  }
  getCouponList()
}
const bgFileList = ref([])
const shareFileList = ref([])
function getGroupDetails(type) {
  http
    .getGroupDetails({
      id: showData.value.id,
    })
    .then(async (res) => {
      let {
        id,
        title,
        bg_img,
        bg_color,
        goods_lx_type,
        has_credits,
        jd_positionId,
        pdd_positionId,
        list,
        list2,
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
        note,
        end_time,
        lx_type,
        cat_id,
        opt_id,
        range_list,
        activity_tags,
        share_word,
        share_img,
        pddRangSelect,
        pddRang,
      } = res.data
      console.log('goods_lx_type', goods_lx_type)
      if (goods_lx_type == 2) await cidOptionsInit(cid, cid2) // 类目选择的列表
      if (goods_lx_type == 3) {
        await goodCatOptionsInit(cat_id)
        await goodOptionsInit(opt_id)
      }
      let _list = list.filter((item, index) => {
        if (item.coupon_id) {
          item._index = index + 1
          item.current_index = index
          return true
        }
        return false
      })
      bgFileList.value = []
      shareFileList.value = []
      if (bg_img) {
        bgFileList.value.push({
          id: 'c',
          name: '已上传的图片',
          status: 'finished',
          url: bg_img,
        })
      }
      if (share_img) {
        shareFileList.value.push({
          id: 'c',
          name: '已上传的图片',
          status: 'finished',
          url: share_img,
        })
      }
      // 供选中 - 未搜索的使用
      shopOptions.value = list2
      const group = _list.map((item) => item.coupon_id)
      model.value = {
        id,
        title,
        bg_img,
        bg_color,
        goods_lx_type,
        has_credits,
        jd_positionId,
        pdd_positionId,
        list,
        list2,
        group,
        type,
        groupId,
        eliteId,
        cid,
        cid2,
        cid3,
        coupon: coupon || [0, 0], // 优惠券范围
        price: price || [0, 0], // 商品价格
        commission: commission || [0, 0], // 佣金比例
        review: review || [0, 0],
        positionId,
        cid2Name,
        cid3Name,
        page,
        note,
        end_time,
        lx_type,
        cat_id,
        opt_id,
        range_list,
        activity_tags,
        share_word,
        share_img,
      }
      tableData.value = _list
      showModal.value = true
      ckIds.value = res.data.ckIds
      model.value.has_credits = Boolean(model.value.has_credits)
      model.value.cid = cid || null
      model.value.cid2 = cid2 || null
      model.value.cid3 = cid3 || null
      pddRangValue.value = pddRang
      pddRangSelectValue.value = pddRangSelect
      model.value.range_list = []
    })
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
// 新增获取的列表
function getCouponList() {
  const deviceType = model.value.type
  http.couponList({ p_type: deviceType }).then((res) => {
    let { list } = res.data
    tableData.value = []
    shopOptions.value = list
    showModal.value = true
  })
}

/**暴露给父组件使用 */
defineExpose({
  show,
})
</script>

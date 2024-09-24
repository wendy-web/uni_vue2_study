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
            <n-form-item label="分组名称" path="title" w-300>
              <n-input v-model:value="model.title" />
            </n-form-item>
            <n-form-item label="分组类型" path="is_rebate" w-400>
              <n-select v-model:value="model.is_rebate" :options="rebateOptions" @update:value="groupChange" />
            </n-form-item>
            <n-form-item v-if="model.is_rebate == 1" label="追加电商分组" path="circle" w-400>
              <n-select v-model:value="model.circle" :filterable="modalType === 1" :options="channelOptions" multiple />
            </n-form-item>
            <n-form-item label="系统类型" path="system" w-400>
              <n-select v-model:value="model.system" :options="systemOptions" />
            </n-form-item>
            <n-form-item label="类别" path="lx_type" w-400>
              <n-select v-model:value="model.lx_type" :options="tyOptions" @update:value="lx_handleUpdate" />
            </n-form-item>
            <n-form-item label="排序" path="sort" w-300>
              <n-input-number v-model:value="model.sort" />
            </n-form-item>
            <n-form-item v-if="model.lx_type == 1 && model.is_rebate != 1" label="京东推广位ID" path="positionId" w-400>
              <n-input v-model:value="model.positionId" clearable />
            </n-form-item>
            <n-form-item
              v-if="model.lx_type == 1 && model.is_rebate != 1"
              label="拼多多推广位ID"
              path="pdd_positionId"
              w-400
            >
              <n-input v-model:value="model.pdd_positionId" clearable />
            </n-form-item>
          </div>
          <div v-if="model.lx_type == 1 && model.is_rebate == 0" flex>
            <div>
              <n-form-item label="订单权重(%)" path="amount_power" w-360 ml-50>
                <n-input-number
                  v-model:value="model.amount_power"
                  :show-button="false"
                  placeholder="请输入"
                  clearable
                  min="0"
                  max="100"
                />
              </n-form-item>
              <n-form-item label="佣金权重(%)" path="commission_power" w-360 ml-50>
                <n-input-number
                  v-model:value="model.commission_power"
                  :show-button="false"
                  placeholder="请输入"
                  clearable
                  min="0"
                  max="100"
                />
              </n-form-item>
              <n-form-item label="复购权重(%)" path="again_power" w-360 ml-50>
                <n-input-number
                  v-model:value="model.again_power"
                  :show-button="false"
                  placeholder="请输入"
                  clearable
                  min="0"
                  max="100"
                />
              </n-form-item>
              <n-form-item label="点击转化权重(%)" path="click_power" w-360 ml-50>
                <n-input-number
                  v-model:value="model.click_power"
                  :show-button="false"
                  placeholder="请输入"
                  clearable
                  min="0"
                  max="100"
                />
              </n-form-item>
              <n-form-item label="复购量统计周期(d)" path="again_time" w-360 ml-50>
                <n-input-number
                  v-model:value="model.again_time"
                  :show-button="false"
                  placeholder="单位天"
                  min="0"
                  clearable
                />
              </n-form-item>
              <n-form-item label="排序间隔时长(h)" path="keep" w-360 ml-50>
                <n-input-number
                  v-model:value="model.keep"
                  :show-button="false"
                  placeholder="请输入"
                  clearable
                  min="0"
                />
              </n-form-item>
              <n-form-item label="排序统计周期(h)" path="circle" w-400 ml-50>
                <n-input v-model:value="model.circle" :show-button="false" placeholder="多个周期用'-'分隔" clearable />
              </n-form-item>
            </div>
          </div>
          <div v-if="model.lx_type == 1">
            <n-form-item label="佣金降幅(%)" path="commission_num" w-300 ml-50>
              <n-input v-model:value="model.commission_num" :show-button="false" placeholder="" clearable />
            </n-form-item>
            <n-form-item label="最终佣金(%)" path="commission" w-300 ml-50>
              <n-input v-model:value="model.commission" :show-button="false" placeholder="" clearable />
            </n-form-item>
          </div>
        </div>
        <div v-if="model.lx_type == 1">
          <div v-if="model.lx_type == 1 && model.is_rebate == 0" flex>
            <div v-if="end_index" w-250 mb-20 style="color: #316c72ff">当前统计周期：{{ end_index }}</div>
            <div v-if="end_index" w-280 mb-20 style="color: #316c72ff">即将排序时间：{{ end_time }}</div>
          </div>
          <n-form-item label="分组商品" path="gids">
            <n-button type="info" absolute top-0 @click="selectGoods"> 选择商品 </n-button>
            <n-data-table
              id="dragTable"
              ref="tableRef"
              :scroll-x="drawerWidth - 140"
              max-height="820px"
              mt-55
              :columns="couponColumns"
              :data="model.goods_list"
              :row-key="(row) => row['id']"
              :pagination="false"
            />
          </n-form-item>
        </div>
        <div v-else-if="model.jd">
          <n-form-item v-if="model.is_rebate == 0" label="所属页面" path="page" w-300>
            <n-select v-model:value="model.jd.page" :options="eliteIdOptions.pageOptions" />
          </n-form-item>
          <block v-if="model.lx_type == 2">
            <n-form-item label="分组类型" path="type" w-300>
              <n-select
                v-model:value="model.jd.type"
                :options="typeOptions"
                placeholder="请选择类型"
                clearable
                @update:value="type_handleUpdate"
              />
            </n-form-item>
            <n-form-item v-if="currentEliteIdOptions" label="频道" path="eliteId" w-300>
              <n-select
                v-model:value="model.jd.eliteId"
                :options="currentEliteIdOptions"
                placeholder="频道"
                clearable
              />
            </n-form-item>
            <n-form-item v-if="model.jd.type == 3" label="关联内容" path="cid" w-900>
              <n-select
                v-model:value="model.jd.cid"
                label-field="name"
                value-field="cid"
                :options="contOptions.cid"
                placeholder="请选择一级类目"
                clearable
                @update:value="cid_handleUpdate"
              />
              <div style="margin: 0 5px; color: #999">-</div>
              <n-select
                v-model:value="model.jd.cid2"
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
                v-model:value="model.jd.cid3"
                label-field="name"
                value-field="cid"
                :options="contOptions.cid3"
                placeholder="请选择三级类目"
                clearable
                @clear="doChange"
              />
            </n-form-item>
            <n-form-item
              v-if="currentEliteIdOptions && (model.jd.eliteId == 1001 || model.jd.eliteId == 519)"
              label="选品库ID"
              path="groupId"
              w-300
            >
              <n-input-number v-model:value="model.jd.groupId" :show-button="false" placeholder="选品库ID" clearable />
            </n-form-item>
            <n-form-item v-if="model.jd.type == 4" label="选品库ID，多个用英文'|'分隔" path="groupId" w-600>
              <n-input
                v-model:value="model.jd.groupId"
                :show-button="false"
                placeholder="选品库ID，多个用英文'|'分隔"
                clearable
              />
            </n-form-item>
            <n-form-item v-if="model.is_rebate != 1" label="推广位ID" path="positionId" w-400>
              <n-input v-model:value="model.jd.positionId" clearable />
            </n-form-item>
            <n-form-item label="最优券面值" path="coupon" w-400>
              <n-input-number v-model:value="model.jd.coupon[0]" placeholder="最小值" min="0" />
              <div style="margin: 0 5px; color: #999">-</div>
              <n-input-number v-model:value="model.jd.coupon[1]" :min="model.jd.coupon[0]" placeholder="最大值" />
            </n-form-item>
            <n-form-item label="券后价格" path="price" w-400>
              <n-input-number v-model:value="model.jd.price[0]" placeholder="最小值" min="0" />
              <div style="margin: 0 5px; color: #999">-</div>
              <n-input-number v-model:value="model.jd.price[1]" :min="model.jd.price[0]" placeholder="最大值" />
            </n-form-item>
            <n-form-item label="佣金比例" path="commission" w-400>
              <n-input-number v-model:value="model.jd.commission[0]" placeholder="最小值" min="0" />
              <div style="margin: 0 5px; color: #999">-</div>
              <n-input-number
                v-model:value="model.jd.commission[1]"
                :min="model.jd.commission[0]"
                placeholder="最大值"
              />
            </n-form-item>
            <n-form-item label="评论数" path="review" w-400>
              <n-input-number v-model:value="model.jd.review[0]" placeholder="最小值" min="0" />
              <div style="margin: 0 5px; color: #999">-</div>
              <n-input-number v-model:value="model.jd.review[1]" :min="model.jd.review[0]" placeholder="最大值" />
            </n-form-item>
            <n-form-item label="备注说明" path="note" w-400>
              <n-input v-model:value="model.jd.note" placeholder="最多200个字" clearable maxlength="200" />
            </n-form-item>
          </block>
          <!-- 拼多多的内容 -->
          <block v-else>
            <n-form-item label="分组类型" path="type" w-300>
              <n-select
                v-model:value="model.jd.type"
                :options="pddTypeOptions"
                placeholder="请选择类型"
                @update:value="pddType_handleUpdates"
              />
            </n-form-item>
            <n-form-item v-if="model.is_rebate != 1" label="推广位ID" path="positionId" w-400>
              <n-input v-model:value="model.jd.positionId" clearable />
            </n-form-item>
            <n-form-item label="活动商品类目" path="activity_tags">
              <n-checkbox-group
                v-model:value="model.jd.activity_tags"
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
            <block v-if="model.jd.type == 1">
              <n-form-item label="商品类目" path="cat_id" w-300>
                <n-select
                  v-model:value="model.jd.cat_id"
                  :options="eliteIdOptions.catOptions"
                  placeholder="请选择类型"
                  clearable
                />
              </n-form-item>
              <n-form-item label="频道推广" path="eliteId" w-300>
                <n-select
                  v-model:value="model.jd.eliteId"
                  :options="eliteIdOptions.channelOptions"
                  placeholder="请选择频道"
                  clearable
                />
              </n-form-item>
              <n-form-item label="最优券面值" path="coupon" w-400>
                <n-input-number v-model:value="model.jd.coupon[0]" placeholder="最小值" min="0" />
                <div style="margin: 0 5px; color: #999">-</div>
                <n-input-number
                  v-model:value="model.jd.coupon[1]"
                  :min="model.jd.coupon[0] || 0"
                  placeholder="最大值"
                />
              </n-form-item>
              <n-form-item label="券后价格" path="price" w-400>
                <n-input-number v-model:value="model.jd.price[0]" placeholder="最小值" min="0" />
                <div style="margin: 0 5px; color: #999">-</div>
                <n-input-number v-model:value="model.jd.price[1]" :min="model.jd.price[0] || 0" placeholder="最大值" />
              </n-form-item>
              <n-form-item label="佣金比例" path="commission" w-400>
                <n-input-number v-model:value="model.jd.commission[0]" placeholder="最小值" min="0" />
                <div style="margin: 0 5px; color: #999">-</div>
                <n-input-number
                  v-model:value="model.jd.commission[1]"
                  :min="model.jd.commission[0] || 0"
                  placeholder="最大值"
                />
              </n-form-item>
            </block>
            <block v-if="model.jd.type == 2">
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
            <div style="color: red; padding-left: 50px">
              注：拼多多金额单位为分（如筛选金额为“1”请填写“100”）；佣金比例是千分比（如筛选佣金为“4”请填写“40”）
            </div>
          </block>
        </div>
        <div flex justify-center w-1000>
          <n-button mr-10 @click="closeModel"> 关闭 </n-button>
          <n-button type="info" @click="handleValidate"> 保存 </n-button>
        </div>
      </n-form>
    </n-drawer-content>
  </n-drawer>
  <selecGoods ref="selecGoodsRef" @selectSave="selectSave" />
</template>
<script setup>
import { renderIcon } from '@/utils';
import { NButton, NInput, NInputNumber, NSwitch, useMessage } from 'naive-ui';
import { ref } from 'vue';
import http from '../api';
import { rebateOptions, systemOptions } from '../options';
import eliteIdOptions from './eliteIdOptions.js';
import selecGoods from './selecGoods.vue';

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
const channelOptions = ref([])
/**表单 */
const formRef = ref(null)
const end_time = ref()
const end_index = ref()
//表单数据
const model = ref({
  goods_list: [],
  jd: {
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
  },
})
//校验数据
const rules = ref({
  title: {
    required: true,
    trigger: ['blur', 'input'],
    message: '分组名称不能为空',
  },
})
//商品cell
let couponColumns = ref([])
const groupType = ref(0)
watch(
  () => groupType.value,
  (newValue, oldValue) => {
    couponColumns.value = [
      {
        title: '商品编号',
        key: 'goods_number',
        align: 'center',
        fixed: 'left',
        width: 110,
        render(row) {
          return row.goods_number || row.coupon_id
        },
      },
      {
        title: '商品名称',
        key: 'goods_name',
        align: 'center',
        width: 332,
        render(row) {
          return row.goods_name || row.title
        },
      },
      {
        title: '面值(元)',
        key: 'marketPrice',
        align: 'center',
        width: 100,
        render(row, index) {
          return row.lx_type == 1 ? Number(row.price / 100).toFixed(2) : row.face_value
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
        title: '抵扣积分',
        key: 'deduction_credits',
        align: 'center',
        width: 100,
        render(row, index) {
          return row.deduction_credits || row.credits
        },
      },
      {
        title: '启用状态',
        key: 'map_status',
        align: 'center',
        width: 100,
        render(row, index) {
          if (row.lx_type != 1) {
            return h(NSwitch, {
              size: 'small',
              value: Boolean(row.map_status),
              onUpdateValue: (updateValue) => {
                const currentIndex = row._index - 1
                model.value.goods_list[currentIndex].map_status = updateValue
              },
            })
          }
          return ['停用', '启用', '系统停用'][row.use]
        },
      },
      {
        title: '下架原因',
        key: 'msg',
        align: 'center',
        width: 100,
        render(row, index) {
          return row.msg || ''
        },
      },
      {
        title: '来源',
        key: 'lx_type',
        align: 'center',
        width: 100,
        render(row, index) {
          if (row.lx_type == 2) return '京东'
          if (row.lx_type == 3) return '拼多多'
          return '自建'
        },
      },
      {
        title: 'feed流',
        key: 'is_flow',
        align: 'center',
        width: 100,
        render(row, index) {
          return h(NSwitch, {
            size: 'small',
            value: Boolean(row.is_flow),
            disabled: row.lx_type == 1,
            onUpdateValue: (updateValue) => {
              const currentIndex = row._index - 1
              model.value.goods_list[currentIndex].is_flow = !!updateValue
            },
          })
        },
      },
      {
        title: '推广返佣(%)',
        key: 'rebate',
        align: 'center',
        size: 'large',
        width: 150,
        render(row, index) {
          return h(NInputNumber, {
            value: row.rebate || 0,
            min: 0,
            size: 'tiny',
            max: 100,
            style: {
              'margin-right': '10px',
              width: 100,
              display: 'inline-block',
            },
            disabled: row.lx_type == 1,
            onUpdateValue(value) {
              const currentIndex = row._index - 1
              model.value.goods_list[currentIndex].rebate = value
            },
          })
        },
      },
      {
        title: '选品库',
        key: 'groupId',
        align: 'center',
        size: 'large',
        width: 150,
        render(row, index) {
          return h(NInput, {
            value: row.groupId || '',
            size: 'tiny',
            style: {
              'margin-right': '10px',
              width: 100,
              display: 'inline-block',
            },
            disabled: row.lx_type != 2,
            onUpdateValue(value) {
              const currentIndex = row._index - 1
              model.value.goods_list[currentIndex].groupId = value
            },
          })
        },
      },
    ]
    if (newValue == 0) {
      couponColumns.value.push(
        {
          title: '排位保护时间(h)',
          key: 'protect',
          align: 'center',
          size: 'large',
          width: 150,
          render(row, index) {
            return h(NInputNumber, {
              value: row.protect || 0,
              min: 0,
              size: 'tiny',
              max: 100,
              style: {
                'margin-right': '10px',
                width: '85px',
                display: 'inline-block',
              },
              disabled: row.lx_type == 1,
              onUpdateValue(value) {
                const currentIndex = row._index - 1
                model.value.goods_list[currentIndex].protect = value
              },
            })
          },
        },
        { title: '购买人数', key: 'amount', align: 'center', width: 100 },
        { title: '佣金(元)', key: 'commission', align: 'center', width: 100 },
        { title: '复购人数', key: 'again', align: 'center', width: 100 },
        { title: '排序权值', key: 'sort_num', align: 'center', width: 100 },
        { title: '累计订单', key: 'orderNum', align: 'center', width: 100 },
        { title: '点击次数', key: 'clickNum', align: 'center', width: 100 },
        { title: '转化率(%)', key: 'promotion', align: 'center', width: 100 },
        { title: '上轮位置系数', key: 'prev_position_num', align: 'center', width: 110 },
        {
          title: '位置系数',
          key: 'position_num',
          align: 'center',
          size: 'large',
          width: 160,
          render(row, index) {
            return h(NInputNumber, {
              value: row.position_num || 0,
              min: 0,
              size: 'tiny',
              max: 60,
              style: {
                'margin-right': '10px',
                width: '85px',
                display: 'inline-block',
              },
              disabled: row.lx_type == 1,
              onUpdateValue(value) {
                const currentIndex = row._index - 1
                model.value.goods_list[currentIndex].position_num = value
              },
            })
          },
        }
      )
    }
    couponColumns.value.push(
      {
        title: '佣金降幅(%)',
        key: 'commission_num',
        align: 'center',
        size: 'large',
        width: 110,
        render(row, index) {
          return h(NInput, {
            value: row.commission_num || '0',
            min: 0,
            size: 'tiny',
            style: {
              'margin-right': '10px',
              width: '85px',
              display: 'inline-block',
            },
            disabled: row.lx_type != 2,
            onUpdateValue(value) {
              const currentIndex = row._index - 1
              model.value.goods_list[currentIndex].commission_num = value
            },
          })
        },
      },
      {
        title: '最终佣金(%)',
        key: 'commission_end',
        align: 'center',
        size: 'large',
        width: 110,
        render(row, index) {
          return h(NInput, {
            value: row.commission_end || '0',
            min: 0,
            size: 'tiny',
            style: {
              'margin-right': '10px',
              width: '85px',
              display: 'inline-block',
            },
            disabled: row.lx_type != 2,
            onUpdateValue(value) {
              const currentIndex = row._index - 1
              model.value.goods_list[currentIndex].commission_end = value
            },
          })
        },
      },
      {
        title: '操作',
        key: 'actions',
        align: 'center',
        fixed: 'right',
        width: 350,
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
                secondary: true,
                onClick: () => {
                  console.log('置顶 :>> ', index, 'modalType.value', modalType.value)
                  const currData = model.value.goods_list[index]
                  model.value.goods_list.splice(index, 1)
                  model.value.goods_list.unshift(currData)
                  model.value.goods_list.forEach((item, index) => (item._index = index + 1))
                },
              },
              { default: () => '置顶', icon: renderIcon('typcn:arrow-up-thick', { size: 14 }) }
            ),
            h(NInputNumber, {
              value: row._index,
              min: 1,
              size: 'tiny',
              max: model.value.goods_list.length,
              style: {
                'margin-right': '10px',
                width: '85px',
                display: 'inline-block',
              },
              onUpdateValue(value) {
                model.value.goods_list[index]._index = value
              },
              onBlur(value) {
                const currInputIndex = row._index - 1
                if (currInputIndex === index) return
                const currData = model.value.goods_list[index]
                const targetIndex = model.value.goods_list[currInputIndex]
                // model.value.goods_list[currInputIndex] = currData
                // model.value.goods_list[index]._index = index + 1
                model.value.goods_list.splice(index, 1)
                model.value.goods_list.splice(currInputIndex, 0, currData)
                model.value.goods_list.forEach((item, index) => (item._index = index + 1))
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
                onClick: () => {
                  const currData = model.value.goods_list[index]
                  model.value.goods_list.splice(index, 1)
                  model.value.goods_list.push(currData)
                  model.value.goods_list.forEach((item, index) => (item._index = index + 1))
                },
              },
              { default: () => '置底', icon: renderIcon('typcn:arrow-down-thick', { size: 14 }) }
            ),
            h(
              NButton,
              {
                size: 'small',
                type: 'error',
                style: { 'margin-right': '10px' },
                secondary: true,
                onClick: () => delGoods(row),
              },
              { default: () => '删除', icon: renderIcon('majesticons:delete-bin-line', { size: 14 }) }
            ),
          ]
        },
      }
    )
  },
  {
    deep: true,
    immediate: true,
  }
)
function groupChange(value) {
  groupType.value = value
}
//删除选择
function delGoods(data) {
  let index = model.value.goods_list.findIndex((item) => item.id === data.id)
  model.value.goods_list.splice(index, 1)
  model.value.gids = model.value.goods_list.map((item) => item.id).join(',')
}
//类型
const tyOptions = [
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
onMounted(() => {
  initChannelOptions()
})
async function initChannelOptions() {
  const res = await http.shopGroup()
  if (res.code != 1 || !res.data) return
  channelOptions.value = res.data
}
function lx_handleUpdate(value) {
  console.log(value)
  if (value == 2) {
    model.value.jd.lx_type = 1
    cidOptionsInit(0) // 类目选择的列表
  }
  if (value == 3) {
    model.value.jd.lx_type = 2
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
    title: '',
    goods_list: [],
    system: 0,
    is_rebate: 0,
    sort: 0,
    lx_type: 1,
    group: [],
    positionId: '',
    jd: {
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
    },
    pdd_positionId: '',
    amount_power: '',
    commission_power: '',
    again_power: '',
    click_power: '',
    keep: '',
    circle: '',
    again_time: '',
    commission_num: '',
    commission: '',
  }
  if (modalType.value === 1) {
    const { id: reid } = data
    const res = await http.getDetails({ id: reid })
    let {
      id,
      title,
      group,
      goods_list,
      system,
      is_rebate,
      sort,
      lx_type,
      jd,
      positionId,
      pdd_positionId,
      amount_power,
      commission_power,
      again_power,
      click_power,
      keep,
      circle,
      again_time,
      commission_num,
      commission,
    } = res.data
    groupType.value = is_rebate
    end_time.value = res.data.end_time || ''
    end_index.value = res.data.end_index || ''
    goods_list.forEach((res, index) => (res._index = index + 1))
    if (lx_type == 2) {
      const { cid, cid2 } = jd
      await cidOptionsInit(cid, cid2)
    } else if (lx_type == 3) {
      const { cat_id, opt_id } = jd
      await goodCatOptionsInit(cat_id)
      await goodOptionsInit(opt_id)
    }
    // 类目选择的列表
    model.value = {
      id,
      title,
      group,
      goods_list: goods_list || [],
      system,
      is_rebate,
      sort,
      lx_type,
      jd: jd || {
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
      },
      positionId,
      pdd_positionId,
      amount_power,
      commission_power,
      again_power,
      click_power,
      keep,
      circle,
      again_time,
      commission_num,
      commission,
    }
    showModal.value = true
    if (model.value.lx_type == 1 || (model.value.lx_type == 2 && model.value.jd.type == 1)) return
    pddRang.value = jd.pddRang
    pddRangSelect.value = []
    pddRangSelect.value = jd.pddRangSelect
    return
  }
  showModal.value = true
}

/**校验表单 */
function handleValidate() {
  formRef.value?.validate((errors) => {
    if (!errors) {
      let group = []
      if (model.value.lx_type == 2) {
        model.value.jd.cid2 &&
          (model.value.jd.cid2Name = contOptions.value.cid2.find((res) => res.cid == model.value.jd.cid2).name)
        model.value.jd.cid3 &&
          (model.value.jd.cid3Name = contOptions.value.cid3.find((res) => res.cid == model.value.jd.cid3).name)
        model.value.jd.eliteId &&
          currentEliteIdOptions.value &&
          (model.value.cid2Name = currentEliteIdOptions.value.find((res) => res.value == model.value.jd.eliteId).label)
      } else if (model.value.lx_type == 3) {
        if (model.value.jd.type != 1) {
          model.value.jd.cat_id = ''
          goodsCatList.value.forEach((res) => res.id != null && (model.value.jd.cat_id += `${res.id},`))
        }
        model.value.jd.opt_id = ''
        goodsOptList.value.forEach((res) => res.id != null && (model.value.jd.opt_id += `${res.id},`))
        pddRangSelect.value.length &&
          pddRangSelect.value.forEach((res) => {
            const { range_from, range_id, range_to } = res
            model.value.jd.range_list.push({
              range_from,
              range_id,
              range_to,
            })
          })
      } else {
        model.value.goods_list.forEach((item) => {
          group.push({
            coupon_id: item.id,
            is_flow: item.is_flow,
            goods_sign: item.goods_sign,
            itemId: item.itemId,
            rebate: item.rebate,
            protect: item.protect,
            groupId: item.groupId,
            position_num: item.position_num,
            status: item.map_status,
            commission_num: item.commission_num,
            commission: item.commission_end,
          })
        })
      }
      if (model.value.is_rebate == 1) {
        model.value.circle = model.value.circle.toString()
      }
      /**还原数据 */
      let params = {
        ...model.value,
        group,
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
const tableRef = ref(null)
function selectGoods() {
  selecGoodsRef.value.show(model.value.goods_list, model.value.system, model.value.is_rebate)
}
function selectSave(addList) {
  addList &&
    addList.forEach((item) => {
      model.value.goods_list.unshift({
        ...item,
      })
    })

  model.value.goods_list = model.value.goods_list.map((item, index) => {
    return {
      ...item,
      _index: index + 1,
    }
  })
  // 滑动到底部
  setTimeout(() => {
    tableRef.value.scrollTo({
      left: 0,
      top: 0,
    })
  }, 100)
}
/**关闭弹窗 */
function closeModel() {
  showModal.value = false
}
// 清空推荐频道的ID
function type_handleUpdate(value, options) {
  console.log(value)
  model.value.jd.eliteId = null
  model.value.jd.cid2 = null
  model.value.jd.cid3 = null
  model.value.jd.cid2Name = null
  model.value.jd.cid3Name = null
}
// 推荐频道ID
const currentEliteIdOptions = computed(() => {
  let typeIndex = model.value.jd.type - 1
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
  model.value.jd.cid2 = null
  model.value.jd.cid3 = null
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
  model.value.jd.cid2 = null
  model.value.jd.cid3 = null
}
async function cid2_handleUpdate(value, options) {
  let params = {
    parentId: value,
    grade: 2,
  }
  const res = await http.category(params)
  contOptions.value.cid3 = res.data
  if (!value) {
    model.value.jd.cid3 = null
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
  if (value == 2 && model.value.lx_type == 3) {
    console.log(value)
    goodsCatList.value = []
    goodsOptList.value = []
    goodCatsUpdate()
    goodOptUpdate()
    return
  }
  model.value.jd.cat_id = null
  model.value.jd.opt_id = null
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

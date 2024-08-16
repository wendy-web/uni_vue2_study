<template>
  <CommonPage show-footer title="拼多多选品">
    <!-- <template #action>
      <n-button type="success" @click="handleAddList">
        <TheIcon icon="material-symbols:add" :size="18" class="mr-5" /> 添加选中推广
      </n-button>
    </template> -->
    <div class="flex mb-10">
      <n-input
        v-model:value="queryItems.keyword"
        style="width: 500px"
        type="text"
        clearable
        placeholder="请输入关键词"
        class="mr-20"
        :disabled="classifyId"
        @keydown.enter="updateList"
      />
      <n-button type="primary" class="mr-20" @click="updateList">
        <TheIcon icon="simple-line-icons:magnifier" :size="18" class="mr-5" /> 搜索
      </n-button>
      <n-button type="warning" class="mr-20" @click="allCheckOut">
        <TheIcon icon="bxs:message-square-check" :size="18" class="mr-5" />{{
          commodityList.length == checkList.length ? '取消全选' : '全选'
        }}
      </n-button>
      <n-button type="success" @click="handleAddList">
        <TheIcon icon="ri:add-large-fill" :size="18" class="mr-5" /> 推广
      </n-button>
    </div>
    <div class="flex items-center mb-10">
      商品分类：
      <n-button
        v-for="item in classifyPddList"
        :key="item.id"
        strong
        round
        :type="item.id == classifyId ? 'primary' : 'tertiary'"
        class="ml-5"
        @click="classifyChange(item.id)"
      >
        {{ item.label }}
      </n-button>
    </div>
    <div>
      <block v-if="!classifyId">
        <div v-for="(goodsItem, index) in goodsCatList" :key="goodsItem.id" class="class_level flex">
          <div class="class_level-left">{{ goodsItem.rankTxt }}级类目:</div>
          <div class="flex">
            <div
              :class="['class_item', !goodsItem.selID && 'active']"
              style="display: inline-block"
              @click="goodCatsUpdate(0, index, index + 1)"
            >
              全部
            </div>
            <div class="flex items-center flex-wrap">
              <div
                v-for="item in goodsItem.showListOptions"
                :key="item.cat_id"
                :class="['ml-20 class_item', goodsItem.selID == item.cat_id && 'active']"
                @click="goodCatsUpdate(item.cat_id, index, index + 1)"
              >
                {{ item.cat_name }}
              </div>
            </div>
            <n-button
              v-if="goodsItem.listOptions.length > 20"
              strong
              secondary
              type="primary"
              round
              :class="['mt-10 more_btn', goodsItem.listOptions.length == goodsItem.showListOptions.length && 'active']"
              @click="moreList(goodsItem, index)"
            >
              {{ goodsItem.listOptions.length == goodsItem.showListOptions.length ? '收起' : '更多'
              }}<TheIcon icon="ri:arrow-down-s-line" :size="18" class="ml-5" />
            </n-button>
          </div>
        </div>
      </block>
      <block v-else>
        <div class="class_level flex items-center">
          频道推广：
          <n-radio-group v-model:value="queryItems.channel_type" name="radiogroup" @update:value="checkedRadioHandle">
            <n-space>
              <n-radio v-for="item in channelOptions" :key="item.value" :value="item.value">
                {{ item.label }}
              </n-radio>
            </n-space>
          </n-radio-group>
        </div>
        <div v-if="queryItems.channel_type == 4" class="class_level flex items-center">
          商品类目：
          <n-radio-group v-model:value="queryItems.cat_id" name="radiogroup" @update:value="checkedRadioHandle">
            <n-space>
              <n-radio v-for="item in catOptions" :key="item.value" :value="item.value">
                {{ item.label }}
              </n-radio>
            </n-space>
          </n-radio-group>
        </div>
      </block>

      <div class="class_level flex items-center">
        <div class="class_level-left">活动商品类别:</div>
        <n-checkbox-group :value="queryItems.activity_tags" @update:value="tagUpdateValue">
          <n-space item-style="display: flex;" align="center">
            <n-checkbox v-for="item in activityOptions" :key="item.value" :value="item.value" :label="item.label" />
          </n-space>
        </n-checkbox-group>
      </div>
      <block v-if="!classifyId">
        <div class="class_level flex">
          <div class="class_level-left">筛选:</div>
          <div class="flex items-center">
            <n-checkbox v-model:checked="notCouponCheck" label="有券" @update:checked="checkCoupon" />
            <div class="ml-20 flex">
              价格区间：
              <n-input-number
                v-model:value="queryItems.price[0]"
                placeholder="最小值"
                min="0"
                size="small"
                style="width: 120px"
                ><template #prefix>￥</template>
              </n-input-number>
              <div style="margin: 0 5px; color: #999">-</div>
              <n-input-number
                v-model:value="queryItems.price[1]"
                :min="queryItems.price[0]"
                placeholder="最大值"
                size="small"
                style="width: 120px"
                ><template #prefix>￥</template>
              </n-input-number>
            </div>
            <div class="ml-20 flex">
              优惠券面额区间：
              <n-input-number
                v-model:value="queryItems.coupon_price[0]"
                placeholder="最小值"
                min="0"
                size="small"
                style="width: 120px"
                ><template #prefix>￥</template>
              </n-input-number>
              <div style="margin: 0 5px; color: #999">-</div>
              <n-input-number
                v-model:value="queryItems.coupon_price[1]"
                :min="queryItems.coupon_price[0]"
                placeholder="最大值"
                size="small"
                style="width: 120px"
                ><template #prefix>￥</template>
              </n-input-number>
            </div>
            <div class="ml-20 flex">
              佣金比例：
              <n-input-number
                v-model:value="queryItems.commission_rate[0]"
                placeholder="最小值"
                min="0"
                size="small"
                style="width: 120px"
                ><template #suffix>%</template>
              </n-input-number>
              <div style="margin: 0 5px; color: #999">-</div>
              <n-input-number
                v-model:value="queryItems.commission_rate[1]"
                :min="queryItems.commission_rate[0]"
                placeholder="最大值"
                size="small"
                style="width: 120px"
                ><template #suffix>%</template>
              </n-input-number>
            </div>
            <n-button class="ml-20" type="warning" @click="updateList">
              <TheIcon icon="uim:object-ungroup" :size="18" class="mr-5" />
              筛选
            </n-button>
          </div>
        </div>
        <div class="class_level flex">
          <div class="class_level-left">排序:</div>
          <!-- 1-按佣金比率升序;2-按佣金比例降序;3-按价格升序;4-按价格降序;5-按销量升序;6-按销量降序; -->
          <div class="flex items-center">
            <div
              v-for="(item, index) in sortList"
              :key="index"
              :class="['ml-20 flex items-center order_item', item.value == 2 && 'active']"
              @click="sortTagSel(item, index)"
            >
              {{ item.text }}<TheIcon icon="majesticons:arrow-down" :size="18" class="mr-5 icon_lab" />
            </div>
          </div>
        </div>
      </block>
    </div>
    <n-checkbox-group v-if="commodityList.length" :value="checkList" @update:value="handleUpdateValue1">
      <div class="item_box">
        <div v-for="item in commodityList" :key="item" class="list_item">
          <div class="image_box">
            <n-checkbox ref="checkboxInstRef" :value="item.id" size="large" class="check_box" />
            <n-image
              width="230"
              height="230"
              src="图片加载失败"
              :fallback-src="item.image"
              @click.stop="checkChange(item.id)"
            />
          </div>

          <div class="item_con">
            <div class="flex items-center item_con-lab">
              <div class="lab_item">
                佣金 ￥<span>{{ item.commission }}</span>
              </div>
              <div class="lab_item">
                佣金比例<span>{{ item.commissionShare }}%</span>
              </div>
            </div>
            <div class="item_title ml-5 mr-5 mt-10" @click="openDetail(item.goods_sign)">
              {{ item.title }}
            </div>
            <div class="flex items-center justify-between ml-5 mr-5 mt-5">
              <p class="price_box">
                <span class="price mr-6">￥{{ item.price }}</span
                ><span class="origin_price">￥{{ addNumbers(item.price, item.face_value) }}</span>
              </p>
              <p v-if="item.inOrderCount30Days" class="evaluate">月售{{ item.inOrderCount30Days }}</p>
            </div>
            <div class="mr-5 ml-5 mb-5">
              <n-space>
                <n-tag v-if="item.owner == 'g'" size="small" type="error">自营 </n-tag>
                <n-tag v-if="item.owner == 'p'" size="small" type="success">POP</n-tag>
                <n-tag v-if="item.face_value" size="small" type="warning">券：￥{{ item.face_value }}</n-tag>
              </n-space>
            </div>
          </div>
        </div>
      </div>
    </n-checkbox-group>
    <div v-else class="empty_box">
      <img src="@/assets/images/empty.png" w-full alt="empty" />
      <span>暂无更多的商品</span>
    </div>
    <div class="flex mt-20 justify-end">
      <n-pagination
        v-if="!classifyId"
        v-model:page="queryItems.page"
        v-model:page-size="queryItems.size"
        :page-count="pageCount"
        @update:page="pageChange"
      />
      <div v-else>
        <n-tag mr-10 :disabled="queryItems.page <= 1" @click="pageChange(prevPage)">
          <TheIcon icon="ic:baseline-arrow-back-ios-new" :size="11" class="mr-5 mt-2" />上一页
        </n-tag>
        {{ queryItems.page }}
        <n-tag ml-10 @click="pageChange(nextPage)">
          下一页 <TheIcon icon="ic:baseline-arrow-forward-ios" :size="11" class="ml-5"
        /></n-tag>
      </div>
    </div>
  </CommonPage>
  <operate-single ref="operateSingleRef" lx-type="pdd" @refresh="refresh" />
</template>
<script setup>
import { NButton, NTag, useMessage } from 'naive-ui';
import { ref } from 'vue';
import http from './api';
import operateSingle from './operateSingle.vue';
import { activityOptions, catOptions, channelOptions, classifyPddList } from './options';
const classifyId = ref(0)
const operateSingleRef = ref(null)
const queryItems = ref({
  page: 1,
  keyword: '',
  cat_id: '',
  not_coupon: 0,
  price: [0, 0],
  commission_rate: [0, 0],
  coupon_price: [0, 0],
  sort_type: '',
  activity_tags: [],
  size: 30,
  is_queue: 1,
})
const notCouponCheck = ref(!Boolean(queryItems.value.not_coupon))
const sortList = ref([
  {
    text: '佣金比率',
    value: 0,
  },
  {
    text: '价格',
    value: 0,
  },
  {
    text: '销量',
    value: 0,
  },
])

function sortTagSel(currentItem, currentItemIndex) {
  sortList.value.forEach((item, index) => {
    if (currentItemIndex == index) {
      queryItems.value.sort_type = currentItem.value == 2 ? 0 : (currentItemIndex + 1) * 2
      item.value = currentItem.value ? 0 : 2
    } else {
      item.value = 0
    }
  })
  updateList()
}
function checkCoupon(value) {
  notCouponCheck.value = value
  queryItems.value.not_coupon = Number(!value)
  queryItems.value.page = 1
  requestList()
}
const commodityList = ref([])
const pageSize = ref(20)
const pageCount = ref(0)
const message = useMessage()
const checkList = ref([])
const goodsCatList = ref([
  {
    id: null,
    selID: null,
    listOptions: [],
    showListOptions: [],
    rankTxt: '',
  },
])
const digitMap = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
async function goodCatsUpdate(id = 0, index = 0, nextIndex = 0) {
  goodsCatList.value[index].selID = id
  if (nextIndex) {
    if (id) {
      queryItems.value.cat_id = id
    } else {
      queryItems.value.cat_id = goodsCatList.value[index - 1]?.selID || 0
    }
    updateList()
  }
  if (!id && nextIndex) return
  if (nextIndex) goodsCatList.value.splice(nextIndex)
  const res = await http.goodsCats({ parent_cat_id: id })
  if (res.code != 1 || !res.data) return
  const list = res.data
  const currentObj = {
    listOptions: list,
    showListOptions: list,
    id: null,
    selID: null,
    rankTxt: digitMap[nextIndex + 1],
  }
  if (list.length > 20) {
    let newArray = list.slice(0, 20)
    currentObj.showListOptions = newArray
  }
  if (list.length) goodsCatList.value[nextIndex] = currentObj
  if (!list.length && goodsCatList.value[nextIndex]) {
    goodsCatList.value.splice(nextIndex, 1)
    return
  }
}
function moreList(goodsItem, index) {
  const { listOptions, showListOptions } = goodsItem
  if (listOptions.length > showListOptions.length) {
    goodsCatList.value[index].showListOptions = listOptions
    return
  }
  goodsCatList.value[index].showListOptions = listOptions.slice(0, 20)
}
function handleUpdateValue1(check) {
  checkList.value = check
}
function tagUpdateValue(check) {
  queryItems.value.activity_tags = check
  updateList()
}
function checkChange(currentID) {
  const checkIndex = checkList.value.findIndex((item) => item == currentID)
  if (checkIndex < 0) return checkList.value.push(currentID)
  checkList.value.splice(checkIndex, 1)
}
function allCheckOut() {
  if (commodityList.value.length == checkList.value.length) return (checkList.value = [])
  checkList.value = commodityList.value.map((item) => item.id)
}
function handleAddList() {
  if (!checkList.value.length) return message.error('请选中要推广的商品')
  const selList = commodityList.value
    .filter((item) => checkList.value.includes(item.id))
    .map((res) => ({
      goods_sign: res.goods_sign,
      title: res.goods_name,
      image: res.goods_image_url,
      extend_word: res.extend_word || '',
      goods_name: res.goods_name || '',
      coupon_price: res.coupon_price || '',
    }))
  if (!selList.length) return message.error('请选中要推广的商品')
  operateSingleRef.value.show(selList)
}
function checkedRadioHandle() {
  updateList()
}
function updateList() {
  queryItems.value.page = 1
  requestList()
}
function pageChange(page) {
  console.log('page', page)
  queryItems.value.page = page
  requestList()
}
function openDetail(goods_sign) {
  window.open(`https://jinbao.pinduoduo.com/goods-detail?s=${goods_sign}`, '_blank') //在新的窗口打开
}
onMounted(async () => {
  requestList()
  await goodCatsUpdate()
})
const requestApi = ref('goodsSearch')
function classifyChange(id) {
  if (id) {
    queryItems.value = {
      page: 1,
      channel_type: 5,
      activity_tags: '',
      cat_id: 0,
      size: 20,
      is_queue: 1,
      // list_id: '',
    }
  } else {
    queryItems.value = {
      page: 1,
      keyword: '',
      cat_id: '',
      not_coupon: 0,
      price: [0, 0],
      commission_rate: [0, 0],
      coupon_price: [0, 0],
      sort_type: '',
      activity_tags: [],
      size: 30,
      is_queue: 1,
    }
  }
  requestApi.value = !id ? 'goodsSearch' : 'goodsRecommend'
  classifyId.value = id
  requestList()
}
const nextPage = ref(2)
const prevPage = ref(1)
// 请求列表的数据
async function requestList() {
  const res = await http[requestApi.value](queryItems.value)
  if (!res.code) return message.error(res.msg)
  const { list, total_count, nextPage: next, prevPage: prev } = res.data
  commodityList.value = list
  pageCount.value = Math.ceil(total_count / queryItems.value.size)
  nextPage.value = next
  prevPage.value = prev
  console.log('nextPage.value', nextPage.value)

  // if (queryItems.value.page > 1 && classifyId.value && list_id) {
  //   queryItems.value.list_id = list_id
  // }
}

function addNumbers(num1, num2) {
  const precision = 10
  const factor = Math.pow(10, precision)
  const sum = (num1 * factor + num2 * factor) / factor
  return sum
}
</script>
<style scoped>
.class_level {
  margin: 10px 0;
  line-height: 50px;
  border-bottom: 1px solid #f6f6f6;
  white-space: nowrap;
}
.class_level:first-child {
  border-top: 1px solid #f6f6f6;
}
.more_btn.active .ml-5 {
  transition: all 0.3s;
  transform: rotate(180deg);
}
.class_level-left {
  min-width: 80px;
  text-align: right;
  margin-right: 20px;
}
.item_box {
  display: flex;
  flex-wrap: wrap;
}
.list_item {
  width: 230px;
  border-radius: 10px;
  border: 1px solid #f6f6f6;
  overflow: hidden;
  font-size: 0;
  margin-right: 20px;
  margin-bottom: 20px;
}
.item_con {
  font-size: 3.5rem;
}
.item_con-lab {
  background: linear-gradient(116.2deg, #fff, #fff9df);
  -webkit-box-shadow: inset 0 4px 9px 0 rgba(255, 239, 191, 0.5);
  box-shadow: inset 0 4px 9px 0 rgba(255, 239, 191, 0.5);
  text-align: center;
}
.lab_item {
  flex: 1;
  color: #e1251b;
  position: relative;
}
.lab_item:first-child::before {
  content: '\3000';
  position: absolute;
  width: 2px;
  height: 10px;
  background: #e1251b;
  border-radius: 2px;
  top: 50%;
  right: -1px;
  transform: translateY(-50%);
}
.lab_item > span {
  font-weight: bold;
  font-size: 4rem;
}
.image_box {
  position: relative;
  cursor: pointer; /* 显示为手型指针 */
  width: 230px;
  height: 230px;
}
.check_box {
  position: absolute;
  top: 10px;
  right: 10px;
}

.shop_title:hover {
  color: #e1251b;
  background: linear-gradient(116.2deg, #fff, #fff9df);
}
.ellipsis1 {
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}
.price {
  font-size: 4rem;
  color: #e1251b;
}
.origin_price {
  text-decoration: line-through;
  color: #666;
  font-size: 3rem;
}
.class_item {
  cursor: pointer; /* 显示为手型指针 */
  padding: 0 10px;
  display: inline-block;
  line-height: 30px;
  margin: 10px;
  border-radius: 5px;
}
.class_item.active {
  background: #2b4c59ff;
  color: #fff;
  font-weight: bold;
}
.class_item:first-child {
  align-self: self-start;
}
.class_item:not(.active):hover {
  background: #f6f6f6;
  color: #333;
}
.order_item {
  cursor: pointer; /* 显示为手型指针 */
  line-height: 30px;
  margin: 10px;
  padding: 0 10px 0 20px;
}
.order_item:hover {
  background: #f6f6f6;
  color: #333;
}
.order_item .icon_lab {
  transform: rotate(180deg);
}
.order_item.active {
  background: #2b4c59ff;
  color: #fff;
  font-weight: bold;
  transition: all 0.3s;
}
.order_item.active .icon_lab {
  transition: all 0.3s;
  transform: rotate(0deg);
}
.empty_box {
  width: 100%;
  text-align: center;
  color: #dbdfe5;
}
.empty_box img {
  display: block;
  width: 20%;
  margin: 60px auto 20px;
}
.item_title {
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  height: 45px;
  cursor: pointer; /* 显示为手型指针 */
}
</style>

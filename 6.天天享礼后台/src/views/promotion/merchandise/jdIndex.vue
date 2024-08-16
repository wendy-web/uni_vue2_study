<template>
  <CommonPage show-footer title="京东选品">
    <!-- <template #action>
      <n-button v-has="'add'" type="success" @click="handleAddList">
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
        v-for="item in classifyJdList"
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
        <div v-for="(cidItem, index) in cidContOptions" :key="index" class="class_level flex">
          <div class="class_level-left">{{ cidItem.rankTxt }}级类目:</div>
          <div class="flex">
            <div
              :class="['class_item', !queryItems[`cid${index + 1}`] && 'active']"
              style="display: inline-block"
              @click="cidInit(0, index, index + 1)"
            >
              全部
            </div>
            <div class="flex items-center flex-wrap">
              <div
                v-for="item in cidItem.showList"
                :key="item.cid"
                :class="['ml-20 class_item', queryItems[`cid${index + 1}`] == item.cid && 'active']"
                @click="cidInit(item.cid, index, index + 1)"
              >
                {{ item.name }}
              </div>
            </div>
            <n-button
              v-if="cidItem.list.length > 20"
              strong
              secondary
              type="primary"
              round
              :class="['mt-10 more_btn', cidItem.list.length == cidItem.showList.length && 'active']"
              @click="moreList(cidItem, index)"
            >
              {{ cidItem.list.length == cidItem.showList.length ? '收起' : '更多'
              }}<TheIcon icon="ri:arrow-down-s-line" :size="18" class="ml-5" />
            </n-button>
          </div>
        </div>
      </block>

      <div class="class_level flex">
        <div class="class_level-left">筛选:</div>
        <div class="flex items-center">
          <div v-if="!classifyId" class="flex items-center">
            <n-checkbox v-model:checked="notCouponCheck" label="有券" @update:checked="checkCoupon" />
            <n-checkbox v-model:checked="ownerCheckG" label="自营" @update:checked="checkOwner($event, 'g')" />
            <n-checkbox v-model:checked="ownerCheckPOP" label="POP" @update:checked="checkOwner($event, 'p')" />
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
          <div
            :class="['ml-20 flex items-center order_item', sortClass('commissionShare') && 'active']"
            @click="sortTagSel('commissionShare')"
          >
            佣金比例<TheIcon icon="majesticons:arrow-down" :size="18" class="mr-5 icon_lab" />
          </div>
          <div
            :class="['ml-20 flex items-center order_item', sortClass('commission') && 'active']"
            @click="sortTagSel('commission')"
          >
            佣金<TheIcon icon="majesticons:arrow-down" :size="18" class="mr-5 icon_lab" />
          </div>
          <div
            :class="['ml-20 flex items-center order_item', sortClass('inOrderCount30Days') && 'active']"
            @click="sortTagSel('inOrderCount30Days')"
          >
            30天引单量
            <TheIcon icon="majesticons:arrow-down" :size="18" class="mr-5 icon_lab" />
          </div>
        </div>
      </div>
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
            <div class="item_title ml-5 mr-5 mt-10" @click="openDetail(item.itemId)">
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
        v-model:page="queryItems.page"
        v-model:page-size="queryItems.size"
        :page-count="pageCount"
        @update:page="pageChange"
      />
    </div>
  </CommonPage>
  <operate-single ref="operateSingleRef" lx-type="jd" @refresh="refresh" />
</template>
<script setup>
import { NButton, NTag, useMessage } from 'naive-ui';
import { ref } from 'vue';
import http from './api';
import operateSingle from './operateSingle.vue';
import { classifyJdList } from './options';
const operateSingleRef = ref(null)
const commodityList = ref([])
const pageCount = ref(0)
const message = useMessage()
const checkList = ref([])
const digitMap = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
const classifyId = ref(0)
const queryItems = ref({
  page: 1,
  keyword: '',
  cid1: 0,
  not_coupon: 0,
  owner: '',
  price: [0, 0],
  commission_rate: [0, 0],
  sort_name: '',
  sort_tag: '',
  size: 30,
  is_queue: 1,
})
const notCouponCheck = ref(!Boolean(queryItems.value.not_coupon))
const ownerCheckG = computed(() => queryItems.value.owner == 'g')
const ownerCheckPOP = computed(() => queryItems.value.owner == 'p')
function sortClass(sort) {
  return queryItems.value.sort_name == sort && queryItems.value.sort_tag == 'desc'
}
function sortTagSel(tag) {
  const { sort_name } = queryItems.value
  if (sort_name != tag) queryItems.value.sort_tag = ''
  const { sort_tag } = queryItems.value
  // queryItems.value.sort_name = tag
  queryItems.value.sort_tag = !sort_tag ? 'desc' : ''
  queryItems.value.sort_name = !sort_tag ? tag : ''
  updateList()
}
function checkCoupon(value) {
  notCouponCheck.value = value
  queryItems.value.not_coupon = Number(!value)
  queryItems.value.page = 1
  requestList()
}
function checkOwner(value, type) {
  queryItems.value.owner = value ? type : ''
  queryItems.value.page = 1
  requestList()
}

let cidContOptions = ref([
  {
    cid: 0,
    rankTxt: '',
    list: [],
    showList: [],
  },
])
async function cidInit(value = 0, index = 0, nextIndex = 0) {
  cidContOptions.value.splice(nextIndex)
  if (nextIndex) {
    // 更新列表的处理数据
    queryItems.value[`cid${nextIndex}`] = value
    ;[0, 0, 0].forEach((item, index) => {
      if (nextIndex <= index) queryItems.value[`cid${index + 1}`] = 0
    })
    requestList()
  }
  if (!value && nextIndex) return
  if (nextIndex > 2) return
  let params = {
    parentId: value,
    grade: nextIndex,
  }
  const res = await http.category(params)
  const list = res.data
  const currentObj = {
    list,
    showList: list,
    rankTxt: digitMap[nextIndex + 1],
  }
  if (list.length > 20) {
    let newArray = list.slice(0, 20)
    currentObj.showList = newArray
  }
  if (list.length) cidContOptions.value[nextIndex] = currentObj
  if (!list.length && cidContOptions.value[nextIndex]) {
    cidContOptions.value.splice(nextIndex, 1)
    return
  }
}
function moreList(cidItem, index) {
  const { list, showList } = cidItem
  if (list.length > showList.length) {
    cidContOptions.value[index].showList = list
    return
  }
  cidContOptions.value[index].showList = list.slice(0, 20)
}
function handleUpdateValue1(check) {
  checkList.value = check
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
      itemId: res.itemId,
      title: res.title,
      image: res.image,
      extend_word: res.extend_word || '',
      goods_name: res.goods_name || '',
      coupon_price: res.coupon_price || '',
    }))
  if (!selList.length) return message.error('请选中要推广的商品')
  operateSingleRef.value.show(selList)
}
function updateList() {
  queryItems.value.page = 1
  requestList()
}
function pageChange(page) {
  requestList()
}
function openDetail(itemId) {
  window.open(`https://jingfen.jd.com/detail/${itemId}.html`, '_blank') //在新的窗口打开
}
onMounted(async () => {
  requestList()
  await cidInit()
})
const requestApi = ref('goodsQueryList')

function classifyChange(id) {
  const { keyword, sort_name, sort_tag } = queryItems.value
  if (id) {
    queryItems.value = {
      page: 1,
      keyword,
      not_coupon: 1,
      sort_tag,
      sort_name,
      eliteId: id,
      size: 30,
      is_queue: 1,
    }
  } else {
    queryItems.value = {
      page: 1,
      keyword,
      cid1: 0,
      not_coupon: 0,
      owner: '',
      price: [0, 0],
      commission_rate: [0, 0],
      sort_name,
      sort_tag,
      size: 30,
      is_queue: 1,
    }
  }
  requestApi.value = !id ? 'goodsQueryList' : 'jingfen'
  classifyId.value = id
  updateList()
}
// 请求列表的数据
async function requestList() {
  const res = await http[requestApi.value](queryItems.value)
  if (!res.code) return message.error(res.msg)
  const { list, total_count } = res.data
  commodityList.value = list
  pageCount.value = Math.ceil(total_count / queryItems.value.size)
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
.order_item:hover {
  background: #f6f6f6;
  color: #333;
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

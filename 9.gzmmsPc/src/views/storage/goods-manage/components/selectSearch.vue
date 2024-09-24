<script setup lang="ts">
// 此组件暂时没用上, 放在这里留着参考

/* 
  element-plus2.4.3版本针对select组件新增头部插槽
  测试过2.5.3版本(可使用最新的select-v2),发现两个问题: 
  1.select的宽度丢失,变的极窄; 2.原封装的相关select组件无法弹出下拉选择列表
  github上有人说2.5.1版本可以弹出下拉选择列表,经测试可行,但是封装组件的部分样式丢失,且无法使用select-v2最新的插槽
  !!!最终决定不不不升级到2.5.x
*/
import { getGoodsArrApi } from "@/api/common/index";

const keyword = ref("");
const loading = ref(false);

const selectOptions = ref<any[]>([]); //实际展示的列表数据
const selectList = ref<any[]>([]); //初始列表数据

const page = ref(1);

const getData = async () => {
  let data = {
    page: page.value,
    keyword: keyword.value,
  };
  const result = await getGoodsArrApi(data);
  const res = result.data;
  const list = res.data || [];
  if (list.length === 0) return;
  // selectList.value = [selectList.value, ...list];
  selectOptions.value = [selectOptions.value, ...list];
  console.log("🚀 ~ getData ~  selectOptions.value :", selectOptions.value);
};

const remoteMethod = async (query: string) => {
  if (query) {
    selectOptions.value = [];
    loading.value = true;
    let data = {
      page: 1,
      size: 15,
      keyword: query,
    };
    const result = await getGoodsArrApi(data);
    loading.value = false;
    const list = result.data.data || [];
    selectOptions.value = list;
  } else {
    selectOptions.value = [];
  }
};
function loadmore() {
  page.value = page.value + 1;
  getData();
}

// onMounted(() => {
//   list.value = states.map((item) => {
//     return { value: `value:${item}`, label: `label:${item}` };
//   });
// });

const states = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];
</script>
<template>
  <el-select
    v-model="keyword"
    allow-create
    default-first-option
    popper-class="single-select-loadmore"
    filterable
    remote
    reserve-keyword
    placeholder="请选择名称"
    :remote-method="remoteMethod"
    :loading="loading"
    v-loadMore="loadmore"
    style="width: 100%"
  >
    <template #header>
      <ul class="select-header">
        <li class="select-header-item">条码</li>
        <li class="select-header-item">名称</li>
        <li class="select-header-item">规格</li>
        <li class="select-header-item">单位</li>
      </ul>
    </template>
    <el-option
      v-for="item in selectOptions"
      :key="item.id"
      :label="item.title"
      :value="JSON.stringify(item)"
      class="!whitespace-normal !text-clip !leading-[normal] !h-[auto] min-h-[32px] my-[2px]"
    >
      <ul class="select-list">
        <li class="select-list-item">{{ item.barcode }}</li>
        <li class="select-list-item">
          {{ item.title }}
        </li>
        <li class="select-list-item">{{ item.spec }}</li>
        <li class="select-list-item">{{ item.measure_name }}</li>
      </ul>
    </el-option>
  </el-select>
</template>
<style lang="scss" scoped>
.select-header {
  display: grid;
  grid-template-columns: 100px 200px 100px 100px;
  background-color: #374151;
  height: 100%;
  &-item {
    text-align: center;
    color: #ffffff99;
  }
}

.select-list {
  display: grid;
  grid-template-columns: 100px 200px 100px 100px;
  align-items: center;
  &-item {
    text-align: center;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
}
</style>
<style>
.single-select-loadmore .el-select-dropdown__header {
  padding-left: 0;
  padding-right: 0;
  background-color: #374151;
}
.single-select-ladmor .el-select-dropdown__list {
  padding-top: 0;
}

.single-select-loadmore .el-select-dropdown__item {
  padding: 0;
}
</style>

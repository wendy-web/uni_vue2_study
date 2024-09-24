<script setup lang="ts">
import { getGoodsArrApi } from "@/api/common/index";
import { IGoodsItem } from "@/api/common/types";

const props = defineProps({
  keyword: {
    type: String,
    default: "",
  },
});

const emits = defineEmits(["update:keyword"]);

const titleValue = computed({
  get() {
    return props.keyword;
  },
  set(val) {
    emits("update:keyword", val);
  },
});

const loading = ref(false);
const selectOptions = ref<IGoodsItem[]>([]);

const querySearchAsync = (queryString: string, cb: (arg: any) => void) => {
  console.log("queryString", queryString);
  if (queryString) {
    loading.value = true;
    // selectOptions.value = [];
    let data = {
      page: 1,
      size: 50,
      keyword: queryString,
    };
    getGoodsArrApi(data).then((result) => {
      const res = result.data;
      const list = res.data || [];
      if (list.length === 0) {
        loading.value = false;
        cb([]);
        return;
      }
      loading.value = false;
      selectOptions.value = [...list];
      selectOptions.value[0].flag = true;
      console.log("selectOptions.value", selectOptions.value);
      cb(selectOptions.value);
    });

    // setTimeout(() => {
    //   loading.value = false;
    //   cb(selectOptions.value);
    // }, 1000);
  } else {
    cb([]);
  }
};

// const handleSelect = (item: Record<string, any>) => {
//   console.log(item);
// };
</script>
<template>
  <!--  @select="handleSelect" -->
  <el-autocomplete
    v-model="titleValue"
    :fetch-suggestions="querySearchAsync"
    placeholder="请输入"
    @loading="loading"
    value-key="title"
    popper-class="autocomplete-list"
    :trigger-on-focus="false"
    :debounce="600"
  >
    <template #default="{ item }">
      <div>
        <ul class="select-header" v-if="item.flag">
          <li class="select-header-item">条码</li>
          <li class="select-header-item">名称</li>
          <li class="select-header-item">规格</li>
          <li class="select-header-item">单位</li>
        </ul>
        <ul class="select-list" :class="item.flag ? 'mt-[20px]' : ''">
          <li class="select-list-item">{{ item.barcode }}</li>
          <li class="select-list-item">
            {{ item.title }}
          </li>
          <li class="select-list-item">{{ item.spec }}</li>
          <li class="select-list-item">{{ item.measure_name }}</li>
        </ul>
      </div>
    </template>
  </el-autocomplete>
</template>
<style lang="scss" scoped>
.select-header {
  display: grid;
  grid-template-columns: 160px 200px 160px 100px;
  background-color: #374151;
  height: 32px;
  position: absolute;
  top: 0;
  left: 0px;
  right: 0;
  padding-left: 20px;
  &-item {
    text-align: center;
    color: #ffffff99;
    &:hover {
      background-color: #374151;
      cursor: default;
    }
  }
}

.select-list {
  display: grid;
  grid-template-columns: 160px 200px 160px 100px;
  align-items: center;
  // margin-top: 32px;
  &-item {
    padding-top: 4px;
    line-height: 24px;
    min-height: 32px;
    height: auto;
    white-space: normal;
    text-align: center;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
}
</style>

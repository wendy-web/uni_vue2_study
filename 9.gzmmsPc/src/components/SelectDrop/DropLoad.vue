<script setup lang="ts">
// 几个 入库单 使用的下拉选择货品组件
// 货品列表select选择组件,分页加载更多
import { ElSelect } from "element-plus";
import { getGoodsArrApi } from "@/api/common/index";
import ElSelectLoading from "./ElSelectLoading.vue";

type KeyString = {
  [key: string]: string;
};
interface Props {
  /** select的modelValue */
  title?: string;
  /** 需要显示的字段数组,默认[barcode", "title", "spec", "measure_name] */
  rowList?: string[];
  isFocus?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  title: "",
  rowList: () => ["barcode", "title", "spec", "measure_name"],
  isFocus: false,
});

const emit = defineEmits(["change"]);

const page = ref(1); //无搜索条件时的当前页码
const searchPage = ref(1); // 有搜索条件时的页面
const size = ref(15);
const loading = ref(false); //是否加载中，用来过滤重复的加载
const hasMore = ref(true); //是否有更多数据可加载

const queryValue = ref(""); // 搜索关键字
const selectMode = ref(1); // 1普通(无搜索关键字模式) 2搜索
const selectValue = ref();
const selectOptions = ref<any[]>([]); // 下拉列表数据
const backupsOptions = ref<any[]>([]); // 备份的下拉列表数据
const selectRef = ref<typeof ElSelect>();

const headerList = ref<string[]>(["条码", "名称"]);
// const rowList = ref<string[]>(["barcode", "title", "spec", "measure_name"]);

/** headerList与rowList的参数对照 */
const headerMap = {
  barcode: "条码",
  title: "名称",
  spec: "规格",
  measure_name: "单位",
  // sup_name: "供应商",
  warehouse_name: "仓库",
  // ph_no: "批次/日期",
  batch_number: "批次/日期",
};

// function change(index: number) {
//   let item = selectOptions.value[index];
//   console.log(item);
//   emit("change", item);
// }

function change(item: string) {
  emit("change", JSON.parse(item));
}

const headerLength = computed(() => {
  return headerList.value.length;
});

const rowLength = computed(() => {
  return props.rowList.length;
});

const loadDataList = async () => {
  let data = {
    page: selectMode.value == 1 ? page.value : searchPage.value + 1,
    size: size.value,
    keyword: selectMode.value == 1 ? undefined : queryValue.value,
  };
  try {
    loading.value = true;
    const res = await getGoodsArrApi(data);
    // console.log("res", res);
    const list = res.data.data || [];

    selectOptions.value.push(...list);
    hasMore.value = selectOptions.value.length < res.data.total;
    if (selectMode.value === 1) {
      backupsOptions.value = [...selectOptions.value];
      page.value = page.value + 1;
    } else {
      searchPage.value = searchPage.value + 1;
    }
  } finally {
    loading.value = false;
  }
};

const remoteMethod = async (query: string) => {
  queryValue.value = query;
  if (query) {
    selectOptions.value = [];
    loading.value = true;
    selectMode.value = 2;
    let data = {
      page: 1,
      size: size.value,
      keyword: query,
    };
    // console.log("data", data);
    const res = await getGoodsArrApi(data);
    console.log("res.data.total", res.data.total);
    loading.value = false;
    const list = res.data.data || [];

    selectOptions.value = list;

    // console.log("selectOptions.value.length", selectOptions.value.length);
    hasMore.value = selectOptions.value.length < res.data.total;
  } else {
    // selectOptions.value = []
    selectMode.value = 1;
    selectOptions.value = backupsOptions.value;
    hasMore.value = true;
  }
};

// 子组件触发事件加载更多数据
const handleLoadMore = () => {
  loadDataList();
};

watchEffect(() => {
  selectValue.value = props.title;
  if (props.isFocus) {
    setFocus();
  }
});

watchEffect(() => {
  // 根据rowList 返回对应的 headerList数据
  let list = props.rowList.map((item) => {
    return (headerMap as KeyString)[item];
  });
  headerList.value = list;
});

function setFocus() {
  nextTick(() => {
    selectRef.value?.focus();
  });
}
</script>
<template>
  <el-select
    placeholder="请选择名称"
    v-model="selectValue"
    filterable
    remote
    :remote-method="remoteMethod"
    @change="change($event)"
    remote-show-suffix
    ref="selectRef"
    style="width: 100%"
  >
    <el-option
      :label="1"
      :value="1"
      disabled
      class="!sticky top-0 z-10 bg-gray-600 hover:!bg-gray-700"
    >
      <span
        v-for="(hItem, hIndex) in headerList"
        :class="[
          hIndex != 3 ? 'w-[120px]' : 'w-[60px]',
          hIndex != headerLength - 1 ? 'mr-[10px]' : '',
          {},
          'inline-block',
          'text-center',
        ]"
      >
        {{ hItem }}
      </span>
    </el-option>
    <el-option
      v-for="(item, index) in selectOptions"
      :key="item.id"
      :label="item.title"
      :value="JSON.stringify(item)"
      :disabled="item.select_status"
      class="!whitespace-normal !text-clip !leading-[normal] !h-[auto] flex items-center min-h-[32px] my-[2px]"
    >
      <span
        v-for="(rItem, rIndex) in rowList"
        :class="[
          rIndex != 3 ? 'w-[120px]' : 'w-[60px]',
          rIndex != rowLength - 1 ? 'mr-[10px]' : '',
          'inline-block',
          'text-center',
          'text-omit',
        ]"
      >
        {{ item[rItem as any] }}
      </span>
    </el-option>
    <ElSelectLoading
      :page="page"
      :loading="loading"
      :hasMore="hasMore"
      @loadMore="handleLoadMore"
    />
  </el-select>
</template>

<style lang="scss" scoped>
.text-omit {
  // overflow: hidden;
  // text-overflow: ellipsis;
  // white-space: nowrap;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>

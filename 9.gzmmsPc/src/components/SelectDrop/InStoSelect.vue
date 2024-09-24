<script setup lang="ts">
// 几个 出库单 使用的下拉选择货品组件 -- 最新
// 已入库的货品select选择组件,分页加载更多
import { ElSelect } from "element-plus";
import { getInstockApi } from "@/api/common/index";
import ElSelectLoading from "./ElSelectLoading.vue";

type KeyString = {
  [key: string]: string;
};
interface Props {
  /** 唯一值数组 */
  stockIdList: number[];
  detailStockIdList: stockIdListType[];
  /** select的modelValue */
  title: string;
  /** 需要显示的字段数组,默认[barcode", "title", "spec", "measure_name] */
  rowList?: string[];
  pageType: number;
  /* 领料出库单,调拨单需要传入仓库id,其他单据不需要 */
  warehouse_id?: number; //调拨单需要传入仓库id
}
const props = withDefaults(defineProps<Props>(), {
  stockIdList: () => [] as number[],
  detailStockIdList: () => [] as stockIdListType[],

  title: "",
  rowList: () => ["barcode", "title", "warehouse_name", "batch_number","ws_code","in_wh_date"],
  pageType: 1, // 1是新建2是编辑
  warehouse_id: 0,
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
// const rowList = ref<string[]>(["barcode", "title", "warehouse_name", "batch_number"]);

// const idsList = ref<number[]>([]);
const idsList = ref<number[]>([]);
const detailIdsList = ref<stockIdListType[]>([]);

const currentEveryRes = ref(false);

/** headerList与rowList的参数对照 */
const headerMap = {
  barcode: "条码",
  title: "名称",
  spec: "规格型号",
  measure_name: "单位",
  // sup_name: "供应商",
  warehouse_name: "仓库",
  // ph_no: "批次/日期",
  batch_number: "批次/日期",
  stock: "可用库存",
  brand: "品牌",
  class_name: "分类",
  ws_code: "库位",
  in_wh_date: "入库日期",
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
    is_all: 1,
    warehouse_id: props.warehouse_id ? props.warehouse_id : undefined,
  };
  try {
    loading.value = true;
    const res = await getInstockApi(data);

    const list = res.data.list || [];
    // console.log("list", list);
    const total = res.data.total;
    checkId(list);
    if (props.pageType === 2) {
      checkDetailStockId(list);
    }
    selectOptions.value.push(...list);

    let filterList = selectOptions.value.filter((item) => {
      return item.stock > 0;
    });

    // console.log("filterList");
    if (filterList.length < 15 && total > size.value && list.length > 0) {
      if (selectMode.value === 1) {
        backupsOptions.value = [...selectOptions.value];
        page.value = page.value + 1;
      } else {
        searchPage.value = searchPage.value + 1;
      }
      loadDataList();
      return;
    }
    hasMore.value = selectOptions.value.length < total;
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
      is_all: 1,
      warehouse_id: props.warehouse_id ? props.warehouse_id : undefined,
    };
    // console.log("data", data);
    const res = await getInstockApi(data);
    console.log("res.data.total", res.data.total);
    loading.value = false;
    const list = res.data.list || [];
    checkId(list);
    if (props.pageType === 2) {
      checkDetailStockId(list);
    }
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

function checkId(list: any[]) {
  list.forEach((item) => {
    if (idsList.value.includes(item.stock_id)) {
      item.select_status = true;
    }
  });
}

function checkDetailStockId(list: any[]) {
  // console.log("checkDetailStockId执行了");
  list.forEach((element) => {
    let findRes = detailIdsList.value.find((item) => {
      return element.stock_id == item.stock_id;
    });
    if (findRes) {
      element.stock = findRes.old_num;
    }
  });
}

// 子组件触发事件加载更多数据
const handleLoadMore = () => {
  loadDataList();
};

watchEffect(() => {
  // idsList.value = props.ids;
  idsList.value = props.stockIdList;
  detailIdsList.value = props.detailStockIdList;
});
watchEffect(() => {
  selectValue.value = props.title;
});

watchEffect(() => {
  // 根据rowList 返回对应的 headerList数据
  let list = props.rowList.map((item) => {
    return (headerMap as KeyString)[item];
  });
  // console.log("headerList数据", list);
  headerList.value = list;
});
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
          hIndex != 3 ? 'w-[120px]' : 'w-[80px]',
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
      :key="item.stock_id"
      :label="item.title"
      :value="JSON.stringify(item)"
      :disabled="item.select_status"
      class="!whitespace-normal !text-clip !leading-[normal] !h-[auto] flex items-center min-h-[32px] my-[2px]"
      v-show="Number(item.stock) > 0"
    >
      <span
        v-for="(rItem, rIndex) in rowList"
        :class="[
          rIndex != 3 ? 'w-[120px]' : 'w-[80px]',
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

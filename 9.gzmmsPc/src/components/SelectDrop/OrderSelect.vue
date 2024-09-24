<script setup lang="ts">
// 单号选择组件, 无分页
interface ISelectList {
  id?: number;
  /** 采购单号 */
  procure_no?: string;
  /** 领料出库单号 */
  wh_rec_no?: string;
  /** 商品名称 */
  product_name?: string;
  receiver_name?: string;
}

enum EHeader {
  procure_no = "采购单号",
  wh_rec_no = "领料出库单号",
  product_name = "商品名称",
  receiver_name = "领料人",
}

interface Props {
  /** select下拉列表数据 */
  list: unknown[];
  /** select的modelValue */
  orderNum: string;
  /** 需要显示的字段数组,默认[procure_no", "product_name"] */
  rowList?: string[];
  isDisabled?: boolean;
  placeholderHint?: string;
}

const props = withDefaults(defineProps<Props>(), {
  list: () => [],
  orderNum: "",
  rowList: () => ["procure_no", "product_name"],
  isDisabled: false,
  placeholderHint:"请选择或输入采购单号"
});

/** headerList与rowList的参数对照 */
const headerMap = {
  procure_no: "采购单号",
  wh_rec_no: "领料出库单号",
  product_name: "商品名称",
  receiver_name: "领料人",
};

const state = reactive({
  selectList: [] as ISelectList[],
  headerList: [] as string[], //默认展示的表头数组,默认[采购单号,商品名称]
});

const { selectList, headerList } = toRefs(state);
const selectProcureRef = ref<HTMLSelectElement | null>();

const emit = defineEmits(["change"]);

function change(index: number) {
  emit("change", index);
}

const headerLength = computed(() => {
  return headerList.value.length;
});

const rowLength = computed(() => {
  return props.rowList.length;
});

function selectBlur() {
  selectProcureRef.value?.blur();
}

const rowListMap = () => {
  // 根据rowList 返回对应的 headerList数据
  let list = props.rowList.map((item) => {
    return (headerMap as any)[item];
  });
  headerList.value = list;
};

defineExpose({
  selectBlur,
});
watchEffect(() => {
  selectList.value = props.list as ISelectList[];
  rowListMap();
  //根据rowList 返回对应的 headerList数据
});
</script>
<template>
  <el-select
    ref="selectProcureRef"
    :model-value="orderNum"
    filterable
    default-first-option
    @change="change($event)"
    :placeholder="placeholderHint"
    :disabled="isDisabled"
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
          hIndex != headerLength - 1 ? 'mr-[10px]' : '',
          'w-[140px]',
          'inline-block',
          'text-center',
        ]"
      >
        {{ hItem }}
      </span>
    </el-option>
    <el-option
      v-for="(item, index) in selectList"
      :key="item.id"
      :label="item.procure_no || item.wh_rec_no"
      :value="index"
      class="!whitespace-normal !text-clip !leading-[normal] !h-[auto] flex items-center min-h-[36px] mb-[4px]"
    >
      <span
        v-for="(rItem, rIndex) in rowList"
        :class="[
          rIndex != rowLength - 1 ? 'mr-[10px]' : '',
          'w-[140px]',
          'inline-block',
          'text-center',
          'text-omit',
        ]"
      >
        {{ item[rItem as keyof ISelectList] }}
      </span>
    </el-option>
    <el-option :label="1" :value="1" disabled v-if="selectList.length == 0" class="text-center">
      <span>无可选数据</span>
    </el-option>
  </el-select>
</template>

<style scoped>
.text-omit {
  /* overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>

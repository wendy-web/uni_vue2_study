<script setup lang="ts">
import { orderDetailApi } from "@/api/buy/order/index";
import { usePrint } from "@/hooks/print";
import { Props } from "../../utils/types";
import { userPrint } from "./columns";

const { cellOnePrint, allPrint } = usePrint();

const props = defineProps<Props>();
const emits = defineEmits(["update:visible"]);

const visibleDrawer = computed({
  get() {
    return props.visible;
  },
  set(value) {
    emits("update:visible", value);
  },
});

const { columns } = userPrint();
const tableLoading = ref(false);
const tableData = ref([]);

async function getData(id: number) {
  tableLoading.value = true;
  try {
    const result = await orderDetailApi({ id });
    const res = result.data;
    tableData.value = res.goods.map((item: any) => {
      return {
        barcode: item.barcode,
        title: item.title,
        spec: item.spec,
        print_num: 1,
        num: item.num,
        rem_num: item.rem_num,
      };
    });
  } finally {
    tableLoading.value = false;
  }
}

watch(
  () => props.id,
  (newVal) => {
    console.log("newVal", newVal);
    if (newVal) {
      getData(newVal);
    }
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <div>
    <el-drawer v-model="visibleDrawer" title="打印详情" size="50%" :destroy-on-close="true">
      <div class="mb-[20px]">
        <p class="mb-4 text-gray-400 text-[14px]">
          温馨提示：为避免出现打印数量过多的情况,请设置打印数量(默认为1,最大为10),
        </p>
        <div class="header-left-top text-primary">
          <span>采购单号：</span>
          <span>{{ props.procure_no }}</span>
        </div>
      </div>
      <pure-table :data="tableData" :loading="tableLoading" :columns="columns" stripe border>
        <template #printNum="scope">
          <el-input-number
            v-model="scope.row.print_num"
            controls-position="right"
            :min="1"
            :max="10"
            style="width: 80px"
          />
        </template>
        <template #operation="scope">
          <el-button type="primary" @click="cellOnePrint(scope.row)">打印条码</el-button>
        </template>
      </pure-table>
      <template #footer>
        <div class="flex">
          <el-button @click="visibleDrawer = false" class="w-[100px]" type="primary" size="large">
            关闭
          </el-button>
          <el-button size="large" @click="allPrint(tableData)" :loading="tableLoading">
            打印全部条码
          </el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-drawer__header) {
  margin-bottom: 0;
}
</style>

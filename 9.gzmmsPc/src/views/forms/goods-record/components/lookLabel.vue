<script setup lang="ts">
import { getStocksLabelApi } from "@/api/forms/goods-record";
import type { LabelDataList } from "@/api/forms/goods-record/types";
import { usePrint } from "@/hooks/print";
import { useLabel } from "./columns";

const props = defineProps({
  stock_id: {
    type: Number,
    default: 0,
    required: true,
  },
});

const { cellOnePrint } = usePrint();
const { columns } = useLabel();
const drawerVisible = defineModel("dialogVisible", { required: true, default: false });

const tableLoading = ref(false);
const tableData = ref<LabelDataList[]>([]);

async function getData() {
  tableLoading.value = true;
  const result = await getStocksLabelApi({ stock_id: props.stock_id });
  console.log("🚀 ~ getData ~ result:", result);
  tableData.value = result.data.labels;
  tableData.value = tableData.value.map((item: any) => {
    return {
      ...item,
      print_num: 1,
    };
  });
  tableLoading.value = false;
}

watch(
  () => props.stock_id,
  (newValue) => {
    getData();
  },
);
</script>
<template>
  <div class="look-label">
    <el-drawer v-model="drawerVisible" title="查看标签" size="70%">
      <p class="mb-4 text-gray-400 text-[14px]">
        温馨提示：为避免出现打印数量过多的情况,请设置打印数量(默认为1,最大为10),
      </p>
      <pure-table :data="tableData" :loading="tableLoading" :columns="columns" stripe border>
        <template #qrcode="{ row }">
          <qrcode
            :info="{ barcode: row.barcode, title: row.title, spec: row.spec, content: row.content }"
          ></qrcode>
        </template>
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
          <el-button type="primary" @click="cellOnePrint(scope.row, scope.row.in_wh_date)">
            打印条码
          </el-button>
        </template>
      </pure-table>
      <template #footer>
        <div class="flex">
          <el-button @click="drawerVisible = false" class="w-[100px]" type="primary" size="large">
            关闭
          </el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>
<style lang="scss" scoped></style>

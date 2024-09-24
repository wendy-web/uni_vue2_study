<script setup lang="ts">
import { useRouter } from "vue-router";
import { getWarningDataApi } from "@/api/workbench/index";
import { ElResult } from "element-plus";

const router = useRouter();

const stock_warning_qty = ref(); // 安全库存
const goods_warning_qty = ref(); //订货点
const stock_warning_upper_qty = ref();
const exp_warning_qty = ref();

async function getData() {
  const result = await getWarningDataApi();
  stock_warning_qty.value = result.data.stock_warning_qty;
  goods_warning_qty.value = result.data.goods_warning_qty;
  stock_warning_upper_qty.value = result.data.stock_warning_upper_qty;
  exp_warning_qty.value = result.data.exp_warning_qty;
}

const clickItem = (type: number) => {
  let path = type === -1 ? "/forms/goods-record" : "/forms/goods-stock";
  router.push({
    path: path,
    query: {
      type,
    },
  });
};

onMounted(() => {
  getData();
});
</script>
<template>
  <el-card class="warning-info h-[200px] mb-[2px]">
    <div class="font-bold mb-[30px]">库存预警</div>
    <ul class="flex justify-center">
      <li
        class="w-[90px] h-[80px] rounded-[6px] flex flex-col justify-center items-center bg-[#79bbff] text-white mr-[20px] cursor-pointer"
        @click="clickItem(1)"
      >
        <span>库存下限</span>
        <span class="font-bold text-[20px]">{{ stock_warning_qty }}</span>
      </li>
      <li
        class="w-[90px] h-[80px] rounded-[6px] flex flex-col justify-center items-center bg-[#79bbff] text-white mr-[20px] cursor-pointer"
        @click="clickItem(2)"
      >
        <span>库存上限</span>
        <span class="font-bold text-[20px]">{{ stock_warning_upper_qty }}</span>
      </li>
      <li
        class="w-[90px] h-[80px] rounded-[6px] flex flex-col justify-center items-center bg-[#b1b3b8] text-white cursor-pointer mr-[20px]"
        @click="clickItem(-1)"
      >
        <span>保质期</span>
        <span class="font-bold text-[20px]">{{ exp_warning_qty }}</span>
      </li>
      <li
        class="w-[90px] h-[80px] rounded-[6px] flex flex-col justify-center items-center bg-[#eebe77] text-white cursor-pointer"
        @click="clickItem(3)"
      >
        <span>订货预警</span>
        <span class="font-bold text-[20px]">{{ goods_warning_qty }}</span>
      </li>
    </ul>
  </el-card>
</template>
<style lang="scss" scoped></style>

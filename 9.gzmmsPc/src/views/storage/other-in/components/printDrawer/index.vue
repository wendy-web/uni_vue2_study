<script setup lang="ts">
import { detailOtherInApi } from "@/api/storage/other-in";
import { formartDate } from "@/utils/validate";
import { usePrint } from "@/hooks/print";
import { userPrint } from "./columns";

const { cellOnePrint, allPrint } = usePrint();

type Props = {
  wh_in_no: string;
  id: number;
  in_time: string;
  in_wh_name: string;
};

const props = defineProps<Props>();
const visible = defineModel("visible", { required: true, default: false });

const { columns } = userPrint();
const tableLoading = ref(false);
const tableData = ref<any[]>([]);

async function getData(id: number) {
  tableLoading.value = true;
  try {
    const result = await detailOtherInApi({ id });
    const res = result.data;
    tableData.value = res.goods.map((item: any) => {
      return {
        ...item,
        print_num: 1,
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
    console.log("visible", visible);
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
    <el-drawer v-model="visible" title="打印详情" size="50%" :destroy-on-close="true">
      <div class="mb-[20px]">
        <p class="mb-4 text-gray-400 text-[14px]">
          温馨提示：为避免出现打印数量过多的情况,请设置打印数量(默认为1,最大为10),
        </p>
        <div class="flex mb-4">
          <div class="header-left-top text-primary mr-4">
            <span>其他入库单号：</span>
            <span>{{ wh_in_no }}</span>
          </div>
        </div>
        <div class="flex">
          <div class="header-left-top text-primary mr-4">
            <span>入库日期：</span>
            <span>{{ formartDate(in_time) }}</span>
          </div>
          <div class="header-left-top text-primary">
            <span>入库仓库：</span>
            <span>{{ in_wh_name }}</span>
          </div>
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
          <el-button type="primary" @click="cellOnePrint(scope.row,in_time)">打印条码</el-button>
        </template>
      </pure-table>
      <template #footer>
        <div class="flex">
          <el-button @click="visible = false" class="w-[100px]" type="primary" size="large">
            关闭
          </el-button>
          <el-button size="large" @click="allPrint(tableData,in_time)" :loading="tableLoading">
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

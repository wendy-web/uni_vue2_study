<script setup lang="ts">
import { getGoodsLogApi } from "@/api/storage/goods-manage";

const props = defineProps({
  goodsId: {
    type: Number,
    default: 0,
  },
});

const logData = ref([]);

const getData = async () => {
  const result = await getGoodsLogApi({ goods_id: props.goodsId });
  console.log("🚀 ~ getData ~ result:", result);
  const res = result.data;
  logData.value = res.list;
};

onMounted(() => {
  getData();
});
</script>
<template>
  <div class="log-wrapper min-h-[700px]">
    <el-table
      :data="logData"
      border
      stripe
      style="width: 60%"
      :cell-style="{ 'text-align': 'center' }"
      :header-cell-style="{ 'text-align': 'center' }"
    >
      <el-table-column label="操作人" prop="ct_name" />
      <el-table-column label="操作类型">
        <template #default="{ row }">
          <span>{{ row.act }}</span>
          <span v-if="row.act_msg">：{{ row.act_msg }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" prop="create_time" />
    </el-table>
  </div>
</template>
<style lang="scss" scoped></style>

<script setup lang="ts">
/* 本组件是: 发料明细弹窗 */
// 导入明细api
import { giveDetailApi } from "@/api/storage/get-supplier";

interface Props {
  visible: boolean;
  id: number;
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  id: 0,
});

let emits = defineEmits(["update:visible"]);
const tableData = ref<any[]>([]);
const loading = ref(false);

const visibleDialog = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emits("update:visible", false);
  },
});

async function getData() {
  if (props.id) {
    loading.value = true;
    try {
      const result = await giveDetailApi({ id: props.id });
      console.log("result", result);
      tableData.value = result.data;
    } finally {
      loading.value = false
    }
  }
}

watch(
  () => props.visible,
  (val) => {
    if (val) {
      getData();
    }
  },
);
</script>

<template>
  <el-dialog v-model="visibleDialog" title="发料明细" width="60%" draggable top="30vh">
    <el-table
      :data="tableData"
      border
      stripe
      header-cell-class-name="table-row-header"
      :cell-style="{ 'text-align': 'center' }"
      :header-cell-style="{ 'text-align': 'center' }"
      v-loading="loading"
    >
      <el-table-column label="发料数量" prop="material_issue_num"></el-table-column>
      <el-table-column label="发料日期" prop="material_issue_time"></el-table-column>
      <el-table-column label="仓库发料人" prop="ct_name"></el-table-column>
      <el-table-column label="确认日期" prop="receive_time">
        <template #default="{ row }">
          <span>{{ row.receive_time || "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="领取确认人" prop="receive_name">
        <template #default="{ row }">
          <span>{{ row.receive_name || "-" }}</span>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <span class="flex justify-center mt-10">
        <el-button @click="visibleDialog = false" size="large" class="w-[100px]">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss"></style>

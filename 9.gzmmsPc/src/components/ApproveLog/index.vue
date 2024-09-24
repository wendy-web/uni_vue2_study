<script setup lang="ts">
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { computed } from "vue";
import { IApproveLogType } from "@/api/common/types";

const locale = ref(zhCn);
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  // list: {
  //   type: Array,
  //   default: () => [],
  // },
  list: Array as PropType<IApproveLogType[]>,
  loading: {
    type: Boolean,
    default: false,
  },
  headerMsg: {
    type: String,
    default: "",
  },
});

let emits = defineEmits(["update:visible"]);

let visibleDialog = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emits("update:visible", false);
  },
});
// 操作类型id 1提交 2待审批 3审批通过 4驳回 5撤回 6中止执行 7仓库待确认 8仓库已确认 9仓库已驳回 12领取人确认
const sapnClass = computed(() => {
  return (status: number) => {
    const greenArr = [1, 3, 8, 12];
    const redArr = [4, 5, 9];
    if (greenArr.includes(status)) {
      return "text-green-500";
    } else if (redArr.includes(status)) {
      return "text-red-500";
    }
    return "";
  };
});
</script>
<template>
  <div>
    <el-config-provider :locale="locale">
      <el-dialog
        class="dialog-wrapper"
        title="审批日志"
        v-model="visibleDialog"
        width="40%"
        top="30vh"
        draggable
      >
        <p class="mb-[10px]">{{ headerMsg }}</p>
        <el-table
          :data="list"
          border
          stripe
          v-loading="loading"
          header-cell-class-name="table-row-header-ectype"
        >
          <el-table-column label="执行人【部门】" prop="user.name">
            <template #default="{ row, $index }">
              <span>{{ row.user.name }}【{{ row.user.dept.name }}】</span>
            </template>
          </el-table-column>
          <el-table-column label="所属仓库" prop="warehouse_names"></el-table-column>
          <el-table-column label="操作类型" prop="operation_type">
            <template #default="{ row, $index }">
              <span :class="sapnClass(row.operation_id)">
                {{ row.operation_type }}
              </span>
            </template>
          </el-table-column>
          >
          <el-table-column label="时间" prop="operation_time" />
        </el-table>
        <template #footer>
          <span>
            <el-button @click="visibleDialog = false">关闭</el-button>
          </span>
        </template>
      </el-dialog>
    </el-config-provider>
  </div>
</template>
<style lang="scss" scoped>
:deep(.el-dialog__body) {
  padding-top: 10px;
}
</style>

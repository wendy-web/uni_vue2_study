<template>
  <!-- <div :class="{ hidden: hidden }" class="pagination-container"> -->
  <div :class="[{ hidden: hidden }, customClass]">
    <!-- <el-config-provider :locale="zhCn"> -->
    <el-pagination
      :background="background"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- </el-config-provider> -->
    <!-- :total="total" -->
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from "vue";
import { scrollTo } from "@/utils/scroll-to";

// 引入中文包
// import zhCn from "element-plus/lib/locale/lang/zh-cn";

const props = defineProps({
  total: {
    required: true,
    type: Number as PropType<number>,
    default: 0,
  },
  page: {
    type: Number,
    default: 1,
  },
  limit: {
    type: Number,
    default: 20,
  },
  pageSizes: {
    type: Array as PropType<number[]>,
    default() {
      return [10, 20, 30, 50];
    },
  },
  layout: {
    type: String,
    default: "total, sizes, prev, pager, next, jumper",
    // default: "sizes, prev, pager, next, jumper",
  },
  background: {
    type: Boolean,
    default: true,
  },
  autoScroll: {
    type: Boolean,
    default: true,
  },
  hidden: {
    type: Boolean,
    default: false,
  },
  customClass: {
    type: String,
    // default: "pagination-shadow",
    default: "pagination-container",
  },
});

const emit = defineEmits(["update:page", "update:limit", "pagination"]);

const currentPage = computed<number | undefined>({
  get: () => props.page,
  set: (value) => {
    emit("update:page", value);
  },
});

const pageSize = computed<number | undefined>({
  get() {
    return props.limit;
  },
  set(val) {
    emit("update:limit", val);
  },
});

function handleSizeChange(val: number) {
  emit("pagination", { page: currentPage, limit: val });
  if (props.autoScroll) {
    scrollTo(0, 800);
  }
}

function handleCurrentChange(val: number) {
  currentPage.value = val;
  emit("pagination", { page: val, limit: props.limit });
  if (props.autoScroll) {
    scrollTo(0, 800);
  }
}
</script>

<style scoped>
.pagination-shadow {
  /* padding: 32px 16px; */
  padding: 16px 16px;
  background-color: var(--el-bg-color);
  border-radius: 5px;
  box-shadow: var(--el-box-shadow-light);
}
.pagination-container {
  padding: 16px 16px 0 16px;
  background-color: var(--el-bg-color);
  border-radius: 5px;
}

.pagination-container.hidden {
  display: none;
}
</style>

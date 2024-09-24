<script setup lang="ts">
import { useDetail } from "../utils/detail";

const props = defineProps({
  info: {
    type: Object,
    default: () => ({
      item_count: {},
      item_arr: [],
      cycle_type: 0,
    }),
  },
});
/** 循环周期名称 */
const cycle_name = ref("");

const { columns, getInspecCycleName } = useDetail();

const tableList = ref<any[]>([]);

/** 转换一下详情返回的item_arr数据 */
function changeDetail() {
  let arr = props.info.item_arr.map((item: any) => {
    let { result_content, record_method } = item;
    return {
      val: getResultContentIndex(result_content, record_method),
      ...item,
    };
  });
  console.log("🚀 ~ changeDetail ~ arr:", arr);
  return arr;
}

/** 获取index */
function getResultContentIndex(list: any[], record_method: number) {
  if (record_method === 0) {
    let findIndex = list.findIndex((item) => {
      return item.is_check;
    });
    return findIndex > -1 ? findIndex : undefined;
  } else if (record_method === 1) {
    let indexList = list.map((item, index) => (item.is_check ? index : "")).filter(String);
    return indexList;
  } else if ([2, 3].includes(record_method)) {
    return list[0]?.val;
  }
}

onMounted(() => {
  cycle_name.value = getInspecCycleName(props.info.cycle_type);
  if (props.info.item_arr.length) {
    tableList.value = changeDetail();
  }
});
</script>
<template>
  <div class="project-container">
    <div class="mb-2 font-bold">
      <span class="inline-block mr-4">循环周期</span>
      <span>{{ cycle_name }}</span>
    </div>
    <PureTable header-cell-class-name="table-gray-header" :data="tableList" :columns="columns">
      <template #select="{ row, $index }">
        <div v-if="row.record_method === 0">
          <!-- 如果是单选 -->
          <el-radio-group v-model="row.val" class="ml-4" :disabled="true">
            <el-radio :label="index" v-for="(item, index) in row.result_content">
              <span :class="[item.is_check && item.is_normal ? '!text-orange-500' : '']">
                {{ item.val }}
              </span>
            </el-radio>
          </el-radio-group>
        </div>
        <div v-else-if="row.record_method === 1">
          <!-- 如果是多选 -->
          <el-checkbox-group v-model="row.val" :disabled="true">
            <el-checkbox :label="index" v-for="(item, index) in row.result_content">
              <span :class="[item.is_check && item.is_normal ? '!text-orange-500' : '']">
                {{ item.val }}
              </span>
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <div v-else>
          <span>{{ row.val }}</span>
        </div>
      </template>
    </PureTable>
    <ul class="flex justify-end mt-4 pr-[60px]">
      <li class="mr-4">
        <span>检查项目总数</span>
        <span class="font-bold inline-block ml-4 text-green-400">{{ info.item_count.count }}</span>
      </li>
      <li>
        <span>异常项</span>
        <span class="font-bold inline-block ml-4 text-red-400">{{ info.item_count.normal }}</span>
      </li>
    </ul>
  </div>
</template>
<style lang="scss" scoped>
:deep(.el-radio__input.is-disabled.is-checked .el-radio__inner::after) {
  background-color: var(--el-color-primary);
  width: 8px;
  height: 8px;
}
/* 如果是使用 el-checkbox 而非 el-checkbox-button，样式会稍有不同 */
:deep(.el-checkbox.is-disabled.is-checked .el-checkbox__inner::after) {
  border-color: var(--el-color-primary);
}
</style>

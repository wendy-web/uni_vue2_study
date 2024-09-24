<script setup lang="ts">
/* CIP灌装间卫生列表页面-查看检查内容组件 */
import { useCommon as useDeviceCommon } from "@/hooks/device/baseData";

const { getRecordName, getLimitVal } = useDeviceCommon();

interface Props {
  list: any[];
}

const props = withDefaults(defineProps<Props>(), { list: () => [] });

/** 转换一下详情返回的item_arr数据 */
function changeDetail(list: any[]) {
  let arr = list.map((item) => {
    let { result_content, record_method } = item;
    return {
      val: getResultContentIndex(result_content, record_method),
      ...item,
    };
  });
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
    return list[0].val;
  }
}

function warningCheckNumberValue(row: any) {
  let { val, upper_limit_val, lower_limit_val } = row;
  if (Number(val) > Number(upper_limit_val) || Number(val) < Number(lower_limit_val)) {
    return true;
  }
  return false;
}

const formColumns: PlusColumnList = [
  {
    label: "检查内容组名",
    prop: "name",
  },
  {
    label: "检查目的",
    prop: "std_explain",
  },
  {
    label: "状态",
    prop: "status",
    valueType: "select",
    options: [
      {
        label: "未检",
        value: 0,
        color: "orange",
      },
      {
        label: "有异常",
        value: 1,
        color: "red",
      },
      {
        label: "已检",
        value: 2,
        color: "blue",
      },
    ],
  },
];

const tableColumns: TableColumnList = [
  {
    label: "序号",
    type: "index",
    width: 60,
  },
  {
    label: "检查内容",
    prop: "item_content",
    align: "center",
  },
  {
    label: "检验方法/工具/依据",
    prop: "method",
    align: "center",
  },
  {
    label: "检查标准说明",
    prop: "std_explain",
    align: "center",
  },
  {
    label: "记录方式",
    prop: "record_method",
    align: "center",
    cellRenderer: ({ row }) => {
      return getRecordName(row.record_method);
    },
  },
  {
    label: "结果选项",
    align: "center",
    slot: "select",
  },
  {
    label: "上限",
    prop: "upper_limit_val",
    align: "center",
    cellRenderer: ({ row }) => {
      return getLimitVal(row.record_method, row.upper_limit_val);
    },
  },
  {
    label: "下限",
    prop: "lower_limit_val",
    align: "center",
    cellRenderer: ({ row }) => {
      return getLimitVal(row.record_method, row.lower_limit_val);
    },
  },
  {
    label: "备注",
    prop: "note",
    align: "center",
  },
];
</script>
<template>
  <div class="conent-wrapper">
    <div class="conent-wrapper-item mb-4" v-for="content in list" :key="content.id">
      <PlusDescriptions :column="3" :columns="formColumns" :data="content"></PlusDescriptions>
      <pure-table
        ref="prueTableRef"
        row-key="id"
        stripe
        header-cell-class-name="table-gray-header"
        :data="changeDetail(content.items)"
        :columns="tableColumns"
        class="my-4"
      >
        <template #select="{ row, $index }">
          <div v-if="row.record_method === 0">
            <!-- 如果是单选 -->
            <el-radio-group v-model="row.val" class="ml-4 w-full justify-center" disabled>
              <el-radio :label="index" v-for="(item, index) in row.result_content">
                <span :class="[item.is_normal ? '!text-orange-500' : '']">
                  {{ item.val }}
                </span>
              </el-radio>
            </el-radio-group>
          </div>
          <div v-else-if="row.record_method === 1">
            <el-checkbox-group v-model="row.val" class="w-full justify-center" disabled>
              <el-checkbox :label="index" v-for="(item, index) in row.result_content">
                <span :class="[item.is_normal ? '!text-orange-500' : '']">
                  {{ item.val }}
                </span>
              </el-checkbox>
            </el-checkbox-group>
          </div>
          <div v-else-if="row.record_method === 2">
            <el-input
              v-model="row.val"
              v-inputnum.num_point="4"
              placeholder="请输入数值"
              :class="[warningCheckNumberValue(row) ? 'warning-text' : '']"
              disabled
            ></el-input>
          </div>
          <div v-else-if="row.record_method === 3">
            <el-input v-model="row.val" disabled></el-input>
          </div>
        </template>
      </pure-table>
      <ul class="flex justify-end">
        <li class="mr-4">
          <span>正常项</span>
          <span class="text-green-500 font-bold in inline-block ml-2">
            {{ content.normal_count }}
          </span>
        </li>
        <li>
          <span>异常项</span>
          <span class="text-red-500 font-bold inline-block ml-2">{{ content.abnormal_count }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.conent-wrapper {
  max-height: 60vh;
  overflow: auto;
}

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

<script setup lang="ts">
/* 编辑页面-点击执行检查的弹窗组件 */
import type { FormInstance } from "element-plus";
import { isArray } from "@pureadmin/utils";
import { useCommon as useDeviceCommon } from "@/hooks/device/baseData";

const { getRecordName, getLimitVal } = useDeviceCommon();
const model = defineModel("visible", { required: true, default: false });
const emits = defineEmits(["confirm"]);

// 表格表单
const formTableRef = ref<FormInstance>();
// 表格数据
const formTable = ref({
  check_user_name: "", //检查人
  name: "", //检查内容组名
  std_explain: "", //检查目的
  tableList: [] as any[],
});

const isDisabled = ref(false);

/** 点击确认执行 */
async function clickSubmit() {
  let validateRes = await formTableRef.value!.validate((valid, fields) => {
    for (const keys in fields) {
      if (fields[keys]) {
        // 弹出每个字段的错误提示
        ElMessage.warning(fields[keys][0].message);
        break;
      }
    }
  });
  console.log("🚀 ~ validateRes ~ validateRes:", validateRes);
  if (!validateRes) return;
  emits("confirm", changeTable(formTable.value.tableList));
}

/** 点击取消 */
function clickColse() {
  model.value = false;
}

function setData(data: any, disabled = false) {
  formTable.value.check_user_name = data.check_user_name;
  formTable.value.name = data.name;
  formTable.value.std_explain = data.std_explain;
  formTable.value.tableList = changeDetail(data.items);
  console.log("data.items!!!!!!!!!!!!!!!!!",data.items)
  console.log("🚀 ~ setData ~ formTable.value.tableList :", formTable.value.tableList )
  isDisabled.value = disabled;
}

//弹窗关闭的回调
function closeDialog() {
  isDisabled.value = false;
  formTableRef.value?.resetFields();
  formTable.value.check_user_name = "";
  formTable.value.name = "";
  formTable.value.std_explain = "";
  formTable.value.tableList = [];
}

defineExpose({
  setData,
});

/** 异常值 */
const abnormalSum = computed(() => {
  let list = changeTable(formTable.value.tableList);
  let newList = list.map((item) => {
    let count = 0;
    let { result_content, record_method } = item;
    if (record_method == 0 || record_method == 1) {
      result_content.forEach((item) => {
        if (item.is_check === 1 && item.is_normal === 1) {
          count++;
        }
      });
    } else if (record_method == 2) {
      result_content.forEach((item) => {
        if (item.is_normal === 1) {
          count++;
        }
      });
    }
    return {
      count,
    };
  });

  let totalCount = 0;

  for (let i = 0; i < newList.length; i++) {
    totalCount += newList[i].count || 0;
  }

  return totalCount;
});

/** 正常值 */
const normalSum = computed(() => {
  let list = changeTable(formTable.value.tableList);
  let newList = list.map((item) => {
    let count = 0;
    let { result_content, record_method } = item;
    if (record_method == 0 || record_method == 1) {
      result_content.forEach((item) => {
        if (item.is_check === 1 && item.is_normal === 0) {
          count++;
        }
      });
    } else if (record_method == 2) {
      result_content.forEach((item) => {
        if (item.is_normal === 0) {
          count++;
        }
      });
    }
    return {
      count,
    };
  });

  let totalCount = 0;

  for (let i = 0; i < newList.length; i++) {
    totalCount += newList[i].count || 0;
  }

  return totalCount;
});

/** 提交数据时 转换一下tables数据 */
function changeTable(list: any[]) {
  let arr = list.map((item) => {
    let { result_content, ...rest } = item;

    let itemObj = {
      item_content: item.item_content,
      method: item.method,
      record_method: item.record_method,
      std_explain: item.std_explain,
      upper_limit_val: item.upper_limit_val,
      lower_limit_val: item.lower_limit_val,
      note: item.note,
      abnormal_val: item.abnormal_val,
      normal_val: item.normal_val,
      default_val: item.default_val,
      result_content: changeResultContent(
        item.result_content,
        item.val,
        item.record_method,
        item.upper_limit_val,
        item.lower_limit_val,
      ),
    };

    return itemObj;
  });
  return arr;
}

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

/** 提交数据时转换table里面的 result_content */
function changeResultContent(
  restContent: any[],
  value: number | string | number[],
  method: number,
  upper_limit_val: string,
  lower_limit_val: string,
) {
  if ([0, 1].includes(method)) {
    return restContent.map((item, index) => {
      let { is_check, ...rest } = item;
      return {
        is_check: isArray(value) ? Number(value.includes(index)) : Number(index === value),
        ...rest,
      };
    });
  } else if (method === 2) {
    return restContent.map((item, index) => {
      let { is_check, type } = item;
      let is_normal =
        Number(value) > Number(upper_limit_val) || Number(value) < Number(lower_limit_val) ? 1 : 0;
      console.log("🚀 ~ returnrestContent.map ~ is_normal:", is_normal);
      return {
        is_check,
        is_normal: is_normal,
        type,
        val: value,
      };
    });
  } else {
    return restContent.map((item, index) => {
      let { is_check, is_normal, type } = item;
      return {
        is_check,
        is_normal,
        type,
        val: value,
      };
    });
  }
}

function warningCheckNumberValue(row: any) {
  let { val, upper_limit_val, lower_limit_val } = row;
  if (Number(val) > Number(upper_limit_val) || Number(val) < Number(lower_limit_val)) {
    return true;
  }
  return false;
}

function checkNumberValue(
  rule: any,
  value: any,
  callback: any,
  upper_limit_val: string,
  lower_limit_val: string,
) {
  // console.log("Number(value)", Number(value));
  // console.log("Number(upper_limit_val) ", Number(upper_limit_val));
  // console.log(" Number(lower_limit_val) ", Number(lower_limit_val));
  if (!value) {
    callback(new Error("请输入数值"));
  }
  // else if (Number(value) > Number(upper_limit_val) || Number(value) < Number(lower_limit_val)) {
  //   callback(new Error(`数值应在${lower_limit_val}到${upper_limit_val}之间`));
  // }
  else {
    callback();
  }
}

/** 执行检查组件顶部columns */
const inspectBaseColumns: PlusColumnList = [
  {
    label: "检查人",
    prop: "check_user_name",
  },
  {
    label: "检查内容组名",
    prop: "name",
  },
  {
    label: "检查目的",
    prop: "std_explain",
  },
];

/** 执行检查组件表格columns */
const inspectTableColumns: TableColumnList = [
  {
    label: "检查内容",
    prop: "item_content",
    align: "center",
  },
  {
    label: "检验方法",
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
    width: 80,
    cellRenderer: ({ row }) => {
      return getRecordName(row.record_method);
    },
  },
  {
    label: "结果选项",
    align: "center",
    slot: "select",
    minWidth: 200,
  },
  {
    label: "上限",
    prop: "upper_limit_val",
    align: "center",
    minWidth: 60,
    cellRenderer: ({ row }) => {
      return getLimitVal(row.record_method, row.upper_limit_val);
    },
  },
  {
    label: "下限",
    prop: "lower_limit_val",
    align: "center",
    minWidth: 60,
    cellRenderer: ({ row }) => {
      return getLimitVal(row.record_method, row.lower_limit_val);
    },
  },
  {
    label: "备注",
    prop: "note",
    align: "center",
    slot: "note",
    minWidth: 60,
  },
];
</script>
<template>
  <div class="inspect-wrapper">
    <el-drawer
      v-model="model"
      size="70%"
      title="执行检查内容"
      :close-on-press-escape="false"
      @close="closeDialog"
    >
      <PlusDescriptions
        :column="3"
        :columns="inspectBaseColumns"
        :data="formTable"
      ></PlusDescriptions>
      <el-form :model="formTable" ref="formTableRef">
        <el-card shadow="never" class="mb-6" header="检查项目">
          <PureTable
            header-cell-class-name="table-gray-header"
            :data="formTable.tableList"
            :columns="inspectTableColumns"
            scrollbar-always-on
            height="calc(80vh - 100px)"
          >
            <template #select="{ row, $index }">
              <div v-if="row.record_method === 0">
                <el-form-item
                  :prop="`tableList.${$index}.val`"
                  :rules="[
                    {
                      required: true,
                      message: '请选择结果选项',
                    },
                  ]"
                >
                  <!-- 如果是单选 -->
                  <el-radio-group
                    v-model="row.val"
                    class="ml-4 w-full justify-center"
                    :disabled="isDisabled"
                  >
                    <el-radio :label="index" v-for="(item, index) in row.result_content">
                      <span :class="[item.is_normal ? '!text-orange-500' : '']">
                        {{ item.val }}
                      </span>
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
              <div v-else-if="row.record_method === 1">
                <!-- 如果是多选 -->
                <el-form-item
                  :prop="`tableList.${$index}.val`"
                  :rules="[
                    {
                      required: true,
                      message: '请选择结果选项',
                    },
                  ]"
                >
                  <el-checkbox-group
                    v-model="row.val"
                    class="w-full justify-center"
                    :disabled="isDisabled"
                  >
                    <el-checkbox :label="index" v-for="(item, index) in row.result_content">
                      <span :class="[item.is_normal ? '!text-orange-500' : '']">
                        {{ item.val }}
                      </span>
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </div>
              <div v-else-if="row.record_method === 2">
                <el-form-item
                  :prop="`tableList.${$index}.val`"
                  :rules="[
                    {
                      required: true,
                      validator: (rule, value, callback) => {
                        checkNumberValue(
                          rule,
                          value,
                          callback,
                          row.upper_limit_val,
                          row.lower_limit_val,
                        );
                      },
                      trigger: 'blur',
                    },
                  ]"
                >
                  <el-input
                    v-model="row.val"
                    v-inputnum.num_point="4"
                    placeholder="请输入数值"
                    :class="[warningCheckNumberValue(row) ? 'warning-text' : '']"
                    :disabled="isDisabled"
                  ></el-input>
                </el-form-item>
              </div>
              <div v-else-if="row.record_method === 3">
                <el-form-item
                  :prop="`tableList.${$index}.val`"
                  :rules="[
                    {
                      required: true,
                      message: '请输入文本',
                    },
                  ]"
                >
                  <el-input
                    v-model="row.val"
                    placeholder="请输入内容"
                    :disabled="isDisabled"
                  ></el-input>
                </el-form-item>
              </div>
            </template>
            <template #note="{ row }">
              <el-input
                v-model="row.note"
                placeholder="请输入备注"
                :disabled="isDisabled"
              ></el-input>
            </template>
          </PureTable>
          <ul class="flex justify-end mt-4 pr-[60px]">
            <li class="mr-4">
              <span>正常项</span>
              <span class="font-bold inline-block ml-4 text-green-400">{{ normalSum }}</span>
            </li>
            <li>
              <span>异常项</span>
              <span class="font-bold inline-block ml-4 text-red-400">{{ abnormalSum }}</span>
            </li>
          </ul>
        </el-card>
      </el-form>

      <template #footer>
        <div class="flex items-start">
          <template v-if="isDisabled">
            <el-button type="primary" plain size="large" class="w-[100px]" @click="clickColse">
              关闭
            </el-button>
          </template>
          <template v-else>
            <el-button size="large" type="primary" class="w-[100px]" @click="clickSubmit">
              确认执行
            </el-button>
            <el-button type="primary" plain size="large" class="w-[100px]" @click="clickColse">
              取消
            </el-button>
          </template>
        </div>
      </template>
    </el-drawer>
  </div>
</template>
<style lang="scss" scoped>
:deep(.el-drawer__header) {
  margin-bottom: 0;
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

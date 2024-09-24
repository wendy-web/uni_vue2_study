<script setup lang="tsx">
/* 整改情况组件 */
import type { FormInstance } from "element-plus";
import dayjs from "dayjs";
import { checkIsBeforeDate } from "@/utils/validate";
import MultiUpload from "@/components/Upload/MultiUpload.vue";
import { type TableListType, useAdd } from "../utils/add";

interface Props {
  list: string[];
  rectify_time: string;
  rectify_feedback: string;
  disabled: boolean;
  rectify_list: TableListType[];
}

const { tableColumns, warningCheckNumberValue } = useAdd();

const props = withDefaults(defineProps<Props>(), {
  list: () => [],
  disabled: false,
  rectify_time: dayjs().format("YYYY-MM-DD HH:mm"),
  rectify_feedback: "",
  rectify_list: () => [],
});

const PlusformRef = ref();
const formRef = computed(() => {
  return PlusformRef.value.formInstance as FormInstance;
});

const tableFormRef = ref<FormInstance>();

const rectifyForm = ref({
  rectify_time: props.rectify_time, //整改时间
  rectify_feedback: props.rectify_feedback, //整改反馈
  rectify_picture: props.list, //整改照片
  rectify_list: props.rectify_list, //
});

const rectifyRules = {
  rectify_time: [
    {
      required: true,
      message: "请选择整改时间",
      trigger: "change",
    },
  ],
  rectify_feedback: [
    {
      required: true,
      message: "请输入整改反馈",
      trigger: "blur",
    },
  ],
  rectify_picture: [
    {
      required: true,
      message: "请上传整改后照片",
      trigger: "change",
    },
  ],
};

/** 监听图片change事件 */
function imgChange(val: string[]) {
  console.log("🚀 ~ imgChange ~ val:", val);
  rectifyForm.value.rectify_picture = val;
  formRef.value.clearValidate("rectify_picture");
}

async function vailFormData() {
  const tableValidateRes = await tableValidate();
  if (!tableValidateRes) return false;
  let vaildateRes = await formRef.value!.validate((valid, fields) => {
    for (const keys in fields) {
      if (fields[keys]) {
        // 弹出每个字段的错误提示
        ElMessage.warning(fields[keys][0].message);

        break;
      }
    }
  });
  return vaildateRes;
}
function checkNumberValue(
  rule: any,
  value: any,
  callback: any,
  upper_limit_val: string,
  lower_limit_val: string,
) {
  if (!value) {
    callback(new Error("请输入数值"));
  } else if (Number(value) > Number(upper_limit_val) || Number(value) < Number(lower_limit_val)) {
    callback(new Error(`数值应在${lower_limit_val}到${upper_limit_val}之间`));
  } else {
    callback();
  }
}

function checkSelectValue(rule: any, value: any, callback: any, result_content: any[]) {
  console.log("🚀 ~ checkSelectValue ~ is_normal:", result_content);
  console.log("🚀 ~ checkSelectValue ~ value:", value);
  if (value === undefined) {
    callback(new Error("请选择结果选项"));
  } else if (result_content[value].is_normal === 1) {
    callback(new Error(`整改不可选择异常项`));
  } else {
    callback();
  }
}

function checkMultipleSelect(rule: any, value: any[], callback: any, result_content: any[]) {
  if (value.length === 0) {
    callback(new Error("请选择结果选项"));
  } else {
    let is_normal_indexs = result_content
      .map((item, index) => (item.is_normal == 1 ? index : null))
      .filter((index) => index !== null);

    let someRes = is_normal_indexs.some((element) => value.includes(element));
    if (someRes) {
      callback(new Error(`整改不可选择异常项`));
    } else {
      callback();
    }
  }
}

async function tableValidate() {
  let vaildateRes = await tableFormRef.value!.validate((valid, fields) => {
    for (const keys in fields) {
      if (fields[keys]) {
        // 弹出每个字段的错误提示
        ElMessage.warning(fields[keys][0].message);

        break;
      }
    }
  });
  return vaildateRes;
}

defineExpose({
  vailFormData,
  rectifyForm,
});

// watch(
//   () => props.list,
//   (newVal) => {
//     imgList.value = newVal;
//   },
// );

const rectifyColumns: PlusColumnList = [
  {
    label: "整改时间",
    prop: "rectify_time",
    valueType: "date-picker",
    fieldProps: {
      type: "datetime",
      placeholder: "请选择时间",
      format: "YYYY-MM-DD HH:mm",
      valueFormat: "YYYY-MM-DD HH:mm",
      clearable: false,
      disabledDate: (date: string) => {
        return checkIsBeforeDate(date, rectifyForm.value.rectify_time, "YYYY-MM-DD");
      },
    },
  },
  {
    label: "整改反馈",
    prop: "rectify_feedback",
    valueType: "textarea",
    fieldProps: {
      rows: 3,
    },
  },
  {
    label: "整改后照片",
    prop: "rectify_picture",
    slot: "rectify_picture",
    renderLabel: (label) => {
      return (
        <>
          <div class="flex flex-col">
            <span>{label}</span>
            <span class="text-[12px] text-gray-400">(最多4张)</span>
          </div>
        </>
      );
    },
  },
];
</script>
<template>
  <el-card shadow="never" class="mb-6" header="整改情况">
    <el-form :model="rectifyForm" ref="tableFormRef">
      <PureTable
        header-cell-class-name="table-gray-header"
        :data="rectifyForm.rectify_list"
        :columns="tableColumns"
        class="mb-4"
      >
        <template #select="{ row, $index }">
          <div v-if="row.record_method === 0">
            <el-form-item
              :prop="`rectify_list.${$index}.val`"
              :rules="[
                {
                  required: true,
                  validator: (rule, value, callback) => {
                    checkSelectValue(rule, value, callback, row.result_content);
                  },
                },
              ]"
            >
              <!-- 如果是单选 -->
              <el-radio-group
                v-model="row.val"
                class="ml-4 w-full justify-center"
                :disabled="disabled"
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
              :prop="`rectify_list.${$index}.val`"
              :rules="[
                {
                  required: true,
                  validator: (rule, value, callback) => {
                    checkMultipleSelect(rule, value, callback, row.result_content);
                  },
                },
              ]"
            >
              <el-checkbox-group
                v-model="row.val"
                class="w-full justify-center"
                :disabled="disabled"
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
              :prop="`rectify_list.${$index}.val`"
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
                :disabled="disabled"
              ></el-input>
            </el-form-item>
          </div>
          <div v-else-if="row.record_method === 3">
            <el-form-item
              :prop="`rectify_list.${$index}.val`"
              :rules="[
                {
                  required: true,
                  message: '请输入文本',
                },
              ]"
            >
              <el-input v-model="row.val" placeholder="请输入内容" :disabled="disabled"></el-input>
            </el-form-item>
          </div>
        </template>
        <template #note="{ row }">
          <el-input v-model="row.note" placeholder="请输入备注" :disabled="disabled"></el-input>
        </template>
      </PureTable>
    </el-form>

    <PlusForm
      :disabled="disabled"
      ref="PlusformRef"
      :rules="rectifyRules"
      v-model="rectifyForm"
      :columns="rectifyColumns"
      :rowProps="{ gutter: 20 }"
      labelWidth="110"
      :hasFooter="false"
    >
      <template #plus-field-rectify_picture>
        <MultiUpload
          :list="rectifyForm.rectify_picture"
          @change="imgChange"
          :disabled="disabled"
          :limit="4"
        ></MultiUpload>
      </template>
    </PlusForm>
  </el-card>
</template>
<style lang="scss" scoped></style>

<script setup lang="tsx">
import { useAdd } from "../utils/add";

const props = defineProps([
  "checkTablecolumns",
  "checkFormRules",
  "checkTableForm",
  "formData",
  "checkTableData",
  "formLoading",
  "supplyOptions",
  "suppliersMap",
  "tableLableOptions",
  "editDisabled",
]);
const emit = defineEmits(["handleAdd", "handleDelRow"]);
defineOptions({
  name: "MaterialInspectionCansSeamCheckInfo",
});

/** puretable的ref */
const prueTableRef = ref();
const { tableFormRef, passList, validatorCell } = useAdd();

const handleAdd = async () => {
  // 表格有数据的时候验证包号
  // if (props.checkTableData.length) {
  //   let data = props.checkTableData;
  //   for (let i = 0; i < data.length; i++) {
  //     let checkPackNo = await tableFormRef.value?.validateField(`checkTableData.${i}.pack_no`);
  //     console.log("checkPackNo::", checkPackNo);
  //   }
  // }
  // tableFormRef.value?.resetFields();
  emit("handleAdd");
};
// 多选的行
const multipleSelection = ref([]);
// 表格多选
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val;
};

// 删除选中的表格
const handleDelete = () => {
  // emit("handleDelRow", multipleSelection.value);

  emit("handleDelRow", defaultIndex.value);
};
async function validateForm() {
  if (!tableFormRef.value) return false;
  const vaildateRes = await tableFormRef.value
    .validate((valid, fields) => {
      for (const keys in fields) {
        console.log(fields);
        if (fields[keys]) {
          // 弹出每个字段的错误提示
          ElMessage.warning(fields[keys][0].message);
          tableFormRef.value.scrollToField(keys);
          break;
        }
      }
    })
    .catch((err) => {
      console.log("err", err);
    });
  return vaildateRes;
}
// 计算平均值
function calculateAverage(data: any) {
  const sum = Number(data[1]) + Number(data[2]) + Number(data[3]);
  const average = sum / 3;
  data["x"] = average.toFixed(2); // 保留两位小数
}

// 默认索引第一条
const defaultIndex = ref(0);
// 选中索引切换数据
const selectIndex = (index: number) => {
  defaultIndex.value = index;
};

// 检查单元格是否符合标准值 自定义class 异常标红显示
function checkCellClass(value: any, key: string) {
  let className = "";
  if (!props.tableLableOptions) return className;
  let ok = validatorCell(props.tableLableOptions[key], value);
  className = ok ? "" : "warn-text";
  return className;
}
watch(
  () => props.checkTableData,
  (newValue) => {
    if (props.checkTableData.length) {
      defaultIndex.value = props.checkTableData.length - 1;
    }
    console.log("watch defaultIndex: ", defaultIndex.value);
  },
  {
    immediate: true,
    deep: true,
  },
);
// 将方法暴露给父组件
defineExpose({
  validateForm,
  tableFormRef,
});
</script>
<template>
  <div class="app-container !p-0">
    <div class="flex justify-between mb-[10px]">
      <div v-if="!editDisabled">
        <el-button type="primary" @click="handleAdd">新增一页</el-button>
        <el-button v-if="checkTableData.length > 0" type="primary" @click="handleDelete">
          删除本页
        </el-button>
      </div>
      <div class="flex">
        <div class="mr-[10px]">
          总样品数:
          <span class="text-green-800">{{ formData.total }}</span>
        </div>
        <div>
          总异常数:
          <span class="text-red-800">{{ formData.abnormal }}</span>
        </div>
      </div>
    </div>
    <div>
      <el-form
        :model="checkTableForm"
        ref="tableFormRef"
        :rules="checkFormRules"
        :disabled="editDisabled"
      >
        <div class="table-box w-[100%] overflow-y-auto">
          <table v-if="checkTableData.length > 0">
            <thead>
              <tr>
                <th rowspan="2" class="fixed-column">
                  <div class="fixed-width">项目</div>
                </th>
                <th colspan="4">样品1</th>
                <th colspan="4">样品2</th>
                <th colspan="4">样品3</th>
                <th rowspan="2">
                  <div class="fixed-width">结果</div>
                </th>
                <th rowspan="2">
                  <div class="w-[300px]">备注</div>
                </th>
              </tr>
              <tr>
                <th>1</th>
                <th>2</th>
                <th>3</th>
                <th>x</th>
                <th>1</th>
                <th>2</th>
                <th>3</th>
                <th>x</th>
                <th>1</th>
                <th>2</th>
                <th>3</th>
                <th>x</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="fixed-column">
                  <div>热缩膜厚度</div>
                  <div v-if="tableLableOptions">
                    （{{ tableLableOptions.land.initval }}）{{ tableLableOptions.land.unit }}
                  </div>
                </td>
                <td>
                  <el-form-item
                    class="pt-[18px]"
                    :prop="`checkTableData[${defaultIndex}].check_json.list[0][1][1]`"
                    :rules="checkFormRules.land"
                    :class="
                      checkCellClass(checkTableData[defaultIndex].check_json.list[0][1][1], 'land')
                    "
                  >
                    <el-input-number
                      v-model="checkTableData[defaultIndex].check_json.list[0][1][1]"
                      :min="0"
                      :step="0.01"
                      controls-position="right"
                      @change="calculateAverage(checkTableData[defaultIndex].check_json.list[0][1])"
                    />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    class="pt-[18px]"
                    :prop="`checkTableData[${defaultIndex}].check_json.list[0][1][2]`"
                    :rules="checkFormRules.land"
                    :class="
                      checkCellClass(checkTableData[defaultIndex].check_json.list[0][1][2], 'land')
                    "
                  >
                    <el-input-number
                      v-model="checkTableData[defaultIndex].check_json.list[0][1][2]"
                      :min="0"
                      :step="0.01"
                      controls-position="right"
                      @change="calculateAverage(checkTableData[defaultIndex].check_json.list[0][1])"
                    />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    class="pt-[18px]"
                    :prop="`checkTableData[${defaultIndex}].check_json.list[0][1][3]`"
                    :rules="checkFormRules.land"
                    :class="
                      checkCellClass(checkTableData[defaultIndex].check_json.list[0][1][3], 'land')
                    "
                  >
                    <el-input-number
                      v-model="checkTableData[defaultIndex].check_json.list[0][1][3]"
                      :min="0"
                      :step="0.01"
                      controls-position="right"
                      @change="calculateAverage(checkTableData[defaultIndex].check_json.list[0][1])"
                    />
                  </el-form-item>
                </td>
                <td>
                  <div class="w-[100px] p-2 bg-gray-200">
                    {{ checkTableData[defaultIndex].check_json.list[0][1]["x"] || 0 }}
                  </div>
                </td>
                <td>
                  <el-form-item
                    class="pt-[18px]"
                    :prop="`checkTableData[${defaultIndex}].check_json.list[0][2][1]`"
                    :rules="checkFormRules.land"
                    :class="
                      checkCellClass(checkTableData[defaultIndex].check_json.list[0][2][1], 'land')
                    "
                  >
                    <el-input-number
                      v-model="checkTableData[defaultIndex].check_json.list[0][2][1]"
                      :min="0"
                      :step="0.01"
                      controls-position="right"
                      @change="calculateAverage(checkTableData[defaultIndex].check_json.list[0][2])"
                    />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    class="pt-[18px]"
                    :prop="`checkTableData[${defaultIndex}].check_json.list[0][2][2]`"
                    :rules="checkFormRules.land"
                    :class="
                      checkCellClass(checkTableData[defaultIndex].check_json.list[0][2][2], 'land')
                    "
                  >
                    <el-input-number
                      v-model="checkTableData[defaultIndex].check_json.list[0][2][2]"
                      :min="0"
                      :step="0.01"
                      controls-position="right"
                      @change="calculateAverage(checkTableData[defaultIndex].check_json.list[0][2])"
                    />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    class="pt-[18px]"
                    :prop="`checkTableData[${defaultIndex}].check_json.list[0][2][3]`"
                    :rules="checkFormRules.land"
                    :class="
                      checkCellClass(checkTableData[defaultIndex].check_json.list[0][2][3], 'land')
                    "
                  >
                    <el-input-number
                      v-model="checkTableData[defaultIndex].check_json.list[0][2][3]"
                      :min="0"
                      :step="0.01"
                      controls-position="right"
                      @change="calculateAverage(checkTableData[defaultIndex].check_json.list[0][2])"
                    />
                  </el-form-item>
                </td>
                <td>
                  <div class="w-[100px] p-2 bg-gray-200">
                    {{ checkTableData[defaultIndex].check_json.list[0][2]["x"] || 0 }}
                  </div>
                </td>
                <td>
                  <el-form-item
                    class="pt-[18px]"
                    :prop="`checkTableData[${defaultIndex}].check_json.list[0][3][1]`"
                    :rules="checkFormRules.land"
                    :class="
                      checkCellClass(checkTableData[defaultIndex].check_json.list[0][3][1], 'land')
                    "
                  >
                    <el-input-number
                      v-model="checkTableData[defaultIndex].check_json.list[0][3][1]"
                      :min="0"
                      :step="0.01"
                      controls-position="right"
                      @change="calculateAverage(checkTableData[defaultIndex].check_json.list[0][3])"
                    />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    class="pt-[18px]"
                    :prop="`checkTableData[${defaultIndex}].check_json.list[0][3][2]`"
                    :rules="checkFormRules.land"
                    :class="
                      checkCellClass(checkTableData[defaultIndex].check_json.list[0][3][2], 'land')
                    "
                  >
                    <el-input-number
                      v-model="checkTableData[defaultIndex].check_json.list[0][3][2]"
                      :min="0"
                      :step="0.01"
                      controls-position="right"
                      @change="calculateAverage(checkTableData[defaultIndex].check_json.list[0][3])"
                    />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    class="pt-[18px]"
                    :prop="`checkTableData[${defaultIndex}].check_json.list[0][3][3]`"
                    :rules="checkFormRules.land"
                    :class="
                      checkCellClass(checkTableData[defaultIndex].check_json.list[0][3][3], 'land')
                    "
                  >
                    <el-input-number
                      v-model="checkTableData[defaultIndex].check_json.list[0][3][3]"
                      :min="0"
                      :step="0.01"
                      controls-position="right"
                      @change="calculateAverage(checkTableData[defaultIndex].check_json.list[0][3])"
                    />
                  </el-form-item>
                </td>
                <td>
                  <div class="w-[100px] p-2 bg-gray-200">
                    {{ checkTableData[defaultIndex].check_json.list[0][3]["x"] || 0 }}
                  </div>
                </td>
                <td>
                  <el-form-item
                    :prop="`checkTableData[${defaultIndex}].check_json.list[0]['ret']`"
                    :rules="checkFormRules.ret"
                  >
                    <el-select
                      v-model="checkTableData[defaultIndex].check_json.list[0]['ret']"
                      placeholder="请选择"
                      filterable
                    >
                      <el-option
                        v-for="item in passList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    :prop="`checkTableData[${defaultIndex}].check_json.list[0]['note']`"
                  >
                    <el-input
                      v-model="checkTableData[defaultIndex].check_json.list[0]['note']"
                      :autosize="{ minRows: 2, maxRows: 4 }"
                      type="textarea"
                      placeholder=""
                    />
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td class="fixed-column">
                  <div>热缩膜宽度</div>
                  <div v-if="tableLableOptions">
                    （{{ tableLableOptions.width.initval }}）{{ tableLableOptions.width.unit }}
                  </div>
                </td>
                <td>
                  <el-form-item
                    class="pt-[18px]"
                    :prop="`checkTableData[${defaultIndex}].check_json.list[1][1][1]`"
                    :rules="checkFormRules.width"
                    :class="
                      checkCellClass(checkTableData[defaultIndex].check_json.list[1][1][1], 'width')
                    "
                  >
                    <el-input-number
                      v-model="checkTableData[defaultIndex].check_json.list[1][1][1]"
                      :min="0"
                      controls-position="right"
                      @change="calculateAverage(checkTableData[defaultIndex].check_json.list[1][1])"
                    />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    class="pt-[18px]"
                    :prop="`checkTableData[${defaultIndex}].check_json.list[1][1][2]`"
                    :rules="checkFormRules.width"
                    :class="
                      checkCellClass(checkTableData[defaultIndex].check_json.list[1][1][2], 'width')
                    "
                  >
                    <el-input-number
                      v-model="checkTableData[defaultIndex].check_json.list[1][1][2]"
                      :min="0"
                      controls-position="right"
                      @change="calculateAverage(checkTableData[defaultIndex].check_json.list[1][1])"
                    />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    class="pt-[18px]"
                    :prop="`checkTableData[${defaultIndex}].check_json.list[1][1][3]`"
                    :rules="checkFormRules.width"
                    :class="
                      checkCellClass(checkTableData[defaultIndex].check_json.list[1][1][3], 'width')
                    "
                  >
                    <el-input-number
                      v-model="checkTableData[defaultIndex].check_json.list[1][1][3]"
                      :min="0"
                      controls-position="right"
                      @change="calculateAverage(checkTableData[defaultIndex].check_json.list[1][1])"
                    />
                  </el-form-item>
                </td>
                <td>
                  <div class="w-[100px] p-2 bg-gray-200">
                    {{ checkTableData[defaultIndex].check_json.list[1][1]["x"] || 0 }}
                  </div>
                </td>
                <td>
                  <el-form-item
                    class="pt-[18px]"
                    :prop="`checkTableData[${defaultIndex}].check_json.list[1][2][1]`"
                    :rules="checkFormRules.width"
                    :class="
                      checkCellClass(checkTableData[defaultIndex].check_json.list[1][2][1], 'width')
                    "
                  >
                    <el-input-number
                      v-model="checkTableData[defaultIndex].check_json.list[1][2][1]"
                      :min="0"
                      controls-position="right"
                      @change="calculateAverage(checkTableData[defaultIndex].check_json.list[1][2])"
                    />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    class="pt-[18px]"
                    :prop="`checkTableData[${defaultIndex}].check_json.list[1][2][2]`"
                    :rules="checkFormRules.width"
                    :class="
                      checkCellClass(checkTableData[defaultIndex].check_json.list[1][2][2], 'width')
                    "
                  >
                    <el-input-number
                      v-model="checkTableData[defaultIndex].check_json.list[1][2][2]"
                      :min="0"
                      controls-position="right"
                      @change="calculateAverage(checkTableData[defaultIndex].check_json.list[1][2])"
                    />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    class="pt-[18px]"
                    :prop="`checkTableData[${defaultIndex}].check_json.list[1][2][3]`"
                    :rules="checkFormRules.width"
                    :class="
                      checkCellClass(checkTableData[defaultIndex].check_json.list[1][2][3], 'width')
                    "
                  >
                    <el-input-number
                      v-model="checkTableData[defaultIndex].check_json.list[1][2][3]"
                      :min="0"
                      controls-position="right"
                      @change="calculateAverage(checkTableData[defaultIndex].check_json.list[1][2])"
                    />
                  </el-form-item>
                </td>
                <td>
                  <div class="w-[100px] p-2 bg-gray-200">
                    {{ checkTableData[defaultIndex].check_json.list[1][2]["x"] || 0 }}
                  </div>
                </td>
                <td>
                  <el-form-item
                    class="pt-[18px]"
                    :prop="`checkTableData[${defaultIndex}].check_json.list[1][3][1]`"
                    :rules="checkFormRules.width"
                    :class="
                      checkCellClass(checkTableData[defaultIndex].check_json.list[1][3][1], 'width')
                    "
                  >
                    <el-input-number
                      v-model="checkTableData[defaultIndex].check_json.list[1][3][1]"
                      :min="0"
                      controls-position="right"
                      @change="calculateAverage(checkTableData[defaultIndex].check_json.list[1][3])"
                    />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    class="pt-[18px]"
                    :prop="`checkTableData[${defaultIndex}].check_json.list[1][3][2]`"
                    :rules="checkFormRules.width"
                    :class="
                      checkCellClass(checkTableData[defaultIndex].check_json.list[1][3][2], 'width')
                    "
                  >
                    <el-input-number
                      v-model="checkTableData[defaultIndex].check_json.list[1][3][2]"
                      :min="0"
                      controls-position="right"
                      @change="calculateAverage(checkTableData[defaultIndex].check_json.list[1][3])"
                    />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    class="pt-[18px]"
                    :prop="`checkTableData[${defaultIndex}].check_json.list[1][3][3]`"
                    :rules="checkFormRules.width"
                    :class="
                      checkCellClass(checkTableData[defaultIndex].check_json.list[1][3][3], 'width')
                    "
                  >
                    <el-input-number
                      v-model="checkTableData[defaultIndex].check_json.list[1][3][3]"
                      :min="0"
                      controls-position="right"
                      @change="calculateAverage(checkTableData[defaultIndex].check_json.list[1][3])"
                    />
                  </el-form-item>
                </td>
                <td>
                  <div class="w-[100px] p-2 bg-gray-200">
                    {{ checkTableData[defaultIndex].check_json.list[1][3]["x"] || 0 }}
                  </div>
                </td>
                <td>
                  <el-form-item :prop="`checkTableData[${defaultIndex}].check_json.list[1]['ret']`">
                    <el-select
                      v-model="checkTableData[defaultIndex].check_json.list[1]['ret']"
                      placeholder="请选择"
                      filterable
                    >
                      <el-option
                        v-for="item in passList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    :prop="`checkTableData[${defaultIndex}].check_json.list[1]['note']`"
                  >
                    <el-input
                      v-model="checkTableData[defaultIndex].check_json.list[1]['note']"
                      :autosize="{ minRows: 2, maxRows: 4 }"
                      type="textarea"
                      placeholder=""
                    />
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td class="fixed-column">
                  <div>热缩膜筒内径</div>
                  <div v-if="tableLableOptions">
                    （{{ tableLableOptions.internal.initval }}）{{
                      tableLableOptions.internal.unit
                    }}
                  </div>
                </td>
                <td>
                  <el-form-item
                    class="pt-[18px]"
                    :prop="`checkTableData[${defaultIndex}].check_json.list[2][1][1]`"
                    :rules="checkFormRules.internal"
                    :class="
                      checkCellClass(
                        checkTableData[defaultIndex].check_json.list[2][1][1],
                        'internal',
                      )
                    "
                  >
                    <el-input-number
                      v-model="checkTableData[defaultIndex].check_json.list[2][1][1]"
                      :min="0"
                      controls-position="right"
                      @change="calculateAverage(checkTableData[defaultIndex].check_json.list[2][1])"
                    />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    class="pt-[18px]"
                    :prop="`checkTableData[${defaultIndex}].check_json.list[2][1][2]`"
                    :rules="checkFormRules.internal"
                    :class="
                      checkCellClass(
                        checkTableData[defaultIndex].check_json.list[2][1][2],
                        'internal',
                      )
                    "
                  >
                    <el-input-number
                      v-model="checkTableData[defaultIndex].check_json.list[2][1][2]"
                      :min="0"
                      controls-position="right"
                      @change="calculateAverage(checkTableData[defaultIndex].check_json.list[2][1])"
                    />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    class="pt-[18px]"
                    :prop="`checkTableData[${defaultIndex}].check_json.list[2][1][3]`"
                    :rules="checkFormRules.internal"
                    :class="
                      checkCellClass(
                        checkTableData[defaultIndex].check_json.list[2][1][3],
                        'internal',
                      )
                    "
                  >
                    <el-input-number
                      v-model="checkTableData[defaultIndex].check_json.list[2][1][3]"
                      :min="0"
                      controls-position="right"
                      @change="calculateAverage(checkTableData[defaultIndex].check_json.list[2][1])"
                    />
                  </el-form-item>
                </td>
                <td>
                  <div class="w-[100px] p-2 bg-gray-200">
                    {{ checkTableData[defaultIndex].check_json.list[2][1]["x"] || 0 }}
                  </div>
                </td>
                <td>
                  <el-form-item
                    class="pt-[18px]"
                    :prop="`checkTableData[${defaultIndex}].check_json.list[2][2][1]`"
                    :rules="checkFormRules.internal"
                    :class="
                      checkCellClass(
                        checkTableData[defaultIndex].check_json.list[2][2][1],
                        'internal',
                      )
                    "
                  >
                    <el-input-number
                      v-model="checkTableData[defaultIndex].check_json.list[2][2][1]"
                      :min="0"
                      controls-position="right"
                      @change="calculateAverage(checkTableData[defaultIndex].check_json.list[2][2])"
                    />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    class="pt-[18px]"
                    :prop="`checkTableData[${defaultIndex}].check_json.list[2][2][2]`"
                    :rules="checkFormRules.internal"
                    :class="
                      checkCellClass(
                        checkTableData[defaultIndex].check_json.list[2][2][2],
                        'internal',
                      )
                    "
                  >
                    <el-input-number
                      v-model="checkTableData[defaultIndex].check_json.list[2][2][2]"
                      :min="0"
                      controls-position="right"
                      @change="calculateAverage(checkTableData[defaultIndex].check_json.list[2][2])"
                    />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    class="pt-[18px]"
                    :prop="`checkTableData[${defaultIndex}].check_json.list[2][2][3]`"
                    :rules="checkFormRules.internal"
                    :class="
                      checkCellClass(
                        checkTableData[defaultIndex].check_json.list[2][2][3],
                        'internal',
                      )
                    "
                  >
                    <el-input-number
                      v-model="checkTableData[defaultIndex].check_json.list[2][2][3]"
                      :min="0"
                      controls-position="right"
                      @change="calculateAverage(checkTableData[defaultIndex].check_json.list[2][2])"
                    />
                  </el-form-item>
                </td>
                <td>
                  <div class="w-[100px] p-2 bg-gray-200">
                    {{ checkTableData[defaultIndex].check_json.list[2][2]["x"] || 0 }}
                  </div>
                </td>
                <td>
                  <el-form-item
                    class="pt-[18px]"
                    :prop="`checkTableData[${defaultIndex}].check_json.list[2][3][1]`"
                    :rules="checkFormRules.internal"
                    :class="
                      checkCellClass(
                        checkTableData[defaultIndex].check_json.list[2][3][1],
                        'internal',
                      )
                    "
                  >
                    <el-input-number
                      v-model="checkTableData[defaultIndex].check_json.list[2][3][1]"
                      :min="0"
                      controls-position="right"
                      @change="calculateAverage(checkTableData[defaultIndex].check_json.list[2][3])"
                    />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    class="pt-[18px]"
                    :prop="`checkTableData[${defaultIndex}].check_json.list[2][3][2]`"
                    :rules="checkFormRules.internal"
                    :class="
                      checkCellClass(
                        checkTableData[defaultIndex].check_json.list[2][3][2],
                        'internal',
                      )
                    "
                  >
                    <el-input-number
                      v-model="checkTableData[defaultIndex].check_json.list[2][3][2]"
                      :min="0"
                      controls-position="right"
                      @change="calculateAverage(checkTableData[defaultIndex].check_json.list[2][3])"
                    />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    class="pt-[18px]"
                    :prop="`checkTableData[${defaultIndex}].check_json.list[2][3][3]`"
                    :rules="checkFormRules.internal"
                    :class="
                      checkCellClass(
                        checkTableData[defaultIndex].check_json.list[2][3][3],
                        'internal',
                      )
                    "
                  >
                    <el-input-number
                      v-model="checkTableData[defaultIndex].check_json.list[2][3][3]"
                      :min="0"
                      controls-position="right"
                      @change="calculateAverage(checkTableData[defaultIndex].check_json.list[2][3])"
                    />
                  </el-form-item>
                </td>
                <td>
                  <div class="w-[100px] p-2 bg-gray-200">
                    {{ checkTableData[defaultIndex].check_json.list[2][3]["x"] || 0 }}
                  </div>
                </td>
                <td>
                  <el-form-item :prop="`checkTableData[${defaultIndex}].check_json.list[2]['ret']`">
                    <el-select
                      v-model="checkTableData[defaultIndex].check_json.list[2]['ret']"
                      placeholder="请选择"
                      filterable
                    >
                      <el-option
                        v-for="item in passList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    :prop="`checkTableData[${defaultIndex}].check_json.list[2]['note']`"
                  >
                    <el-input
                      v-model="checkTableData[defaultIndex].check_json.list[2]['note']"
                      :autosize="{ minRows: 2, maxRows: 4 }"
                      type="textarea"
                      placeholder=""
                    />
                  </el-form-item>
                </td>
              </tr>
              <!-- 战马类型显示 -->
              <tr v-if="formData.brand === 'ND2'">
                <td class="fixed-column">外观质量</td>
                <td colspan="4">
                  <el-form-item :prop="`checkTableData[${defaultIndex}].check_json.exterior['1']`">
                    <el-select
                      v-model="checkTableData[defaultIndex].check_json.exterior['1']"
                      placeholder="请选择"
                      filterable
                    >
                      <el-option
                        v-for="item in passList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </td>
                <td colspan="4">
                  <el-form-item :prop="`checkTableData[${defaultIndex}].check_json.exterior['2']`">
                    <el-select
                      v-model="checkTableData[defaultIndex].check_json.exterior['2']"
                      placeholder="请选择"
                      filterable
                    >
                      <el-option
                        v-for="item in passList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </td>
                <td colspan="4">
                  <el-form-item :prop="`checkTableData[${defaultIndex}].check_json.exterior['3']`">
                    <el-select
                      v-model="checkTableData[defaultIndex].check_json.exterior['3']"
                      placeholder="请选择"
                      filterable
                    >
                      <el-option
                        v-for="item in passList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    :prop="`checkTableData[${defaultIndex}].check_json.exterior['ret']`"
                  >
                    <el-select
                      v-model="checkTableData[defaultIndex].check_json.exterior['ret']"
                      placeholder="请选择"
                      filterable
                    >
                      <el-option
                        v-for="item in passList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    :prop="`checkTableData[${defaultIndex}].check_json.exterior['note']`"
                  >
                    <el-input
                      v-model="checkTableData[defaultIndex].check_json.exterior['note']"
                      :autosize="{ minRows: 2, maxRows: 4 }"
                      type="textarea"
                      placeholder=""
                    />
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td class="fixed-column">
                  <div>热缩膜净重</div>
                  <div v-if="tableLableOptions">
                    （{{ tableLableOptions.weight.initval }}）{{ tableLableOptions.weight.unit }}
                  </div>
                </td>
                <td colspan="4">
                  <el-form-item
                    class="pt-[18px]"
                    :prop="`checkTableData[${defaultIndex}].check_json.weight[1]`"
                    :rules="checkFormRules.weight"
                    :class="
                      checkCellClass(checkTableData[defaultIndex].check_json.weight[1], 'weight')
                    "
                  >
                    <el-input-number
                      v-model="checkTableData[defaultIndex].check_json.weight[1]"
                      :min="0"
                      controls-position="right"
                    />
                  </el-form-item>
                </td>
                <td colspan="4">
                  <el-form-item
                    class="pt-[18px]"
                    :prop="`checkTableData[${defaultIndex}].check_json.weight[2]`"
                    :rules="checkFormRules.weight"
                    :class="
                      checkCellClass(checkTableData[defaultIndex].check_json.weight[2], 'weight')
                    "
                  >
                    <el-input-number
                      v-model="checkTableData[defaultIndex].check_json.weight[2]"
                      :min="0"
                      controls-position="right"
                    />
                  </el-form-item>
                </td>
                <td colspan="4">
                  <el-form-item
                    class="pt-[18px]"
                    :prop="`checkTableData[${defaultIndex}].check_json.weight[3]`"
                    :rules="checkFormRules.weight"
                    :class="
                      checkCellClass(checkTableData[defaultIndex].check_json.weight[3], 'weight')
                    "
                  >
                    <el-input-number
                      v-model="checkTableData[defaultIndex].check_json.weight[3]"
                      :min="0"
                      controls-position="right"
                    />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item :prop="`checkTableData[${defaultIndex}].check_json.weight['ret']`">
                    <el-select
                      v-model="checkTableData[defaultIndex].check_json.weight['ret']"
                      placeholder="请选择"
                      filterable
                    >
                      <el-option
                        v-for="item in passList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    class="pt-[18px]"
                    :prop="`checkTableData[${defaultIndex}].check_json.weight['num']`"
                  >
                    <span class="mr-2">(含筒轴</span>
                    <el-input-number
                      v-model="checkTableData[defaultIndex].check_json.weight['num']"
                      :min="0"
                      controls-position="right"
                    />
                    <span class="ml-2">kg)</span>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td class="fixed-column">检验意见</td>
                <td colspan="14">
                  <el-form-item :prop="`checkTableData[${defaultIndex}].check_note`">
                    <el-input
                      v-model="checkTableData[defaultIndex].check_note"
                      :autosize="{ minRows: 2, maxRows: 4 }"
                      type="textarea"
                      placeholder=""
                    />
                  </el-form-item>
                </td>
              </tr>
            </tbody>
          </table>
          <el-empty v-else description="暂无数据" />
        </div>
      </el-form>
      <div class="flex justify-end mt-4">
        <span
          @click="selectIndex(index)"
          class="block bg-gray-400 text-black px-2 py-1 rounded mr-4 cursor-pointer"
          :class="defaultIndex === index ? '!bg-blue-600 text-white' : ''"
          v-for="(item, index) in checkTableData"
          :key="item.id"
        >
          {{ index + 1 }}
        </span>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
:deep(.table-input-center .el-input__wrapper .el-input__inner) {
  text-align: center;
}

:deep(.table-input-danger .el-input__inner) {
  // .table-input-danger .el-input__inner{
  color: red;
  font-weight: bold;
}
.table-box {
  table {
    width: 100%;
    border-collapse: collapse;
    table-layout: auto;
  }
  th,
  td {
    border: 1px solid #ebeef5;
    padding: 8px;
    text-align: center;
  }
  th {
    background-color: #ecf5ff !important;
  }
  /* 设置单元格的高度和宽度 */
  .fixed-width {
    width: 100px; /* 设置单元格宽度 */
  }
  .fixed-height {
    height: 50px; /* 设置单元格高度 */
  }
  /* 固定第一列 */
  .fixed-column {
    position: sticky;
    left: 0;
    background-color: white; /* 确保固定列的背景颜色 */
    z-index: 100;
  }
}
</style>

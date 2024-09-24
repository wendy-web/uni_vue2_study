<script setup lang="tsx">
import {
  type FormInstance,
  type FormRules,
  type TableColumnCtx,
  type TableInstance,
  dayjs,
} from "element-plus";
import { type ComponentInternalInstance, getCurrentInstance } from "vue";
// 签名组件
import QualitySignDialog from "@/components/Device/SignDialog/index.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { type ElSelectRefType, useAdd } from "../utils/add";

// const { proxy } = getCurrentInstance() as ComponentInternalInstance;

// 签名弹窗ref
const signDialogRef = ref();
// 签名弹窗配置
const dialogOptions = {
  width: "60%",
  btnClass: "w-[80px]",
  draggable: true,
  closeOnClickModal: false,
  closeOnPressEscape: false,
  btnLoading: false,
  showClose: false,
};
const props = defineProps([
  "checkTablecolumns",
  "checkFormRules",
  "checkTableForm",
  "formData",
  "checkTableData",
  "formLoading",
  "editDisabled",
  "tableLableOptions",
  "checkUserOptions",
  "useSetting",
]);
const emit = defineEmits(["handleAdd", "handleDelRow", "handlePreview"]);

/** puretable的ref */
const prueTableRef = ref();
const passList = [
  {
    name: "合格",
    id: 1,
  },
  {
    name: "不合格",
    id: 0,
  },
];
const { tableFormRef, validatorCell } = useAdd();

// function handleSelectUser(val: number, refName: string, row: any) {
//   nextTick(() => {
//     row.confirm_name = (proxy!.$refs[refName] as ElSelectRefType).selected.currentLabel;
//   });
// }

const handleAdd = async () => {
  console.log("tableFormRef.value::", tableFormRef.value.validate);
  if (tableFormRef.value) {
    const vaildateRes = await tableFormRef.value
      .validate((valid, fields) => {
        for (const keys in fields) {
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
    console.log("vaildateRes", vaildateRes);
    if (!vaildateRes) return;
    emit("handleAdd");
    return;
  }
  emit("handleAdd");
};
// 多选的行
const multipleSelection = ref<unknown[]>([]);
// 表格多选
const handleSelectionChange = (val: any[]) => {
  multipleSelection.value = val.map((item) => {
    return item.id || item.unique_id;
  });
};
// 删除选中的表格
const handleDelete = () => {
  emit("handleDelRow", multipleSelection.value);
};
async function validateForm() {
  if (!tableFormRef.value) return true;
  const vaildateRes = await tableFormRef.value
    .validate((valid, fields) => {
      for (const keys in fields) {
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
// checkInfo input 表格变化
function handleInputChange(event: any, index: number) {
  let item = props.checkTableData[index];
  let { color, scent, look, impurity, Brix, pH, delta } = item;
  // if (props.tableLableOptions) {
  //   let brix_ok = validatorCell(props.tableLableOptions["Brix"], Brix);
  //   let ph_ok = validatorCell(props.tableLableOptions["pH"], pH);
  //   let delta_ok = validatorCell(props.tableLableOptions["delta"], delta);
  //   console.log("color:", color, "scent:", scent, "look:", look, "impurity:", impurity);
  //   console.log("brix_ok:", brix_ok, "ph_ok:", ph_ok, "delta_ok:", delta_ok);
  //   if (color && scent && look && impurity && brix_ok && ph_ok && delta_ok) {
  //     item.check_ret = 1;
  //   } else {
  //     item.check_ret = 0;
  //   }
  // }
}
// 检查单元格是否符合标准值 自定义class
function checkCellClass(value: any, key: string) {
  let className = "";
  if (!props.tableLableOptions || !value) return className;
  let ok = validatorCell(props.tableLableOptions[key], value);
  className = ok ? "" : "warn-text";
  return className;
}
const tableRef = computed<TableInstance>(() => {
  return prueTableRef.value?.getTableRef();
});
// 签字提交: key是tableItem的字段名
async function handleSign(row: any, key: string) {
  addDialog({
    ...dialogOptions,
    title: "签名",
    contentRenderer: () =>
      h(QualitySignDialog, {
        ref: signDialogRef,
      }),
    beforeCancel: (done, { options, index }) => {
      done();
    },
    beforeSure: async (done, { options, index }) => {
      updateDialog(true, "btnLoading");
      const result = await signDialogRef.value.handleGenerate();
      // 更新签名地址
      row[key] = result;
      updateDialog(false, "btnLoading");
      done();
    },
  });
}
// 将预览事件丢给父组件，尝试解决el-image组件的层级问题
function handlePreview(url: any) {
  // emit("handlePreview", url);
}
// 将方法暴露给父组件
defineExpose({
  validateForm,
  tableFormRef,
});
</script>
<template>
  <div class="app-box !p-0 flex-1">
    <div class="flex justify-between mb-[10px]">
      <div v-if="!editDisabled">
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button type="primary" @click="handleDelete">删除</el-button>
        <!-- <el-button type="primary" @click="">导入</el-button>
        <el-button type="primary" @click="">导出模板</el-button> -->
      </div>
      <div class="flex justify-end flex-1">
        <div class="mr-[10px]">
          总样品数:
          <span class="text-green-800">{{ formData.total }}</span>
        </div>
        <div>
          不合格数:
          <span class="text-red-800">{{ formData.abnormal }}</span>
        </div>
      </div>
    </div>
    <div class="pure-table-box">
      <el-form
        :model="checkTableForm"
        ref="tableFormRef"
        :rules="checkFormRules"
        :disabled="editDisabled"
      >
        <PureTable
          ref="prueTableRef"
          row-key="id"
          header-cell-class-name="table-row-header"
          alignWhole="center"
          :data="checkTableData"
          :columns="checkTablecolumns"
          :loading="formLoading"
          border
          @selection-change="handleSelectionChange"
          height="800"
        >
          <!-- 时间 -->
          <template #check_time="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.check_time`"
              :rules="checkFormRules.check_time"
            >
              <el-time-select
                v-model="row.check_time"
                start="00:00"
                step="00:01"
                end="23:59"
                placeholder="请选择时间"
              />
            </el-form-item>
          </template>
          <!-- 检测数(箱) -->
          <template #box_num="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.box_num`"
              :rules="checkFormRules.box_num"
            >
              <el-input
                v-model.number="row.box_num"
                placeholder="请输入内容"
                @input="handleInputChange($event, $index)"
                v-inputnum.intp
              ></el-input>
            </el-form-item>
          </template>
          <!-- 合格数量(箱) -->
          <template #pass_num="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.pass_num`"
              :rules="checkFormRules.pass_num"
            >
              <el-input
                v-model.number="row.pass_num"
                placeholder="请输入内容"
                @input="handleInputChange($event, $index)"
                v-inputnum.intp
              ></el-input>
            </el-form-item>
          </template>
          <!-- 不合格数量(箱) -->
          <template #nopass_num="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.nopass_num`"
              :rules="checkFormRules.nopass_num"
            >
              <el-input
                v-model.number="row.nopass_num"
                placeholder="请输入内容"
                @input="handleInputChange($event, $index)"
                v-inputnum.intp
              ></el-input>
            </el-form-item>
          </template>
          <!-- 批号：5位，唯一值（不可重复） -->
          <template #batch_num="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.batch_num`"
              :rules="checkFormRules.batch_num"
            >
              <el-input v-model="row.batch_num" maxlength="5" placeholder="请输入批号"></el-input>
            </el-form-item>
          </template>
          <!-- 身份编码 -->
          <template #id_card="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.id_card`"
              :rules="checkFormRules.id_card"
            >
              <el-input v-model="row.id_card" placeholder="请输入内容"></el-input>
            </el-form-item>
          </template>
          <!-- 检验结果 -->
          <template #check_ret="{ row, $index }">
            <el-form-item :prop="`checkTableData.${$index}.check_ret`">
              <el-select v-model="row.check_ret" placeholder="请选择" filterable>
                <el-option
                  v-for="item in passList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </template>
          <!-- 扫码信息确认人 -->
          <template #confirmer_id="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.confirmer_id`"
              :rules="checkFormRules.confirmer_id"
            >
              <!-- @change="handleSelectUser($event, `selectUser${$index}Ref`, row)" -->
              <el-select
                v-model="row.confirmer_id"
                placeholder="请选择"
                filterable
                :ref="`selectUser${$index}Ref`"
              >
                <el-option
                  v-for="item in checkUserOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </template>
          <!-- 确认人签名 -->
          <template #confirmer_sign="{ row, $index }">
            <el-form-item
              :prop="`checkTableData.${$index}.confirmer_sign`"
              :rules="checkFormRules.confirmer_sign"
            >
              <el-image
                :src="useSetting.baseHttp + row.confirmer_sign"
                :initial-index="1"
                :zoom-rate="1.2"
                :max-scale="3"
                :min-scale="0.2"
                :preview-src-list="[useSetting.baseHttp + row.confirmer_sign]"
                preview-teleported
                @click="handlePreview(useSetting.baseHttp + row.confirmer_sign)"
                fit="contain"
              >
                <template #error>
                  <el-button type="primary" @click="handleSign(row, 'confirmer_sign')">
                    点击签名
                  </el-button>
                </template>
              </el-image>
              <el-button
                v-if="row.confirmer_sign"
                class="mt-[20px]"
                type="default"
                @click="row.confirmer_sign = ''"
              >
                重置签名
              </el-button>
            </el-form-item>
          </template>
        </PureTable>
      </el-form>
    </div>
  </div>
</template>
<style lang="scss" scoped>
:deep(.pure-table-box .el-form-item--default) {
  margin-top: 18px;
}
</style>

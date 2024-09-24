<script setup lang="ts">
import { type CollapseModelValue, type FormInstance, type TabPaneName } from "element-plus";
import type { FieldValues, PlusColumn } from "plus-pro-components";
import { useRoute, useRouter } from "vue-router";
// 引入香精入厂检测接口
import {
  countertrialApi,
  createOrderApi,
  deleteOrderApi,
  editOrderApi,
  finishOrderApi,
  getInfoApi,
  makeReportApi,
  rejectOrderApi,
  reviewrderApi,
  revokeOrderApi,
} from "@/api/quality/process-inspection/essence/index";
// 签名组件
import QualitySignDialog from "@/components/Device/SignDialog/index.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useCommonHooks } from "@/hooks/quality";
import { useSettingsStoreHook } from "@/store/modules/settings";
import { useTagsViewStore } from "@/store/modules/tagsView";
import FileTable from "@/views/quality/components/FileTable/index.vue";
import OrderLog from "@/views/quality/components/OrderLog/index.vue";
// 复核签名+备注组件
import QualityRecheckSign from "@/views/quality/components/RecheckSign/index.vue";
// 引入订单操作按钮
import AffixButton from "@/views/quality/components/affixButton.vue";
import { useAdd } from "./utils/add";

const { startDownloadUrl } = useCommonHooks();

/* 香精入厂检测记录编辑页 */
defineOptions({
  name: "MaterialInspectionEssenceAdd",
});
enum ETitle {
  "新建香精入厂检测记录" = 1,
  "编辑香精入厂检测记录",
  "香精入厂检测记录详情",
}
/** 身份标识数组--重要! */
const assocType = ref<number[]>([]);
const tagsViewStore = useTagsViewStore();
const router = useRouter();
const route = useRoute();
const activeName = ref("first");
function tabChange(name: TabPaneName) {
  activeName.value = name as string;
}
const {
  pageType,
  editDisabled,
  formData,
  formColumns,
  formRules,
  checkTableForm,
  checkFormRules,
  checkTableData,
  handleAdd,
  handleDelRow,
  tableLableOptions,
  initTableClumns,
  errorCountMap,
  updateBatchNo,
  resetErrorCountMap,
  VisualChemicalTestingTablecolumns,
  SensoryHeavyMetalTestingTablecolumns,
  validatorCell,
  is_submit,
  tableFormRef,
  tasteOptions,
} = useAdd();
/** 用于记录编辑时,从列表传过来的id */
const listId = ref(0);
/** 用于记录单据状态 */
const status = ref(0);
const headerTitle = computed(() => {
  return ETitle[pageType.value];
});
const formLoading = ref(false);
/** 折叠面板的数组 */
const activeNames = ref(["1", "2", "3", "4"]);
// 页面加载状态
const pageLoading = ref(false);
const initTagsView = () => {
  const title = headerTitle.value;
  const new_route = Object.assign({}, route, {
    title,
  });
  tagsViewStore.updateVisitedView(new_route);
};
const useSetting = useSettingsStoreHook();
const PlusFormRef = ref();
/** 基础表单的ref */
const baseFormRef = computed(() => {
  return PlusFormRef.value.formInstance as FormInstance;
});
/** 附件自定义组件的ref */
const fileTableRef = ref<InstanceType<typeof FileTable>>();
// 签名提交
const dialogOptions = {
  width: "60%",
  btnClass: "w-[80px]",
  draggable: true,
  closeOnClickModal: false,
  closeOnPressEscape: false,
  btnLoading: false,
  showClose: false,
};
// 复核签名列表
const recheck_img_list = ref<string[]>([]);

const signDialogRef = ref();
// 折叠面板切换
const handleChange = (val: CollapseModelValue) => {
  // console.log(val);
};
/** 点击取消 */
function handleCancel() {
  router.replace({
    path: "/quality/material-inspection/essence",
  });
}
// 点击保存：1-保存，2-提交
async function handleSave(type = 1) {
  is_submit.value = false;
  const vaildateRes = await baseFormRef.value
    .validate((valid, fields) => {
      for (const keys in fields) {
        if (fields[keys]) {
          // 弹出每个字段的错误提示
          ElMessage.warning(fields[keys][0].message);
          baseFormRef.value.scrollToField(keys);
          break;
        }
      }
    })
    .catch((err) => {
      console.log("err", err);
    });
  if (!vaildateRes) return;
  // 检验信息
  formData.value.check_info = getcheckInfo();
  // 附件信息
  formData.value.file_list.forEach((item: any) => {
    if (!Number(item.id)) {
      delete item.id;
    }
  });
  let data = { ...formData.value };

  let resultMsg = "";
  try {
    const result = listId.value
      ? await editOrderApi({ ...data, id: listId.value })
      : await createOrderApi(data);
    resultMsg = result.msg;
    if (type === 2) {
      /* 如果是提交,保存后用返回的id,调用提交接口 */
      let data = {
        id: result.data.id,
        check_sign: formData.value.check_sign,
        check_ret: formData.value.check_ret,
      };
      const submitResult = await reviewrderApi(data);
      resultMsg = submitResult.msg;
    }
    handleBack(resultMsg);
  } catch (error) {}
}
async function validateForm() {
  if (!tableFormRef.value) return true;
  const vaildateRes = await tableFormRef.value
    .validate((valid, fields) => {
      console.log(valid, fields);
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
// 签字提交
async function handleSubmit() {
  is_submit.value = true;
  // 校验基础信息
  const vaildateRes = await baseFormRef.value.validate();
  if (!vaildateRes) return;
  // 校验检验信息
  console.log("tableFormRef.value:", tableFormRef.value);
  let checkinfoValidateRes: any = await validateForm();
  if (!checkinfoValidateRes) return;

  let { check_ret } = formData.value;
  if (check_ret === null) {
    ElMessage.warning("请先填写检验结果");
    return;
  }

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
      formData.value.check_user_signature = result;
      handleSave(2);
      updateDialog(false, "btnLoading");
      done();
    },
  });
}
// 签字复核
async function handleRecheck() {
  recheckSignVisible.value = true;
  recheckSignRef.value?.resetValues();
}
// 撤回
async function handleRecall() {
  let data: any = {
    id: listId.value,
  };
  let result = await revokeOrderApi(data);
  handleBack(result.msg);
}
// 反审核
async function handleReverse() {
  ElMessageBox.prompt("请填写反审核理由", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  })
    .then(async ({ value }) => {
      let data: any = {
        id: listId.value,
        reason: value,
      };
      let result = await countertrialApi(data);
      handleBack(result.msg);
    })
    .catch(() => {});
}
// 删除：暂存状态才可删除
async function handleDelete() {
  let data: any = {
    id: listId.value,
  };
  let result = await deleteOrderApi(data);
  handleBack(result.msg);
}
// 生成报告
async function handleReport() {
  let data: any = {
    id: listId.value,
  };
  startDownloadUrl(makeReportApi, data);
}
// 签字复核
const recheckSignRef = ref<InstanceType<typeof QualityRecheckSign>>();
const recheckSignVisible = ref(false);
// 复核签字组件回调
const handleRecheckSignConfirm = async (fileValues: {
  file_url: string;
  note: string;
  status: number;
}) => {
  let data: any = {
    id: listId.value,
    recheck_sign: fileValues.file_url,
    check_remark: fileValues.note,
  };
  // 根据 status 请求不同接口：2 通过 3 驳回
  const result = fileValues.status == 3 ? await rejectOrderApi(data) : await finishOrderApi(data);
  handleBack(result.msg);
};

// 操作按钮上绑定的变量
const affixBtnData = computed(() => {
  return {
    status: formData.value.status,
    assocType: assocType.value,
    pageType: pageType.value,
  };
});

// // 操作按钮上绑定的方法
const affixBtnEvent = {
  cancel: handleCancel,
  save: handleSave,
  submit: handleSubmit,
  recheck: handleRecheck,
  recall: handleRecall,
  reverse: handleReverse,
  delete: handleDelete,
  report: handleReport,
};

// /** 监听表单的变化 */
const handleFormChange = (values: FieldValues, column: PlusColumn) => {
  let { prop } = column;
  // 修改生产批号
  // if (prop === "batch_no") {
  //   let { batch_no } = values;
  //   // 修改了生产批号需要同步给检验表格
  //   if (batch_no) {
  //     updateBatchNo(batch_no);
  //   }
  // }
  // 修改供应商:初始化表头配置
  if (["supplier_id"].includes(prop) && values[prop]) {
    initTableClumns(formData.value);
  }
};
// 表格新增行
const tableAdd = async () => {
  // 新增检验信息，先校验基础信息表单必填项
  const vaildateRes = await baseFormRef.value
    .validate((valid, fields) => {
      for (const keys in fields) {
        if (fields[keys]) {
          // 弹出每个字段的错误提示
          ElMessage.warning(fields[keys][0].message);
          baseFormRef.value.scrollToField(keys);
          break;
        }
      }
    })
    .catch((err) => {
      console.log("err", err);
    });
  if (!vaildateRes) return;
  handleAdd();
};

function getcheckInfo() {
  // 传参的时候 皱纹度,紧密度需要/100,展示的时候需要 *100 百分比显示
  return checkTableData.value?.length > 0
    ? checkTableData.value.map((item: any) => {
        let { unique_id, ...rest } = item;

        return { ...rest };
      })
    : undefined;
}
// 操作成功返回列表
const handleBack = (msg: string) => {
  ElMessageBox.confirm(`${msg},请回到列表页面查看~`, "温馨提示", {
    confirmButtonText: "好的,我知道了",
    showCancelButton: false,
    showClose: false,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    type: "success",
  }).then(() => {
    const currentTag = router.currentRoute.value;
    router.replace({
      path: "/quality/material-inspection/essence",
    });
    tagsViewStore.delView(currentTag);
  });
};
// 检查单元格是否符合标准值 自定义class
function checkCellClass(value: any, key: string) {
  let className = "";
  if (!tableLableOptions.value || !value) return className;
  console.log("tableLableOptions.value:", tableLableOptions.value);
  let ok = validatorCell(tableLableOptions.value[key], value);
  className = ok ? "" : "warn-text";
  return className;
}
async function getDetailData() {
  try {
    formLoading.value = true;
    const result = await getInfoApi({ id: listId.value });
    const res = result.data;
    formData.value.order_no = res.order_no;
    formData.value.supplier_name = res.supplier_name;
    formData.value.supplier_id = res.supplier_id;
    formData.value.batch_no = res.batch_no;
    formData.value.pro_date = res.pro_date;
    formData.value.check_date = res.check_date;
    formData.value.check_res = res.check_res;
    formData.value.sampling_uid = res.sampling_uid;
    formData.value.sampling_user = res.sampling_user;
    formData.value.check_uid = res.check_uid;
    formData.value.check_user = res.check_user;
    formData.value.check_user_signature = res.check_user_signature;
    formData.value.destroy_status = res.destroy_status;
    formData.value.destroy_user_signature = res.destroy_user_signature;
    formData.value.destory_note = res.destory_note;
    formData.value.destory_uid = res.destory_uid;
    formData.value.destroy_date = res.destroy_date;
    formData.value.reviewer_user_signature = res.reviewer_user_signature;
    formData.value.reviewer_date = res.reviewer_date;
    formData.value.reviewer_uid = res.reviewer_uid;
    formData.value.note = res.note;
    formData.value.total_samples = res.total_samples;
    formData.value.total_abnormal = res.total_abnormal;
    formData.value.status = res.status;
    let checkinfo = res.check_info || [];

    if (checkinfo?.length > 0) {
      checkinfo.forEach((item: any) => {
        item.aroma_val = Number(item.aroma_val);
        item.taste_val = Number(item.taste_val);
      });
    }

    checkTableData.value = checkinfo.length > 0 ? checkinfo : formData.value.check_info;
    formData.value.create_time = res.create_time;
    formData.value.ct_name = res.ct_name;
    formData.value.ct_uid = res.ct_uid;
    formData.value.dept_id = res.dept_id;
    formData.value.file_list = res.file_list;
    formData.value.act_log = res.act_log;
    formData.value.up_name = res.up_name;
    formData.value.up_uid = res.up_uid;
    formData.value.update_time = res.update_time;
    formData.value.id = res.id;
    formLoading.value = false;
    await initTableClumns(formData.value);
  } catch (error) {
    formLoading.value = false;
  }
}
watch(
  () => checkTableData.value,
  (newValue) => {
    formData.value.total = 0;
    if (newValue?.length > 0) {
      formData.value.total = checkTableData.value?.length;
      // 检验信息是否：不合格，合格，部分合格
      const allPassed = checkTableData.value.every((item: any) => item.check_ret === 1);
      const allFailed = checkTableData.value.every((item: any) => item.check_ret === 0);
      const somePassed = checkTableData.value.some((item: any) => item.check_ret === 1);
      const someFailed = checkTableData.value.some((item: any) => item.check_ret === 0);
      if (allPassed) {
        formData.value.check_ret = 1;
      } else if (allFailed) {
        formData.value.check_ret = 0;
      } else {
        // 部分合格
        if (somePassed || someFailed) {
          formData.value.check_ret = 2;
        }
      }
      // console.log("watch checkTableData: ", checkTableData.value);
      return;
    }
  },
  {
    deep: true,
  },
);
const hasExecuted = computed(() => {
  return checkTableData.value?.some((item: any) => item.check_user_name);
});
onActivated(() => {
  listId.value = Number(route.query.id) || 0;
  pageType.value = Number(route.query.pageType) || 1;
  assocType.value = [Number(route.query.assocType)];
  baseFormRef.value?.resetFields();
  checkTableData.value = [];
  formData.value.file_list = [];
  formData.value.logs = [];
  checkTableData.value = formData.value.check_info;
  initTagsView();
  if (listId.value) {
    getDetailData();
    return;
  }
});
</script>
<template>
  <div class="app-container !pb-[40px]">
    <AffixButton v-bind="affixBtnData" :order-type="10" v-on="affixBtnEvent"></AffixButton>
    <el-tabs v-model="activeName" @tab-change="tabChange">
      <el-tab-pane label="详情信息" name="first">
        <el-form
          :model="checkTableForm"
          ref="tableFormRef"
          :rules="checkFormRules"
          :disabled="editDisabled"
        >
          <el-collapse
            v-model="activeNames"
            @change="handleChange"
            class="mt-2"
            v-loading="pageLoading"
          >
            <!-- 基础信息 -->
            <el-collapse-item name="1">
              <template #title>
                <p class="font-bold text-[14px]">基础信息</p>
              </template>
              <div class="px-8">
                <PlusForm
                  :disabled="pageType === 3"
                  ref="PlusFormRef"
                  v-model="formData"
                  labelWidth="90px"
                  labelPosition="right"
                  :columns="formColumns"
                  :rules="formRules"
                  :colProps="{ span: 6 }"
                  :row-props="{ gutter: 10 }"
                  :hasFooter="false"
                  @change="handleFormChange"
                  v-loading="formLoading"
                ></PlusForm>
              </div>
            </el-collapse-item>
            <!-- 检验信息 -->
            <el-collapse-item name="2" class="mt-2">
              <template #title>
                <p class="font-bold text-[14px]">外观及理化检测信息</p>
              </template>
              <div class="px-8">
                <div class="pure-table-box">
                  <PureTable
                    ref="prueTableRef"
                    row-key="id"
                    header-cell-class-name="table-row-header"
                    alignWhole="center"
                    :data="checkTableData"
                    :columns="VisualChemicalTestingTablecolumns"
                    :loading="formLoading"
                    border
                    width="500px"
                  >
                    <!-- 外观 -->
                    <template #appearance_val="{ row, $index }">
                      <el-form-item
                        :prop="`checkTableData.${$index}.appearance_val`"
                        :rules="checkFormRules.appearance_val"
                      >
                        <!-- <el-input v-model="row.appearance_val" placeholder="请输入外观"></el-input> -->
                        <el-select v-model="row.appearance_val">
                          <el-option
                            v-for="item in tasteOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.label"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </template>
                    <!-- 色度 -->
                    <template #color_val="{ row, $index }">
                      <el-form-item
                        :prop="`checkTableData.${$index}.color_val`"
                        :rules="checkFormRules.color_val"
                      >
                        <el-input
                          v-model="row.color_val"
                          placeholder="请输入"
                          v-inputnum.num_point="4"
                        ></el-input>
                      </el-form-item>
                    </template>
                    <!-- Brix标准值 -->
                    <template #brix_val="{ row, $index }">
                      <el-form-item
                        :prop="`checkTableData.${$index}.brix_val`"
                        :rules="checkFormRules.brix_val"
                        :class="checkCellClass(row.brix_val, 'brix')"
                      >
                        <el-input
                          v-model="row.brix_val"
                          placeholder="请输入内容"
                          v-inputnum.num_point="4"
                        ></el-input>
                      </el-form-item>
                    </template>
                    <!-- 密度 -->
                    <template #density_val="{ row, $index }">
                      <el-form-item
                        :prop="`checkTableData.${$index}.density_val`"
                        :rules="checkFormRules.density_val"
                        :class="checkCellClass(row.density_val, 'density')"
                      >
                        <el-input
                          v-model="row.density_val"
                          placeholder="请输入内容"
                          v-inputnum.num_point="4"
                        ></el-input>
                      </el-form-item>
                    </template>
                  </PureTable>
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item name="3" class="mt-2" v-if="hasExecuted">
              <template #title>
                <p class="font-bold text-[14px]">感官及重金属检测信息</p>
              </template>
              <div class="px-8">
                <div class="pure-table-box">
                  <PureTable
                    ref="prueTableRef"
                    row-key="id"
                    header-cell-class-name="table-row-header"
                    alignWhole="center"
                    :data="checkTableData"
                    :columns="SensoryHeavyMetalTestingTablecolumns"
                    :loading="formLoading"
                    border
                  >
                    <!-- 香气 -->
                    <template #aroma_val="{ row, $index }">
                      <el-form-item>
                        <el-select disabled v-model="row.aroma_val" placeholder="请选择" filterable>
                          <el-option
                            v-for="item in tasteOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </template>
                    <!-- 口感 -->
                    <template #taste_val="{ row, $index }">
                      <el-form-item>
                        <el-select disabled v-model="row.taste_val" placeholder="请选择" filterable>
                          <el-option
                            v-for="item in tasteOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </template>
                    <!-- 铅 -->
                    <template #lead_val="{ row, $index }">
                      <el-form-item :prop="`checkTableData.${$index}.lead_val`">
                        <el-input
                          disabled
                          v-model="row.lead_val"
                          type="number"
                          placeholder="请输入"
                        ></el-input>
                      </el-form-item>
                    </template>
                    <!-- 砷 -->
                    <template #arsenic_val="{ row, $index }">
                      <el-form-item :prop="`checkTableData.${$index}.arsenic_val`">
                        <el-input
                          disabled
                          v-model="row.arsenic_val"
                          type="number"
                          placeholder="请输入"
                        ></el-input>
                      </el-form-item>
                    </template>
                  </PureTable>
                </div>
              </div>
            </el-collapse-item>

            <!-- 附件信息 -->
            <el-collapse-item name="4" class="mt-2">
              <template #title>
                <p class="font-bold text-[14px]">附件信息</p>
              </template>
              <FileTable
                :fileList="formData.file_list"
                :disabled="editDisabled"
                ref="fileTableRef"
              ></FileTable>
            </el-collapse-item>
          </el-collapse>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="单据日志" name="second" v-if="editDisabled">
        <OrderLog :log-list="formData.act_log"></OrderLog>
      </el-tab-pane>
    </el-tabs>
    <!-- 签字复核组件 -->
    <QualityRecheckSign
      ref="recheckSignRef"
      @confirm="handleRecheckSignConfirm"
      v-model="recheckSignVisible"
    ></QualityRecheckSign>
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/collapse.scss";
@import "@/styles/common.scss";
@import "@/styles/quality/add.scss";
:deep(.el-table .el-table__cell) {
  padding: 4px 0;
}
:deep(.el-tabs__header) {
  margin-bottom: 0;
  margin-top: 10px;
  padding-left: 10px;
  background-color: #fff !important;
}
:deep(.el-table .el-table__cell) {
  padding: 4px 0;
}
.pure-table-box {
  max-width: 1200px;
  min-width: 800px;
}
</style>

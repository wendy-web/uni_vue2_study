<script setup lang="ts">
import type { FormInstance } from "element-plus";
import { isArray } from "@pureadmin/utils";
import { useRoute, useRouter } from "vue-router";
import { getExecuteCheckApi } from "@/api/device/common/index";
import {
  getInspecRecordAddEditApi,
  getInspecRecordDetailApi,
} from "@/api/device/inspection/record/index";
import CommonSelect from "@/components/DeptSelect/CommonSelect.vue";
import DeviceApproveFlow from "@/components/Device/DeviceApproveFlow/index.vue";
import SignDialog from "@/components/Device/SignDialog/index.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import MultiUpload from "@/components/Upload/MultiUpload.vue";
import { useEditHooks } from "@/hooks/edit";
import { useSettingsStoreHook } from "@/store/modules/settings";
import { useTagsViewStore } from "@/store/modules/tagsView";
import { useUserStoreHook } from "@/store/modules/user";
import RectifyCondition from "./components/rectifyCondition.vue";
import { type TableListType, useAdd } from "./utils/add";

defineOptions({
  name: "deviceInspectionRecordAdd",
});

const { isReqDetail } = useEditHooks();
const userStore = useUserStoreHook();

enum ETitle {
  "新建点巡检记录" = 1,
  "编辑点巡检记录",
}

const useSetting = useSettingsStoreHook();
const tagsViewStore = useTagsViewStore();
const router = useRouter();
const route = useRoute();

const {
  formData,
  group,
  addRules,
  tableColumns,
  getInspecCycleName,
  userList,
  warningCheckNumberValue,
  checkNumberValue,
} = useAdd();

/** 身份标识数组 */
const assoc_type = ref<number[]>([]);
const detailLoading = ref(false);

/** 整改情况组件ref */
const rectifyConditionRef = ref();

/** 记录点巡检计划点击执行计划传过来的id */
const planId = ref(0);
const scrollContainer = ref();
const dataLoading = ref(false);
const listId = ref(0);
const pageType = ref(1);
const order_type = ref(0); //如果从列表页面点击去整改按钮进来的 则设为1
const headerTitle = computed(() => {
  return ETitle[pageType.value];
});
const PlusformRef = ref();
const formRef = computed(() => {
  return PlusformRef.value.formInstance as FormInstance;
});
//表格表单
const formTableRef = ref<FormInstance>();
// 表格数据
const formTable = ref({
  tableList: [] as TableListType[],
  is_must_pho: 0, //是否必须拍照
  is_must_sig: 0, //是否必须签名
  is_report_rectify: 0, //是否上报整改；0：否；1：是
  rectify_problem: "", //整改问题 描述文本
  rectify_uid: userStore.uid, //整改人uid
  // picture: [] as string[],
});

const abnormalSum = computed(() => {
  // if (listId.value) {
  //   return item_count.value.normal;
  // }
  // record_method 记录方式;0：单选；1：多选；2：数值；3：长文本
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
  console.log("🚀 ~ newList ~ newList:", newList);

  let totalCount = 0;

  for (let i = 0; i < newList.length; i++) {
    totalCount += newList[i].count || 0;
  }
  if (totalCount >= 1) {
    formTable.value.is_report_rectify = 1;
  } else {
    formTable.value.is_report_rectify = 0;
  }
  return totalCount;
});

const totalNum = computed(() => {
  // return listId.value ? item_count.value.count : formTable.value.tableList.length;
  return formTable.value.tableList.length;
});

const formTableRules = reactive({
  is_report_rectify: [
    {
      required: true,
      message: "请选择是否上报整改",
      trigger: "change",
    },
  ],
  rectify_problem: [
    {
      required: true,
      message: "请输入整改内容描述",
      trigger: "blur",
    },
  ],
  rectify_uid: [
    {
      required: true,
      message: "请选择整改人",
      trigger: "change",
    },
  ],
});

/** 循环周期名称 */
const cycle_name = ref("");
const cycle_type = ref<number>();
/** 记录现场图片数据的数组 */
const picture = ref<string[]>([]);
const sign = ref("");

/** 表格底部显示内容数据 */
const item_count = ref({
  count: 0,
  normal: 0,
});

/** 编辑时-记录返回的整改情况数据 */
const rectify_picture = ref<string[]>([]);
const rectify_time = ref("");
const rectify_feedback = ref("");
const rectify_status = ref(-1); //编辑时记录一下返回的整改状态;
const rectify_status_text = ref(""); //整改状态文本
const rectify_list = ref<any[]>([]);
/** 判断如果是编辑页,且为整改人角色,就返回true,限制其他可操作项,显示整改情况组件(可操作) */
const isShowRectifyCondition = computed(() => {
  console.log("order_type.value", order_type.value);
  if (pageType.value === 2 && assoc_type.value.includes(6) && order_type.value === 1) {
    return true;
  }
  return false;
});
/** 判断是否可以操作 提交验收按钮 */
const isDisabledSubmit = computed(() => {
  if (formTable.value.is_report_rectify === 1) {
    return rectify_status.value === 1 ? false : true;
  }
  return false;

  // if (pageType.value === 1 && formTable.value.is_report_rectify === 1) {
  //   // 如果是新建页面,且是否上报整改为 是,则返回true,禁止提交验收
  //   return true;
  // } else if (pageType.value === 2) {
  //   // 如果是编辑页面
  //   if (assoc_type.value.includes(6)) {
  //     // 如果是整改人角色, 可以操作提交验收,返回为false
  //     return false;
  //   } else {
  //     // 如果不是整改人角色,则判断是否上报整改和已整改状态, 如果无需上报整改,则返回false,如果需要上报整改,则判断已整改状态为1则返回false可以提交,否则返回true禁止提交
  //     return formTable.value.is_report_rectify === 1
  //       ? rectify_status.value === 1
  //         ? false
  //         : true
  //       : false;
  //   }
  // }
  // // 默认返回false,可以操作
  // return false;
});
/** 判断是否禁止修改是否上报整改表单 */
const isDisabledReported = computed(() => {
  // 如果是如果编辑页,为整改人角色,就返回true,禁止修改, 或者为已整改状态也禁止修改
  if (isShowRectifyCondition.value || rectify_status.value === 1) {
    return true;
  } else {
    return false;
  }
});

/** 监听图片change事件 */
function imgChange(val: string[]) {
  console.log("🚀 ~ imgChange ~ val:", val);
  picture.value = val;
}

async function getPlanData() {
  detailLoading.value = true;
  const result = await getExecuteCheckApi({ id: planId.value });
  let data = result.data;
  formData.value.plan_details_no = data.plan_details_no;
  formData.value.bar_title = data.bar_title;
  formData.value.asset_no = data.asset_no;
  formData.value.barcode = data.barcode;
  formData.value.spec = data.spec;
  formData.value.equipment_type_title = data.equipment_type_title;
  // formData.value.equipment_type_id = data.equipment_type_id;
  formData.value.use_places = data.use_places;
  formData.value.use_dept_names = data.equipment.use_dept_names;
  formData.value.use_dept_id = data.equipment.use_dept_id;
  formData.value.plan_start_time = data.plan_start_time;
  formData.value.plan_end_time = data.plan_end_time;
  formData.value.executive_rule_type = data.executive_rule_type;
  formData.value.executor_uid = data.executor_uid
    ? data.executor_uid.split(",").map((m: string) => Number(m))
    : [];
  formData.value.equipment_id = data.equipment_id;

  formTable.value.is_must_pho = data.is_must_pho;
  formTable.value.is_must_sig = data.is_must_sig;
  formTable.value.tableList = data.cycle; //

  cycle_name.value = getInspecCycleName(data.cycle_type);
  cycle_type.value = data.cycle_type;
  detailLoading.value = false;
}

/** 编辑时获取详情数据 */
async function getEditData() {
  detailLoading.value = true;
  const result = await getInspecRecordDetailApi({ id: listId.value });
  let data = result.data;
  assoc_type.value = data.assoc_type;
  planId.value = data.plant_id;
  rectify_picture.value = data.rectify_picture;
  rectify_time.value = data.rectify_time || "";
  rectify_feedback.value = data.rectify_feedback || "";
  rectify_status.value = data.rectify_status;
  rectify_status_text.value = data.rectify_status_text;
  rectify_list.value = changeDetail(data.rectify_list);

  formData.value.note = data.note; //备注

  formData.value.plan_details_no = data.plan_details_no; //计划明细单号
  formData.value.bar_title = data.bar_title; //资产名称
  formData.value.asset_no = data.asset_no; //设备编码
  formData.value.barcode = data.barcode; //资产条码
  formData.value.spec = data.spec; //规格型号
  formData.value.equipment_type_title = data.equipment_type_text; //资产类型:
  // formData.value.equipment_type_id = data.equipment_type_id;
  formData.value.use_places = data.save_addr_text; //使用位置
  formData.value.use_dept_names = data.use_dept_names; //使用部门
  formData.value.use_dept_id = data.use_dept_id; //
  formData.value.plan_start_time = data.plan_start_time; //计划执行时间:
  formData.value.plan_end_time = data.plan_end_time; //
  formData.value.executive_rule_type = data.executive_rule_type; //执行时间规则
  formData.value.executor_uid = data.executor_uid
    ? data.executor_uid.split(",").map((m: string) => Number(m))
    : []; //执行人
  formData.value.equipment_id = data.equipment_id; //设备id
  formTable.value.is_must_pho = data.is_must_pho; // 是否必须拍照
  formTable.value.is_must_sig = data.is_must_sig; // 是否必须签名

  formTable.value.is_report_rectify = data.is_report_rectify;
  formTable.value.rectify_problem = data.rectify_problem;
  formTable.value.rectify_uid = data.rectify_uid;

  cycle_name.value = getInspecCycleName(data.cycle_type);
  cycle_type.value = data.cycle_type;

  item_count.value = data.item_count;
  formData.value.task_time_start = data.task_time_start;
  formData.value.task_time_end = data.task_time_end;
  picture.value = data.picture;
  sign.value = data.sign ?? "";
  formTable.value.tableList = changeDetail(data.item_arr);
  console.log("🚀 ~ getEditData ~ formTable.value.tableList:", formTable.value.tableList);
  detailLoading.value = false;
  console.log("🚀 ~ getEditData ~ formTable.value.tableList :", formTable.value.tableList);
}
/** 点击确定/提交按钮 */
async function handleConfirm(type: number) {
  const validateRes = await formRef.value.validate((valid, fields) => {
    for (const keys in fields) {
      if (fields[keys]) {
        // 弹出每个字段的错误提示
        ElMessage.warning(fields[keys][0].message);
        formRef.value.scrollToField(keys);
        break;
      }
    }
  });
  if (!validateRes) return;
  const tableVaildateRes = await formTableRef.value?.validate((valid, fields) => {
    for (const keys in fields) {
      if (fields[keys]) {
        // 弹出每个字段的错误提示
        ElMessage.warning(fields[keys][0].message);
        formTableRef.value?.scrollToField(keys);
        break;
      }
    }
  });
  if (!tableVaildateRes) {
    ElMessage.warning("循环周期表格内容未填写或者填写有误");
    return;
  }
  console.log("formTable.value.is_must_pho", formTable.value.is_must_pho);
  console.log("picture.value", picture.value);
  if (formTable.value.is_must_pho && picture.value.length === 0) {
    ElMessage.warning("必须上传图片现场图片");
    return;
  }
  if (formTable.value.is_must_sig && !sign.value) {
    ElMessage.warning("必须签名,请点击签名");
    return;
  }

  if (isShowRectifyCondition.value) {
    // 需要验证整改情况是否填写完整
    const vailRes = await rectifyConditionRef.value?.vailFormData();
    if (!vailRes) return;
  }

  let rectifyForm = rectifyConditionRef.value?.rectifyForm;
  let is_report_rectify = formTable.value.is_report_rectify; //是否需要整改 1需要

  let data = {
    id: listId.value ? listId.value : undefined,
    plant_id: planId.value,
    plan_details_no: formData.value.plan_details_no,
    eq_id: formData.value.equipment_id,
    plan_start_time: formData.value.plan_start_time,
    use_dept_id: formData.value.use_dept_id,
    use_dept_names: formData.value.use_dept_names,
    task_time_start: formData.value.task_time_start,
    task_time_end: formData.value.task_time_end,
    executor_uid: formData.value.executor_uid.join(","),
    note: formData.value.note,
    cycle_type: cycle_type.value,
    status: type,
    picture: picture.value,
    sign: sign.value,
    item: changeTable(formTable.value.tableList),
    is_report_rectify: is_report_rectify,
    rectify_problem: is_report_rectify ? formTable.value.rectify_problem : undefined,
    rectify_uid: is_report_rectify ? formTable.value.rectify_uid : undefined,
    rectify_time: rectifyForm ? rectifyForm.rectify_time : undefined,
    rectify_feedback: rectifyForm ? rectifyForm.rectify_feedback : undefined,
    rectify_picture: rectifyForm ? rectifyForm.rectify_picture : undefined,
    rectify_list: rectifyForm ? changeTable(rectifyForm.rectify_list) : undefined,
    rectify_status: isShowRectifyCondition.value ? 1 : undefined,
  };
  console.log("data", data);

  // return;
  const result = await getInspecRecordAddEditApi(data);
  ElMessageBox.confirm(`${result.msg},请回到列表页面查看~`, "温馨提示", {
    confirmButtonText: "好的,我知道了",
    showCancelButton: false,
    showClose: false,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    type: "success",
  })
    .then(() => {
      const currentTag = router.currentRoute.value;
      router.replace({
        path: "/device/inspection/record",
      });
      tagsViewStore.delView(currentTag);
    })
    .catch((error) => {
      console.log(error);
    });
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
    // let indexList = list
    //   .map((item, index) => (item.is_check ? index : ""))
    //   .filter((el) => typeof el === "string");
    // console.log("🚀 ~ getResultContentIndex ~ indexList:", indexList);
    let indexList = list.map((item, index) => (item.is_check ? index : "")).filter(String);
    return indexList;
  } else if ([2, 3].includes(record_method)) {
    return list[0].val;
  }
}

/** 提交数据时 转换一下tables数据 */
function changeTable(list: TableListType[]) {
  let arr = list.map((item) => {
    let itemObj = {
      item_content: item.item_content,
      method: item.method,
      record_method: item.record_method,
      std_explain: item.std_explain,
      upper_limit_val: item.upper_limit_val,
      lower_limit_val: item.lower_limit_val,
      note: item.note,
      result_content: changeResultContent(
        item.result_content,
        item.val,
        item.record_method,
        item.upper_limit_val,
        item.lower_limit_val,
      ),
    };

    return listId.value ? { id: item.id, ...itemObj } : itemObj;
  });
  return arr;
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

// 点击返回
function pageBack() {
  router.go(-1);
}
const initTagsView = () => {
  // id存在表示是编辑
  pageType.value = listId.value ? 2 : 1;
  const title = headerTitle.value;
  const new_route = Object.assign({}, route, {
    title,
  });
  tagsViewStore.updateVisitedView(new_route);
};

const dialogOptions = {
  width: "60%",
  btnClass: "w-[80px]",
  draggable: true,
  closeOnClickModal: false,
  closeOnPressEscape: false,
  btnLoading: false,
  showClose: false,
};

const signDialogRef = ref();
function clickSign() {
  addDialog({
    ...dialogOptions,
    title: "执行人签名",
    contentRenderer: () =>
      h(SignDialog, {
        ref: signDialogRef,
      }),
    beforeCancel: (done, { options, index }) => {
      done();
    },
    beforeSure: async (done, { options, index }) => {
      updateDialog(true, "btnLoading");
      const result = await signDialogRef.value.handleGenerate();
      console.log("result", result);
      sign.value = result;
      updateDialog(false, "btnLoading");
      done();
    },
  });
}

onActivated(() => {
  // getReBase();
  planId.value = Number(route.query.planId) || 0;
  listId.value = Number(route.query.id) || 0;
  order_type.value = Number(route.query.order_type) || 0;
  initTagsView();
  if (planId.value) {
    getPlanData();
  }
  if (listId.value && isReqDetail.value) {
    getEditData();
  }
});
</script>
<template>
  <div class="app-container">
    <div class="app-card" ref="scrollContainer" v-loading="detailLoading">
      <div class="header-title">
        <span>{{ headerTitle }}</span>
      </div>
      <PlusForm
        :disabled="isShowRectifyCondition"
        ref="PlusformRef"
        :rules="addRules"
        v-model="formData"
        :group="group"
        :colProps="{ span: 8 }"
        :rowProps="{ gutter: 20 }"
        labelWidth="110"
        :hasFooter="false"
        v-loading="dataLoading"
      ></PlusForm>
      <el-form :model="formTable" ref="formTableRef" :rules="formTableRules">
        <el-card shadow="never" class="mb-6" header="检查项目">
          <div class="mb-2 font-bold">
            <span class="inline-block mr-4">循环周期</span>
            <span>{{ cycle_name }}</span>
          </div>

          <PureTable
            header-cell-class-name="table-gray-header"
            :data="formTable.tableList"
            :columns="tableColumns"
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
                    :disabled="isShowRectifyCondition"
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
                    :disabled="isShowRectifyCondition"
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
                    :disabled="isShowRectifyCondition"
                    :class="[warningCheckNumberValue(row) ? 'warning-text' : '']"
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
                    :disabled="isShowRectifyCondition"
                  ></el-input>
                </el-form-item>
              </div>
            </template>
            <template #note="{ row }">
              <el-input
                v-model="row.note"
                placeholder="请输入备注"
                :disabled="isShowRectifyCondition"
              ></el-input>
            </template>
          </PureTable>
          <ul class="flex justify-end mt-4 pr-[60px]">
            <li class="mr-4">
              <span>检查项目总数</span>
              <span class="font-bold inline-block ml-4 text-green-400">{{ totalNum }}</span>
            </li>
            <li>
              <span>异常项</span>
              <span class="font-bold inline-block ml-4 text-red-400">{{ abnormalSum }}</span>
            </li>
          </ul>
        </el-card>
        <el-card shadow="never" class="mb-6">
          <template #header>
            <span>现场拍照图片</span>
            <span class="text-[12px] text-gray-400">(最多4张)</span>
            <span class="text-red-500" v-if="formTable.is_must_pho">*</span>
          </template>
          <MultiUpload
            :list="picture"
            @change="imgChange"
            :disabled="isShowRectifyCondition"
            :limit="4"
          ></MultiUpload>
          <div class="mt-8">
            <div class="flex justify-between">
              <el-form-item label="是否上报整改:" label-width="110" prop="is_report_rectify">
                <el-radio-group
                  v-model="formTable.is_report_rectify"
                  class="ml-4 mt-[-4px]"
                  :disabled="isDisabledReported"
                >
                  <el-radio :label="0" size="large">否</el-radio>
                  <el-radio :label="1" size="large">是</el-radio>
                </el-radio-group>
              </el-form-item>
              <div v-if="pageType === 2 && formTable.is_report_rectify === 1">
                <span class="text-gray-400">当前整改状态为：</span>
                <span class="font-bold">{{ rectify_status_text }}</span>
              </div>
            </div>

            <el-form-item
              label="整改问题:"
              label-width="110"
              prop="rectify_problem"
              v-if="formTable.is_report_rectify === 1"
            >
              <el-input
                v-model="formTable.rectify_problem"
                placeholder="请填写整改内容、描述"
                type="textarea"
                :rows="3"
                :disabled="isDisabledReported"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="整改负责人:"
              label-width="110"
              prop="rectify_uid"
              v-if="formTable.is_report_rectify === 1"
            >
              <CommonSelect
                v-model="formTable.rectify_uid"
                :list="userList"
                :disabled="isDisabledReported"
              ></CommonSelect>
            </el-form-item>
          </div>
        </el-card>
        <!-- 整改人填写的数据,只有整改人时才显示和需要填写 -->
        <RectifyCondition
          v-if="isShowRectifyCondition || rectify_status === 1"
          ref="rectifyConditionRef"
          :list="rectify_picture"
          :rectify_time="rectify_time"
          :rectify_feedback="rectify_feedback"
          :rectify_list="rectify_list"
          :disabled="!isShowRectifyCondition && rectify_status === 1"
        ></RectifyCondition>
        <el-card shadow="never" class="mb-6">
          <template #header>
            <span>执行人签名</span>
            <span class="text-red-500" v-if="formTable.is_must_sig">*</span>
          </template>
          <div class="flex items-center">
            <el-image
              style="width: 100px; height: 100px"
              :src="useSetting.baseHttp + sign"
              v-if="sign"
            />
            <el-button
              type="primary"
              size="default"
              @click="clickSign"
              class="ml-4"
              :disabled="isShowRectifyCondition"
            >
              点击签名
            </el-button>
          </div>
        </el-card>
      </el-form>
      <DeviceApproveFlow :id="listId" :order-type="3"></DeviceApproveFlow>
    </div>
    <div class="mt-6">
      <el-button plain class="w-[100px] mr-4" size="large" @click="pageBack">返回</el-button>
      <el-button type="primary" @click="handleConfirm(0)" class="w-[100px]" size="large">
        确定
      </el-button>

      <el-button
        type="primary"
        @click="handleConfirm(1)"
        class="w-[100px]"
        size="large"
        :disabled="isDisabledSubmit"
      >
        提交验收
      </el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/styles/common.scss";
@import "@/styles/warning-input.scss";

:deep(.plus-form .el-card) {
  box-shadow: none;
}

.app-card {
  height: calc(100vh - 180px);
  overflow-y: auto;
  padding-top: 0;
  .header-title {
    position: sticky;
    top: 0px;
    background-color: #fff;
    z-index: 12;
    height: 46px;
    display: flex;
    align-items: center;
    border-bottom: 2px solid #e5e5e5;
  }
}
</style>

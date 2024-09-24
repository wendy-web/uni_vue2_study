<script setup lang="ts">
/* 新建恒温培养箱使用记录列表页面 */
import type { CollapseModelValue } from "element-plus";
import type { FormInstance, TabPaneName } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { incubatorDetailApi, incubatorSaveApi,incubatorConfirmApi } from "@/api/quality/instrument/incubator";
import SignDialog from "@/components/Device/SignDialog/index.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useTagsViewStore } from "@/store/modules/tagsView";
import FileTable from "@/views/quality/components/FileTable/index.vue";
import OrderLog from "@/views/quality/components/OrderLog/index.vue";
import { useAdd } from "./utils/add";

defineOptions({
  name: "InstrumentIncubatorAdd",
});

enum ETitle {
  "新建恒温培养箱使用记录" = 1,
  "编辑恒温培养箱使用记录",
  "恒温培养箱使用记录详情",
}

const tagsViewStore = useTagsViewStore();
const router = useRouter();
const route = useRoute();
const {
  baseForm,
  baseColumns,
  fileData,
  logList,
  pageType,
  baseRules,
  is_submit,
  getStatusText,
  useSetting,
  isDetailDisable,
  getUserOptions,
  germForm,
  germColumns,
  germRules,
  myceteForm,
  myceteRules,
  timeFrameOptions,
  getInstMap,
  instList,
  isBaseDisable
} = useAdd();

const headerTitle = computed(() => {
  return ETitle[pageType.value];
});

/** 附件自定义组件的ref */
const fileTableRef = ref<InstanceType<typeof FileTable>>();

/** 折叠面板的数组 */
const activeNames = ref(["1", "2", "3"]);
const PlusFormRef = ref();
/** 基础表单的ref */
const baseFormRef = computed(() => {
  return PlusFormRef.value.formInstance as FormInstance;
});

const PlusGermFormRef = ref();
/** 细菌总数ref */
const germFormRef = computed(() => {
  return PlusGermFormRef.value.formInstance as FormInstance;
});

const PlusMyceteFormRef = ref();
/** 霉菌/酵母菌ref */
const myceteFormRef = computed(() => {
  return PlusMyceteFormRef.value.formInstance as FormInstance;
});

/** 是否已经添加霉菌酵母菌项目标识 */
const isAddProject = ref(false);

/** 用于记录编辑时,从列表传过来的id */
const listId = ref(0);
/** 用于记录单据状态 */
const status = ref();

/** 获取详情数据时的加载状态 */
const detailLoading = ref(false);

function selectInstChange(val: string, type: number) {
  // console.log("🚀 ~ selectInstChange ~ type:", type);
  // console.log("🚀 ~ selectInstChange ~ val:", val);
  let findRes = instList.value.find((item) => item.id === val);
  if (!findRes) return;
  if (type === 1) {
    germForm.value.inst_code = findRes.code;
    germForm.value.inst_name = findRes.name;
  } else if (type === 2) {
    myceteForm.value.inst_code = findRes.code;
    myceteForm.value.inst_name = findRes.name;
  }
}

/** 点击添加霉菌酵母菌项目 */
function handleAddPro() {
  isAddProject.value = true;
}

/** 点击删除霉菌酵母菌项目 */
function handleDelPro() {
  isAddProject.value = false;
}

/** 点击返回 */
function handleCancel() {
  router.replace({
    path: "/quality/instrument/incubator",
  });
}

/** 点击保存
 * @param apiStatus 0保存 1提交
 */
async function handleSave(apiStatus = 0) {
  is_submit.value = false;
  // 保存需要验证基本信息表单的内容
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

  const vaildateGermRes = await germFormRef.value
    .validate((valid, fields) => {
      for (const keys in fields) {
        if (fields[keys]) {
          // 弹出每个字段的错误提示
          ElMessage.warning(fields[keys][0].message);
          germFormRef.value.scrollToField(keys);
          break;
        }
      }
    })
    .catch((err) => {
      console.log("err", err);
    });
  if (!vaildateGermRes) return;

  if (isAddProject.value) {
    const vaildateGermRes = await myceteFormRef.value
      .validate((valid, fields) => {
        for (const keys in fields) {
          if (fields[keys]) {
            // 弹出每个字段的错误提示
            ElMessage.warning(fields[keys][0].message);
            myceteFormRef.value.scrollToField(keys);
            break;
          }
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
    if (!vaildateGermRes) return;
  }

  let { order_no, order_status, ct_name, create_time, confirm_sign, ...rest } = baseForm.value;
  let file_list = fileTableRef.value!.getChangeFileData();

  let { end_time, check_sign, out_sign, recheck_sign, ...germRest } = germForm.value;
  let checkinfo = [{ ...germRest }];
  if (isAddProject.value) {
    let { end_time, check_sign, out_sign, recheck_sign, ...myceteRest } = myceteForm.value;
    checkinfo.push({ ...myceteRest });
  }
  let data = {
    ...rest,
    // files: file_list.length > 0 ? file_list : undefined,
    files: file_list,
    confirm_sign: confirm_sign ? confirm_sign : undefined,
    checkinfo,
    // status: apiStatus,
    status: 0,
  };
  console.log("🚀 ~~~.then ~ data:", data);

  let loadingText = apiStatus === 0 ? "正在保存中" : "正在提交中";
  let resultMsg = "";
  console.log("🚀 ~ handleSave ~ data:", data);
  const sendLoading = ElLoading.service({
    lock: true,
    text: loadingText,
    background: "rgba(0, 0, 0, 0.7)",
  });
  try {
    const result = listId.value
      ? await incubatorSaveApi({ ...data, id: listId.value })
      : await incubatorSaveApi(data);
    resultMsg = result.msg;
    if (apiStatus === 1) {
      /* 如果是提交,保存后用返回的id,调用提交接口 */
      let data = {
        id: result.data.id,
        check_sign: baseForm.value.confirm_sign,
        confirm_type: 1,
      };
      const submitResult = await incubatorConfirmApi(data);
      resultMsg = submitResult.msg;
    }

    sendLoading.close();
    closeCurrentPage(resultMsg);
  } catch (error) {
    sendLoading.close();
  }
}

/** 弹窗提示关闭当前页面回到列表页面 */
function closeCurrentPage(resultMsg: string) {
  ElMessageBox.confirm(`${resultMsg},请回到列表页面查看~`, "温馨提示", {
    confirmButtonText: "好的,我知道了",
    showCancelButton: false,
    showClose: false,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    type: "success",
  }).then(() => {
    const currentTag = router.currentRoute.value;
    router.replace({
      path: "/quality/instrument/incubator",
    });
    tagsViewStore.delView(currentTag);
  });
}

const signDialogRef = ref();
/** 点击签字提交 */
async function handleSubmit() {
  /* 提交需要验证输入完整 */
  is_submit.value = true;

  const vaildateBaseRes = await baseFormRef.value
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
  if (!vaildateBaseRes) return;
  showSubmitDialog();
}
function showSubmitDialog() {
  addDialog({
    width: "60%",
    btnClass: "w-[80px]",
    draggable: true,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    btnLoading: false,
    showClose: false,
    title: "签名提交",
    contentRenderer: () =>
      h(SignDialog, {
        ref: signDialogRef,
      }),
    beforeCancel: (done) => {
      done();
    },
    beforeSure: async (done) => {
      updateDialog(true, "btnLoading");
      const result = await signDialogRef.value.handleGenerate();
      console.log("result", result);
      baseForm.value.confirm_sign = result;
      updateDialog(false, "btnLoading");
      done();

      handleSave(1);
    },
  });
}

async function getDetailData() {
  detailLoading.value = true;
  const result = await incubatorDetailApi({ id: listId.value });
  const res = result.data;

  baseForm.value.order_no = res.order_no; //单据编号-保存剔除
  baseForm.value.order_status = getStatusText(res.status); //单据状态文本-保存剔除
  status.value = res.status;
  baseForm.value.ct_name = res.ct_name; //制单人-保存剔除
  baseForm.value.create_time = res.create_time; //创建时间-保存剔除

  baseForm.value.type = res.type;
  baseForm.value.report_no = res.report_no;
  baseForm.value.humidity = res.humidity;
  baseForm.value.temperature = res.temperature;
  baseForm.value.check_user_id = res.check_user_id;
  baseForm.value.check_user_name = res.check_user_name;

  let checkinfo_germ = res.checkinfo[0];
  let checkinfo_mycete = res.checkinfo[1];
  setGermFormData(checkinfo_germ);
  isAddProject.value = checkinfo_mycete ? true : false;
  if (checkinfo_mycete) {
    setMyceteFormData(checkinfo_mycete);
  }

  isBaseDisable.value = res.checkinfo.some((item: any) => item.status != 0);

  detailLoading.value = false;
}

function setGermFormData(data: any) {
  germForm.value.check_type = data.check_type;
  germForm.value.temperature = data.temperature;
  germForm.value.inst_id = data.inst_id;
  germForm.value.inst_code = data.inst_code;
  germForm.value.inst_name = data.inst_name;
  germForm.value.num = data.num;
  germForm.value.test_time_type = data.test_time_type;
  germForm.value.test_temperature = data.test_temperature;

  germForm.value.id = data.id;
  germForm.value.status = data.status;
  if (isDetailDisable.value) {
    germForm.value.end_time = data.end_time;
    germForm.value.check_sign = data.check_sign;
    germForm.value.end_time = data.end_time;
    germForm.value.out_sign = data.out_sign;
    germForm.value.recheck_sign = data.recheck_sign;
  }
}

function setMyceteFormData(data: any) {
  myceteForm.value.check_type = data.check_type;
  myceteForm.value.temperature = data.temperature;
  myceteForm.value.inst_id = data.inst_id;
  myceteForm.value.inst_code = data.inst_code;
  myceteForm.value.inst_name = data.inst_name;
  myceteForm.value.num = data.num;
  myceteForm.value.test_time_type = data.test_time_type;
  myceteForm.value.test_temperature = data.test_temperature;
  myceteForm.value.id = data.id;
  myceteForm.value.status = data.status;
  if (isDetailDisable.value) {
    myceteForm.value.end_time = data.end_time;
    myceteForm.value.check_sign = data.check_sign;
    myceteForm.value.end_time = data.end_time;
    myceteForm.value.out_sign = data.out_sign;
    myceteForm.value.recheck_sign = data.recheck_sign;
    myceteForm.value.status = data.status;
  }
}

const initTagsView = () => {
  // id存在表示是编辑
  const title = headerTitle.value;
  const new_route = Object.assign({}, route, {
    title,
  });
  tagsViewStore.updateVisitedView(new_route);
};

onActivated(() => {
  listId.value = Number(route.query.id) || 0;
  pageType.value = Number(route.query.pageType) || 1;
  initTagsView();
  getInstMap();
  getUserOptions();
  if (listId.value) {
    getDetailData();
  }
});

const activeName = ref("first");

const handleClick = (name: TabPaneName) => {
  activeName.value = name as string;
};
</script>
<template>
  <div class="app-container" v-loading="detailLoading">
    <el-affix :offset="90" class="!w-full">
      <el-button type="" @click="handleCancel">返回</el-button>
      <template v-if="[1, 2].includes(pageType)">
        <el-button type="primary" @click="handleSave(0)">保存</el-button>
        <el-button type="primary" @click="handleSubmit">签字确认</el-button>
      </template>
    </el-affix>
    <el-tabs v-model="activeName" @tab-change="handleClick">
      <el-tab-pane label="单据内容" name="first">
        <el-collapse v-model="activeNames">
          <!-- 基础信息 -->
          <el-collapse-item name="1">
            <template #title>
              <p class="font-bold text-[14px]">基础信息</p>
            </template>
            <div class="pr-8">
              <PlusForm
                :disabled="isDetailDisable || isBaseDisable"
                ref="PlusFormRef"
                :rules="baseRules"
                v-model="baseForm"
                labelWidth="110"
                label-position="right"
                :columns="baseColumns"
                :row-props="{ gutter: 20 }"
                :col-props="{
                  span: 6,
                }"
                :hasFooter="false"
              ></PlusForm>
            </div>
          </el-collapse-item>
          <!-- 使用信息 -->
          <el-collapse-item name="2" class="mt-2">
            <template #title>
              <p class="font-bold text-[14px]">使用信息</p>
            </template>
            <div class="px-8">
              <ul class="flex mb-4" v-if="!isDetailDisable">
                <li>
                  <el-button type="primary" @click="handleAddPro" :disabled="isAddProject">
                    添加
                  </el-button>
                </li>
                <li>
                  <el-button @click="handleDelPro" class="ml-4" :disabled="!isAddProject || myceteForm.status != 0">
                    删除
                  </el-button>
                </li>
              </ul>
              <el-row :gutter="40">
                <!-- 细菌总数 -->
                <el-col :span="12" :offset="0">
                  <PlusForm
                    class="border rounded-[8px] pr-4 pt-4"
                    :disabled="isDetailDisable || germForm.status != 0"
                    ref="PlusGermFormRef"
                    :rules="germRules"
                    v-model="germForm"
                    labelWidth="120"
                    label-position="right"
                    :columns="germColumns"
                    :col-props="{
                      span: 12,
                    }"
                    :hasFooter="false"
                  >
                    <template #plus-field-test_temperature>
                      <el-input v-model="germForm.test_temperature" placeholder="温度检测">
                        <template #suffix>
                          <span>℃</span>
                        </template>
                        <template #prepend>
                          <el-select v-model="germForm.test_time_type" style="width: 74px">
                            <el-option
                              v-for="item in timeFrameOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            ></el-option>
                          </el-select>
                        </template>
                      </el-input>
                    </template>

                    <template #plus-field-inst_id>
                      <el-select
                        v-model="germForm.inst_id"
                        filterable
                        style="width: 100%"
                        @change="selectInstChange($event, 1)"
                      >
                        <el-option
                          v-for="item in instList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </template>
                  </PlusForm>
                </el-col>
                <!-- 霉菌酵母菌 -->
                <el-col :span="12" :offset="0">
                  <PlusForm
                    v-if="isAddProject"
                    class="border rounded-[8px] pr-4 pt-4"
                    :disabled="isDetailDisable || myceteForm.status != 0"
                    ref="PlusMyceteFormRef"
                    :rules="myceteRules"
                    v-model="myceteForm"
                    labelWidth="120"
                    label-position="right"
                    :columns="germColumns"
                    :col-props="{
                      span: 12,
                    }"
                    :hasFooter="false"
                  >
                    <template #plus-field-test_temperature>
                      <el-input v-model="myceteForm.test_temperature" placeholder="温度检测">
                        <template #suffix>
                          <span>℃</span>
                        </template>
                        <template #prepend>
                          <el-select v-model="myceteForm.test_time_type" style="width: 74px">
                            <el-option
                              v-for="item in timeFrameOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            ></el-option>
                          </el-select>
                        </template>
                      </el-input>
                    </template>

                    <template #plus-field-inst_id>
                      <el-select
                        v-model="myceteForm.inst_id"
                        filterable
                        style="width: 100%"
                        @change="selectInstChange($event, 2)"
                      >
                        <el-option
                          v-for="item in instList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </template>
                  </PlusForm>
                </el-col>
              </el-row>
            </div>
          </el-collapse-item>

          <el-collapse-item name="3" class="mt-2">
            <template #title>
              <p class="font-bold text-[14px]">附件信息</p>
            </template>
            <FileTable
              :fileList="fileData"
              :disabled="isDetailDisable"
              ref="fileTableRef"
            ></FileTable>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
      <el-tab-pane label="单据日志" name="second" v-if="isDetailDisable">
        <OrderLog :log-list="logList"></OrderLog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/quality/add.scss";
</style>

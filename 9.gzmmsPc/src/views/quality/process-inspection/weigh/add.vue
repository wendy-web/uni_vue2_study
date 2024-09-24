<script setup lang="ts">
import { type CollapseModelValue, type FormInstance, type TabPaneName } from "element-plus";
import type { FieldValues, PlusColumn } from "plus-pro-components";
import { useRoute, useRouter } from "vue-router";
// 引入空罐顶盖重量检测接口
import { getInfoApi } from "@/api/quality/process-inspection/weigh/index";
// 签名组件
import QualitySignDialog from "@/components/Device/SignDialog/index.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useSettingsStoreHook } from "@/store/modules/settings";
import { useTagsViewStore } from "@/store/modules/tagsView";
import FileTable from "./components/FileTable/index.vue";
import { useAdd } from "./utils/add";

/* 空罐顶盖重量检测编辑页 */
defineOptions({
  name: "ProcessInspectionWeighAdd",
});
enum ETitle {
  "新建空罐顶盖重量检测" = 1,
  "编辑空罐顶盖重量检测",
  "空罐顶盖重量检测详情",
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
  errorCountMap,
  resetErrorCountMap,
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
const activeNames = ref(["1", "2", "3"]);
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
    path: "/quality/process-inspection/sample",
  });
}
// 点击保存：1-保存，2-提交
async function handleSave(type = 1) {
  // console.log("点击保存formData.value: ", formData.value);
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
}
// 签字提交
async function handleSubmit() {
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

// 删除：暂存状态才可删除
async function handleDelete() {
  let data: any = {
    id: listId.value,
  };
}

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
};

async function getDetailData() {
  try {
    formLoading.value = true;
    const result = await getInfoApi({ id: listId.value });
    const res = result.data;
    formData.value.order_no = res.order_no;
    formData.value.supplier_id = res.supplier_id;
    formData.value.supplier_name = res.supplier_name;
    formData.value.check_date = res.check_date;
    formData.value.max_weight = res.max_weight;
    formData.value.min_weight = res.min_weight;
    formData.value.diff_weight = res.diff_weight;
    formData.value.avg_weight = res.avg_weight;
    formData.value.weight = res.weight;
    formData.value.remark = res.remark;

    formData.value.create_time = res.create_time;
    formData.value.ct_name = res.ct_name;
    formData.value.ct_uid = res.ct_uid;
    formData.value.dept_id = res.dept_id;
    formData.value.files = res.files;
    formData.value.up_name = res.up_name;
    formData.value.up_uid = res.up_uid;
    formData.value.update_time = res.update_time;
    formLoading.value = false;
  } catch (error) {
    formLoading.value = false;
  }
}

watch(
  () => errorCountMap.value,
  (newValue) => {
    // console.log("watch errorCountMap: ", errorCountMap.value);
    formData.value.abnormal = errorCountMap.value.size;
  },
  {
    immediate: true,
    deep: true,
  },
);
onActivated(() => {
  listId.value = Number(route.query.id) || 0;
  pageType.value = Number(route.query.pageType) || 1;
  assocType.value = [Number(route.query.assocType)];
  baseFormRef.value?.resetFields();
  formData.value.files = [];
  initTagsView();
  // 重置检验信息 不合格统计
  resetErrorCountMap();
  if (listId.value) {
    getDetailData();
    return;
  }
});
</script>
<template>
  <div class="app-container !pb-[40px]">
    <el-tabs v-model="activeName" @tab-change="tabChange">
      <el-tab-pane label="详情信息" name="first">
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
                :group="formColumns"
                :colProps="{ span: 6 }"
                :row-props="{ gutter: 10 }"
                :hasFooter="false"
                @change="handleFormChange"
                v-loading="formLoading"
              >
                <template #group-header="{ title, icon }">
                  <div class="custom-group-header">
                    <span class="font-bold">
                      {{ title }}
                    </span>
                  </div>
                </template>
                <template #plus-field-weight>
                  <div class="flex items-center w-100">
                    <div
                      class="flex flex-col justify-center items-center border-solid flex-shrink-0"
                    >
                      <div class="bg-[#ECF5FF] px-[20px] py-[10px]">序号</div>
                      <div class="bg-[#FFFFFF] px-[20px] py-[10px]">重量</div>
                    </div>
                    <div
                      class="flex flex-col justify-center items-center border-solid flex-shrink-0"
                      v-for="(item, index) in formData.weight"
                    >
                      <div class="bg-[#ECF5FF] px-[20px] py-[10px] self-stretch text-center" >{{ item.index }}</div>
                      <div class="bg-[#FFFFFF] px-[20px] py-[10px]">{{ item.vals }}</div>
                    </div>
                  </div>
                </template>
              </PlusForm>
            </div>
          </el-collapse-item>

          <!-- 附件信息 -->
          <!-- <el-collapse-item name="4" class="mt-2">
            <template #title>
              <p class="font-bold text-[14px]">附件信息</p>
            </template>
            <FileTable
              :fileList="formData.files"
              :disabled="editDisabled"
              :listId="listId"
              ref="fileTableRef"
              @update="getDetailData"
            ></FileTable>
          </el-collapse-item> -->
        </el-collapse>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/collapse.scss";
@import "@/styles/common.scss";
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
</style>

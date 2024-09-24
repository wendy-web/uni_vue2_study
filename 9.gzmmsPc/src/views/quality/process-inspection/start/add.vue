<script lang="ts">
import { perms } from "@/utils/auth";

export default {
  beforeRouteEnter(to, from, next) {
    let pageType = to.query.pageType ? Number(to.query.pageType) : 1;
    let permsRes = perms(["pi:start:execute"]);
    if (pageType === 2) {
      // 如果是编辑页查看是否拥有执行检测权限,没有则不让进入,防止通过url路径直接进入该页面
      if (permsRes) {
        next((vm) => {});
      } else {
        next({ name: from.name as any });
      }
    } else {
      next((vm) => {});
    }
  },
};
</script>
<script setup lang="ts">
/* 开机及CIP检测项目编辑页 */
import { useRoute, useRouter } from "vue-router";
import {
  powerConfirmDetailApi,
  powerConfirmFileAddApi,
  powerConfirmFileDelApi,
} from "@/api/quality/process-inspection/start";
import { useTagsViewStore } from "@/store/modules/tagsView";
import cipFileTableVue from "@/views/quality/components/CipFileTable/index.vue";
import checkinfoVue from "./components/checkinfo.vue";
import { useAdd } from "./utils/add";

defineOptions({
  name: "ProcessInspectionStartAdd",
});

enum ETitle {
  "新建开机确认单" = 1,
  "编辑开机确认单",
  "开机确认单详情",
}

const tagsViewStore = useTagsViewStore();
const router = useRouter();
const route = useRoute();

const { baseForm, baseColumns, fileData, pageType, isDetailDisable, getUserOptions } = useAdd();

const headerTitle = computed(() => {
  return ETitle[pageType.value];
});

const checkinfoRef = ref<InstanceType<typeof checkinfoVue>>();
/** 附件自定义组件的ref */
const fileTableRef = ref<InstanceType<typeof cipFileTableVue>>();
/** 折叠面板的数组 */
const activeNames = ref(["1", "2"]);

/** 用于记录编辑时,从列表传过来的id */
const listId = ref(0);
/** 获取详情数据时的加载状态 */
const detailLoading = ref(false);
/** 点击返回 */
function handleCancel() {
  router.replace({
    path: "/quality/process-inspection/start",
  });
}

async function getDetailData() {
  // detailLoading.value = true;
  const result = await powerConfirmDetailApi({
    id: listId.value,
  });
  const res = result.data;

  fileData.value = res.files;

  baseForm.value.order_no = res.order_no;
  baseForm.value.ct_name = res.ct_name;
  baseForm.value.create_time = res.create_time;
  baseForm.value.workshop_name = res.workshop_name;
  baseForm.value.line_name = res.line_name;
  baseForm.value.check_date = res.check_date;
  baseForm.value.pro_name = res.pro_name;
  baseForm.value.brand_text = res.brand_text;
  baseForm.value.check_ret = res.check_ret;
  baseForm.value.sku = res.sku;
  baseForm.value.ingredient_confirm_uid = res.ingredient_confirm_uid; //配料确认人id
  baseForm.value.product_manager_uid = res.product_manager_uid; //生产部主管uid
  baseForm.value.laboratory_manager_uid = res.laboratory_manager_uid; //化验室负责人id
  let signatureData = {
    pz_manager_signature: res.pz_manager_signature || "",
    product_manager_signature: res.product_manager_signature || "",
    product_manag_signature: res.product_manag_signature || "",
    laboratory_manager_signature: res.laboratory_manager_signature || "",
    ingredient_signature: res.ingredient_signature || "",
  };
  let userinfo = {
    product_manag_uid_name: res.product_manag_uid_name,
    pz_manager_uid_name: res.pz_manager_uid_name,
  };
  checkinfoRef.value!.setData(res.check_info, signatureData, userinfo);

  // detailLoading.value = false;
}

async function handleFileAdd(fileValues: { file_url: string; file_name: string; note: string }) {
  let data = {
    ...fileValues,
    oid: listId.value,
  };
  const result = await powerConfirmFileAddApi(data);
  ElMessage.success(result.msg);
  getDetailData();
}

async function handleFileDel(ids: number[]) {
  const result = await powerConfirmFileDelApi({ id: ids });
  ElMessage.success(result.msg);
  getDetailData();
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
  pageType.value = Number(route.query.pageType) || 2;
  initTagsView();
  if (listId.value) {
    getDetailData();
  }
  getUserOptions();
});
</script>
<template>
  <div class="app-container !pt-0" v-loading="detailLoading">
    <el-affix :offset="90" class="!w-full">
      <el-card shadow="always" :body-style="{ padding: '10px' }" class="w-full">
        <el-button type="" @click="handleCancel">返回</el-button>
        <!-- <el-button type="" @click="handleDel">删除</el-button> -->
      </el-card>
    </el-affix>

    <el-collapse v-model="activeNames" class="mt-2">
      <!-- 基础信息 -->
      <el-collapse-item name="1">
        <template #title>
          <p class="font-bold text-[14px]">基础信息</p>
        </template>
        <div class="px-8">
          <PlusForm
            :disabled="isDetailDisable"
            ref="PlusFormRef"
            v-model="baseForm"
            labelWidth="90"
            :columns="baseColumns"
            :row-props="{ gutter: 20 }"
            :col-props="{
              span: 6,
            }"
            :hasFooter="false"
          ></PlusForm>
        </div>
      </el-collapse-item>
      <!-- 检验信息 -->
      <el-collapse-item name="2" class="mt-2">
        <template #title>
          <p class="font-bold text-[14px]">检验信息</p>
        </template>
        <div class="px-8">
          <checkinfoVue
            ref="checkinfoRef"
            v-model="baseForm.check_ret"
            @refresh="getDetailData"
            :disabled="isDetailDisable"
          ></checkinfoVue>
        </div>
      </el-collapse-item>
      <el-collapse-item name="3" class="mt-2">
        <template #title>
          <p class="font-bold text-[14px]">附件信息</p>
        </template>
        <cipFileTableVue
          :fileList="fileData"
          :disabled="isDetailDisable"
          @file-add="handleFileAdd"
          @file-del="handleFileDel"
          :uploadBtnPerm="['pi:start:addfile']"
          :delBtnPerm="['pi:start:delfile']"
          ref="fileTableRef"
        ></cipFileTableVue>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/collapse.scss";
@import "@/styles/common.scss";
:deep(.el-tabs__header) {
  margin-bottom: 0;
  margin-top: 10px;
  padding-left: 10px;
  background-color: #fff;
}
</style>

<script setup lang="ts">
/* 新建CIP灌装间卫生检查表 */
import { useRoute, useRouter } from "vue-router";
import {
  onlineVerifyConfirmApi,
  onlineVerifyDelApi,
  onlineVerifyDetailApi,
  onlineVerifyReverseApi,
} from "@/api/quality/environment/online-verify";
import SignDialog from "@/components/Device/SignDialog/index.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useCommonHooks } from "@/hooks/quality";
import { useTagsViewStore } from "@/store/modules/tagsView";
import checkInfoVue from "@/views/quality/environment/components/checkOrder/checkInfo.vue";
import detailBtnVue from "@/views/quality/environment/components/checkOrder/detailBtn.vue";
import { useAdd } from "./utils/add";

defineOptions({
  name: "EnvironmentOnlineVerifyAdd",
});

enum ETitle {
  "新建在线检测设备验证表" = 1,
  "编辑在线检测设备验证表",
  "在线检测设备验证表详情",
}

const tagsViewStore = useTagsViewStore();
const router = useRouter();
const route = useRoute();
const status = ref(0);
const ct_uid = ref(NaN);

const { baseForm, baseColumns, pageType, isDetailDisable } = useAdd();

const headerTitle = computed(() => {
  return ETitle[pageType.value];
});

/** 检查信息组件的ref */
const checkInfoRef = ref<InstanceType<typeof checkInfoVue>>();

/** 折叠面板的数组 */
const activeNames = ref(["1", "2"]);
/** 用于记录编辑时,从列表传过来的id */
const listId = ref(0);
/** 获取详情数据时的加载状态 */
const detailLoading = ref(false);

/** 点击返回 */
function handleCancel() {
  router.replace({
    path: "/quality/environment/online-verify",
  });
}

/** 点击签字提交 */
const signDialogRef = ref();
async function handleSubmit() {
  if (status.value != 2) {
    ElMessage.warning("全部执行检查后才可签字提交");
    return;
  }
  addDialog({
    width: "70%",
    btnClass: "w-[100px]",
    draggable: true,
    closeOnClickModal: false,
    btnLoading: false,
    btnSize: "large",
    title: "签名",
    contentRenderer: () =>
      h(SignDialog, {
        ref: signDialogRef,
      }),
    beforeCancel: (done) => {
      done();
    },
    beforeSure: async (done) => {
      updateDialog(true, "btnLoading");
      const signRes = await signDialogRef.value.handleGenerate();
      console.log("signRes", signRes);
      try {
        const result = await onlineVerifyConfirmApi({ id: listId.value, sign: signRes });
        ElMessage.success(result.msg);
        updateDialog(false, "btnLoading");
        done();
        closeCurrentPage(result.msg);
      } catch (error) {
        updateDialog(false, "btnLoading");
      }
    },
  });
}

/** 点击反审核 */
function handleReverse() {
  ElMessageBox.confirm(`确认要反审核该单据吗?`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const result = await onlineVerifyReverseApi({ id: listId.value });
      ElMessage.success(result.msg);
      closeCurrentPage(result.msg);
    })
    .catch((error) => {
      console.log(error);
    });
}

/** 点击删除 */
function handleDel() {
  let { order_no } = baseForm.value;
  ElMessageBox.confirm(`确认要删除单据编号为：【${order_no}】的该条内容吗?`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定删除");
      const result = await onlineVerifyDelApi({ id: listId.value });
      ElMessage.success(result.msg);
      closeCurrentPage(result.msg);
    })
    .catch((error) => {
      console.log(error);
    });
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
      path: "/quality/environment/online-verify",
    });
    tagsViewStore.delView(currentTag);
  });
}

async function getDetailData() {
  detailLoading.value = true;
  const result = await onlineVerifyDetailApi({
    id: listId.value,
  });
  const res = result.data;

  ct_uid.value = res.ct_uid;
  status.value = res.status;

  baseForm.value.order_no = res.order_no;
  baseForm.value.ct_name = res.ct_name;
  baseForm.value.create_time = res.create_time;
  baseForm.value.line_name = res.line_name;
  baseForm.value.check_date = res.check_date;
  baseForm.value.class_name = res.class_name;
  baseForm.value.status_text = res.status_text ?? "";

  checkInfoRef.value?.setData(res.group, res.id);
  console.log("pageType.value", pageType.value);
  if (pageType.value === 3) {
    baseForm.value.sign = res.sign ?? "";
  }

  detailLoading.value = false;
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
});
</script>
<template>
  <div class="app-container pt-40" v-loading="detailLoading">
    <detailBtnVue
      :order-type="2"
      :status="status"
      :ctUid="ct_uid"
      :page-type="pageType"
      v-on="{
        cancel: handleCancel,
        submit: handleSubmit,
        reverse: handleReverse,
        delete: handleDel,
      }"
    ></detailBtnVue>
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
      <!-- 检验信息 -->
      <el-collapse-item name="2" class="mt-2">
        <template #title>
          <p class="font-bold text-[14px]">检验信息</p>
        </template>
        <div class="px-8">
          <checkInfoVue
            ref="checkInfoRef"
            @refresh="getDetailData"
            :disabled="isDetailDisable"
            :order-type="2"
          ></checkInfoVue>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/quality/add.scss";
</style>

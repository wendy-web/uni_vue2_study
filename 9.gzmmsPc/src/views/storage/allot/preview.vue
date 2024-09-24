<!-- 调拨单阅览页 -->
<script setup lang="ts">
// 引api
import { addRllotApi, editRllotApi, submitRllotApi } from "@/api/storage/allot";
import { IAllotAddInfo } from "@/api/storage/allot/types";
import { checkSaveHooks } from "@/hooks";
// 引入审批流程自定义组件
import ApproveFlow from "./components/ApproveFlow.vue";

export interface Props {
  preTableData: IAllotAddInfo;
}

const props = withDefaults(defineProps<Props>(), {
  preTableData: () => {
    return {} as IAllotAddInfo;
  },
});

const emit = defineEmits(["aboutPre"]);

const { saveId, checkSaveFn } = checkSaveHooks();

const loading = ref(false);
const loadingText = ref("");

// 点击返回列表
const handleList = () => {
  emit("aboutPre", 4);
};

// 点击上一步
const handleBack = () => {
  emit("aboutPre", 1);
};

// 点击保存
const handleSave = async () => {
  const checkResult = checkSaveFn(() => {
    emit("aboutPre", 2);
  });
  if (!checkResult) return;

  let { id } = props.preTableData;
  let data = getQueryData();
  if (id) {
    // id存在 表示是编辑
    try {
      loadingText.value = "正在保存中...";
      loading.value = true;
      const result = await editRllotApi(data);
      ElMessage.success(result.msg);
      emit("aboutPre", 2);
    } finally {
      loading.value = false;
    }
  } else {
    // id不存在是新建
    try {
      loadingText.value = "正在保存中...";
      loading.value = true;
      const result = await addRllotApi(data);
      ElMessage.success(result.msg);
      emit("aboutPre", 2);
    } finally {
      loading.value = false;
    }
  }
};

function getQueryData() {
  let {
    id,
    goods,
    file_info,
    note,
    out_wh_id,
    out_wh_name,
    to_wh_id,
    to_wh_name,
    in_time,
    out_time,
  } = props.preTableData;

  if (id) {
    // id存在 表示是编辑
    return {
      id,
      note,
      file_info,
      out_wh_id,
      out_wh_name,
      to_wh_id,
      to_wh_name,
      goods: goods,
      in_time,
      out_time,
    };
  } else {
    // id不存在是新建
    return {
      note,
      file_info,
      goods: goods,
      out_wh_id,
      out_wh_name,
      to_wh_id,
      to_wh_name,
      in_time,
      out_time,
    };
  }
}

// 调用新建保存api
const sendAddData = async () => {
  let data = getQueryData();
  try {
    const result = await addRllotApi(data);
    return result.data.id;
  } catch (error) {
    console.log(error);
  }
};
// 调用编辑保存api
const sendEditData = async () => {
  let data = getQueryData();
  try {
    const result = await editRllotApi(data);
    return result.data.id;
  } catch (error) {
    console.log(error);
  }
};

// 点击提交审核
const handleSubmit = async () => {
  const checkResult = checkSaveFn(() => {
    emit("aboutPre", 2);
  });
  if (!checkResult) return;

  // 这里提交审核需要先保存
  let { id } = props.preTableData;

  if (id) {
    // id存在 表示是编辑
    try {
      loadingText.value = "正在提审中...";
      loading.value = true;
      let id = await sendEditData();
      saveId.value = id;
      const result = await submitRllotApi({ id });
      ElMessage.success(result.msg);
      emit("aboutPre", 2);
    } finally {
      loading.value = false;
    }
  } else {
    // id不存在是新建
    try {
      loadingText.value = "正在提审中...";
      loading.value = true;
      let id = await sendAddData();
      saveId.value = id;
      const result = await submitRllotApi({ id });
      ElMessage.success(result.msg);
      emit("aboutPre", 2);
    } catch (error) {
      loading.value = false;
    }
  }
};
</script>
<template>
  <div class="app-container" v-loading="loading" :element-loading-text="loadingText">
    <div class="app-card">
      <div class="header-title">调拨预览</div>
      <div class="mb-[20px] text-[14px] flex items-center">
        <div class="mr-[20px]">
          <span>调出仓库：</span>
          <span class="font-bold">{{ preTableData.out_wh_name }}</span>
        </div>
        <span class="inline-block text-[14px] mr-[20px]">
          调出日期：{{ preTableData.out_time }}
        </span>
        <div class="mr-[20px]">
          <span>调入仓库：</span>
          <span class="font-bold">{{ preTableData.to_wh_name }}</span>
        </div>
        <span class="inline-block text-[14px] mr-[20px]">调入日期：{{ preTableData.in_time }}</span>
      </div>
      <el-table :data="preTableData.goods" border stripe height="700" scrollbar-always-on>
        <el-table-column label="#" type="index" />
        <el-table-column label="条码" prop="barcode" />
        <el-table-column label="名称" prop="title" />
        <el-table-column label="规格型号" prop="spec" />
        <el-table-column label="品牌" prop="brand" />
        <el-table-column label="分类" prop="class_name" />
        <el-table-column label="批次/日期" prop="ph_no" />
        <el-table-column label="单位" prop="measure_name" />
        <el-table-column label="调拨数量" prop="rec_num" />
        <el-table-column label="库位" prop="ws_code" />
        <el-table-column label="单价" prop="price" />
        <el-table-column label="入库日期" prop="in_wh_date" />
        <el-table-column label="备注" prop="note" />
      </el-table>
      <div class="mt-[20px]">
        <div>
          <span>备注: {{ preTableData.note || "无" }}</span>
        </div>
        <div>
          <span>附件: {{ preTableData.file_info.name || "无" }}</span>
        </div>
      </div>
      <div class="footer-btn mt-[20px]">
        <el-divider />
        <el-button @click="handleList" class="w-[100px]" size="large">返回列表页</el-button>
        <el-button @click="handleBack" type="primary" plain class="w-[100px]" size="large">
          上一步
        </el-button>
        <el-button type="primary" @click="handleSave" class="w-[100px]" size="large">
          保存
        </el-button>
        <el-button type="primary" plain @click="handleSubmit" class="w-[100px]" size="large">
          提交审核
        </el-button>
      </div>
      <div class="mt-[20px]">
        <el-divider />
        <!-- 流程组件 -->
        <ApproveFlow
          :id="preTableData.id"
          :type="2"
          :outWhId="preTableData.out_wh_id"
          :toWhId="preTableData.to_wh_id"
        ></ApproveFlow>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>

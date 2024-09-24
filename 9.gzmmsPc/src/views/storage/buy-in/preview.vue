<script setup lang="ts">
// 采购入库单预览页
// 引入创建和编辑的api
import { addBuyInApi, editBuyInApi, submitBuyInApi } from "@/api/storage/buy-in";
import { IBuyInAddInfo } from "@/api/storage/buy-in/types";
// 引入审批流程自定义组件
import ApproveFlowGlobal from "@/components/ApproveLog/ApproveFlowGlobal.vue";
import { checkSaveHooks } from "@/hooks";

export interface Props {
  preTableData: IBuyInAddInfo;
}

const props = withDefaults(defineProps<Props>(), {
  preTableData: () => {
    return {} as IBuyInAddInfo;
  },
});

const { saveId, checkSaveFn } = checkSaveHooks();

const emit = defineEmits(["aboutPre"]);

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
  console.log("data", data);
  if (id) {
    // id存在 表示是编辑
    try {
      loadingText.value = "正在保存中...";
      loading.value = true;
      const result = await editBuyInApi(data);
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
      const result = await addBuyInApi(data);
      ElMessage.success(result.msg);
      emit("aboutPre", 2);
    } finally {
      loading.value = false;
    }
  }
};

function getQueryData() {
  let { id, goods, file_info, note, in_time, in_wh_id, in_wh_name } = props.preTableData;
  let list = goods.map((item) => {
    let { old_in_num, isSelect, dept_name, ...rest } = item;
    return {
      ...rest,
    };
  });
  if (id) {
    // id存在 表示是编辑
    return {
      id,
      note,
      file_info,
      // goods,
      goods: list,
      in_time,
      in_wh_id,
      in_wh_name,
    };
  } else {
    // id不存在是新建
    return {
      note,
      file_info,
      // goods,
      goods: list,
      in_time,
      in_wh_id,
      in_wh_name,
    };
  }
}

// 调用新建保存api
const sendAddData = async () => {
  let data = getQueryData();
  const result = await addBuyInApi(data);
  return result.data.id;
};
// 调用编辑保存api
const sendEditData = async () => {
  let data = getQueryData();
  const result = await editBuyInApi(data);
  return result.data.id;
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
      const result = await submitBuyInApi({ id });
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
      const result = await submitBuyInApi({ id });
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
    <div class="header-title">其他入库单预览</div>
    <div class="app-card">
      <div class="mb-[20px]">
        <span class="inline-block text-[14px] mr-[20px]" v-if="preTableData.procure_no">
          采购单号:{{ preTableData.procure_no }}
        </span>
        <span class="inline-block text-[14px] mr-[20px]">入库日期:{{ preTableData.in_time }}</span>
        <span class="inline-block text-[14px] mr-[20px]" v-if="preTableData.in_wh_name">
          入库仓库:{{ preTableData.in_wh_name }}
        </span>
      </div>
      <el-table
        :data="preTableData.goods"
        border
        stripe
        :cell-style="{ 'text-align': 'center' }"
        :header-cell-style="{ 'text-align': 'center' }"
        height="700"
        scrollbar-always-on
      >
        <el-table-column type="index" label="#" />
        <el-table-column label="条码" prop="barcode" />
        <el-table-column label="名称" prop="title" />
        <el-table-column label="规格型号" prop="spec" />
        <el-table-column label="品牌" prop="brand" />
        <el-table-column label="待入数量" prop="old_in_num" v-if="preTableData.radio != 2" />
        <el-table-column label="入库数量" prop="in_num" />
        <!-- <el-table-column label="入库仓库" prop="warehouse_name" /> -->
        <el-table-column label="供应商" prop="sup_name" />
        <el-table-column label="需求部门" prop="dept_name" v-if="preTableData.radio != 2" />
        <el-table-column label="单位" prop="measure_name" />
        <el-table-column label="单价(元)" prop="price" />
        <el-table-column label="库位" prop="ws_code" />
        <el-table-column label="分类" prop="class_name" />
        <el-table-column label="批次/日期" prop="ph_no" />
        <el-table-column label="生产日期" prop="pro_time" />
        <el-table-column label="保质期(天)" prop="exp_day" />
        <el-table-column label="到期日期" prop="exp_time" />
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
        <ApproveFlowGlobal
          :id="preTableData.id"
          :orderType="2"
          :pageType="2"
          :wh-id="preTableData.in_wh_id"
        ></ApproveFlowGlobal>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>

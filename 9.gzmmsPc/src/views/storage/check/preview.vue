<!-- 盘点单预览页 -->
<template>
  <div class="app-container" v-loading="loading" :element-loading-text="loadingText">
    <div class="app-card">
      <div class="header-title">盘点预览</div>
      <div class="flex mb-[10px]">
        <div class="text-[14px] mr-[20px]">
          <span>盘点仓库：</span>
          <span class="font-bold">{{ preTableData.warehouse_name }}</span>
        </div>
        <div class="text-[14px]">
          <span>盘点日期：</span>
          <span class="font-bold">{{ preTableData.inventory_time }}</span>
        </div>
      </div>

      <el-table :data="preTableData.goods" border stripe height="900" scrollbar-always-on>
        <el-table-column label="#" type="index" />
        <el-table-column label="条码" prop="barcode" />
        <el-table-column label="名称" prop="title" />
        <el-table-column label="规格型号" prop="spec" />
        <el-table-column label="批次/日期" prop="ph_no" />
        <el-table-column label="单位" prop="measure_name" />
        <el-table-column label="品牌" prop="brand" />
        <el-table-column label="盘点前数量" prop="in_num" />
        <el-table-column label="盘点后数量" prop="inv_num" />
        <el-table-column label="盘盈盘亏" prop="total_num">
          <template #default="{ row }">
            <span
              :class="[{ 'text-green-500': row.diff_num > 0, 'text-red-500': row.diff_num < 0 }]"
            >
              {{ row.diff_num }}
            </span>
          </template>
        </el-table-column>
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
      <div class="footer-btn mt-[20px] pb-[10px]">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Action } from "element-plus";
// 引入创建和编辑的api
import { addCheckApi, editCheckApi, submitCheckApi } from "@/api/storage/check";
import { ICheckAddInfo } from "@/api/storage/check/types";
import { checkSaveHooks } from "@/hooks";

export interface Props {
  preTableData: ICheckAddInfo;
}

const props = withDefaults(defineProps<Props>(), {
  preTableData: () => {
    return {} as ICheckAddInfo;
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

  if (id) {
    // id存在 表示是编辑
    try {
      loadingText.value = "正在保存中...";
      loading.value = true;
      const result = await editCheckApi(data);
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
      const result = await addCheckApi(data);
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
    warehouse_id,
    warehouse_name,
    inventory_time,
    surplus_num,
    shortage_num,
  } = props.preTableData;

  if (id) {
    // id存在 表示是编辑
    return {
      id,
      note,
      file_info,
      goods,
      warehouse_id,
      warehouse_name,
      inventory_time,
      surplus_num,
      shortage_num,
    };
  } else {
    // id不存在是新建
    return {
      note,
      file_info,
      goods,
      warehouse_id,
      warehouse_name,
      inventory_time,
      surplus_num,
      shortage_num,
    };
  }
}

// 调用新建保存api
const sendAddData = async () => {
  let data = getQueryData();
  const result = await addCheckApi(data);
  return result.data.id;
};
// 调用编辑保存api
const sendEditData = async () => {
  let data = getQueryData();
  const result = await editCheckApi(data);
  return result.data.id;
};

// 点击提交审核
const handleSubmit = async () => {
  const checkResult = checkSaveFn(() => {
    emit("aboutPre", 2);
  });
  if (!checkResult) return;
  console.log(props.preTableData.goods);

  // ElMessageBox.confirm("是否需要更新库存?", "提示", {
  //   distinguishCancelAndClose: true,
  //   confirmButtonText: "需要",
  //   cancelButtonText: "不需要",
  //   type: "warning",
  // })
  //   .then(() => {
  //     console.log("需要");
  //     sendSubmit(1);
  //   })
  //   .catch((action: Action) => {
  //     if (action === "close") return;
  //     console.log("不需要");
  //     sendSubmit(2);
  //   });

  /* 暂时不需要弹窗确认是否需要更新库存,默认不需要更新库存 */
  sendSubmit(2);
};

const sendSubmit = async (up_inv: number) => {
  // 这里提交审核需要先保存
  let { id } = props.preTableData;
  if (id) {
    // id存在 表示是编辑
    try {
      loadingText.value = "正在提审中...";
      loading.value = true;
      let id = await sendEditData();
      saveId.value = id;
      const result = await submitCheckApi({ id, up_inv });
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
      const result = await submitCheckApi({ id, up_inv });
      ElMessage.success(result.msg);
      emit("aboutPre", 2);
    } catch (error) {
      loading.value = false;
    }
  }
};
</script>

<style scoped lang="scss"></style>

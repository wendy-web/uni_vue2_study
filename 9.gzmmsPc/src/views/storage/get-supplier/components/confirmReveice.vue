<script setup lang="ts">
/* 本组件为确认领料弹窗页面 */
// 引入确认领取api
import { confirmReceiveApi } from "@/api/storage/get-supplier";

//
interface Props {
  visible: boolean;
  data: any[];
  listId: number;
}
const props = withDefaults(defineProps<Props>(), {
  visible: false,
  data: () => [],
  listId: 0,
});

let emits = defineEmits(["update:visible", "confirmReceive"]);
const visibleDialog = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emits("update:visible", false);
  },
});
/** 记录领料是否成功 */
const receiveStatus = ref(false);
/** 记录领料按钮是否loading */
const btnLoading = ref(false);

// 点击确认领取
const tapConfirm = async () => {
  let goods = props.data.map((item) => {
    return {
      id: item.id,
      receiv_num: item.this_wait_received_num,
      goods_id: item.goods_id,
      goods_all_id: item.goods_all_id,
    };
  });
  let data = {
    id: props.listId,
    goods,
  };
  try {
    btnLoading.value = true;
    const result = await confirmReceiveApi({ id: props.listId, goods });
    ElMessage.success(result.msg);
    receiveStatus.value = true;
    emits("confirmReceive");
  } finally {
    btnLoading.value = false;
  }
};
</script>

<template>
  <div>
    <el-dialog v-model="visibleDialog" title="发料领取确认" width="60%" draggable top="30vh">
      <div class="mb-[20px] flex" v-if="receiveStatus">
        <i-ep-CircleCheck class="text-green-500 text-2xl mr-[10px]"></i-ep-CircleCheck>
        <span class="text-lg">领取成功</span>
      </div>
      <el-table
        :data="data"
        border
        stripe
        header-cell-class-name="table-row-header"
        :cell-style="{ 'text-align': 'center' }"
        :header-cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column label="条码" prop="barcode" min-width="100"></el-table-column>
        <el-table-column label="名称" prop="title" min-width="100"></el-table-column>
        <el-table-column label="规格型号" prop="spec" min-width="90"></el-table-column>
        <el-table-column label="批次/日期" prop="ph_no" min-width="90"></el-table-column>
        <el-table-column label="单位" prop="measure_name"></el-table-column>
        <el-table-column label="出库仓库" prop="warehouse_name" min-width="90"></el-table-column>
        <el-table-column label="使用地点" prop="use_places" min-width="90"></el-table-column>
        <el-table-column label="申请数量" prop="rec_num" min-width="90"></el-table-column>
        <el-table-column label="已领数量" prop="received_num" min-width="90"></el-table-column>
        <el-table-column label="本次领料" prop="this_wait_received_num" min-width="90">
          <template #default="{ row, $index }">
            <span class="text-lg text-orange-500 font-bold">{{ row.this_wait_received_num }}</span>
          </template>
        </el-table-column>
        <el-table-column label="入库日期" prop="in_wh_date" min-width="90" />
        <el-table-column label="库位" prop="ws_code" min-width="90" />
        <el-table-column label="生产日期" prop="pro_time" min-width="90" />
        <el-table-column label="到期日期" prop="exp_time" min-width="90" />
        <el-table-column label="发料状态" prop="rec_num" min-width="90">
          <template #default="{ row, $index }">
            <span v-if="row.issuance_status == 1">部分发料</span>
            <span v-else-if="row.issuance_status == 2">全部发料</span>
            <span v-else>待发料</span>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <span class="flex justify-center mt-10">
          <el-button
            @click="visibleDialog = false"
            size="large"
            class="w-[100px]"
            v-if="receiveStatus"
          >
            关闭
          </el-button>
          <el-button type="primary" @click="tapConfirm" size="large" :loading="btnLoading" v-else>
            确认领取
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss"></style>

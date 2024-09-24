<script setup lang="ts">
/* 本组件为: 领取确认状态弹窗组件 废弃? */
// 引入人员列表类型
import type { IUserItem } from "@/api/system/types";
import { getLabel } from "../utils/hook";
// 引入api
// import { getReceiveStatusApi, confirmReceiveApi } from "@/api/storage/get-supplier/index";

/** 领取确认弹窗组件的props类型  */
export interface ReceiveStatusProps {
  visible: boolean;
  order_id: number;
  userList: IUserItem[];
  assoc_type: number;
}

const props = withDefaults(defineProps<ReceiveStatusProps>(), {
  visible: false,
});

const formData = ref({
  wh_rec_no: "", //单号`
  ar_uid: [] as number[],
  status: 0,
  receiver_confirm_status: 0,
  act_confirm_log: [] as any[],
});
/** 人员列表 */
const list = ref(props.userList);
/** 订单id */
const id = ref(props.order_id);
/* loading状态 */
const dialogLoading = ref(false);

let emits = defineEmits(["update:visible", "refreshList"]);

let visibleDialog = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emits("update:visible", false);
  },
});

const refreshStatus = () => {
  getData();
};

async function getData() {
  if (!id.value) return;
  // // if (!props.order_id) return;
  // dialogLoading.value = true;
  // const result = await getReceiveStatusApi({ id: id.value });
  // // const result = await getReceiveStatusApi({ id: props.order_id });

  // dialogLoading.value = false;
  // // console.log("🚀 ~ file: receiveStatus.vue:50 ~ getData ~ result:", result);
  // formData.value = result.data;
  // formData.value.ar_uid = formData.value.ar_uid
  //   ? formData.value.ar_uid.map((item) => Number(item))
  //   : [];
}

// 点击确认领取
const confirmReceive = async () => {
  // const result = await confirmReceiveApi({ id: props.id });
  // const result = await confirmReceiveApi({ id: id.value });
  // ElMessage.success(result.msg);
  // visibleDialog.value = false;
  emits("refreshList");
};

watch(
  () => props.userList,
  (newValue) => {
    list.value = newValue;
  },
);
// watch(
//   () => props.visible,
//   (newValue) => {
//     if (newValue) getData();
//   },
// );

watch(
  () => props.order_id,
  (newValue) => {
    // console.log("🚀 ~ file: receiveStatus.vue:63 ~ newValue:", newValue);
    id.value = newValue;
    getData();
  },
);
</script>
<template>
  <el-dialog
    class="dialog-wrapper"
    title="领取确认状态"
    v-model="visibleDialog"
    width="40%"
    top="30vh"
    draggable
  >
    <el-form :model="formData" label-width="110" label-position="left" v-loading="dialogLoading">
      <el-form-item label="领料出库单号：">
        <span>{{ formData.wh_rec_no }}</span>
      </el-form-item>
      <el-form-item label="指定领取人：">
        <el-select
          v-model="formData.ar_uid"
          value-key="id"
          placeholder="请指定领取人"
          multiple
          style="width: 60%"
          disabled
        >
          <el-option
            v-for="item in userList"
            :key="item.id"
            :label="getLabel(item.name, item.dept_name)"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="确认状态：">
        <el-button type="primary" v-if="formData.receiver_confirm_status">已确认</el-button>
        <el-button type="primary" plain v-else>待确认</el-button>
      </el-form-item>
      <el-table :data="formData.act_confirm_log" border stripe>
        <el-table-column prop="ct_name" label="操作人"></el-table-column>
        <el-table-column prop="act" label="操作类型"></el-table-column>
        <el-table-column prop="create_time" label="时间"></el-table-column>
      </el-table>
    </el-form>
    <template #footer>
      <span>
        <el-button
          type="primary"
          plain
          size="large"
          class="w-[100px]"
          @click="refreshStatus"
          v-deBounce
          v-if="!formData.receiver_confirm_status"
        >
          刷新状态
        </el-button>
        <el-button @click="visibleDialog = false" size="large" class="w-[100px]">关闭</el-button>
        <el-button
          @click="confirmReceive"
          type="primary"
          size="large"
          class="w-[100px]"
          v-if="assoc_type == 8 && formData.status == 8"
        >
          确认领取
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped>
:deep(.el-form-item__label) {
  font-weight: 700;
}
</style>

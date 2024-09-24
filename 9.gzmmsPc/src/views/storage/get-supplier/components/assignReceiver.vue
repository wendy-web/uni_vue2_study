<script setup lang="ts">
/* 本组件为: 指定领取人弹窗组件 */
// 引入人员列表类型
import type { FormInstance } from "element-plus";
// 引入api
import { editReceiverApi } from "@/api/storage/get-supplier/index";
import type { IUserItem } from "@/api/system/types";
import { getLabel } from "../utils/hook";

/** 指定领取人弹窗Props */
export interface AssignReceiveProps {
  visible: boolean;
  assignInfo: {
    wh_rec_no: string;
    assign_name: number[];
    status: number;
    ct_uid: number;
    // receive_status: number;
    is_part_issue: number;
    order_id: number;
  };
  userList: IUserItem[];
}

const props = withDefaults(defineProps<AssignReceiveProps>(), {
  visible: false,
});

const formData = ref(props.assignInfo);
const formRef = ref<FormInstance>();
// const list = ref(props.userList);
const is_part = ref(props.assignInfo.is_part_issue);

let emits = defineEmits(["update:visible", "refreshList"]);

let visibleDialog = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emits("update:visible", false);
  },
});
// async function getData() {
//   const result = await getUserListApi();
//   userList.value = result.data.list;
//   console.log("userList.value", userList.value);
// }

const confirmEdit = () => {
  console.log("点击确认修改");
  formRef.value?.validate(async (valid, fields) => {
    if (valid) {
      let { order_id: id, assign_name } = formData.value;
      let receiver = assign_name.join(",");
      const result = await editReceiverApi({ id, receiver });
      ElMessage.success(result.msg);
      visibleDialog.value = false;
      emits("refreshList");
    }
  });
};

const isDisabled = computed(() => {
  console.log(
    "🚀 ~ file: assignReceiver.vue:62 ~ isDisabled ~ formData.value.is_part_issue:",
    formData.value.is_part_issue,
  );
  let is_dis = Boolean(is_part.value);

  return is_dis;
});

const uid = computed(() => {
  let ct_uid = formData.value.ct_uid;
  return ct_uid;
});

// onMounted(() => {
//   getData();
// });
// watch(
//   () => props.userList,
//   (newValue) => {
//     list.value = newValue;
//   },
// );
watch(
  () => props.assignInfo.order_id,
  (newValue) => {
    nextTick(() => {
      formData.value = props.assignInfo;
    });
  },
);
watch(
  () => props.assignInfo.is_part_issue,
  (newValue) => {
    is_part.value = newValue;
  },
);
</script>
<template>
  <el-dialog
    class="dialog-wrapper"
    title="指定领取人"
    v-model="visibleDialog"
    width="40%"
    top="30vh"
    draggable
  >
    <el-form :model="formData" ref="formRef" label-width="110" label-position="left">
      <el-form-item label="领料出库单号：">
        <span>{{ formData.wh_rec_no }}</span>
      </el-form-item>
      <!--   -->
      <el-form-item
        label="指定领取人："
        :rules="[{ required: true, message: '请选择领取人', trigger: 'change' }]"
        prop="assign_name"
      >
        <el-select
          v-model="formData.assign_name"
          value-key="id"
          placeholder="请指定领取人"
          multiple
          style="width: 60%"
          :disabled="isDisabled"
        >
          <!-- <el-option
            v-for="item in userList"
            :key="item.id"
            :label="`${item.name}【${item.dept_name}】`"
            :value="item.id"
          ></el-option> -->
          <el-option
            v-for="item in userList"
            :key="item.id"
            :label="getLabel(item.name, item.dept_name)"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="确认状态：">
        <el-button type="primary" v-if="isDisabled">已确认</el-button>
        <el-button type="primary" plain v-else>待确认</el-button>
      </el-form-item> -->
    </el-form>
    <template #footer>
      <span>
        <el-button @click="visibleDialog = false" size="large" class="w-[100px]">关闭</el-button>
        <el-button
          @click="confirmEdit()"
          type="primary"
          size="large"
          class="w-[100px]"
          v-if="!isDisabled"
        >
          确定
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

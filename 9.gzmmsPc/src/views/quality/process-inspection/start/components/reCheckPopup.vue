<script setup lang="ts">
import type { FormInstance } from "element-plus";
import SignDialog from "@/components/Device/SignDialog/index.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useselectData } from "@/hooks/quality/selectData";
import { useSettingsStoreHook } from "@/store/modules/settings";

type InfoType = {
  name: string;
  content: string;
  value: string;
  recheck_values: string;
  val_type: number;
};

interface props {
  info: InfoType;
}
const useSetting = useSettingsStoreHook();
const { passList } = useselectData();
const props = withDefaults(defineProps<props>(), {
  list: () => [],
  info: () => ({
    name: "",
    content: "",
    value: "",
    recheck_values:"",
    val_type: 0,
  }),
});

const formRef = ref<FormInstance>();
const check_info = ref({ ...props.info, check_sign: "" });

const rules = {
  value: [{ required: true, message: "请输入测定值" }],
  check_sign: [{ required: true, message: "请签名" }],
};

const validateExecute = async () => {
  const validateRes = await formRef.value!.validate();
  return validateRes;
};

/** 点击签名 */
const signDialogRef = ref();
function clickSign() {
  addDialog({
    width: "60%",
    btnClass: "w-[80px]",
    draggable: true,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    btnLoading: false,
    showClose: false,
    title: "签名确认",
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
      check_info.value.check_sign = result;
      updateDialog(false, "btnLoading");
      done();
    },
  });
}

defineExpose({
  validateExecute,
  check_info,
});
</script>
<template>
  <div class="check-popup">
    <el-form :model="check_info" ref="formRef" :rules="rules">
      <table>
        <colgroup>
          <col style="width: 200px" />
          <col style="width: 100px" />
          <col style="width: 100px" />
        </colgroup>
        <tr>
          <td>检测项目</td>
          <td colspan="2">内容</td>
          <td>第一次</td>
          <td>复检</td>
        </tr>
        <tr>
          <td>{{ check_info.name }}</td>
          <td colspan="2">{{ check_info.content }}</td>
          <td>
            <!-- 第一次 -->
            <el-form-item prop="value">
              <CommonSelect
                v-model="check_info.value"
                :list="passList"
                v-if="check_info.val_type == 1"
              ></CommonSelect>
              <el-input v-model="check_info.value" placeholder="请输入" v-else></el-input>
            </el-form-item>
          </td>
          <td>
            <!-- 复检 -->
            <el-form-item prop="value">
              <CommonSelect
                v-model="check_info.recheck_values"
                :list="passList"
                v-if="check_info.val_type == 1"
              ></CommonSelect>
              <el-input v-model="check_info.recheck_values" placeholder="请输入" v-else></el-input>
            </el-form-item>
          </td>
        </tr>
      </table>
      <div class="mt-8 flex">
        <div>
          <p class="mb-4">执行人签名</p>
          <el-button type="primary" @click="clickSign">点击签名</el-button>
          <el-form-item prop="check_sign">
            <el-input v-model="check_info.check_sign" v-show="false"></el-input>
          </el-form-item>
        </div>
        <el-image
          :src="useSetting.baseHttp + check_info.check_sign"
          v-if="check_info.check_sign"
          style="width: 200px; height: 200px"
        ></el-image>
      </div>
    </el-form>
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/table.scss";
</style>

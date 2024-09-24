<script setup lang="ts">
import type { FormInstance } from "element-plus";
import SignDialog from "@/components/Device/SignDialog/index.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useSettingsStoreHook } from "@/store/modules/settings";

const useSetting = useSettingsStoreHook();

type InfoType = {
  name: string;
  content: string;
  pm05: {
    avg: string;
    vals: string;
    index: number;
  };
  pm5: {
    avg: string;
    vals: string;
    index: number;
  };
};

interface props {
  info: InfoType;
}

const props = withDefaults(defineProps<props>(), {
  info: () => ({
    name: "",
    content: "",
    pm05: { avg: "", vals: "", index: -1 },
    pm5: { avg: "", vals: "", index: -1 },
  }),
});

const formRef = ref<FormInstance>();
const check_info = ref({ ...props.info, check_sign: "" });

const rules = {
  avg: [{ required: true, message: "请输入均值" }],
  vals: [{ required: true, message: "请输入限值" }],
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
      <div>
        <p class="font-bold mb-4">检验信息</p>
        <table>
          <colgroup>
            <col style="width: 200px" />
            <col style="width: 100px" />
            <col style="width: 100px" />
          </colgroup>
          <tr>
            <td>检测项目</td>
            <td colspan="2">内容</td>
            <td>测定值</td>
          </tr>

          <tr>
            <td rowspan="2">{{ check_info.name }}</td>
            <td rowspan="2">{{ check_info.content }}</td>
            <td>≥0.5um</td>
            <td>
              <div class="flex my-2">
                <span class="flex-shrink-0 mt-1">均值:</span>
                <el-form-item prop="pm05.avg" style="width: 100%" :rules="rules.avg">
                  <el-input
                    class="flex-1 ml-2"
                    v-model="check_info.pm05.avg"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
              </div>
              <div class="flex my-2">
                <span class="flex-shrink-0 mt-1">限值:</span>
                <el-form-item prop="pm05.vals" style="width: 100%" :rules="rules.vals">
                  <el-input
                    class="flex-1 ml-2"
                    v-model="check_info.pm05.vals"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
              </div>
            </td>
          </tr>
          <tr>
            <td>≥5um</td>
            <td>
              <div class="flex my-2">
                <span class="flex-shrink-0 mt-1">均值:</span>
                <el-form-item prop="pm5.avg" style="width: 100%" :rules="rules.avg">
                  <el-input
                    class="flex-1 ml-2"
                    v-model="check_info.pm5.avg"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
              </div>
              <div class="flex my-2">
                <span class="flex-shrink-0 mt-1">限值:</span>
                <el-form-item prop="pm5.vals" style="width: 100%" :rules="rules.vals">
                  <el-input
                    class="flex-1 ml-2"
                    v-model="check_info.pm5.vals"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
              </div>
            </td>
          </tr>
        </table>
      </div>
      <div class="mt-8 flex">
        <div>
          <p class="mb-4 font-bold">执行人签名</p>
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

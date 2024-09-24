<template>
  <el-dialog v-model="dialogVisible" title="执行检测" width="1000">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="检验信息" prop="values">
        <table class="shops-table" v-if="_type !== 'cip'">
          <tr>
            <th>检测项目</th>
            <th>内容</th>
            <th>测定值</th>
          </tr>
          <tr>
            <td>{{ _typeName }}</td>
            <td>
              <span>{{ tableData.name }}</span>
              <span v-if="tableData.val_type == '2'">{{ tableData.base_val.strval }}</span>
            </td>
            <td>
              <MeasurementTool :config="tableData" />
            </td>
          </tr>
        </table>
        <table class="shops-table" v-else>
          <tr>
            <th>检测项目</th>
            <th colspan="2">内容</th>
            <th>测定值</th>
          </tr>
          <tr>
            <td rowspan="2">{{ tableData.name }}</td>
            <td rowspan="2">{{ tableData.child_name }}</td>
            <td>≥0.5um</td>
            <td>
              <div style="display: flex; align-items: center">
                <span>均值：</span>
                <MeasurementTool :config="pm05" keyType="avg" />
                <span style="margin-left: 10px">限值：</span>
                <MeasurementTool :config="pm05" keyType="vals" />
              </div>
            </td>
          </tr>
          <tr>
            <td>≥5um</td>
            <td>
              <div style="display: flex; align-items: center">
                <span>均值：</span>
                <MeasurementTool :config="pm5" keyType="avg" />
                <span style="margin-left: 10px">限值：</span>
                <MeasurementTool :config="pm5" keyType="vals" />
              </div>
            </td>
          </tr>
        </table>
      </el-form-item>
      <el-form-item label="执行人签名" prop="check_sign">
        <el-image
          v-if="form.check_sign"
          :src="form.check_sign"
          fit="fill"
          :lazy="true"
          :preview-src-list="[form.check_sign]"
          :preview-teleported="true"
          :z-index="10000"
        ></el-image>
        <el-button type="primary" link @click="handleSign">
          {{ form.check_sign ? "重新签名" : "点击签名" }}
        </el-button>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="tsx" setup>
import { computed, ref } from "vue";
import { updateChecKRet } from "@/api/quality/process-inspection/stop/index";
import SignDialog from "@/components/Device/SignDialog/index.vue";
import { addDialog } from "@/components/ReDialog";

const dialogVisible = ref(false);
const form = ref<any>({
  check_sign: "",
});

const valuesValid = (rule: any, value: any, callback: any) => {
  if (_type.value !== "cip" && tableData.value.values === "") {
    return callback(new Error("请选择或输入测定值"));
  }
  if (_type.value === "cip") {
    if (pm05.value.avg === "") {
      return callback(new Error("请选择或输入测定值(≥0.5um 均值)"));
    }
    if (pm05.value.vals === "") {
      return callback(new Error("请选择或输入测定值(≥0.5um 限值)"));
    }
    if (pm5.value.avg === "") {
      return callback(new Error("请选择或输入测定值(≥5um 均值)"));
    }
    if (pm5.value.vals === "") {
      return callback(new Error("请选择或输入测定值(≥0.5um 限值)"));
    }
  }
  callback();
};

const rules = reactive<any>({
  check_sign: { required: true, message: "请输入签名", trigger: "blur" },
  values: { required: true, validator: valuesValid, trigger: "blur" },
});

/**固定参数 */
let _paramsBase = {};
/**表格显示 */
const tableData = ref<any>([]);
/**项目类型 */
const _type = ref<string>("");
/**项目名称 */
const _typeName = ref<string>("");

const pm05 = computed(() => {
  if (tableData.value.info) return tableData.value.info.pm05;
  return {};
});

const pm5 = computed(() => {
  if (tableData.value.info) return tableData.value.info.pm5;
  return {};
});

const MeasurementTool = (data: any) => {
  //根据测定值类型
  const keys = data.keyType ? data.keyType : "values";

  if (data.config.val_type == 1) {
    return (
      <el-select style="width: 150px" v-model={data.config[keys]}>
        <el-option label="合格" value="1"></el-option>
        <el-option label="不合格" value="0"></el-option>
      </el-select>
    );
  } else if (data.config.val_type == 0) {
    return <el-input style="width: 150px" v-model={data.config[keys]}></el-input>;
  } else {
    return (
      <el-input-number
        v-model={data.config[keys]}
        min={Number(data.config.base_val.lower_limit_val)}
        max={Number(data.config.base_val.upper_limit_val)}
        step={2}
        precision={2}
      />
    );
  }
};

const show = (data: any, params: any = {}, typeName: string, type: string) => {
  formRef.value?.resetFields();
  formRef.value?.clearValidate();
  form.value = {
    check_sign: "",
  };
  _type.value = type;
  _typeName.value = typeName;
  tableData.value = data;
  _paramsBase = params;
  dialogVisible.value = true;
};

const signDialogRef = ref();

const dialogOptions = {
  width: "60%",
  btnClass: "w-[80px]",
  draggable: true,
  closeOnClickModal: false,
  closeOnPressEscape: false,
  btnLoading: false,
  showClose: false,
};
// 签名复核
const handleSign = () => {
  addDialog({
    ...dialogOptions,
    title: "签名",
    contentRenderer: () =>
      h(SignDialog, {
        ref: signDialogRef,
      }),
    beforeCancel: (done, { options, index }) => {
      done();
    },
    beforeSure: async (done, { options, index }) => {
      const result = await signDialogRef.value.handleGenerate();
      form.value.check_sign = result;
      done();
    },
  });
};

const formRef = ref();
const emit = defineEmits(["checkComplete"]);
const submit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate((valid: any) => {
    if (valid) {
      //填充签名
      let params: any = {
        ..._paramsBase,
      };

      if (_type.value !== "cip") {
        params.data = {
          [_type.value]: {
            values: tableData.value.values,
            check_ret: 1,
            check_sign: form.value.check_sign,
            index: tableData.value.index,
          },
        };
      } else {
        params.data = {
          [_type.value]: {
            check_ret: 1,
            check_sign: form.value.check_sign,
            info: {
              pm05: {
                ...pm05.value,
              },
              pm5: {
                ...pm5.value,
              },
            },
          },
        };
      }

      updateChecKRet(params).then((res) => {
        ElMessage({
          message: res.msg,
          type: "success",
        });
        emit("checkComplete");
        dialogVisible.value = false;
      });
    }
  });
};

defineExpose({ show });
</script>
<style scoped>
.shops-table {
  width: 90%;
  border-spacing: 0;
  border-top: 1px solid #d8d8d8;
  border-left: 1px solid #d8d8d8;
}
.shops-table th {
  background-color: #e9e5e5;
}
.shops-table th,
.shops-table td {
  box-sizing: border-box;
  height: 30px;
  padding: 8px 16px;
  font-size: 12px;
  color: #333;
  text-align: center;
  border-right: 1px solid #d8d8d8;
  border-bottom: 1px solid #d8d8d8;
}
</style>

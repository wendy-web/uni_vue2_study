<template>
  <el-dialog v-model="dialogVisible" title="新增定期CIP" width="500">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="车间" prop="workshop_id">
        <el-select v-model="form.workshop_id" clearable filterable @change="workshopChange">
          <el-option
            v-for="item in workShopOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="线别" prop="line_id">
        <el-select v-model="form.line_id" clearable filterable @change="lineNameChange">
          <el-option
            v-for="item in lineOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="检测日期" prop="check_date">
        <el-date-picker v-model="form.check_date" type="date" value-format="YYYY-MM-DD" />
      </el-form-item>
      <el-form-item label="CIP项目" prop="pro_id">
        <el-select v-model="form.pro_id" clearable filterable @change="proNameChange">
          <el-option
            v-for="item in proOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
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

<script lang="ts" setup>
import { ref } from "vue";
import { getStopcipBaseData, saveOrder } from "@/api/quality/process-inspection/stop/index";
import { OrderParams, Workshopinit } from "@/api/quality/process-inspection/stop/types";

const dialogVisible = ref(false);
const form = ref<OrderParams>({
  workshop_id: "",
  workshop_name: "",
  line_id: "",
  line_name: "",
  check_date: "",
  pro_id: "",
  pro_name: "",
});
const rules = reactive<any>({
  workshop_id: { required: true, message: "请选择", trigger: "blur" },
  line_id: { required: true, message: "请选择", trigger: "blur" },
  pro_id: { required: true, message: "请选择", trigger: "blur" },
  check_date: { required: true, message: "请选择", trigger: "blur" },
});
const workShopOptions = ref<Workshopinit[]>([]);
const lineOptions = ref<Workshopinit[]>([]);
const proOptions = ref<Workshopinit[]>([]);

const workshopChange = (val: string) => {
  if (val) {
    let data = workShopOptions.value.find((item: any) => item.id == val);
    form.value.workshop_name = data?.name || "";
  }
};

const lineNameChange = (val: string) => {
  if (val) {
    let data = lineOptions.value.find((item: any) => item.id == val);
    form.value.line_name = data?.name || "";
  }
};

const proNameChange = (val: string) => {
  if (val) {
    let data = proOptions.value.find((item: any) => item.id == val);
    form.value.pro_name = data?.name || "";
  }
};

onMounted(async () => {
  let { data } = await getStopcipBaseData();
  workShopOptions.value = data.work_shop_init;
  lineOptions.value = data.line_init;
  proOptions.value = data.pro_init;
});

const show = () => {
  formRef.value?.resetFields();
  formRef.value?.clearValidate();
  form.value = {
    workshop_id: "",
    workshop_name: "",
    line_id: "",
    line_name: "",
    check_date: "",
    pro_id: "",
    pro_name: "",
  };
  dialogVisible.value = true;
};

const formRef = ref();
const emit = defineEmits(["refresh"]);
const submit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate((valid: any) => {
    if (valid) {
      saveOrder(form.value).then((res) => {
        ElMessage({
          message: res.msg,
          type: "success",
        });
        emit("refresh");
        dialogVisible.value = false;
      });
    }
  });
};

defineExpose({ show });
</script>

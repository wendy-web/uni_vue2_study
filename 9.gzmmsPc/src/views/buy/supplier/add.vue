<template>
  <div class="app-container">
    <div class="header-title">{{ headerTitle }}</div>
    <div class="app-card">
      <el-form
        :model="formData"
        :rules="rules"
        ref="addform"
        :inline="false"
        label-width="80"
        label-position="left"
      >
        <div class="mb-[40px]">
          <div class="font-bold mb-[20px] text-[14px]">基本信息</div>
          <el-row :gutter="40">
            <el-col :span="6" :offset="0">
              <el-form-item
                label="名称"
                prop="name"
                :rules="[
                  {
                    required: true,
                    message: '请输入名称',
                    trigger: 'blur',
                  },
                ]"
              >
                <el-input v-model="formData.name" placeholder="请输入名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="0">
              <el-form-item label="地址" prop="address">
                <el-input v-model="formData.address" placeholder="请输入地址"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="6" :offset="0">
              <el-form-item label="联系人" prop="contact">
                <el-input v-model="formData.contact" placeholder="请输入联系人"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="0">
              <el-form-item label="联系电话" prop="mobile">
                <el-input
                  v-model="formData.mobile"
                  placeholder="请输入联系电话"
                  maxlength="200"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="6" :offset="0">
              <el-form-item label="邮件地址" prop="e_mail">
                <el-input v-model="formData.e_mail" placeholder="请输入邮件地址"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="mb-[40px]">
          <div class="font-bold mb-[20px] text-[14px]">财务信息</div>
          <el-row :gutter="40">
            <el-col :span="6" :offset="0">
              <el-form-item label="开户银行" prop="acct_nm">
                <el-input v-model="formData.acct_nm" placeholder="请输入开户银行"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="0">
              <el-form-item label="银行账号" prop="pan">
                <el-input v-model="formData.pan" placeholder="请输入银行账号"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="6" :offset="0">
              <el-form-item label="营业执照" prop="license_pic">
                <single-upload v-model="formData.license_pic"></single-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
    <div class="footer mt-[40px]">
      <el-button size="large" class="w-[140px]" @click="handeleCancel">取消</el-button>
      <el-button type="primary" size="large" @click="hanleSave" class="w-[140px]">保存</el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
// 上传图片自定义组件
import SingleUpload from "@/components/Upload/SingleUpload.vue";
import type { FormInstance, FormRules } from "element-plus";
// 导入新建供应商api
import { addSupplierApi, editSupplierApi } from "@/api/buy/sup/index";
import { IAddQueyr } from "@/api/buy/sup/types";
export interface Props {
  formInfo: IAddQueyr; //编辑表单信息
}
enum ETitle {
  "新建供应商" = 1,
  "编辑供应商",
}

const props = defineProps<Props>();
const state = reactive({
  formData: {} as IAddQueyr,

  pageType: 1, //1是新建,2是编辑
});

const { formData, pageType } = toRefs(state);
const addform = ref<FormInstance>();

const rules = reactive<FormRules>({
  e_mail: [
    {
      validator: checkEmail,
      trigger: "blur",
    },
  ],
});

// 验证邮箱的规则
function checkEmail(rules: any, value: any, callback: any) {
  console.log("value", value);
  if ((value ?? "") !== "") {
    // 验证邮箱的正则表达式
    const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
    if (regEmail.test(value)) {
      return callback();
    }
    callback(new Error("请输入正确的邮箱"));
  } else {
    return callback();
  }
}

const emit = defineEmits(["aboutAdd"]);

// 点击取消 显示列表页
const handeleCancel = () => {
  addform.value?.clearValidate();
  emit("aboutAdd", 1);
};

// 点击保存 显示详情页
const hanleSave = () => {
  addform.value?.validate(async (valid) => {
    if (valid) {
      console.log("submit!", "pageType.value", pageType.value);
      if (pageType.value == 1) {
        sendCreate();
      } else {
        sendEdit();
      }
    } else {
      console.log("error submit!");
    }
  });
};

const sendCreate = async () => {
  let data = {
    ...formData.value,
  };
  const result = await addSupplierApi(data);
  ElMessage.success(result.msg);
  let detailForm = result.data;
  setTimeout(() => {
    emit("aboutAdd", 2, detailForm);
  }, 500);
};

const sendEdit = async () => {
  let data = {
    ...formData.value,
  };
  const result = await editSupplierApi(data);
  ElMessage.success(result.msg);
  let detailForm = result.data;
  setTimeout(() => {
    emit("aboutAdd", 2, detailForm);
  }, 500);
};

const headerTitle = computed(() => {
  return ETitle[pageType.value];
});
watch(
  () => props.formInfo,
  (newVal: IAddQueyr, oldVal) => {
    console.log("new", newVal);
    if (newVal.id) {
      let { name, contact, mobile, e_mail, address, acct_nm, pan, license_pic, id } = newVal;
      pageType.value = 2;
      formData.value = {
        name,
        contact,
        mobile,
        e_mail,
        address,
        acct_nm,
        pan,
        license_pic,
        id,
      };
    }
  },
  { deep: true, immediate: true },
);
</script>
<style scoped></style>

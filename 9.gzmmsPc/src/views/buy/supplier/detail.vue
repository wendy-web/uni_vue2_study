<template>
  <div class="app-container">
    <div class="header-title">供应商详情</div>
    <div class="app-card">
      <el-form
        :model="formData"
        ref="addform"
        :inline="false"
        label-width="80"
        label-position="left"
      >
        <div class="mb-[40px]">
          <div class="font-bold mb-[20px] text-[14px]">基本信息</div>
          <el-row :gutter="40">
            <el-col :span="6" :offset="0">
              <el-form-item label="名称" prop="name">
                <span>{{ formData.name }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="0">
              <el-form-item label="地址" prop="address">
                <span>{{ formData.address }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="6" :offset="0">
              <el-form-item label="联系人" prop="contact">
                <span>{{ formData.contact }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="0">
              <el-form-item label="联系电话" prop="mobile">
                <span>{{ formData.mobile }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="6" :offset="0">
              <el-form-item label="邮件地址" prop="e_mail">
                <span>{{ formData.e_mail }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="mb-[40px]">
          <div class="font-bold mb-[20px] text-[14px]">财务信息</div>
          <el-row :gutter="40">
            <el-col :span="6" :offset="0">
              <el-form-item label="开户银行" prop="acct_nm">
                <span>{{ formData.acct_nm }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="0">
              <el-form-item label="银行账号" prop="acct_nm">
                <span>{{ formData.acct_nm }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="6" :offset="0">
              <el-form-item label="营业执照" prop="license_pic">
                <!-- <span>{{formData.license_pic}}</span> -->
                <!-- <img :src="imgHttp + formData.license_pic" alt="" /> -->
                <el-image
                  style="width: 200px; height: 200px"
                  :src="imgHttp + formData.license_pic"
                  :zoom-rate="1.2"
                  :preview-src-list="srcList"
                  :initial-index="4"
                  fit="cover"
                  v-if="formData.license_pic"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
    <div class="footer mt-[40px]">
      <el-button size="large" type="primary" plain class="w-[140px]" @click="handeleCancel">
        返回
      </el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { IAddQueyr } from "@/api/buy/sup/types";
import { useSettingsStoreHook } from "@/store/modules/settings";

interface Props {
  // formInfo: IAddGoods;
  detailForm: IAddQueyr;
}

const useSetting = useSettingsStoreHook();

const imgHttp = useSetting.baseHttp;
const props = defineProps<Props>();
const state = reactive({
  formData: {} as IAddQueyr,
  srcList: [] as string[],
});

const { formData, srcList } = toRefs(state);
const emit = defineEmits(["aboutDetail"]);
// 点击返回 显示列表页
const handeleCancel = () => {
  emit("aboutDetail");
};
watch(
  () => props.detailForm,
  (newVal: IAddQueyr, oldVal) => {
    console.log("new", newVal);
    console.log("old", oldVal);
    formData.value = newVal;
    console.log("newVal.license_pic", newVal.license_pic);
    if (newVal.license_pic) {
      srcList.value.push(imgHttp + newVal.license_pic);
    }
  },
  { immediate: true },
);
</script>
<style scoped></style>

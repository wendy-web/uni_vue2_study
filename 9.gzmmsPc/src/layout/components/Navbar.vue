<script setup lang="ts">
// import SizeSelect from '@/components/SizeSelect/index.vue';
// import LangSelect from '@/components/LangSelect/index.vue';
// import MixNav from "./Sidebar/MixNav.vue";
import { CaretBottom } from "@element-plus/icons-vue";
import type { FormInstance } from "element-plus";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { changePasswordApi } from "@/api/auth";
import Breadcrumb from "@/components/Breadcrumb/index.vue";
import Hamburger from "@/components/Hamburger/index.vue";
import Screenfull from "@/components/Screenfull/index.vue";
import { useAppStore } from "@/store/modules/app";
import { useSettingsStore } from "@/store/modules/settings";
import { useTagsViewStore } from "@/store/modules/tagsView";
import { useUserStore } from "@/store/modules/user";
import Notice from "../components/Notice/index.vue";

const appStore = useAppStore();
const tagsViewStore = useTagsViewStore();
const userStore = useUserStore();
const settingsStore = useSettingsStore();

const route = useRoute();
const router = useRouter();

const device = computed(() => appStore.device);

/** 修改密码弹窗开关 */
const dialogVisible = ref(false);
/** 弹窗按钮加载状态 */
const dialogBtnLoading = ref(false);

const formRef = ref<FormInstance>();
const formData = ref({
  original_pwd: "",
  pwd1: "",
  pwd2: "",
});

const rules = {
  original_pwd: [{ trigger: "blur", validator: validateOriginal }],
  pwd1: [{ trigger: "blur", validator: validatePassword }],
  pwd2: [{ trigger: "blur", validator: validateRepeat }],
};
function validateOriginal(rule: any, value: any, callback: any) {
  if (value.length < 1) {
    callback(new Error("请输入原密码"));
  } else {
    callback();
  }
}

function validatePassword(rule: any, value: any, callback: any) {
  if (value.length < 6) {
    callback(new Error("密码长度不能小于6位"));
  } else {
    callback();
  }
}
function validateRepeat(rule: any, value: any, callback: any) {
  if (value === "") {
    callback(new Error("请再次输入新密码"));
  } else if (value !== formData.value.pwd1) {
    callback(new Error("两次输入的新密码不一致"));
  } else {
    callback();
  }
}

function toggleSideBar() {
  appStore.toggleSidebar(true);
}

function logout() {
  ElMessageBox.confirm("确定注销并退出系统吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    userStore
      .logout()
      .then(() => {
        tagsViewStore.delAllViews();
      })
      .then(() => {
        // console.log("route.fullPath",route.fullPath)
        router.push(`/login`);
        // if(route.fullPath.includes("401")){
        //   router.push(`/login`);
        // }else{
        //   router.push(`/login?redirect=${route.fullPath}`);
        // }
      });
  });
}

/** 点击修改密码 */
function changePassword() {
  dialogVisible.value = true;
}

/** 弹窗点击确认 */
async function dialogConfirm() {
  formRef.value?.validate(async (valid: any) => {
    if (valid) {
      try {
        dialogBtnLoading.value = true;
        const reuslt = await changePasswordApi(formData.value);
        ElMessage.success({ message: reuslt.msg, offset: 200 });
        dialogVisible.value = false;
        formRef.value?.resetFields();
        userStore.resetToken();
        router.push(`/login`);
      } finally {
        dialogBtnLoading.value = false;
      }
    } else {
      return false;
    }
  });
}

watch(dialogVisible, (newVal: boolean) => {
  if (newVal === false) {
    formRef.value?.resetFields();
  }
});
</script>

<template>
  <div class="navbar">
    <div class="flex justify-start" v-if="device === 'mobile' || settingsStore.layout === 'left'">
      <hamburger :is-active="appStore.sidebar.opened" @toggleClick="toggleSideBar" />
      <!-- 面包屑导航栏 -->
      <breadcrumb />
    </div>

    <!-- <mix-nav v-if="device !== 'mobile' && settingsStore.layout === 'mix'" /> -->

    <div v-if="device === 'mobile' || settingsStore.layout === 'left'" class="flex justify-start">
      <div v-if="device !== 'mobile'" class="flex justify-center items-center">
        <!-- 通知消息 -->
        <Notice></Notice>
        <!--全屏 -->
        <screenfull id="screenfull" class="mr-[8px]" />

        <!-- 布局大小 -->
        <!-- <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select />
        </el-tooltip> -->

        <!--语言选择-->
        <!-- <lang-select /> -->
      </div>

      <el-dropdown trigger="click">
        <div class="flex justify-center items-center pr-[20px]">
          <img :src="userStore.avatar" class="w-[40px] h-[40px] rounded-lg mr-[4px]" />
          <span class="text-[12px]">{{ userStore.nickname }}</span>
          <CaretBottom class="w-3 h-3" />
        </div>

        <template #dropdown>
          <el-dropdown-menu>
            <router-link to="/">
              <el-dropdown-item>首页</el-dropdown-item>
            </router-link>
            <router-link to="/switch">
              <el-dropdown-item divided>切换系统</el-dropdown-item>
            </router-link>
            <el-dropdown-item divided @click="changePassword">修改密码</el-dropdown-item>
            <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <el-dialog
      v-model="dialogVisible"
      title="修改密码"
      width="30%"
      top="30vh"
      destroy-on-close
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="原密码" prop="original_pwd">
          <el-input
            placeholder="原密码"
            type="password"
            :maxLength="20"
            v-model="formData.original_pwd"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pwd1">
          <el-input
            placeholder="新密码"
            type="password"
            :maxLength="20"
            v-model="formData.pwd1"
          ></el-input>
        </el-form-item>
        <el-form-item label="重复新密码" prop="pwd2">
          <el-input
            placeholder="重复新密码"
            type="password"
            :maxLength="20"
            v-model="formData.pwd2"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogConfirm" :loading="dialogBtnLoading">
            确定修改
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.el-dropdown {
  font-size: 18px;
}

.navbar {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 0px 2px rgba(0, 0, 0, 0.2);
  background: var(--el-color-white);
}
</style>

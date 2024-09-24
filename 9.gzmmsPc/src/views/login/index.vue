<template>
  <div class="login-container">
    <div class="out-card">
      <div class="out-img-right">
        <img src="@/assets/img/login_img/login_right1.png" alt="" />
      </div>
      <div class="login-card">
        <!-- <div class="left-bottom-img">
          <img src="@/assets/img/login_img/login_right4.png" alt="" />
        </div>
        <div class="right-bottom-img">
          <img src="@/assets/img/login_img/login_right3.png" alt="" />
        </div> -->
        <div class="login-left">
          <div class="ms-gif">
            <div class="ms-gifImg">
              <img src="@/assets/img/login_img/login_left1.png" />
              <img src="@/assets/img/login_img/login_left2.png" />
              <img src="@/assets/img/login_img/login_left3.png" />
              <img src="@/assets/img/login_img/login_left4.png" />
              <img src="@/assets/img/login_img/login_left5.png" />
              <img src="@/assets/img/login_img/login_left6.png" />
              <img src="@/assets/img/login_img/login_left7.png" />
              <img src="@/assets/img/login_img/login_left8.png" />
              <img src="@/assets/img/login_img/login_left9.png" />
              <img src="@/assets/img/login_img/login_left10.png" />
              <img src="@/assets/img/login_img/login_left11.png" />
            </div>
          </div>
        </div>
        <div class="login-right">
          <div class="ms-logo">
            <img src="@/assets/logo001.png" alt="" class="admin-logo" />
            <span class="admin-name">{{ defaultSettings.adminTitle }}</span>
          </div>
          <div class="ms-login">
            <el-form
              ref="loginFormRef"
              auto-complete="on"
              label-position="left"
              :model="loginData"
              :rules="loginRules"
            >
              <el-form-item prop="username" class="mgb-42">
                <el-input
                  ref="username"
                  v-model="loginData.username"
                  placeholder="请输入手机号码/账号名"
                  name="username"
                  type="text"
                  auto-complete="on"
                  maxlength="11"
                  @input="handleKeyup"
                >
                  <template #prefix>
                    <i-ep-user></i-ep-user>
                  </template>
                </el-input>
              </el-form-item>

              <el-form-item prop="password" class="mgb-42">
                <el-input
                  ref="passwordRef"
                  :key="passwordType"
                  :type="passwordType"
                  v-model="loginData.password"
                  placeholder="请输入密码"
                  name="password"
                  auto-complete="on"
                >
                  <template #prefix>
                    <i-ep-Lock></i-ep-Lock>
                  </template>
                </el-input>
              </el-form-item>
              <div class="login-select">
                <el-checkbox v-model="checkedPassword" label="记住密码"></el-checkbox>
              </div>
              <el-button
                class="login-btn"
                size="default"
                type="primary"
                @keyup.enter.native="handleLogin"
                @click="handleLogin"
                :loading="btnLoading"
              >
                登录
              </el-button>
            </el-form>
          </div>
          <div class="footer-text">
            <span>2023-{{ current_yarn }}</span>
            <span>&nbsp;©&nbsp;</span>
            <span>v{{ settingsStore.version }}</span>
            <span class="footer-name">天兴诚科技</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { dayjs } from "element-plus";
import type { FormInstance } from "element-plus";
//引入base64加密，用于记住密码
import { onKeyStroke } from "@vueuse/core";
import { Base64 } from "js-base64";
// API依赖
import { useRoute } from "vue-router";
import { LoginData } from "@/api/auth/types";
import { localStorage } from "@/utils/localStorage";
import router from "@/router";
import defaultSettings from "@/settings";
import { useSettingsStore } from "@/store/modules/settings";
// 状态管理依赖
import { useUserStore } from "@/store/modules/user";

const userStore = useUserStore();
const settingsStore = useSettingsStore();

const route = useRoute();

const loginFormRef = ref<FormInstance>();
const passwordRef = ref<HTMLInputElement | null>();

const current_yarn = dayjs().year();
console.log("current_yarn", current_yarn);

const state = reactive({
  redirect: "",
  loginData: {
    username: "",
    password: "",
    // username: "",
    // password: "",
  } as LoginData,
  loginRules: {
    username: [{ trigger: "blur", validator: validateUsername }],
    password: [{ trigger: "blur", validator: validatePassword }],
  },
  btnLoading: false,
  passwordType: "password",
  otherQuery: {},
  clientHeight: document.documentElement.clientHeight,
});
const { loginData, loginRules, btnLoading, passwordType } = toRefs(state);

const checkedPassword = ref(!!localStorage.get("checkedPassword"));
console.log("checkedPassword", checkedPassword.value);
const username = localStorage.get("username");
if (username) {
  state.loginData.username = username;
}
if (checkedPassword.value) {
  const password = Base64.decode(localStorage.get("userPassword"));
  state.loginData.password = password;
}
function validateUsername(rule: any, value: any, callback: any) {
  if (value.length < 1) {
    callback(new Error("手机号码/账号格式不正确"));
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

function handleLogin() {
  loginFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      btnLoading.value = true;
      localStorage.set("checkedPassword", checkedPassword.value);
      localStorage.set("username", state.loginData.username);
      if (checkedPassword.value) {
        localStorage.set("userPassword", Base64.encode(state.loginData.password));
      } else {
        localStorage.remove("userPassword");
      }
      userStore
        .login(state.loginData)
        .then(() => {
          router.push({ path: state.redirect || "/", query: state.otherQuery });
          btnLoading.value = false;
          ElMessage({
            message: "登录成功",
            type: "success",
          });
        })
        .catch(() => {
          btnLoading.value = false;
        });
    } else {
      console.log("出错了");
      return false;
    }
  });
}

function getOtherQuery(query: any) {
  return Object.keys(query).reduce((acc: any, cur: any) => {
    if (cur !== "redirect") {
      acc[cur] = query[cur];
    }
    return acc;
  }, {});
}

const handleKeyup = (value: string) => {
  // 只能输入数字，大小写字母，@！._的使用
  loginData.value.username = value.replace(/[^\w_@.!]/g, "");

  // as HTMLInputElement
};

// watch(
//   route,
//   () => {
//     const query = route.query;
//     if (query) {
//       state.redirect = query.redirect as string;
//       state.otherQuery = getOtherQuery(query);
//     }
//   },
//   {
//     immediate: true,
//   },
// );

let cleanup: Function = function (): void {};
onMounted(() => {
  userStore.setModuleType(-1);
  // 监听键盘回车时,触发的事件
  cleanup = onKeyStroke("Enter", (e) => {
    console.log("login回车");
    handleLogin();
  });
});
onBeforeUnmount(() => {
  cleanup(); //销毁键盘按键监听
});
</script>

<style scoped lang="scss">
.login-container {
  background: url("@/assets/img/login_img/login_bg.svg");
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 550px;
  background-color: #eee;
  background-size: 100% 100%;
  background-size: cover;
  position: relative;

  .out-card {
    position: absolute;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 98%;
    height: 96%;
    // background-color: #fffc;
    background-color: rgba(255, 255, 255, 0.65);
    border-radius: 10px;
    z-index: 99;
    .out-img-right {
      position: absolute;
      right: 20px;
      top: 20px;
      z-index: -1;
    }
    .out-img-bottom {
      position: absolute;
      bottom: 0;
      right: 0px;
      z-index: -1;
    }
    .login-card {
      width: 1200px;
      height: 600px;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 2px 3px 7px 4px #0003;
      display: flex;
      justify-content: space-around;
      position: relative;
      // .left-bottom-img {
      //   position: absolute;
      //   left: -280px;
      //   bottom: -350px;
      //   transform: rotate(-10deg);
      //   img{
      //     width: 200px;
      //   }
      // }
      // .right-bottom-img {
      //   position: absolute;
      //   right: 0;
      //   width: 160px;
      //   // right: -324px;
      //   bottom: -350px;
      // }
      .login-left {
        flex: 1;
        min-width: 600px;
        position: relative;
        // background-color: #acd3fc;
        background-color: #0d84ff70;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
        .ms-gif {
          position: absolute;
          width: 579px;
          height: 579px;
          margin-left: 40px;
          margin-top: 40px;
          overflow: hidden;
          .ms-gifImg {
            height: 579px;
            display: flex;
            padding-left: -579px;
            animation: run 2.5s step-start infinite;
          }
          @keyframes run {
            0% {
              margin-left: 0;
            }
            8.333% {
              margin-left: -579px;
            }
            16.666% {
              margin-left: -1158px;
            }
            25% {
              margin-left: -1158px;
            }
            33.333% {
              margin-left: -1737px;
            }
            41.666% {
              margin-left: -2316px;
            }
            50% {
              margin-left: -2895px;
            }
            58.333% {
              margin-left: -3474px;
            }
            66.666% {
              margin-left: -4053px;
            }
            75% {
              margin-left: -4632px;
            }
            83.333% {
              margin-left: -5211px;
            }
            91.666% {
              margin-left: 0;
            }
            100% {
              margin-left: 0;
            }
          }
        }
      }
      .login-right {
        flex: 1;
        min-width: 600px;
        background-color: #fff;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
        .ms-logo {
          padding-top: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          margin-bottom: 60px;
          .admin-logo {
            width: 55px;
            height: 55px;
            margin-right: 16px;
            vertical-align: middle;
          }
          .admin-name {
            font-size: 26px;
            font-weight: 700;
            color: #2b5686;
          }
        }
        .ms-login {
          width: 400px;
          margin: auto;
          background: #fff;
          opacity: 0.8;
          position: relative;
          .mgb-42 {
            margin-bottom: 22px;
          }

          .login-select {
            margin-top: 40px;
            // margin-left: 50px;
            :deep(.el-checkbox__label) {
              font-size: 16px;
            }
            :deep(.el-checkbox__inner) {
              width: 16px;
              height: 16px;
            }

            :deep(.el-checkbox__inner::after) {
              //对钩的位置
              top: 2px;
              left: 6px;
            }
          }
          .login-btn {
            width: 100%;
            height: 52px;
            border-radius: 10px;
            font-size: 20px;
            margin-top: 10px;
          }
          :deep(.el-form-item__label) {
            font-size: 20px;
            line-height: 40px;
          }
          :deep(.el-input__wrapper),
          :deep(.el-input__inner) {
            border-width: 1px;
            border-radius: 6px;
            font-size: 16px;
            height: 40px;
          }
        }
        .footer-text {
          text-align: center;
          color: var(--el-text-color-secondary);
          margin-top: 160px;
          font-size: 14px;
          .footer-name {
            display: inline-block;
            margin-left: 20px;
          }
        }
      }
    }
  }
}
</style>

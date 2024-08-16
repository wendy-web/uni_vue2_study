<template>
  <view class="personal-info-box">
    <view class="list-box">
      <!-- 头像 -->
      <view class="list-item">
        <view class="li-left">头像</view>
        <view class="li-right">
          <image
            class="icon-avatar"
            :src="userInfo.avatar_url || default_url"
            mode="aspectFit"
            lazy-load="false"
          ></image>
          <button
            v-if="canIuse"
            class="get-avatar"
            open-type="chooseAvatar"
            @chooseavatar="chooseAvatar"
          ></button>
          <button v-else class="get-avatar" @click="chooseImg"></button>
          <van-icon name="arrow" color="#999999" size="16" />
        </view>
      </view>
      <!-- 昵称 -->
      <view class="list-item">
        <view class="li-left">昵称</view>
        <view class="li-right" @click="modifyName">
          <view class="lir-item">{{ userInfo.nick_name || "微信默认昵称" }}</view>
          <van-icon name="arrow" color="#999999" size="16" />
        </view>
      </view>
      <!-- 生日 -->
      <view class="list-item">
        <view class="li-left">生日</view>
        <view class="li-right" @click="showBirthPicker = !showBirthPicker">
          <view class="lir-item">{{ birth_constellation || "请选择" }}</view>
          <van-icon name="arrow" color="#999999" size="16" />
        </view>
      </view>
      <!-- 性别 -->
      <view class="list-item">
        <view class="li-left">性别</view>
        <view class="li-right" @click="showGenderPicker = !showGenderPicker">
          <view class="lir-item">{{ user_gender || "请选择" }}</view>
          <van-icon name="arrow" color="#999999" size="16" />
        </view>
      </view>
      <!-- 手机号 -->
      <view class="list-item">
        <view class="li-left">手机号</view>
        <view class="li-right">
          <view class="lir-item">{{ userInfo.mobile || "请输入手机号" }}</view>
          <van-icon name="arrow" color="#999999" size="16" />
          <button
            open-type="getPhoneNumber"
            class="get-phone"
            @getphonenumber="getPhoneNumber"
          ></button>
        </view>
      </view>
    </view>
    <view class="back_login" @click="backHandle">退出登录</view>

    <!-- 性别选择 -->
    <van-popup
      :show="showGenderPicker"
      @close="showGenderPicker = false"
      round
      position="bottom"
      custom-style="width:100%"
    >
      <view class="gender-box">
        <van-picker
          show-toolbar
          visible-item-count="3"
          title="请选择性别"
          :columns="genderColumns"
          @cancel="showGenderPicker = false"
          @confirm="genderConfirm"
        />
      </view>
    </van-popup>
    <!-- 生日、星座picker弹窗 -->
    <van-popup
      :show="showBirthPicker"
      @close="showBirthPicker = false"
      round
      position="bottom"
      custom-style="width:100%"
    >
      <view class="birth-pop">
        <van-datetime-picker
          type="date"
          :value="currentDate"
          :min-date="minDate"
          :max-date="maxDate"
          :formatter="formatter"
          visible-item-count="3"
          @change="dateChange"
          @confirm="dateConfirm"
          @cancel="showBirthPicker = false"
        />
        <view class="star-sign-name">
          <view>{{ starSignName }}</view>
          <image
            class="icon-omega"
            mode="aspectFit"
            src="https://file.y1b.cn/store/1-0/24131/65ba39d5a9b2e.png"
          ></image>
        </view>
      </view>
    </van-popup>
    <privacy ref="privacy"></privacy>
    <confirmDia
        :isShow="isShowConfirmDia"
        remindText="确定退出登录？"
        @close="isShowConfirmDia = false"
        @confirm="confirmExitLoginHandle"
    ></confirmDia>
  </view>
</template>

<script>
import { compareVersion, parseTime } from "@/utils/index.js";
import uploadImgAI from "@/utils/uploadImgAI.js";
import { mapActions, mapGetters, mapMutations } from "vuex";
import confirmDia from "./confirmDia.vue";
import { constellationObj, getAstro } from "./utils/index.js";
let is_hide = false; //page 是否onHide过
export default {
    components: {
        confirmDia
    },
    data() {
        return {
            default_url: "https://file.y1b.cn/store/1-0/24131/65ba392989ede.png",
            canIuse: false,
            user_gender: "",
            genderColumns: ["先生", "女士"],
            showGenderPicker: false,
            showBirthPicker: false,
            currentDate: new Date("1990/06/15").getTime(),
            minDate: new Date("1900/01/01").getTime(),
            maxDate: new Date().getTime(),
            starSignName: "", //星座名
            birthday: "",
            constellation: "", //星座对应数字，后台传参
            birth_constellation: "",
            isShowConfirmDia: false
        };
    },
    computed: {
        ...mapGetters(["userInfo"]),
    },
    watch: {
        userInfo: {
            handler(newVal, oldVal) {
                if (newVal) {
                let { birthday, gender, constellation } = newVal;
                if (gender == 0) {
                    this.user_gender = "请选择";
                } else {
                    this.user_gender = gender == 1 ? "先生" : "女士";
                }
                let obj = constellationObj();
                if (birthday) {
                    this.birth_constellation = parseTime(birthday, "{m}-{d}") + " · " + obj[constellation];
                    this.currentDate = new Date(birthday.replace(new RegExp(/-/gm), "/")).getTime();
                }
                let date = parseTime(this.currentDate, "{y}年{m}月{d}日");
                this.dateToStar(date);
                }
            },
            immediate: true,
            deep: true,
        },
    },
  methods: {
    ...mapActions({
      getUserInfo: "user/getUserInfo",
      wxloginSmall: "user/wxloginSmall",
      updateUserNew: "user/updateUserNew",
      updateMobile: "user/updateMobile",
    }),
    ...mapMutations({
        setAutoLogin: 'user/setAutoLogin'
    }),
    chooseAvatar(event) {
      console.log(event);
      this.uploadImg(event.detail.avatarUrl);
    },
    async uploadImg(imgPath) {
      try {
        //上传图片
        let res = await uploadImgAI(imgPath, {});
        //展示上传结果
        this.userInfo.avatar_url = res.url;
        let params = {
          avatar_url: res.url,
        };
        this.editUserInfo(params);
      } catch (error) {
        console.log(error);
        wx.hideLoading({fail() {}});
        if (error && error.isRefresh) {
          // 刷新token
          this.wxloginSmall().then((res) => {});
        }
      } finally {
      }
    },
    async chooseImg() {
      let chooseImage = wx.chooseMedia || wx.chooseImage;

      try {
        /**图片获取 */
        let [tempFile] = (
          await chooseImage({
            count: 1,
            sizeType: "compressed",
            mediaType: ["image"],
            sourceType: ["camera"],
            camera: "back",
          })
        ).tempFiles;
        let imgPath = tempFile.tempFilePath;
        //是否压缩
        if (tempFile.size / 1024 > 60) {
          let { tempFilePath } = await wx.compressImage({
            src: imgPath,
            quality: 70,
          });
          imgPath = tempFilePath;
        }
        //上传图片
        let res = await uploadImgAI(imgPath, {});
        //展示上传结果
        this.userInfo.avatar_url = res.url;
        let params = {
          avatar_url: res.url,
        };
        this.editUserInfo(params);
      } catch (error) {
        wx.hideLoading({fail() {}});
        if (error && error.isRefresh) {
          this.wxloginSmall().then((res) => {});
        }
      } finally {
      }
    },
    modifyName() {
        this.$go(`/pages/mineModule/personalInfo/modifyName/index?value=${this.userInfo.nick_name}`);
    },
    genderConfirm(event) {
      let { detail } = event;
      this.user_gender = detail.value;
      this.showGenderPicker = false;
      if(this.userInfo.gender == (detail.index + 1)) return; // 与当前一致不更改访问
      let params = {
        gender: detail.index + 1,
      };
      this.editUserInfo(params);
    },
    formatter(type, value) {
      if (type === "year") {
        return `${value}年`;
      }
      if (type === "month") {
        return `${value}月`;
      }
      if (type === "day") {
        return `${value}日`;
      }
      return value;
    },
    dateChange(e) {
      let arr = e.detail.getValues();
      let date = arr.join("");
      this.dateToStar(date);
    },
    dateConfirm(e) {
      let { detail } = e;
      let format_date = parseTime(detail, "{y}年{m}月{d}日");
      this.birthday = parseTime(detail, "{y}-{m}-{d}");
      const dateToStarObj = this.dateToStar(format_date);
      const params = {
        birthday: this.birthday,
        constellation: dateToStarObj.index
      }
      this.showBirthPicker = false;
      if(this.userInfo.birthday == this.birthday) return; // 与当前一致不更改访问
      this.editUserInfo(params);
    },
    // dateConfirm(e) {
    //   let { detail } = e;
    //   console.log(detail);
    //   let date = new Date(detail);
    //   let format_date = parseTime(detail, "{y}年{m}月{d}日");
    //   this.birthday = parseTime(detail, "{m}-{d}");

    //   let time_stamp = date.getTime();
    //   this.dateToStar(format_date);
    //   this.showBirthPicker = false;
    //   let params = {
    //     birthday: parseTime(detail, "{y}-{m}-{d}"),
    //     constellation: this.constellation,
    //   };
    //   this.editUserInfo(params);
    // },
    init() {
      let date = parseTime(this.currentDate, "{y}年{m}月{d}日");
      this.dateToStar(date);
    },
    //日期换算星座
    dateToStar(date) {
      let obj = getAstro(date);
      if (obj) {
        this.starSignName = obj.name;
        this.constellation = obj.index;
        if (this.birthday) {
          this.birth_constellation = this.birthday + " · " + obj.name;
        }
      }
      return obj;
    },
    getPhoneNumber(event) {
			if(event.detail.errMsg !== 'getPhoneNumber:ok') return;
      const phoneCode = event.detail.code;
      if(phoneCode) {
        this.updateMobile({ code: phoneCode }).then(() => {
          /**更新成功直接发起兑换 */
          uni.showToast({
            title: "更新成功",
            icon: "none",
          });
        });
        return;
      }
      uni.showToast({
        title: '微信版本过低，无法获取手机号',
        icon: 'none'
      });
    },
    editUserInfo(params) {
      console.log(`output->params`, params);
      this.updateUserNew(params);
    },
    backHandle() {
        this.isShowConfirmDia = true;
    },
    async confirmExitLoginHandle() {
        this.confirmExitLoginHandle = false;
        this.setAutoLogin(0);
        this.$leftBack();
    }
  },
  onLoad() {
    //兼容性判断
    const version = wx.getSystemInfoSync().SDKVersion;
    this.canIuse = compareVersion(version, "2.21.2") >= 0;
    this.init();
  },
  onShow() {
    this.$refs.privacy.LifetimesShow();
    // 更新用户信息
    if (!is_hide) return (is_hide = false);
    this.getUserInfo();
  },
  onHide() {
    is_hide = true;
  },
  onUnload() {
    is_hide = false;
  },
};
</script>

<style scoped lang="scss">
.personal-info-box {
  background-color: #ffffff;
}

.list-box {
  box-sizing: border-box;
  border-top: 14rpx solid #f5f6fa;

  .list-item {
    height: 128rpx;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 32rpx;
    position: relative;

    .li-left {
      font-size: 28rpx;
      font-weight: 400;
      color: #333333;
      flex-shrink: 0;
    }

    .li-right {
      padding-right: 32rpx;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      position: relative;
      flex: 1;

      .icon-avatar {
        width: 80rpx;
        height: 80rpx;
        background: #d8d8d8;
        border-radius: 50%;
        margin-right: 10rpx;
      }

      .lir-item {
        font-size: 28rpx;
        font-weight: 400;
        text-align: right;
        color: #999999;
        margin-right: 10rpx;
      }

      .get-avatar {
        z-index: 1;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 80rpx;
        opacity: 0;
      }

      .get-phone {
        z-index: 1;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
      }
    }
  }

  .list-item::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 32rpx;
    right: 0;
    height: 2rpx;
    background: #f1f1f1;
  }
}

.gender-box {
  width: 100%;
  height: 478rpx;
  box-sizing: border-box;
  padding-top: 20rpx;
}

.birth-pop {
  width: 100%;
  height: 478rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 40rpx;
}

.star-sign-name {
  width: 622rpx;
  height: 76rpx;
  line-height: 76rpx;
  text-align: center;
  margin: 0 auto;
  background: #ffffff;
  border: 1rpx solid rgba(202, 151, 103, 0.5);
  border-radius: 16rpx;
  font-size: 24rpx;
  font-weight: 500;
  color: #333333;
  letter-spacing: 0.52px;
  position: relative;
  z-index: 2;

  .icon-omega {
    z-index: -1;
    width: 118rpx;
    height: 76rpx;
    position: absolute;
    top: 0;
    right: 190rpx;
    margin: 0 auto;
  }
}
.back_login{
    width: 100%;
    font-size: 28rpx;
    text-align: center;
    color: #999;
    line-height: 40rpx;
    position: absolute;
    left: 0;
    bottom: calc(60rpx + constant(safe-area-inset-bottom));
    /* 兼容 IOS<11.2 */
    bottom: calc(60rpx + env(safe-area-inset-bottom));
}
</style>

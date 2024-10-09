<template>
 <view class="personal-info-box">
    <view class="list-box">
      <view class="list-item item_title">基本信息</view>
      <!-- 头像 -->
      <view class="list-item">
        <view class="li-left">头像</view>
        <view class="li-right">
          <image
            class="icon-avatar"
            :src="userInfo.avatar_url || avatar_default"
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
          <van-icon name="arrow" color="#999999" size="14" />
        </view>
      </view>
      <!-- 昵称 -->
      <view class="list-item" @click="modifyName">
        <view class="li-left">昵称</view>
        <view class="li-right">
          <view class="lir-item">{{ userInfo.nick_name || '微信默认昵称'}}</view>
          <van-icon name="arrow" color="#999999" size="14" />
        </view>
      </view>
      <!-- 生日 -->
      <view class="list-item" @click="showBirthPicker = !showBirthPicker">
        <view class="li-left">生日</view>
        <view class="li-right">
          <view class="lir-item">{{ birth_constellation||"请选择"}}</view>
          <van-icon name="arrow" color="#999999" size="14" />
        </view>
      </view>
      <!-- 性别 -->
      <view class="list-item" @click="showGenderPicker = !showGenderPicker">
        <view class="li-left">性别</view>
        <view class="li-right">
          <view class="lir-item">{{ genderLabel || "请选择" }}</view>
          <van-icon name="arrow" color="#999999" size="14" />
        </view>
      </view>
      <!-- 手机号 -->
      <view class="list-item">
        <view class="li-left">手机号</view>
        <view class="li-right">
          <view class="lir-item">{{ phoneNumber || '请输入手机号'}}</view>
          <button
            open-type="getPhoneNumber"
            class="get-phone"
            @getphonenumber="getPhoneNumber"
          ></button>
          <van-icon name="arrow" color="#999999" size="14" />
        </view>
      </view>
      <view class="list-item" @click="animationHandle" v-if="isTest">
        <view class="li-left">测试</view>
        <view class="li-right">
          <view class="lir-item">旋转木马动画效果</view>
          <van-icon name="arrow" color="#999999" size="14" />
        </view>
      </view>
      <!-- <view class="list-item" @click="animationHandle1">
        <view class="li-left">测试</view>
        <view class="li-right">
          <view class="lir-item">插件</view>
          <van-icon name="arrow" color="#999999" size="14" />
        </view>
      </view> -->
      <view class="list-item" @click="animationHandle2"  v-if="isTest">
        <view class="li-left">测试</view>
        <view class="li-right">
          <view class="lir-item">库迪咖啡首页</view>
          <van-icon name="arrow" color="#999999" size="14" />
        </view>
      </view>
      <view class="list-item" @click="animationHandle3"  v-if="isTest">
        <view class="li-left">测试</view>
        <view class="li-right">
          <view class="lir-item">省钱卡活动</view>
          <van-icon name="arrow" color="#999999" size="14" />
        </view>
      </view>
    </view>
    <view class="back_login" @click="exitLoginHandle">退出登录</view>
    <!-- 性别选择 -->
    <van-popup
      :show="showGenderPicker"
      custom-style="overflow: initial;"
      round
    >
      <view class="gender-box">
        <view class="close_box" @click="showGenderPicker = false">
          <image
            class="close_icon"
            :src="imgUrl + 'static/user/close_icon.png'"
            mode="aspectFit"
            lazy-load="false"
          ></image>
        </view>
        <view class="gender_title">怎么称呼</view>
        <view
          class="gender_box"
          v-for="item in genderList"
          :key="item.id"
          @click="genderConfirm(item)"
        >
          <image
            class="gender_icon"
            :src="item.icon"
            mode="aspectFit"
            lazy-load="false"
          ></image>
          {{ item.label }}
        </view>
      </view>
    </van-popup>
    <!-- 生日、星座picker弹窗 -->
    <van-popup
      :show="showBirthPicker"
      round
      position="bottom"
      custom-style="width:100%"
      @close="showBirthPicker = false"
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
        </view>
      </view>
    </van-popup>
    <privacyOpen ref="privacyOpen"></privacyOpen>
    <confirmDia
      :isShow="isShowConfirmDia"
      remindText="确定退出登录？"
      @close="isShowConfirmDia = false"
      @confirm="confirmExitLoginHandle"
    ></confirmDia>
  </view>
</template>
<script>
import { getENV, getImgUrl } from '@/utils/auth.js';
import { getAstro } from "@/utils/getAstro.js";
import { compareVersion, parseTime } from "@/utils/index.js";
import uploadImgAI from "@/utils/uploadImgAI.js";
import { mapActions, mapGetters, mapMutations } from 'vuex';
import confirmDia from './confirmDia.vue';
export default{
    components:{
        confirmDia
    },
	data() {
		return {
      canIuse: false,
      imgUrl: getImgUrl(),
      avatar_default: `${getImgUrl()}static/images/avatar_default.png`,
      genderLabel: "",
      genderList: [
          {
          id: 1,
          label: '先生',
          icon: `${getImgUrl()}static/user/gender_1.png`
          },
          {
          id: 2,
          label: '女士',
          icon: `${getImgUrl()}static/user/gender_2.png`
          }
      ],
      showGenderPicker: false,
      showBirthPicker: false,
      currentDate: new Date("1990/06/15").getTime(),
      minDate: new Date("1900/01/01").getTime(),
      maxDate: new Date().getTime(),
      starSignName: "", //星座名
      birthday: "",
      constellation: "", //星座对应数字，后台传参
      birth_constellation: '',
      phoneNumber: '',
      isShowConfirmDia: false,
      isTest: getENV() == 'test',
		}
	},
	computed: {
        ...mapGetters(['userInfo'])
	},
  // 页面周期函数--监听页面加载
  onLoad() {
    //兼容性判断
    const version = wx.getSystemInfoSync().SDKVersion;
    this.canIuse = compareVersion(version, "2.21.2") >= 0;
    this.init();
  },
  onShow() {
    this.$refs.privacyOpen?.LifetimesShow();
  },
	methods:{
    ...mapActions({
      editUpdateUser: 'user/editUpdateUser',
      updateUserNew: 'user/updateUserNew'
    }),
    ...mapMutations({
      setUserInfo: 'user/setUserInfo',
      setAutoLogin: 'user/setAutoLogin'
    }),
    onadload(e) {
      console.log('广告数据加载成功');
    },
    onadclose(e) {
		 console.log("onadclose",e);
    },
    onaderror(e) {
      // 广告加载失败
      console.log("onerror: ", e.detail);
    },
    chooseAvatar(event) {
      this.uploadImg(event.detail.avatarUrl);
    },
    animationHandle() {
      this.$go('/pages/userComModule/ani3Dflower/index')
    },
    animationHandle1() {
      this.$go(`plugin://hello-plugin/hello-page`);
      // this.$go(`plugin://express-plugin/home?shareCode=1911Fv7raS&userId=1&extra=1`);
    },
    animationHandle2() {
      // this.$go(`plugin://jtkDc/kudiindex?pub_id=27729&sid=ttxl&channel=${this.userInfo.id}`);
      this.$go(`plugin://jtkDc/index?pub_id=27729&sid=ttxl${this.userInfo.id}`);
      // plugin://jtkDc/index?pub_id=26&sid=123456
    },
    animationHandle3() {
      // this.$go(`plugin://jtkDc/kudiindex?pub_id=27729&sid=ttxl&channel=${this.userInfo.id}`);
      this.$go(`/pages/userCard/card/cardVip/activity?activeId=1`);
      // plugin://jtkDc/index?pub_id=26&sid=123456
    },
    async uploadImg(imgPath) {
      try {
        //上传图片
        let res = await uploadImgAI(imgPath, {});
        // 展示上传结果
        this.updateUserInfo({
          avatar_url: res.url
        });
      } catch (error) {
        wx.hideLoading();
        if (error && error.isRefresh) {
          // 刷新token
          // this.wxloginSmall().then(res=>{})
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
        this.updateUserInfo({
          avatar_url: res
        });
      } catch (error) {
        wx.hideLoading();
        if (error && error.isRefresh) {
          // this.wxloginSmall().then(res => {})
        }
      } finally {
      }
    },
    // 修改用户信息
    async updateUserInfo(params) {
      const res = await this.editUpdateUser(params);
      this.$toast(res.msg);
    },
    modifyName() {
      this.$go(`/pages/userInfo/personalInfo/modifyName/index?nickName=${this.userInfo.nick_name}`);
    },
    genderConfirm(event) {
      let { label, id } = event;
      this.genderLabel = label;
      this.showGenderPicker = false;
      if(this.userInfo.gender == id) return; // 与当前一致不更改访问
      this.updateUserInfo({
        gender: id
      });
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
      this.updateUserInfo(params);
    },
    init() {
      const { gender, birthday, mobile } = this.userInfo;
      this.phoneNumber = mobile;
      this.birthday = this.userInfo.birthday;
      const genderObj = gender ?  this.genderList.filter(res =>  res.id == gender)[0] : this.genderList[0];
      this.genderLabel = genderObj.label;
      if(birthday) {
        this.currentDate = new Date(birthday).getTime()
      }
      let date = parseTime(this.currentDate, "{y}年{m}月{d}日");
      this.dateToStar(date);
    },
    // 日期换算星座
    dateToStar(date) {
      let obj = getAstro(date);
      if (obj) {
        this.starSignName = obj.name;
        this.constellation = obj.index;
        if(this.birthday){
          this.birth_constellation = this.birthday + " · " + obj.name;
        }
      }
      return obj;
    },
    async getPhoneNumber(event) {
			if(event.detail.errMsg !== 'getPhoneNumber:ok') return;
      const code = event.detail.code;
      if(!code) return this.$toast('微信版本过低，无法获取手机号');
      const res = await this.updateUserNew({ code });
      this.phoneNumber = res.data.mobile;
      this.$toast('更新成功');
    },
    exitLoginHandle() {
        this.isShowConfirmDia = true;
    },
    async confirmExitLoginHandle() {
        this.isShowConfirmDia = false;
        this.setAutoLogin(false)
        this.$leftBack();
    }
	}
}
</script>
<style lang="scss" scoped>
.personal-info-box {
  width: 100vw;
  height: 100vh;
  background-color: #f7f7f7;
  overflow: hidden;
}
.list-box {
  overflow: hidden;
  box-sizing: border-box;;
  background: #ffffff;
  border-radius: 0rpx 0rpx 32rpx 32rpx;
  .list-item {
    height: 84rpx;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32rpx;
    position: relative;
    &.item_title {
      font-size: 26rpx;
      color: #999999;
      line-height: 36rpx;
      margin-top: 26rpx;
    }
    .li-left {
      font-size: 28rpx;
      font-weight: 500;
      color: #333333;
    }
    .li-right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      position: relative;
      .icon-avatar {
        width: 64rpx;
        height: 64rpx;
        background: #d8d8d8;
        border-radius: 50%;
        margin-right: 16rpx;
      }
      .lir-item {
        font-size: 28rpx;
        font-weight: 400;
        text-align: right;
        color: #999999;
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
      .get-phone{
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
}
.gender-box {
  width: 530rpx;
  height: 328rpx;
  background: #ffffff;
  border-radius: 32rpx;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  .close_box {
    position: absolute;
    width: 46rpx;
    height: 46rpx;
    right: -23rpx;
    top: -56rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0,0,0,0.12);
    border: 2rpx solid rgba(255,255,255,0.55);
    border-radius: 50%;
    box-sizing: border-box;
    .close_icon {
      width: 30rpx;
      height: 32rpx;
    }
  }
  .gender_title{
    font-size: 30rpx;
    text-align: left;
    color: #333333;
    line-height: 42rpx;
    margin-bottom: 6rpx;
  }
  .gender_box {
    width: 434rpx;
    height: 80rpx;
    border: 2rpx solid #e1e1e1;
    border-radius: 16rpx;
    font-size: 28rpx;
    text-align: left;
    color: #333333;
    line-height: 80rpx;
    letter-spacing: 0.62rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20rpx;
    .gender_icon {
      width: 40rpx;
      height: 40rpx;
    }
  }
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
  border: 2rpx solid rgba(202, 151, 103, 0.5);
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
    width: 750rpx;
    height: 104rpx;
    line-height: 104rpx;
    background: #fff;
    border-radius: 32rpx;
    font-size: 28rpx;
    font-weight: 500;
    color: #333;
    text-align: center;
    border-radius: 32rpx;
    margin-top: 32rpx;
}
</style>

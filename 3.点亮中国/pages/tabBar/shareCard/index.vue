<template>
  <view class="share">
    <xh-navbar
      title="返回"
      titleColor="#F0BD00"
      leftImage="/static/images/back_icon.png"
      @leftCallBack="backHandle"
      @titleHandle="backHandle"
      :leftImgPad="true"
    />
    <image
      class="share_bg"
      src="https://file.y1b.cn/store/1-0/23410/6433f45ca5149.png"
    ></image>
    <!-- 原证书样式 -->
    <!-- 	<view class="share_box">
			<image class="share_icon" src="https://file.y1b.cn/store/1-0/23410/6433f47a86f7c.png"></image>
			<image class="share_bg" src="https://file.y1b.cn/store/1-0/2347/642fea13ed08a.png"></image>
			<view class="share_con">
				<view class="cont_title">{{shareImgData.name}}</view>
				<view class="cont_text">
					{{shareImgData.cert_content[0]}}
					<text style="color: #FF8837">{{shareImgData.cert_content[1]}}</text>
				</view>
				<view>{{shareImgData.cert_content[2]}}</view>
				<view>{{shareImgData.cert_content[3]}}</view>
				<view class="cont_rem">特颁此证，表示诚挚的谢意！</view>
			</view>
		</view> -->

    <!-- 新证书样式 -->
    <view class="share-wrapper">
      <image
        class="share-bg"
        src="https://file.y1b.cn/public/img/bfzx/zhengshu_bg@2x.png"
      ></image>
      <image
        class="share-icon"
        src="https://file.y1b.cn/store/1-0/23410/6433f47a86f7c.png"
      ></image>
      <view class="share-content">
        <view class="user-info">
          <image :src="shareImgData.image" class="avatar"></image>
          <text>{{ shareImgData.name }}</text>
        </view>
        <view class="cont-text">
          {{ shareImgData.cert_content[0] }}
        </view>
        <view class="cont-text orange">{{ shareImgData.cert_content[1] }}</view>
        <view class="cont-text">{{ shareImgData.cert_content[2] }}</view>
        <view class="cont-text">{{ shareImgData.cert_content[3] }}</view>
        <view class="cont-rem">特颁此证</view>
      </view>
    </view>
    <!-- 首页进入 -->
    <view
      class="btn_cli"
      v-if="source == 'home'"
      @click="goToLoveDetailsHandle"
    >
      我也要帮助人
    </view>
    <!-- 证书的分享 -->
    <view class="btn_cli" v-if="source == 'readShare'">
      分享好友
      <button class="shareBtn" open-type="share" data-name="honorCard">
        分享好友
      </button>
    </view>
    <!-- 捐献进入 -->
    <template v-if="source == 'donate'">
      <view class="btn_cli" @click="backHandle"> 继续帮助更多人 </view>
      <!-- <view class="share_btn">
				<image class="share_btn-bg" src="/static/images/fenxiang_you@2x.png" mode="aspectFill"></image>
				<button open-type="share">分享好友</button>
			</view> -->
      <button open-type="share" class="new-btn">
        分享荣誉
        <image
          class="share_btn-bg"
          src="/static/images/fenxiang_you@2x.png"
          mode="aspectFill"
        ></image>
      </button>
    </template>
    <painter
      v-if="template"
      customStyle="width:626px;height:870px;position:fixed;bottom:-10000px;z-index:-10000;"
      @imgOK="onImgOk"
      @imgErr="imgErr"
      :palette="template"
      :dirty="true"
    />
  </view>
</template>

<script>
import palette from "./card.js";
export default {
  data() {
    return {
      shareBtn: true,
      template: "",
      source: "",
      shareImage: "",
      shareImgData: {
        share_title: "点亮全中国，一起攒能量 - share-title",
        name: "wendy---",
        avatar_url:
          "https:\/\/file.y1b.cn\/api3\/227733\/20230307\/a64069f1f79ecc.jpeg",
        cert_content: [
          "你捐献的46能量将助力",
          "【壹基金温暖包计划】",
          "谢谢你帮助乡村儿童温暖过冬，",
          "这个冬天有你不再冷!",
        ],
      },
    };
  },
  onShareAppMessage(data) {
    const shareImgData = JSON.stringify(this.shareImgData);
    // console.log('shareImgData', shareImgData)
    console.log(this.shareImage);
    let share = {
      imageUrl: this.shareImage,
      title: this.shareImgData.share_title || "点亮全中国，一起攒能量",
      path: `/pages/tabBar/home/index?type=shareReadPlan&shareImgData=${shareImgData}&com_id=${this.com_id}`,
    };
    // if (data.from == 'button') {
    //   share.path =`/pages/tabBar/home/index?type=shareReadPlan&shareImgData=${shareImgData}`;
    // }
    return share;
  },
  methods: {
    // 去捐献的详情页
    goToLoveDetailsHandle() {
      uni.navigateTo({
        url: `/pages/love/loveDetails/index?com_id=${this.com_id}`,
      });
    },
    backHandle() {
      uni.navigateBack({
        fail(e) {
          uni.reLaunch({
            url: "/pages/tabBar/shopMall/index",
          });
        },
      });
    },
    onImgOk(e) {
      this.shareImage = e.mp.detail.path || e.target.path;
    },
    imgErr(err) {
      console.log(err);
    },
  },
  onLoad(option) {
    console.log("option", JSON.parse(option.data));
    if (option.data) {
      this.shareImgData = JSON.parse(option.data);
    }
    if (option.source) {
      this.source = option.source;
    }
    if (option.com_id) {
      this.com_id = option.com_id;
    }
    this.template = palette(this.shareImgData);
    console.log("this.template", this.template);
  },
  // 页面周期函数--监听页面隐藏
};
</script>

<style lang="scss">
.share {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .share_box {
    width: 716rpx;
    height: 864rpx;
    position: relative;
    align-self: flex-end;
    z-index: 0;
  }

  .share_con {
    margin: 291rpx 50rpx 0 84rpx;
    font-size: 28rpx;
    text-align: left;
    color: #5f5d58;
    position: relative;
    z-index: 9;

    .cont_title {
      font-size: 36rpx;
      color: #333333;
      font-weight: 500;
    }

    .cont_text {
      margin: 40rpx 0;
    }

    .cont_rem {
      margin-top: 40rpx;
    }
  }

  .btn_cli {
    text-align: center;
    width: 460rpx;
    line-height: 82rpx;
    background: #ff8837;
    border-radius: 42rpx;
    font-size: 32rpx;
    color: #fff;
    margin: 22rpx auto 24rpx;
    border: 0;
    box-sizing: border-box;
    position: relative;
  }
}

.share_bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.share_icon {
  position: absolute;
  right: 0;
  top: -210rpx;
  width: 182rpx;
  height: 260rpx;
  z-index: -1;
}

.btn_icon {
  width: 140rpx;
  height: 40rpx;
}

.share_btn {
  position: relative;
  z-index: 0;
  width: 460rpx;
  line-height: 82rpx;
  border: 2rpx solid #ff8837;
  border-radius: 42rpx;

  .share_btn-bg {
    position: absolute;
    width: 140rpx;
    height: 40rpx;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: -1;
  }

  > button {
    opacity: 0;
  }
}
.new-btn {
  width: 460rpx;
  border: 2rpx solid #ff8837;
  height: 82rpx;
  border-radius: 42rpx;
  line-height: 82rpx;
  box-sizing: border-box;
  font-size: 32rpx;
  color: #e8782b;
  background: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  image {
    width: 20rpx;
    height: 18rpx;
    margin-left: 12rpx;
  }
}

// .share_btn{
//   position: relative;
//   z-index: 0;
//   width: 140rpx;
//   height: 40rpx;
//   .share_btn-bg {
//     position: absolute;
//     width: 100%;
//     height: 100%;
//     top: 0;
//     left: 0;
//     z-index: -1;
//   }
//   >button {
//     opacity: 0;
//   }
// }
.shareBtn {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}

// 新的分享框样式

.share-wrapper {
  width: 626rpx;
  height: 870rpx;
  position: relative;

  .share-icon {
    position: absolute;
    right: -60rpx;
    top: -210rpx;
    width: 182rpx;
    height: 260rpx;
    z-index: -1;
  }

  .share-bg {
    width: 100%;
    height: 100%;
  }

  .share-content {
    position: absolute;
    top: 290rpx;
    left: 80rpx;
    right: 80rpx;
    // left: 50%;
    // transform: translateX(-50%);

    .user-info {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 22rpx;

      .avatar {
        width: 60rpx;
        height: 60rpx;
        border-radius: 50%;
        margin-right: 16rpx;
      }

      text {
        color: #000018;
        font-size: 28rpx;
      }
    }

    .cont-text {
      
      color: #6b3813;
      font-size: 26rpx;
      margin-bottom: 24rpx;
      text-align: center;

      &.orange {
        color: #ff6f00;
      }
    }

    .cont-rem {
      text-align: center;
      font-size: 26rpx;
      color: #6b3813;
      margin-top: 30rpx;
    }
  }
}
</style>

<template>
	<view class="scan-code">
		<cover-view
      class="fixed"
      :style="{height:statusBarHeight+navBarHeight+'px', paddingTop: statusBarHeight+ 'px'}"
    >
      <cover-image
        class="back_icon"
        src="/static/images/back.png"
				mode="aspectFill"
        :style="{height:navBarHeight/2+'px',width:navBarHeight/2+'px'}"
        @click="backHome"
      >
      </cover-image>
    </cover-view>
    <!-- 自定义相机扫码 -->
    <xh-scan-code
      :openNow="false"
      @onScancode="onScancode"
      ref="xhScanCode"
    ></xh-scan-code>
    <!-- 扫码动画 -->
		<cover-view
      class="scan_anim"
      :style="{top: topNum+'%'}"
    >
			<cover-image class="scan-code-amin" mode="aspectFill"
			src="../static/scan_anim.png"></cover-image>
		</cover-view>
		<!-- <cover-view class="scan-tips">请对准二维码</cover-view> -->
		<cover-view class="scan-bottom">
      <cover-image class="scan-bottom_icon"
        src="../static/scan.png"
				mode="aspectFill">
      </cover-image>
      <cover-view class="scan-text">请扫中国红牛罐底码</cover-view>
    </cover-view>
		<!-- 隐私协议的组件 -->
		<privacy ref="privacy"></privacy>
  </view>
</template>

<script>
import { getNavbarData } from '../../../components/xhNavbar/xhNavbar.js';
import XhScanCode from '../../../components/xh-scan-code.vue'
export default {
  components: {
    XhScanCode
  },
  data() {
    return {
      statusBarHeight: 30,
      navBarHeight: 44,
      menuWidth: 110,
      timer: null,
      topNum: 10
    };
  },
  computed: {},
  methods: {
    onScancode(scanCode) {
      console.log('scanCode :>> ', scanCode);
      let pages = getCurrentPages();             //获取所有页面栈实例列表
      let prevPage = pages[ pages.length - 2 ];  //上一页页面实例
      prevPage.$vm.scanCodeVal = scanCode;         //修改上一页面的 couponNumber 参数值为 value
			uni.navigateBack();
    },
    backHome() {
			uni.navigateBack();
    },
  },
  watch: {},
  onLoad() {
  },
  onReady() {},
  onShow() {
    // 隐私协议判断
		this.$refs.privacy.LifetimesShow();
    getNavbarData().then(data => {
      this.navBarHeight = data.navBarHeight;
      this.statusBarHeight = data.statusBarHeight;
      this.menuWidth = data.menuWidth;
    });
    this.$refs.xhScanCode.reset();
    let topAniUp = true;
    this.timer = setInterval(() =>{
      if(topAniUp) {
        this.topNum +=1;
        if(this.topNum>50) {
          topAniUp = false;
        }
      } else {
        this.topNum -=1;
        if(this.topNum<10) {
          topAniUp = true;
        }
      }
    }, 50);
  },
  onUnload() {
    clearInterval(this.timer);
  }
}
</script>

<style scoped lang="scss">
.fixed{
  position: fixed;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 10000;
  .back_icon {
    width: 18rpx;
    height: 34rpx;
    padding: 0 5px;
		position: absolute;
		left: 0;
		top: 50%;
		padding: 8rpx 10rpx 10rpx 10rpx;
		margin-left: 20rpx;
		transform: translateY(-50%);
  }
}
.scan_anim {
  position: absolute;
  width: 100%;
  top: 10%;
  display: flex;
  justify-content: center;
  transform: all 1s;
}
.scan-code-amin {
  position: relative;
  width: 610rpx;
  height: 89rpx;
}
@keyframes scanCodeAmin {
		0% {
			top: 10%;
		}

		50% {
			top: 50%;
		}

		100% {
			top: 10%;
		}
	}

.scanCodeAmin {
  animation: scanCodeAmin linear 3s infinite;
}
.scan-tips {
    position: absolute;
    width: 100%;
    top: 60%;
    font-size: 28rpx;
    text-align: center;
    color: #ffffff;
    line-height: 40rpx;
}
.scan-code {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background-color: #333;
    .scan-bottom {
      width: 100%;
      height: 334rpx;
      background: rgba(0,0,0,0.86);
      position: absolute;
      bottom: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      .scan-bottom_icon {
        width: 236rpx;
        height: 178rpx;
      }
      .scan-text {
        font-size: 28rpx;
        text-align: center;
        color: #ffffff;
        line-height: 40rpx;
        margin-top: 20rpx;
      }
    }
}
</style>
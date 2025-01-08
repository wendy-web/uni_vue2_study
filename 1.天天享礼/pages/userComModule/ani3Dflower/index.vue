<template>
<view class="content">
  <view class="">
    <view class="cont_bg">
      <view class="cont_3d">
        <hj3-display-images
          :imagesList="imagesList"
          :vtouch="false"
          @itap="tapHandle"
          :autoplay="isAutoplay"
          :clockwise="true"
          :interval="intervalTime"
          :speakNum="speakNum"
          @current="currentHandle"
          ></hj3-display-images>
      </view>
    </view>
    <view :class="['ani_btn', inBtnActive ? 'active' : '']"
      @click="startBtn"
      @touchstart="touchStartHandle"
      @touchend="touchEndHandle"
    >
      <view :class="['ani_btn1',isEndClick ? 'active' : '' ]">
        <image class="ani_btn-txt" mode="heightFix"
        :src="!isStartClick ? 'https://file.y1b.cn/store/1-0/24130/65b8ae890eef6.png' : 'https://file.y1b.cn/store/1-0/24130/65b8af87449f9.png'"></image>
        <!-- https://file.y1b.cn/store/1-0/24131/65b9f8fa6117e.png -->
      </view>
    </view>
  </view>
  <image :class="['show_img', isShowImgBg ? 'active' : '']" mode="aspectFit" :src="showImgBig"></image>
  <view class="an_box">
    <view :style="{
      '--trans': transValue + 'rpx'
    }" class="an_txt">
				<view class="list_item" v-for="(item, index) in list" :key="index">{{item}}</view>
    </view>
  </view>
</view>
</template>
<script>
import hj3DisplayImages from '../components/hj3-display-images/hj3-display-images.vue';
export default {
  components: {
    hj3DisplayImages
  },
  data() {
    return {
      inBtnActive: false,
      imagesList: [
        {
          src:'https://test-file.y1b.cn/store/1-0/24126/65b36d32961c9.png',
        },
        {
          src:'https://test-file.y1b.cn/store/1-0/24126/65b36d53b0c84.png',
        },
        {
          src:'https://test-file.y1b.cn/store/1-0/24126/65b391fa6adac.png',
        },
        {
          src:'https://test-file.y1b.cn/store/1-0/24126/65b392192935f.png',
        },
        {
          src:'https://test-file.y1b.cn/store/1-0/24126/65b39231d7905.png',
        },
        {
          src:'https://test-file.y1b.cn/store/1-0/24126/65b3924c62745.png',
        },
        {
          src:'https://test-file.y1b.cn/store/1-0/24126/65b39260cab08.png',
        },
        {
          src:'https://test-file.y1b.cn/store/1-0/24126/65b392753b599.png',
        },
        {
          src:'https://test-file.y1b.cn/store/1-0/24126/65b3928d8b953.png',
        },
        {
          src:'https://test-file.y1b.cn/store/1-0/24126/65b392b2f0672.png',
        },
        {
          src:'https://test-file.y1b.cn/store/1-0/24126/65b392c5d85a7.png',
        },
        {
          src:'https://test-file.y1b.cn/store/1-0/24126/65b392d73376e.png',
        },
        {
          src:'https://test-file.y1b.cn/store/1-0/24126/65b3924c62745.png',
        },
        {
          src:'https://test-file.y1b.cn/store/1-0/24126/65b392192935f.png',
        },
      ],
      list: [
        '梵**花   抽中了酷狗优惠券',
        '好**连   抽中了红包',
        '新**乐   抽中了喜茶代金券',
        '阳*   抽中了支架优惠券',
        '好**连   抽中了红包',
        '新**乐   抽中了代金券',
        '好**连   抽中了红包',
        '广**仔   抽中了现金红包',
        '梵**花   抽中了酷狗优惠券',
        '好**连   抽中了红包',
        '新**乐   抽中了喜茶代金券',
        '阳*   抽中了支架优惠券',
        '好**连   抽中了红包',
        '新**乐   抽中了代金券',
        '好**连   抽中了红包',
        '广**仔   抽中了现金红包',
      ],
      showImgBig: 'https://test-file.y1b.cn/store/1-0/24126/65b36d32961c9.png',
      isShowImgBg: false,
      currentIndex: 0,
      intervalTime: 1000,
      isStartClick: false, // 开始抽奖的活动
      isEndClick: false,
      isAutoplay: true,
      speakNum: 20,
      addTimer: null,
      subTimer: null,
      transitionStyle: '',
      transValue: 0,

    }
  },
  computed: {
  },
  // 页面周期函数--监听页面加载
  async onLoad(option) {
  },
  onShow() {
    this.init();

  },
  methods: {
    currentHandle(index) {
      this.isShowImgBg = true;
      setTimeout(() => this.isShowImgBg = false, 3000);
      this.showImgBig = this.imagesList[index].src;
    },
    init() {
      setInterval(() => {
        this.transValue += 5;
        if(this.transValue > (346 * (this.list.length- 1))) this.transValue = 0;
      }, 40)
				// 主要通过 transition 的过度时间 控制 滚动速度
				// setTimeout(() => {
				// 	this.transitionStyle = 'transition: all 8s linear 0s;transform: translateX(-50%);'
				// 	setInterval(() => {
				// 		this.transitionStyle = ''
				// 		setTimeout(() => {
				// 			this.transitionStyle =
				// 				'transition: all 8s linear 0s;transform: translateX(-50%);'
				// 		}, 20)
				// 	}, 8000)
				// }, 20)
			},
    tapHandle (eventIndex) {
      this.currentIndex = eventIndex;
    },
    touchStartHandle(event){
      this.inBtnActive = true;
    },
    touchEndHandle() {
      this.inBtnActive = false;
      this.clearNumTimer();
      // if(this.isEndClick) return;
      if(this.isStartClick) {
        // this.speakNum = 50;
        this.isEndClick = true;
        this.interSubSpeak();
        return;
      }
      this.speakNum = 100;
      this.isStartClick = true;
      this.interAddSpeak();
    },
    clearNumTimer() {
      clearTimeout(this.addTimer);
      clearTimeout(this.subTimer);
      this.addTimer = null;
      this.subTimer = null;
    },
    interAddSpeak() {
      this.addTimer = setTimeout(() => {
        if(this.speakNum <= 5) this.speakNum += 2;
        if(this.speakNum > 5 &&this.speakNum <= 15) this.speakNum += 2;
        if(this.speakNum > 15 &&this.speakNum <= 200) this.speakNum += 50;
        if(this.speakNum < 200){
          this.interAddSpeak();
        };
      }, 500);
    },
    interSubSpeak() {
      this.subTimer = setTimeout(() => {
        if(this.speakNum > 0 && this.speakNum <= 5) this.speakNum -= 1;
        if(this.speakNum > 5 &&this.speakNum <= 15) this.speakNum -= 5;
        if(this.speakNum > 15 &&this.speakNum <= 30) this.speakNum -= 10;
        if(this.speakNum > 30 &&this.speakNum <= 50) this.speakNum = 20;
        if(this.speakNum > 50) this.speakNum = 50;
        if(this.speakNum >= 10) {
          this.interSubSpeak();
        } else {
          this.isStartClick = false;
          this.isEndClick = false;
        }
      }, 500);
    },
    startBtn() {
    },
    intervalTimeFun(intervalTime = 500) {
      setTimeout(() => {
        // this.speakNum -= 5;
        if(this.speakNum > 80) this.speakNum -= 15;
        if(this.speakNum < 80 && this.speakNum >= 60) this.speakNum -= 20;
        if(this.speakNum < 60 && this.speakNum > 10) this.speakNum -= 5;
        // if(this.speakNum < 40 && this.speakNum >= 10) this.speakNum -= 15;
        if(this.speakNum <= 10 && this.speakNum > 5) this.speakNum -= 2;
        if(this.speakNum <= 5 && this.speakNum >0) {
          this.speakNum -= 1;
          return this.intervalTimeFun(1000);
        };
        // if(this.speakNum < 60 && this.speakNum > 60) this.speakNum -= 20;
        if(this.speakNum >= 10) return this.intervalTimeFun();
        this.isStartClick = false;
        this.isEndClick = false;
      }, intervalTime)
    }
  }
}
</script>

<style lang="scss">
.content {
  position: fixed;
  z-index: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  &::before {
    content: '\3000';
    background: url("https://file.y1b.cn/store/1-0/24131/65b9fc1c0cd6a.png") 0 0 / 100% 100%;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
}
.show_img{
  position: absolute;
  width: 100rpx;
  height: 286rpx;
  margin-top: -170rpx;
  opacity: 0;
  &.active {
    animation: imgAni 2s linear;
    // animation-duration: 1.3s;
  }
}
@keyframes imgAni {
    0% {
      transform: scale(.5);
      opacity: 0;
    }
    50% {
      transform: scale(4);
      opacity: 1;
    }
    80% {
      transform: scale(4);
      opacity: 1;
    }
    100% {
      transform: scale(4);
      opacity: 0;
    }
}
.cont_bg {
  width: 686rpx;
  height: 886rpx;
  position: relative;
  margin-top: -120rpx;
  &::before {
    content: '\3000';
    background: url("https://file.y1b.cn/store/1-0/24130/65b8cc8620767.png") 0 0 / 100% 100%;
    position: absolute;
    left: 0;
    top: 0;
    width: 686rpx;
    height: 698rpx;
    z-index: -1;
  }
  &::after {
    content: '\3000';
    background: url("https://test-file.y1b.cn/store/1-0/24126/65b386df653e6.png") 0 0 / 100% 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 680rpx;
    height: 268rpx;
    z-index: -1;
  }
  .cont_3d {
    position: absolute;
    width: 460rpx;
    height: 286rpx;
    left: 25%;
    bottom: 210rpx;
    transform: scale(.55);
  }
}
.ani_btn{
  width: 508rpx;
  height: 140rpx;
  position: relative;
  z-index: 0;
  // background: url("https://test-file.y1b.cn/store/1-0/24126/65b3886782db8.png") 0 0 / 100% 100%;
  margin: 124rpx auto 0;
  &::before {
    content: '\3000';
    background: url("https://file.y1b.cn/store/1-0/24130/65b8cd6174b8b.png") 0 0 / 100% 100%;
    position: absolute;
    left: 50%;
    top: 50%;
    width: 750rpx;
    height: 378rpx;
    transform: translate(-50%, -50%);
    z-index: -1;
  }
  &::after {
    content: '\3000';
    background: url("https://test-file.y1b.cn/store/1-0/24126/65b3886782db8.png") 0 0 / 100% 100%;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
  .ani_btn1{
    width: 458rpx;
    height: 128rpx;
    display: block;
    margin: 0 auto;
    position: relative;
    z-index: 0;
    top: -34rpx;
    display: flex;
    justify-content: center;
    transition: all .3s;
    &::after {
      content: '\3000';
      background: url("https://file.y1b.cn/store/1-0/24130/65b8ad1b784a9.png") 0 0 / 100% 100%;
      // background: url("https://file.y1b.cn/store/1-0/24131/65b9f8fa6117e.png") 0 0 / 100% 100%;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 0;
      width: 458rpx;
      height: 128rpx;
      z-index: -1;
    }
    &.active::after {
      background: url("https://file.y1b.cn/store/1-0/24131/65b9fc4408ad1.png") 0 0 / 100% 100%;
    }
  }
  &.active {
    .ani_btn1{
      top: -15rpx;
    }
  }
  .ani_btn-txt {
    width: 284rpx;
    height: 52rpx;
    margin-top: 12rpx;
  }
}
.an_box {
  position: absolute;
  line-height: 50rpx;
  width: 656rpx;
  box-sizing: border-box;
  left: 50%;
  transform: translateX(-50%);
  bottom: 120rpx;
  background: linear-gradient(270deg,rgba(255,255,255,0.00), rgba(255,255,255,0.10));
  border-radius: 26rpx;
  box-shadow: 3rpx 3rpx 8rpx 0rpx rgba(255,255,255,0.06) inset;
  padding: 0 16rpx;
  font-size: 24rpx;
  text-align: left;
  color: rgba(255,255,255,0.90);
  overflow: hidden;
  .an_txt {
    display: flex;
    transform: translateX(calc(0px - var(--trans)));
    transition: all .05s;
    .list_item{
      width: 346rpx;
      flex: 0 0 346rpx;
      white-space: nowrap;
    }
  }
}
</style>

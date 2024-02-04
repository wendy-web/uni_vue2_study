<template>
<view class="recharge" :style="{'--bg': subjectColor}">
<mescroll-body
  :sticky="true"
  ref="mescrollRef"
  @init="mescrollInit"
  @down="downCallback"
  @up="upCallback"
  :up="upOption"
  :down="downOption"
>
<xh-navbar
  :leftImage="imgUrl+'/static/images/left_back.png'"
  @leftCallBack="$topCallBack"
  :navberColor="subjectColor"
  :fixed="true"
  :fixedNum="9"
>
<view slot="title" class="nav-custom">
  <image class="title_icon" src="https://file.y1b.cn/store/1-0/23817/64dde71999d9c.png" mode="aspectFill"></image>
</view>
</xh-navbar>
<view class="wrap">
  <btnIndex class="rotaBtn" :leftAndright1Deg="15" :leftAndright2Deg="25"
    @change="changeHandle" @gotoHandle="gotoHandle"/>
</view>
<view class="prop_css">
  <view class="container">
    <view class="item"> <image class="title_icon" src="https://ruiheng1201.oss-cn-beijing.aliyuncs.com/app/dev/images/20210224/map.png" mode="scaleToFill"></image></view>
    <view class="item"> <image class="title_icon" src="https://ruiheng1201.oss-cn-beijing.aliyuncs.com/app/dev/images/20210224/coupon.png" mode="scaleToFill"></image></view>
    <view class="item"> <image class="title_icon" src="https://ruiheng1201.oss-cn-beijing.aliyuncs.com/app/dev/images/20210224/mem.png" mode="scaleToFill"></image></view>
    <view class="item"> <image class="title_icon" src="https://ruiheng1201.oss-cn-beijing.aliyuncs.com/app/dev/images/20210224/point.png" mode="scaleToFill"></image></view>
    <view class="item"> <image class="title_icon" src="https://ruiheng1201.oss-cn-beijing.aliyuncs.com/app/dev/images/20210224/activty.png" mode="scaleToFill"></image></view>
    <view class="item"> <image class="title_icon" src="https://ruiheng1201.oss-cn-beijing.aliyuncs.com/app/dev/images/20210224/mall_select.png" mode="scaleToFill"></image></view>
    <view class="item"> <image class="title_icon" src="https://ruiheng1201.oss-cn-beijing.aliyuncs.com/app/dev/images/20210224/mall_select.png" mode="scaleToFill"></image></view>
</view>

</view>
</mescroll-body>
</view>
</template>

<script>
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { getImgUrl } from '@/utils/auth.js';
import btnIndex from '../components/rotateBtn/index';
export default {
  mixins: [MescrollMixin], // 使用mixin
  components: {
    btnIndex
  },
  data() {
    return {
			imgUrl: getImgUrl(),
      list: []
    }
  },
  computed: {
  },
  // 页面周期函数--监听页面加载
  async onLoad(option) {
  },
  methods: {
    async upCallback(page) {
      this.mescroll.endSuccess(0, false);
      return;
    },
    // 旋转事件
    changeHandle(index){
      console.log(index, 'index')
    },
    // 点击事件
    gotoHandle(index){
      console.log(index, 'index')
    },
		onPageScroll(event) {
      const scrollTop = Math.ceil(event.scrollTop);
      this.scrollTop = scrollTop;
    },
    warpRectDom(idName) {
			return new Promise(resolve => {
				setTimeout(() => {
          // 延时确保dom已渲染, 不使用$nextclick
					let query = uni.createSelectorQuery();
					// #ifndef MP-ALIPAY
					query = query.in(this) // 支付宝小程序不支持in(this),而字节跳动小程序必须写in(this), 否则都取不到值
					// #endif
					query.select('#'+ idName).boundingClientRect(data => {
						resolve(data)
					}).exec();
				}, 20)
			})
		},
  }
}
</script>

<style lang="scss">
.recharge{
  background: var(--bg);
  position: relative;
  font-size: 0;
  .recharge_cont {
    padding: 0 32rpx;
  }
}
.nav-custom {
		position: absolute;
		font-size: 0;
		top: 50%;
		transform: translateY(-50%);
		left: 84rpx;
		.title_icon{
      width: 154rpx;
      height: 36rpx;
    }
}
.banner_com{
  width: 100%;
}

.banner_box {
  position: sticky;
  top: 110rpx;
  border-radius: 32rpx 32rpx 0 0;
  z-index: 1;
  width: 100%;
  background: var(--bg);
  .ban_more {
    width: 78rpx;
    height: 154rpx;
    position: absolute;
    top: 22rpx;
    right: 0;
    z-index: 1;
  }
  .ban_index-box{
    height: 12rpx;
    background: #e1e1e1;
    border-radius: 6rpx;
    margin-bottom: 32rpx;
    .ban_index-active{
      height: 100%;
      background: #f98306;
      border-radius: 6rpx;
      position: relative;
    }
  }
  .bean_list-box{
    padding: 32rpx 20rpx;
    box-sizing: border-box;
    position: relative;
    z-index: 0;
  }
}
.prop_css{
  perspective: 800px;
  display: flex;
  align-items: center;
  justify-content: center;

}
.container {
  width: 50px;
  height: 100px;
  position: relative;
  transform-style: preserve-3d;
  animation: action 30s linear infinite;
  animation-play-state: paused;
  .item {
    width: 100%;
    height: 100%;
    position: absolute;
    // -webkit-box-reflect: below 15px linear-gradient(transparent 20%, rgba(0, 0, 0, 0.3));
    .title_icon {
        width: 100%;
        height: 100%;
        object-fit: cover;
        background-color: gray;
    }
  }
}
.container .item:nth-child(1) {
    transform: translateZ(500px);
}

.container .item:nth-child(2) {
    transform: rotateY(60deg) translateZ(00px);
}

.container .item:nth-child(3) {
    transform: rotateY(120deg) translateZ(500px);
}

.container .item:nth-child(4) {
    transform: rotateY(180deg) translateZ(500px);
}

.container .item:nth-child(5) {
    transform: rotateY(240deg) translateZ(500px);
}

.container .item:nth-child(6) {
    transform: rotateY(300deg) translateZ(500px);
}

@keyframes action {
    from {
        transform: rotateY(0deg);
    }

    to {
        transform: rotateY(360deg);
    }
}

.container:hover {
    animation-play-state: running;
}

.container:hover .item {
    box-shadow: 0 0 15px 10px white;
}
</style>

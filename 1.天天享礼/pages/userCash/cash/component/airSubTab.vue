<template>
<view class="sub_tab-box"  id="airSubTab">
  <view class="sub_tab">
    <view :class="['active_bg', subIndex ? 'active' : '']"></view>
    <view v-for="(item, index) in subList" :key="index"
      :class="['sub_tab-item fl_center', subIndex == index ? 'active' : '']"
      @click="subTabHandle(index)"
    >
		<image :src="subIndex == index ? item.icon_active : item.icon" mode="scaleToFill" class="sub_tab-icon"></image>
		{{item.text}}
    </view>
  </view>
</view>
</template>
<script>
  export default {
    props: {
      isShow: {
        type: Boolean,
        default: false
      },
      subIndex: {
        type: Number,
        default: 0
      },
	  subList: {
		type: Array,
		default: []
	  }
    },
    data() {
      return {
      };
    },
    mounted() {
      this.$nextTick(()=> setTimeout(() => this.domFun(), 1000));
    },
    methods: {
      subTabHandle(index) {
        this.$emit('selTab', index);
      },
      domFun(){
        this.initWarpRect('airSubTab').then(res=> {
          this.$emit('airSubTabRef', res);
        });
      },
      initWarpRect(id) {
        return new Promise(resolve => {
          setTimeout(() => { // 延时确保dom已渲染, 不使用$nextclick
            let query = uni.createSelectorQuery();
            // #ifndef MP-ALIPAY
            query = query.in(this) // 支付宝小程序不支持in(this),而字节跳动小程序必须写in(this), 否则都取不到值
            // #endif
            query.select('#' + (id || this.viewId)).boundingClientRect(data => {
              resolve(data)
            }).exec();
          }, 20)
        })
      }
    },
  };
</script>
<style lang="scss" scoped>
.sub_tab-box{
  overflow: hidden;
}
.sub_tab {
		margin: 32rpx 16rpx 0;
		background: rgba(0,0,0,0.14);
		border-radius: 28rpx;
		display: flex;
		text-align: center;
		padding: 4rpx;
		position: relative;
		z-index: 0;
		.active_bg {
			width: calc(50% - 4rpx);
			flex: 0 0 354rpx;
			height: 64rpx;
			background: rgba(255,255,255,0.95);
			border-radius: 24rpx;
			position: absolute;
      transform: translateX(0);
			z-index: 0;
			transition: all .3s;
      &.active {
        transform: translateX(100%);
      }
		}
		.sub_tab-item {
      flex: 1;
			position: relative;
			color: #fff;
			font-weight: bold;
			line-height: 64rpx;
			&.active{
				color: #333;
			}
			.sub_tab-icon {
				position: relative;
				width: 66rpx;
				height: 66rpx;
				margin-right: 12rpx;
				top: -12rpx;
			}
		}
	}
</style>

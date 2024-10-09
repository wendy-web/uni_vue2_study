<template>
<view class="me-tabs fl_col_cen">
	<scroll-view class="bean_list-box"
		scroll-x="true"
		scroll-with-animation
		:scroll-animation-duration="300"
		:scroll-left="bannerScrollLeft"
		@scroll="banScrollHandle"
	>
      <view class="swiper-item box_fl">
        <view v-for="(item, index) in tabList" :key="index"
          :class="['list_item', 'fl_col_cen', index == tabIndex ? 'active' :'']"
		      :id="'tabItemId'+index" @click="tabChangeHandle(index)">
          <view class="icon_box fl_center">
            <image class="bg_img" src="https://file.y1b.cn/store/1-0/23118/654b2f93be504.png" mode="widthFix"></image>
            <image class="item_icon" :src="item.img" mode="widthFix"></image>
          </view>
          <view class="txt_box">
            <image class="txt_icon" src="https://file.y1b.cn/store/1-0/23118/654b2fb5a45a5.png" mode="widthFix"></image>
            {{item.name}}
          </view>
        </view>
      </view>
    </scroll-view>
	  <view class="ban_index-box" :style="{width: bannerWidth + 'px'}"
      v-if="tabList.length > 5">
      <view class="ban_index-active" :style="{ width: bannerActiveWidth + 'px', left: banLeft + 'px'}"></view>
    </view>
</view>
</template>

<script>
import getViewPort from '@/utils/getViewPort.js';
	export default {
		props: {
			tabList: {
				type: Array,
				default () {
					return []
				}
			},
			tabIndex: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				bannerWidth: 16,
      	bannerActiveWidth: 16,
				banLeft: 0,
        maxBanLeft: 16,
				bannerScrollLeft: 0,
				BanItemWidth: uni.upx2px(136),
        windowWidth: 0
			}
		},
		computed: {
			bannerContWidth() {
				// banner的组件的长度
				let viewPort = getViewPort();
				return viewPort.screenWidth - uni.upx2px(40);
			}
		},
		watch: {
			tabIndex(newValue) {
				this.scrollCenter(); // 水平滚动到中间
			},
      tabList(newValue) {
        const listTabValue = Math.ceil(newValue.length / 5);
        this.bannerWidth = this.bannerActiveWidth * listTabValue;
        this.maxBanLeft = this.bannerWidth - this.bannerActiveWidth;
      }
		},
		created() {
			let sys = uni.getSystemInfoSync();
			this.windowWidth = sys.windowWidth
			this.windowTop = sys.windowTop;
		},
		methods: {
			// banner的左右滑动
			banScrollHandle(event) {
				const { scrollLeft } = event.detail;
				const BanItemWidth  = this.BanItemWidth;
				const BanItemLen  = BanItemWidth * this.tabList.length - this.bannerContWidth;
				const leftS = this.bannerWidth - this.bannerActiveWidth;
				let banLeft = (scrollLeft / BanItemLen) * leftS;
        const maxBanLeft = this.bannerWidth
        banLeft = banLeft <=0 ? 0 : banLeft;
        banLeft = banLeft >= this.maxBanLeft ? this.maxBanLeft : banLeft;
				this.banLeft = banLeft;
			},
			tabChangeHandle(index) {
				if (this.tabIndex != index) {
					this.$emit("input", index);
					this.$emit("change", index);
				}
			},
			async scrollCenter() {
				let diff = 0;
				diff = this.BanItemWidth * this.tabIndex - this.windowWidth/2;
				this.bannerScrollLeft = diff;
				// #ifdef MP-TOUTIAO
				this.scrollTimer && clearTimeout(this.scrollTimer)
				this.scrollTimer = setTimeout(() => { // 字节跳动小程序,需延时再次设置scrollLeft,否则tab切换跨度较大时不生效
					this.bannerScrollLeft = Math.ceil(diff)
				}, 400)
				// #endif
			},
		}
	}
</script>

<style lang="scss">
@import '@/static/css/mixin.scss';
.me-tabs {
	width: 100%;
}
.bean_list-box{
    padding: 32rpx 20rpx;
    box-sizing: border-box;
    position: relative;
    z-index: 0;
}
.swiper-item {
    .list_item {
      width: 136rpx;
      flex: 0 0 136rpx;
      &:last-child {
        margin-right: 0;
      }
      &.active {
        .icon_box .bg_img,
        .txt_box .txt_icon {
          opacity: 1;
        }
      }
      .icon_box{
        width: 108rpx;
        height: 88rpx;
        position: relative;
        z-index: 0;
        background: linear-gradient(180deg,#ffffff, rgba(255,255,255,0.30));
        border-radius: 46rpx;
        .bg_img {
          opacity: 0;
        }
        .item_icon{
          width: 66rpx;
          height: 88rpx;
        }
      }
      .txt_box {
        font-size: 24rpx;
        font-weight: 600;
        text-align: center;
        color: #333333;
        line-height: 34rpx;
        position: relative;
        z-index: 0;
        margin-top: 12rpx;
        .txt_icon {
          width: 74rpx;
          height: 40rpx;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: -1;
          opacity: 0;
        }
      }
    }
}
.ban_index-box {
    height: 12rpx;
    background: #e1e1e1;
    border-radius: 6rpx;
    margin-bottom: 32rpx;
    .ban_index-active {
      height: 100%;
      background: #f98306;
      border-radius: 6rpx;
      position: relative;
    }
}
</style>

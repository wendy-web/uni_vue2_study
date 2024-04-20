<template>
<view class="cont-tabs" id="contBox">
<!-- 列表内容 -->
<scroll-view class="cont_list-box"
	:scroll-y="isListDisScroll"
	scroll-with-animation
	:scroll-animation-duration="300"
	@scroll="listScrollHandle"
	:style="{maxHeight: mescrollHeight}"
	:scroll-into-view="scrollTopId"
>
	<view
		class="tabList-item"
		v-for="(itemL, idx) in tabList"
		:key="idx"
		:id="'tabItemId'+idx"
		:style="{minHeight: (tabList.length-1) == idx ? mescrollHeight : 0}"
	>
		<view class="cont_title fl_center">
			<image class="cont_title-icon" :src="itemL.img" mode="widthFix"></image>
			<view class="cont_title-txt">{{itemL.name}}</view>
		</view>
		<view class="cont_list" v-if="itemL.child.length">
			<view class="cont_list-item fl_center"
				v-for="(item, index) in itemL.child" :key="index"
				@click="couponDetailHandle(item)"
			>
            <view class="cont_img">
                <van-image
                    height="180rpx" width="180rpx"
                    radius="24rpx" use-loading-slot
                    :src="item.image"
                ><van-loading slot="loading" type="spinner" size="12" vertical />
                </van-image>
            </view>
			<view class="cont_txt fl_col_sp_bt">
				<view class="cont_txt-title txt_ov_ell2">
					<view class="ty_store" v-if="item.type == 12"></view><!-- 到店吃 -->
					{{ item.title }}
				</view>
				<view class="cont_txt-lab">
					<view class="use_cont-right" v-if="userInfo.is_vip">0豆特权</view>
					<view class="item_remind box_fl">
						<view class="vip_credits" v-if="Number(item.credits)">
							<text :class="['item_credits', userInfo.is_vip ? 'active' : '']">{{ item.credits || 0 }}</text>牛金豆
						</view>
						<view class="txt_lab">{{ item.exch_user_num + item.user_num }}人兑换</view>
					</view>
				</view>
			</view>
			</view>
		</view>
	</view>
</scroll-view>
</view>
</template>

<script>
import { getImgUrl } from "@/utils/auth.js";
import goDetailsFun from '@/utils/goDetailsFun';
import { mapGetters } from 'vuex';
export default {
	mixins: [goDetailsFun], // 使用mixin
	props: {
		tabList: {
			type: Array,
			default () {
				return []
			}
		},
		mescrollHeight: {
			type: String,
			default: ''
		},
		tabIndex: { // 当前显示的下标 (使用v-model语法糖: 1.props需为value; 2.需回调input事件)
			type: [String, Number],
			default: 0
		},
		isListDisScroll: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
            cardImgUrl:`${getImgUrl()}static/card/`,
			topValue: 0,
			scrollTop: 0,
			isScroll: true,
			timer: null
		}
	},
	computed: {
        ...mapGetters([ "userInfo"]),
		scrollTopId() {
			return `tabItemId${this.tabIndex}`
		}
	},
	watch: {
		tabList: {
			handler() {
				this.$nextTick(()=>{
					setTimeout(() => {
						this.itemDomFun();
					}, 1000);
				});
			},
			immediate: true,
			deep: false
		},
		tabIndex(newValue) {
			clearTimeout(this.timer);
			this.timer = null;
			this.isScroll = false;
			this.timer = setTimeout(() => {
				this.isScroll = true;
			}, 500);
		}
	},
	created() {
	},
	methods: {
		// 列表的上下滚动
		async listScrollHandle(event) {
			let { scrollTop } = event.detail;
			scrollTop = Math.ceil(scrollTop);
			// const tabItemId = `tabItemId${this.tabIndex}`;
			// const res = await this.initWarpRect(tabItemId);
			// let currentIndex = this.tabList.findIndex(event => {
			// 	if(scrollTop <= event.top){
			// 		return true;
			// 	}
			// });
			// const tabsLength = this.tabList.length;
			// const tabsLengthDom = this.tabList[tabsLength-1];
			// if(currentIndex == -1 && scrollTop < (tabsLengthDom.top + tabsLengthDom.height)) {
			// 	currentIndex = tabsLength;
			// }
			// if(!this.isScroll) return;
			// currentIndex = currentIndex -1;
			// if(scrollTop <= 5) {
			// 	currentIndex = 0
			// }
			let currentIndex = this.tabList.findIndex(event => {
				if(scrollTop < event._top){
					return true;
				}
			});
			if(!this.isScroll) return;
			this.$emit('scroll', currentIndex, scrollTop);
		},
		itemDomFun(){
			this.initWarpRect('contBox').then(res =>  this.topValue = res.top );
			this.tabList.forEach((res, index) => {
				const tabItemId = `tabItemId${index}`;
				this.initWarpRect(tabItemId).then(result => {
					res.top = result.top - this.topValue;
					res.height = result.height;
					if(index == 0) {
						res._top = result.height;
					} else {
						res._top = result.height + this.tabList[index-1]._top;
					}
				});
			});
		},
		couponDetailHandle(item) {
			this.detailsFun_mixins(item, {})
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
	}
}
</script>
<style lang="scss" scoped>
.cont_list-box {
  background: #ffffff;
  border-radius: 32rpx;
  padding: 0 32rpx;
  box-sizing: border-box;
  overflow: hidden;
  .tabList-item {
	box-sizing: border-box;
	&:first-child .cont_title {
		padding-top: 32rpx;
	}
	&:last-child {
      padding-bottom: 40rpx;
      padding-bottom: calc(40rpx + constant(safe-area-inset-bottom));
      /* 兼容 IOS<11.2 */
      padding-bottom: calc(40rpx + env(safe-area-inset-bottom));
    }
  }
  .cont_title {
	font-size: 0;
    text-align: center;
	padding-top: 58rpx;
	.cont_title-icon {
		width: 44rpx;
		height: 44rpx;
		margin-right: 12rpx;
	}
	.cont_title-txt {
		font-size: 32rpx;
    	font-weight: 600;
		color: #333333;
		line-height: 44rpx;
	}
  }

  .cont_list{
    margin-top: 40rpx;
    .cont_list-item {
      margin-top: 44rpx;
      &:first-child {
        margin-top: 0;
      }
      .cont_img {
        width: 180rpx;
        height: 180rpx;
        border-radius: 24rpx;
        margin-right: 24rpx;
      }
      .cont_txt{
        flex: 1;
        align-self: stretch;
        .cont_txt-title{
          font-size: 28rpx;
          font-weight: 600;
          text-align: left;
          color: #333333;
          line-height: 40rpx;
        }
        .cont_price{
          font-size: 26rpx;
          color: #e7331b;
          line-height: 36rpx;
          &.cre_vip{
            color: #666;
            text-decoration:  line-through;
            font-size: 26rpx;
            .cont_price-num{
                font-size: 26rpx;
                line-height: 1;
                margin-right: 0;
                font-weight: 400;
            }
          }
          .cont_price-num {
            font-size: 36rpx;
            font-weight: 500;
            line-height: 48rpx;
            margin-right: 8rpx;
          }
        }
        .txt_lab {
          font-size: 26rpx;
          color: #aaaaaa;
          line-height: 36rpx;
        }
      }
    }
  }
}
.vip_box{
    font-size: 32rpx;
    font-weight: 500;
    color: #f84842;
    line-height: 44rpx;
	margin-top: 10rpx;
}
.use_cont-right{
    color: #c16e15;
    display: flex;
    align-items: center;
	font-size: 22rpx;

    &::before {
      content: "\3000";
      width: 24rpx;
      height: 24rpx;
      background: url("https://test-file.y1b.cn/store/1-0/24312/65f024b3cdd36.png")  0 0 / 100% 100% no-repeat;
      margin-right: 5rpx;
    }
}
.item_remind {
	font-size: 26rpx;
	color: #e7331b;
	line-height: 36rpx;
	white-space: nowrap;
	width: 100%;
	margin-top: 20rpx;
	.vip_credits {
		margin-right: 10rpx;
	}
	.item_credits {
        font-size: 36rpx;
        margin-right: 4rpx;
        font-weight: 500;
        &.active {
          text-decoration: line-through;
        }
    }
}
.ty_store {
  width: 118rpx;
  height: 34rpx;
  background: url("https://test-file.y1b.cn/store/1-0/24412/6619090ba6bf5.png") 0 0 / 100% 100% no-repeat;
  margin-right: 8rpx;
  transform: translateY(8rpx);
  display: inline-block;
}
</style>

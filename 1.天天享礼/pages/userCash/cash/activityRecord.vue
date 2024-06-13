<template>
<view class="record_box">
<mescroll-body id="mescrollBody" ref="mescrollRef" :sticky="true" @init="mescrollInit" @down="downCallback"
	:down="downOption" :up="upOption" @up="upCallback">
	<view class="item_box">
		<view class="item_list" v-for="(item, index) in listData" :key="index">
			<view class="type_top">
				<view class="type_lft">
					<image class="type_top-icon" mode="scaleToFill"
					src="https://test-file.y1b.cn/store/1-0/24226/65dc446057637.png"></image>
					<view class="type_lft-label">
						凑{{item.order_num}}单领奖品
						<text style="color: #999;">（{{item.times}}）</text>
					</view>
				</view>
				<view class="type_rit" v-if="item.logistics_number">已发货</view>
			</view>
			<view class="list_item fl_center">
				<van-image
					width="144rpx" height="144rpx"
					:src="item.gift_img"
					use-loading-slot
					class="item_left" radius="8rpx"
				><van-loading slot="loading" type="spinner" size="20" vertical />
				</van-image>
				<view class="item_right">
					<view class="txt_ov_ell2">{{ item.gift_name }}</view>
					<view class="item_right-lab">已凑{{ item.have_order }}单</view>
				</view>
			</view>
			<view class="lab_cont fl_bet" v-if="item.logistics_number">
				<view class="fl_bet">
					<!-- <image class="lab_cont-icon" mode="scaleToFill"
						src="https://test-file.y1b.cn/store/1-0/24226/65dc4a8b79127.png"></image> -->
					{{ item.logistics_company }}<text class="log_num">{{item.logistics_number}}</text>
				</view>
				<view style="color: #3376FF;" @click="copyHandle(item.logistics_number)">复制</view>
			</view>
			<view class="lab_cont box_fl" v-else-if="item.delivery_time">
				<image class="lab_cont-icon" mode="scaleToFill"
					src="https://test-file.y1b.cn/store/1-0/24226/65dc4a8b79127.png"></image>
					{{ item.delivery_time }}后发货
				<!-- <text class="lab_cont-txt">发货后无法修改收货信息</text> -->
			</view>
			<view class="box_fl_end" v-if="item.is_address">
				<view :class="['repair_btn', item.is_address == 1 ? 'active' : '']"
				@click="repairHandle(item)">
					{{item.is_address == 2 ? '填写信息' : '修改信息'}}
				</view>
			</view>
		</view>
	</view>
</mescroll-body>
<freeRepairAddressDia
	:isShow="isShowSelAddDia"
	:selItem="selItem"
	@close="isShowSelAddDia = false"
	@submit="submitHandle"
></freeRepairAddressDia>
</view>
</template>
<script>
import {
activeLog
} from '@/api/modules/cash.js';
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import freeRepairAddressDia from './component/freeRepairAddressDia.vue';
export default {
	mixins: [MescrollMixin], // 使用mixin
	components: {
		freeRepairAddressDia
	},
	data() {
		return {
			downOption: {
				auto: true,
				use: true,
				bgColor: "#ffffff",
			},
			upOption: {
				auto: false, // 不自动加载
				use: true,
				page: {
					num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
					size: 10, // 每页数据的数量
				},
				noMoreSize: 4,
			},
			isShowSelAddDia: false,
			active_id: 0,
			listData: [],
			selItem: null
		}
	},
	// 页面周期函数--监听页面加载
	async onLoad(option) {
		if(option.active_id) this.active_id = option.active_id;
	},
	methods: {
		copyHandle(str) {
			uni.setClipboardData({
				data: str,
				success: () => this.$toast('复制成功')
			})
		},
		repairHandle(item) {
			const { is_address } = item;
			if(is_address == 1) return;
			this.selItem = item;
			this.isShowSelAddDia = true;
		},
		submitHandle() {
			this.isShowSelAddDia = false;
		},
		async downCallback() {
			this.mescroll.resetUpScroll();
		},
		async upCallback(page) {
			const params = {
				active_id: this.active_id,
				size: 10,
				page: page.num
			}
			activeLog(params).then(res => {
				if(res.code != 1 || !res.data) return;
				const { list, total_count} = res.data;
				if (page.num == 1) this.listData = []; //如果是第一页需手动制空列表
				this.listData = this.listData.concat(list); //追加新数据
				this.mescroll.endBySize(list.length, total_count);

			}).catch(err =>  this.mescroll.endErr());
		},
		onPageScroll(event) {
		},
	}
}
</script>
<style lang="scss" scoped>
.record_box {
	position: relative;
	z-index: 0;
	box-sizing: border-box;
	background: #f7f7f7;
	overflow: hidden;
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
}
.item_box{
	padding-top: 20rpx;
}
.item_list {
	margin: 0 16rpx 16rpx;
	background: #fff;
	border-radius: 24rpx;
	overflow: hidden;
	color: #333;
	padding-bottom: 24rpx;

}
.type_top {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 18rpx 24rpx 18rpx 26rpx;
	border-bottom: 2rpx solid #f1f1f1;
	.type_lft {
		display: flex;
		align-items: center;
		font-size: 26rpx;
		font-weight: 500;
		line-height: 36rpx;
		overflow: hidden;
		.type_lft-label{
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
			flex: 1;
		}
	}
	.type_top-icon {
		width: 36rpx;
		height: 36rpx;
		margin-right: 10rpx;
	}
	.type_rit {
		font-size: 26rpx;
		color: #666;
	}
}
.order {
	padding: 19rpx 24rpx 26rpx;
	.order_cont{
		display: flex;
		justify-content: space-between;
		margin-top: 13rpx;
	}
	.order_type{
		height: 36rpx;
		font-size: 26rpx;
		text-align: left;
		color: #aaa;
		line-height: 36rpx;
	}
	.order_num {
		height: 40rpx;
		font-size: 28rpx;
		color: #333333;
		line-height: 40rpx;
		margin-left: 10rpx;
	}
}
.list_item {
  margin: 33rpx 24rpx 0;
  box-sizing: border-box;
  .item_left {
    width: 144rpx;
    height: 144rpx;
    border-radius: 12rpx;
    margin-right: 24rpx;
    flex: 0 0 144rpx;
    position: relative;
    .list_item-txt{
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      font-size: 22rpx;
      text-align: center;
      color: #ffffff;
      line-height: 36rpx;
      background: rgba(0,0,0,0.75);
    }
  }
  .item_right {
    flex: 1;
    width: 0;
    position: relative;
	font-size: 28rpx;
	font-weight: 600;
	line-height: 40rpx;
	.item_right-lab{
		color: #aaa;
		font-size: 24rpx;
		margin-top: 10rpx;
		font-weight: normal;
	}
  }
}
.lab_cont {
	margin: 20rpx 24rpx 0;
	height: 68rpx;
	background: #f7f8fa;
	border-radius: 16rpx;
	line-height: 68rpx;
	font-size: 26rpx;
	font-weight: bold;
	padding: 0 24rpx;
	.lab_cont-icon {
		width: 36rpx;
		height: 36rpx;
		margin-right: 12rpx;
	}
	.lab_cont-txt {
		margin-left: 24rpx;
		color: #aaa;
	}
	.log_num{
		font-weight: normal;
		margin-left: 10rpx;
	}
}
.repair_btn{
	line-height: 64rpx;
	border: 2rpx solid #ccc;
	border-radius: 33rpx;
	margin: 28rpx 24rpx 0 auto;
	padding: 0 36rpx;
	display: inline-block;
	&.active {
		opacity: .5;
	}
}
</style>

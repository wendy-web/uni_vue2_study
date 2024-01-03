<template>
	<van-popup
		:show="show"
		round position="bottom"
		custom-style="background-color: #fff9f2;"
		:close-on-click-overlay="true"
		@close="popupClose"
		closeable
	>
		<view class="medals_box">
			<view  class="mbl__box">
				<view class="mbl-box">
					<van-image  width="176rpx" height="176rpx" :src="medal.image" radius="50%" fit="cover" rad lazy-load use-loading-slot>
						<van-loading slot="loading" type="spinner" size="20" vertical />
					</van-image>
					<!-- 水波纹 -->
					<image class="water" src="/static/home/water_black.png" mode="heightFix" :style="{bottom:(oldProp*100).toFixed(0)+'%'}"></image>
				</view>
				<!-- 进度 -->
				<view class="mbl-progress" v-if="medal.prop<1">
					{{(oldProp*100).toFixed(0)}}%
				</view>
			</view>
		</view>
		<text class="city_suc">加速点亮以下城市</text>
		<!-- 点亮方式列表 -->
		<view class="city_lst">
			<view class="animBox"  :style="{'width': loadWidth + '%'}"></view>
			<view
				v-for="item in lightList" :key="item.id"
				:class="{'city_lst_item': true, 'active': item.active}"
			>
				<view class="item_icon">
					<van-icon name="star" size="12" />
				</view>
				<view class="item_text">{{item.city}}</view>
			</view>
		</view>
	</van-popup>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				medal: {},
				oldProp: 0,
				lightList: [],
				isActive: true,
				loadWidth: 0
			}
		},
		mounted() {},
		methods: {
			popupShow(data) {
				this.initData(data);
				this.show = true;
			},
			initData(data) {
				if (!data) return;
				this.lightList = data.city.map((item, index) => {
					return {
						id: item.id,
						city: item.city,
						active: index === 0,
						timer: 100 / (data.city.length - 1) * index
					}
				});
				this.medal = data.medal;
				const {oldProp} = this.medal;
				this.oldProp = oldProp || 0;
				this.aniProgress();
			},
			popupClose() {
				this.show = false;
				this.$emit('lightCityClose');
			},
			aniProgress(num=0, index=0) {
				setTimeout(() => {
					num++;
					this.loadWidth = num;
					if((index < this.lightList.length) && (num >= this.lightList[index].timer)) {
						this.lightList[index].active = true;
						index++;
					}
					if(num < 100) {
						this.aniProgress(num, index);
					} else {
						this.aniPercent();
					}
				}, 10);
			},
			aniPercent(oldProp = this.oldProp, prop=this.medal.prop) {
				setTimeout(() => {
					if(prop > oldProp) {
						oldProp = (Number(oldProp)*100) +1;
						this.oldProp = Number(oldProp)/100;
						this.aniPercent(this.oldProp);
					}
				}, 10);
			}
		}
	}
</script>

<style lang="scss">
	.van-popup--bottom.van-popup--safe {
		overflow: visible !important;
	}
	.lighting-mode-list {
		padding: 0 30rpx 48rpx;
	}
	.medals_box {
		position: relative;
		.mbl__box{
			width: 176rpx;
			height: 176rpx;
			position: absolute;
			top: -88rpx;
			left: 0;
			right: 0;
			margin: auto;
			.mbl-box {
				width: 100%;
				height: 100%;
			}
			.mbl-progress {
				right: -12rpx;
				font-size: 24rpx;
				text-align: center;
				color: #ffffff;
				width: 76rpx;
				height: 36rpx;
				line-height: 36rpx;
				background: #ff7507;
			}
		}
	}
	.city_suc {
		width: 128rpx;
		height: 44rpx;
		font-size: 32rpx;
		font-weight: 500;
		text-align: center;
		color: #ff7f48;
		line-height: 52rpx;
		display: block;
		width: 100%;
		margin: 150rpx 0 36rpx;
	}
	.city_lst {
		margin: 0 80rpx 124rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: relative;
		z-index: 0;
		overflow: hidden;
		&::before {
			content: '';
			position: absolute;
			left: 5%;
			right: 5%;
			height: 20rpx;
			background: #FFE0B9;
			z-index: -1;
			top: 12rpx;

		}
		.city_lst_item {
			text-align: center;
			&.active {
				.item_icon{
					color: #fff;
					background-color: #FE6333;
					transition: all 1s;
				}
				.item_text{
					color: #4e4d52;
					transition: all 1s;
				}
			}
		}
		.item_icon {
			width: 96rpx;
			height: 44rpx;
			border-radius: 22rpx;
			text-align: center;
			background: #F2F2F2;
			color: #999;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.item_icon_gray {
			background: #F2F2F2;
			color: #999;
		}
		.item_text {
			color: #AAAAAA;
			font-size: 32rpx;
			line-height: 44rpx;
			margin-top: 24rpx;
		}
		.animBox {
			position: absolute;
			height: 20rpx;
			width: 100%;
			top: 12rpx;
			z-index: -1;
			background: repeating-linear-gradient(125deg,#FE6333 15%, #e3991a 20%, #FE6333 25%);
			border-radius: 22rpx;
		}
	}
</style>

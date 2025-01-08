<template>
<view class="swiperPanel" v-if="isShow">
	<view class="swiperItem" v-for="(item, index) in swiperList" :key="index"
		:style="{ left: itemStyle[index].left, zIndex:itemStyle[index].zIndex}"
		:class="{ active: itemStyle[index].leftValue < 72}"
	>
		<view class="children">
			<view class="pic">
				<image class="pic-img" :src="item"></image>
			</view>
		</view>
	</view>
</view>
</template>

<script>
	export default {
		props: {
			BgPic: {
				type: String,
				default: '',
			}
		},
		data() {
			return {
				slideNote: {
					x: 0,
					y: 0,
				},
				screenWidth: 0,
				itemStyle: [],
				moveArr: [], //拍断是否移动
				id: 0,
				isShow: false,
				swiperList: [],
				timeValue: 3000,
				timer: null
			};
		},
		watch: {
			id: {
				immediate: true, //初始化的时候是否调用
				deep: true, //是否开启深度监听
				handler(newValue, oldValue) {
					this.$emit('checked', {
						id: this.id
					});
				}
			}
		},
		created() { },
		methods: {
			init(swiperList) {
				this.swiperList =swiperList;
				var macInfo = uni.getSystemInfoSync();
				this.screenWidth = macInfo.screenWidth;
				// 计算swiper样式
				this.swiperList.forEach((item, index) => {
					this.itemStyle.push(this.getStyle(index));
				});
				this.isShow = true;
				setTimeout(() => {
					this.setIntervalImg();
				}, this.timeValue)
			},
			setIntervalImg() {
				this.clearIntervalTimer();
				this.timer = setInterval(() => {
					var newList = JSON.parse(JSON.stringify(this.itemStyle));
					newList.push(newList[0]);
					newList.splice(0, 1);
					this.itemStyle = newList;
				}, this.timeValue)
			},
			clearIntervalTimer() {
				clearInterval(this.timer);
				this.timer = null;
			},
			getId() {
				if (this.itemStyle[0].id == 0) return this.id = 0;
				return this.id = (this.itemStyle.length - this.itemStyle[0].id)
			},
			move(e) {
				console.log(e.touches[0].pageX);
				this.moveArr.push(e.touches[0].pageX);
			},
			getStyle(e) {
				// if (e == 0) {
				// 	return {
				// 		zIndex: 9999 - e,
				// 		left: -((72) / (this.swiperList.length - 1)) * e * 2 + 'rpx',
				// 		leftValue: -((72) / (this.swiperList.length - 1)) * e * 2,
				// 		id: e
				// 	}
				// }
				let leftValue = 24 * e;
				leftValue = (leftValue > 72) ? 0 : leftValue;
				return {
					zIndex: 9999 - e,
					left: leftValue + 'rpx',
					leftValue: leftValue,
					width: '10rpx',
					itemLeft: '40rpx',
					itemTop: 0,
					itemBottom: 0,
					id: e
				};

			},
			startMove(e) {
				this.moveArr = [];
			},
			endMove(e) {
				var newList = JSON.parse(JSON.stringify(this.itemStyle));
				// 取最后2位进行对比，防止死变态s形滑动
				if (this.moveArr[this.moveArr.length - 2] > this.moveArr[this.moveArr.length - 1]) {
					console.log('向左移动了');
					var last = [newList.pop()];
					newList = last.concat(newList);

				}
				if (this.moveArr[this.moveArr.length - 2] < this.moveArr[this.moveArr.length - 1]) {
					newList.push(newList[0]);
					newList.splice(0, 1);

					console.log('向右移动了');
				}
				console.log('newList', newList)
				this.itemStyle = newList;
				this.getId();
			},
		},
	};
</script>
<style lang="scss">
	.swiperPanel {
		min-height: 48rpx;
		position: relative;
		// overflow: hidden;
		width: 124rpx;
		.swiperItem {
			height: 48rpx;
			width: 48rpx;
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			margin: auto;
			transition:left .5s, opacity 1s;
			opacity: 0;
			// transform: scale(0);
			&.active {
				opacity: 1;
				// transform: scale(1);
				// transition: transform 1s opacity 1s;
				// &:first-child {
				// 	transition: transform 1s opacity 1s;
				// 	transition-delay: 200ms;
				// }
			}
			.children {
				height: 100%;
				width: 100%;
				// margin: 2rpx auto;
				.pic {
					height: 100%;
					width: 100%;
					position: relative;

					.pic-img {
						position: absolute;
						height: 100%;
						width: 100%;
						border-radius: 50%;
					}

					.pic-title {
						position: absolute;
						top: 46rpx;
						text-align: center;
						z-index: 1;
						color: #FFF;
						width: 100%;
						text-align: center;
						font-size: 28rpx;
						font-weight: 500;
						margin: auto;
						word-wrap: break-word;
						display: flex;
						flex-direction: column;
						justify-content: center;
					}
				}
			}
		}
	}
</style>

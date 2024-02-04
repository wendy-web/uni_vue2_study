<!--
 usage:
 num:显示的数字
 color：字体颜色
 width：每个数字的宽度
 height:字体高度
 fontSize：字体大小
 <countup :num="123.453" color="#ff9e50" width='13' height='23' fontSize='23'></countup>
 -->
<template>
	<view
		class="number-box"
		:style="{fontWeight:fontWeight}"
	>
		<block v-for="(myIndex, index) in indexArr" :key="index">
			<swiper
				class="swiper" vertical="true"
				:autoplay="isAutoplay && myIndex !== 10"
				:interval="10"
				:circular="true"
				:current="myIndex"
				circular="true"
				v-bind:style="{
					color:color,
					width: myIndex == 10 ? dotWidth+'px' : width+'px',
					height:height+'px',
					lineHeight:fontSize+'px',
					fontSize:fontSize+'px',
					fontWeight: fontWeight
				}"
				>
				<swiper-item>
					<view class="swiper-item">0</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item">1</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item">2</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item">3</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item">4</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item">5</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item">6</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item">7</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item">8</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item">9</view>
				</swiper-item>
				<swiper-item v-if="myIndex == 10">
					<view class="swiper-item">.</view>
				</swiper-item>
			</swiper>
		</block>
	</view>
</template>

<script>
	export default {
		props: {
			num:[String, Number],
			color: {
				type: String,
				default: '#000000'
			},
			width: {
				type: String,
				default: '15'
			},
			height: {
				type: String,
				default: '15'
			},
			fontSize: {
				type: String,
				default: '15'
			},
			fontWeight: {
				type: Number,
				default: 400
			},
			dotWidth: {
				type: String,
				default: '7'
			},
			isSetTimeAutoNum: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				indexArr: [],
				fillNum: 0,
				isAutoplay: false
			};
		},
		created() {
			let { num } = this;
            if(!num) return this.indexArr = [0];
			let arr = new Array(num.toString().length);
			arr.fill(this.fillNum);
			this.indexArr = arr;
		},
		watch: {
			num: function(val, oldVal) {
				// 处理新老数据长度不一样的情况
				if(!val) return this.indexArr = [0];
				let arr = Array.prototype.slice.apply(this.indexArr);
				let newLen = val.toString().length;
				let oldLen = oldVal.toString().length;
				if(newLen == oldLen && this.isSetTimeAutoNum) {
					this.isAutoplay = true;
					arr = arr.map(res => {
						if(res == 10) return res;
						const randomNum = Math.floor(Math.random() * 10);
						if(res == randomNum) return res ? 0 : 9;
						return randomNum;
					});
					// console.log('arr', arr)
					this.indexArr = arr;
				}
				// 增加一位小数
				if (newLen > oldLen) {
					for (let i = 0; i < newLen - oldLen; i++) {
						arr.push(this.fillNum);
					}
					this.indexArr = arr;
				}
				// 去除一位小数
				if (newLen < oldLen) {
					for (let i = 0; i < oldLen - newLen; i++) {
						arr.pop();
					}
					this.indexArr = arr;
				}
				this.numChange(val);
			}
		},
		mounted() {
			//定时器作用：app显示数字滚动
			this._time = setTimeout(() => {
				this.numChange(this.num);
				clearTimeout(this._time);
			}, 50);
		},
		methods: {
			/**
			 * 数字改变
			 * @value 数字
			 */
			numChange(num) {
                if(!num) return this.indexArr = [0];
				let { indexArr } = this;
				let copyIndexArr = Array.prototype.slice.apply(indexArr);
				let _num = num.toString();
				for (let i = 0; i < _num.length; i++) {
					if (_num[i] === '.') {
						copyIndexArr[i] = 10;
					} else {
						copyIndexArr[i] = Number(_num[i]);
					}
				}
				setTimeout(() => {
					this.isAutoplay = false;
					this.indexArr = copyIndexArr;
				}, this.isAutoplay ?  this.isSetTimeAutoNum : 0);
			}
		}
	};
</script>

<style lang="scss">
	.number-box {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}

	.swiper {
		position: relative;
		// 	line-height: 30upx;
		// 	width: 30upx;
		// 	height: 30upx;
		// 	font-size: 30upx;
		// 	background: red;
	}

	.swiper:after {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
	}
</style>

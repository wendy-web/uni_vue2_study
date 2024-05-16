<template>
	<view class="vastwu-barrage" :style="{width:width,height:height}">
		<block v-for="(item,index) in items" :key="item.paused">
			<view class="barrages" :style="{
					top: `${trackList[Math.floor(index%3)]}rpx`,
					animation: `mymove ${Number(item.time)}s ${Number(item.delayTime)}s linear ${item.paused} forwards `
			}">
				<view class="barrage" v-for="(tx,i) in item.textList" :key="i">
					<image class="barrage_img" :src="tx.avatar_url"></image>
					<text class="barrage_name">{{tx.nick_name}}</text> {{tx.msg}}
				</view>
			</view>
		</block>
	</view>
</template>
<script>
	export default {
		name: 'vastwu-barrage',
		props: {
			minTime: {
				type: Number,
				default: 5
			},
			maxTime: {
				type: Number,
				default: 10
			},
			width: {
				type: String,
				default: '100%'
			},
			height: {
				type: String,
				default: '100%'
			}
		},
		data() {
			return {
				items: [],
				values: '',
				textIndex: 0,
				trackList: [0, 80, 150],
				headImgArr: [],
				showNum: 3,
				showArrayNum: 3,
				listNum: 3,
				timer: null
			}
		},
		created() {
			this.values = this.items.length
		},
		methods: {
			clearTimer() {
				clearInterval(this.timer);
				this.timer = null;
			},
			add(text = '', time = this.randomNum(this.minTime, this.maxTime), indexNum) {
				let floorNum = Math.floor(indexNum%3);
				if (this.items.length >= this.trackList.length) {
					if (this.textIndex < this.trackList.length) {
						this.items[this.textIndex].textList.push(text);
						this.textIndex++;
					} else {
						this.textIndex = 0
						this.items[this.textIndex].textList.push(text);
						this.textIndex++;
					}
				} else {
					let reduceTime = 0;
					let lastTime = 7;
					let delayTime = 0;
					if(this.items.length >= 3) {
						reduceTime = this.items.slice(floorNum).filter((student, index) => index % 3 === 0).reduce((acc, student) => acc + student.time, 0);
						delayTime = (indexNum <= 6) ? reduceTime : (reduceTime - (lastTime / 2));
					}
					this.items.push({
						textList: [text],
						time,
						indexNum,
						delayTime,
						paused: '',
					});
				}
			},
			init(items = []) {
				this.headImgArr = [...items];
				this.items = [];
				this.values = this.headImgArr.length;
				for(let i = 0; i < this.values; i++) {
					let time = 100;
					time = this.randomNum(this.minTime, this.maxTime);
					let topValue = this.randomNum(0, 250);
					this.trackList.push(topValue);
					this.add(this.headImgArr[i], time, i);
				}
				// if(this.values <= this.showArrayNum) return this.showSelect(0, this.values);
				// this.showSelect(0, this.showNum);
				// this.clearTimer();
				// this.timer = setInterval(() => {
				// 	this.showArrayNum += this.showNum;
				// 	if(this.showArrayNum >= this.values) {
				// 		this.showSelect(this.showArrayNum - this.showNum, this.values);
				// 		this.showArrayNum = 0;
				// 		return;
				// 	}
				// 	this.showSelect(this.showArrayNum - this.showNum, this.showArrayNum);
				// }, 5000);
			},
			showSelect(initNum, lengthNum) {
				for(let i = initNum; i < lengthNum; i++) {
					this.items[i].paused = 'running';
				}
			},
			stop(e, item) {
				item.paused = 'pause'
			},
			go(e, item) {
				item.paused = ''
			},
			//生成从minNum到maxNum的随机数
			randomNum(minNum, maxNum) {
				switch (arguments.length) {
					case 1:
						return parseInt(Math.random() * minNum + 1, 10);
						break;
					case 2:
						return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
						break;
					default:
						return 0;
						break;
				}
			}
		},
	}
</script>

<style>
	.barrages {
		position: absolute;
		white-space: nowrap;
		transform: translateX(750rpx);
		/* animation: mymove 5s linear forwards;
		animation-timing-function: linear;
		-webkit-animation-timing-function: linear;
		animation-fill-mode: forwards;

		-webkit-backface-visibility: hidden;
		-moz-backface-visibility: hidden;
		-ms-backface-visibility: hidden;
		backface-visibility: hidden;

		-webkit-perspective: 1000;
		-moz-perspective: 1000;
		-ms-perspective: 1000;
		perspective: 1000; */
		/* Other transform properties here */
	}
	.barrage {
		position: relative;
		display: inline-block;
		height: 42rpx;
		opacity: 0.74;
		background: linear-gradient(270deg,rgba(255,241,222,0.00), rgba(255,223,187,0.30) 50%);
		border-radius: 28rpx;
		padding: 4rpx;
		display: flex;
		align-items: center;
		font-size: 24rpx;
		color: #fff4e7;
	}
	.barrage_img {
		width: 34rpx;
		height: 34rpx;
		border-radius: 50%;
		opacity: 0.74;
	}
	.barrage_name{
		margin: 0 16rpx 0 8rpx;
	}
	.vastwu-barrage {
		z-index: 3;
		position: relative;
		overflow: hidden;
	}

	@keyframes mymove {
		from {
			/* left: 100%; */
			transform: translateX(750rpx);
		}

		to {
			/* left: -120%; */
			transform: translateX(-100%);
		}
	}

	@-moz-keyframes mymove

	/* Firefox */
		{
		from {
			/* left: 100%; */
			transform: translateX(750rpx);
		}
		to {
			/* left: -120%; */
			transform: translateX(-100%);
		}
	}

	@-webkit-keyframes mymove

	/* Safari and Chrome */
		{
		from {
			/* left: 100%; */
			transform: translateX(750rpx);
		}
		to {
			/* left: -120%; */
			transform: translateX(-100%);
		}
	}

	@-o-keyframes mymove

	/* Opera */
		{
		from {
			/* left: 100%; */
			transform: translateX(750rpx);
		}
		to {
			/* left: -120%; */
			transform: translateX(-100%);
		}
	}
</style>

<template>
	<view class="xh-tabs" :style="{top:navHeight+'px'}">
		<view class="xh-tabs-item" @click="tabsChange(0)">
			<view class="label-text" :class="currTabs == 0?selectClass:''">
				可用
				<text class="xh-tab-num" v-if="total.unused>0">
					{{total.unused|numbers}}
				</text>
			</view>
		</view>
		<view class="xh-tabs-item" @click="tabsChange(1)">
			<view class="label-text" :class="currTabs == 1?selectClass:''">
				已用
				<text class="xh-tab-num" v-if="total.used>0">
					{{total.used|numbers}}
				</text>
			</view>
		</view>
		<view class="xh-tabs-item" @click="tabsChange(2)">
			<view class="label-text" :class="currTabs == 2?selectClass:''">
				已逾期
				<text class="xh-tab-num" v-if="total.overdue>0">
					{{total.overdue|numbers}}
				</text>
			</view>
		</view>
		<!-- cursor -->
		<view class="cursor" :class="selectClass" :style="{left:(currTabs*33.3 + 11.65)+'%'}"></view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex';
	export default {
		props: ['currTabs','type','navHeight'],
		filters: {
			numbers(val) {
				return val >= 99 ? '99+' : val;
			}
		},
		data(){
			return {
				total:{
					unused:0,
					used:0,
					overdue:0
				}
			}
		},
		watch:{
			statistics(){
				this.initTotal()
			},
			type(){
				this.initTotal()
			}
		},
		mounted() {
			this.initTotal()
		},
		computed: {
			...mapGetters(['statistics']),
			selectClass() {
				return this.type==0?'hn-tab-active':'zm-tab-active'
			}
		},
		methods: {
			tabsChange(index) {
				this.$emit('tabsChange', index);
			},
			initTotal(){
				let {hn_unused,hn_used,hn_overdue,zm_unused,zm_used,zm_overdue} = this.statistics
				if(this.type == 0){
					this.total = {
						unused:hn_unused,
						used:hn_used,
						overdue:hn_overdue
					}
				}else{
					this.total = {
						unused:zm_unused,
						used:zm_used,
						overdue:zm_overdue
					}
				}
			}
		}
	};
</script>

<style lang="scss">
	/*顶部导航样式*/
	.xh-tabs {
		position: fixed;
		width: 100%;
		left: 0;
		padding-top: 80rpx;
		// top: 0;
		height: 80rpx;
		// background-color: #FFFFFF;
		display: flex;
		// z-index: 1;
		// box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
		z-index: 2;

		.xh-tabs-item {
			flex: 1;
			color: #999999;
			font-size: RPX(16);
			font-weight: bold;
			@include flex-vh-center;
		}

		.label-text {
			position: relative;
		}

		.cursor {
			position: absolute;
			height: 4rpx;
			width: 10%;
			left: 5%;
			bottom: 0;
			background-color: #E60213;
			transition: 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
			border-radius: 4px;
		}
		.cursor.hn-tab-active{
			background-color: #E60213;
		}
		
		.cursor.zm-tab-active{
			background-color: #FF711F;
		}

		.xh-tab-num {
			color: #999999;
			margin-left: RPX(5);
		}

		.hn-tab-active {
			color: #E60213;
			font-size: RPX(16);
		}

		.hn-tab-active>.xh-tab-num {
			color: #E60213;
		}
		
		.zm-tab-active {
			color: #FF711F;
			font-size: RPX(16);
		}
		
		.zm-tab-active>.xh-tab-num {
			color: #FF711F;
		}

		// .number {
		// 	position: absolute;
		// 	top: 0;
		// 	right: 0;
		// 	box-sizing: border-box;
		// 	min-width: 16px;
		// 	padding: 0 3px;
		// 	color: #fff;
		// 	font-weight: 500;
		// 	font-size: 12px;
		// 	font-family: Avenir-Heavy, PingFang SC, Helvetica Neue, Arial, sans-serif;
		// 	line-height: 14px;
		// 	text-align: center;
		// 	background-color: #ee0a24;
		// 	border: 1px solid #fff;
		// 	border-radius: 16px;
		// 	-webkit-transform: translate(50%, -50%);
		// 	transform: translate(50%, -50%);
		// 	-webkit-transform-origin: 100%;
		// 	transform-origin: 100%;
		// }
		// .grey{
		// 	background-color: #c7c7c7;
		// }
	}

	/*顶部导航样式*/
</style>

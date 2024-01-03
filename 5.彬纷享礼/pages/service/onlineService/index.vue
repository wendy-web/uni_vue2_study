<template>
	<view class="online-service">
		<!-- 头部 -->
		<view class="os-header">
			<image class="os-header-logo" src="../static/kefu.png" mode="widthFix"></image>
			<text class="osh-tips">水果技术客服</text>
			<text class="osh-tips-small">(点击你喜欢的水果，一对一解答)</text>
		</view>
		<!-- 水果客户列表 -->
		<van-row>
			<van-col span="8" v-for="item in fruitList" :key="item.src" custom-class="fruit-box">
				<button open-type="contact">
					<image class="fruit" mode="widthFix" v-if="fileBaseUrl" :src="fileBaseUrl+'/images/'+item.src">
					</image>
				</button>
				<view class="fruit-name">{{item.name}}</view>
			</van-col>
		</van-row>
		<!-- 温馨提示 -->
		<view class="tips-msg">服务时间：周一至周五 09:00-20:00</view>
		<view class="tips-msg">周六至周日 10:00-22:00</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex';
	import {
		fileBaseUrl
	} from '@/api/http/xhHttp.js';

	export default {
		data() {
			return {
				fileBaseUrl: fileBaseUrl,
				fruitList: [{
						name: '榴莲',
						src: 'll.png'
					}, {
						name: '橙子',
						src: 'chenz.png'
					}, {
						name: '山竹',
						src: 'sz.png'
					}, {
						name: '释迦',
						src: 'sj.png'
					}, {
						name: '蓝莓',
						src: 'lm.png'
					},
					{
						name: '猕猴桃',
						src: 'mht.png'
					}, {
						name: '香蕉',
						src: 'xj.png'
					}, {
						name: '无花果',
						src: 'whg.png'
					}, {
						name: '青枣',
						src: 'qz.png'
					}, {
						name: '火龙果',
						src: 'hlg.png'
					},
					{
						name: '西瓜',
						src: 'xg.png'
					}, {
						name: '苹果',
						src: 'pg.png'
					},
				]
			};
		}
	};
</script>

<style lang="scss">
	.online-service {
		.os-header {
			padding-left: RPX(30);
			display: flex;
			align-items: center;
			margin-bottom: RPX(30);
		}

		.os-header-logo {
			width: RPX(30);
			margin-right: RPX(5);
		}

		.osh-tips {
			font-size: RPX(16);
			color: #333;
		}

		.osh-tips-small {
			font-size: RPX(12);
			color: #999;
		}

		.fruit {
			width: RPX(80);
		}

		.fruit-box {
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-bottom: RPX(10);
		}

		.fruit-name {
			font-size: RPX(14);
			color: #333;
			margin-top: RPX(5);
		}

		.tips-msg {
			color: #F5A741;
			font-size: RPX(16);
			text-align: right;
			margin-right: RPX(40);
		}

		button {
			padding-left: 0;
			padding-right: 0;
			background-color: #FFFFFF;
			font-size: 0;

		}

		button:after {
			border: none;
		}

	}
</style>
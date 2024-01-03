<template>
	<cover-view class="xh-notify" :class="config.type"
		:style="{'display':config.isShow?'block':'none','animation-duration':second,'top':top+'px'}">
		{{config.message}}
	</cover-view>
</template>

<script>
	import {
		getNavbarData
	} from '@/utils/xhNavbar.js';
	//默认数据
	let _message = '开发者你没有传消息哟',
		_type = 'success',
		_duration = 1500;
	//关闭	
	let _times = null;

	export default {
		props: {
			isCustom: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				config: {
					message: '',
					type: '',
					isShow: false,
					duration: 1500
				},
				top: -46
			};
		},
		computed: {
			second() {
				return this.config.duration / 1000 + 's';
			}
		},
		created() {
			getNavbarData().then(data => {
				if (this.isCustom) this.top = -46 + data.statusBarHeight + data.navBarHeight;
			});
		},
		methods: {
			show(config = {}) {
				if (this.config.isShow) return this.$emit('frequently');
				this.config.message = config.message || _message;
				this.config.duration = config.duration || _duration;
				this.config.type = 'xhNotify xh-notify-' + (config.type || _type);
				this.config.isShow = true;
				this.config.onClose = config.onClose;
				this.timeClose();
			},
			timeClose() {
				//定时关闭
				_times = setTimeout(() => {
					this.close();
				}, this.config.duration);
			},
			close() {
				this.config.isShow = false;
				clearTimeout(_times);
				wx.nextTick(this.config.onClose);
			}
		}
	};
</script>

<style lang="scss">
	.xh-notify {
		position: fixed;
		width: 100%;
		color: #FFFFFF;
		font-size: 18px;
		height: 46px;
		line-height: 46px;
		text-align: center;
		opacity: 0;
		transition-property: opacity, transform;
		transition-timing-function: ease;
		z-index: 1111;
	}

	.xh-notify-success {
		background-color: #07c160;
	}

	.xh-notify-danger {
		background-color: #ee0a24;
	}

	.xh-notify-warning {
		background-color: #ff976a;
	}

	/*自定义弹窗*/
	.xhNotify {
		animation-name: xhNotify;
		animation-fill-mode: both;
	}

	@-webkit-keyframes xhNotify {
		0% {
			opacity: 0;
			transform: translateY(-100%);
		}

		25% {
			opacity: 1;
			transform: translateY(100%);
		}

		75% {
			opacity: 1;
			transform: translateY(100%);
		}

		100% {
			opacity: 0;
			transform: translateY(-100%);
		}
	}
</style>

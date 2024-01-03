<template>
	<web-view v-if="link" :webview-styles="webviewStyles" :src="link"></web-view>
</template>

<script>
	let _link = '';
	export default {
		onLoad(option) {
			_link = option.link;
			this.link = decodeURIComponent(option.link);
		},
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				// console.log(res.target)
			}
			return {
				title: '中国红牛 1元换购',
				path: '/pages/webview/webview?link=' + _link,
				imageUrl: 'https://file.y1b.cn/public/img/bfxl/2023/bfxl_share_2023.png'
			};
		},
		data() {
			return {
				link: '',
				webviewStyles: {
					progress: {
						color: '#FF3333'
					}
				}
			};
		}
	};
</script>
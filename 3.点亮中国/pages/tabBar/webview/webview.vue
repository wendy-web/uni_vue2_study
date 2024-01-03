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

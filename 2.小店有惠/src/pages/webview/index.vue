<template>
	<web-view v-if="link" :webview-styles="webviewStyles" :src="link"></web-view>
</template>

<script>
	export default {
		onLoad(option) {
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

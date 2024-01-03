<template>
	<view class="xh-video">
		<video id="myVideo" :src="url" @error="videoErrorCallback" controls autoplay></video>
	</view>
</template>

<script>
	export default {
		onLoad(option) {
			this.url = option.url;
		},
		data() {
			return {
				url: ''
			};
		},
		onReady: function(res) {
			this.videoContext = uni.createVideoContext('myVideo');
		},
		methods: {
			videoErrorCallback: function(e) {
				// console.log('视频错误信息:')
				// console.log(e.target.errMsg)
			}
		}
	};
</script>

<style>
	.xh-video {
		position: fixed;
		width: 100%;
		top: 0;
		bottom: 0;
		background-color: #000;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	#myVideo {
		width: 100%;
	}
</style>

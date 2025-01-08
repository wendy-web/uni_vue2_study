<template>
	<view class="container">
		<uni-nav-bar
			status-bar
			title="提示"
			:border="false"
			fixed
		/>
		<uv-empty mode="permission" text="您当前的IP不在可使用本小程序的IP范围内" icon="https://cdn.uviewui.com/uview/empty/permission.png" width="300" textSize="16"></uv-empty>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">

</style>

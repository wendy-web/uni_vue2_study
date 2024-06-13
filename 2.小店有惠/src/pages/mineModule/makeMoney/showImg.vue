<template>
<view class="make_money">
	<van-image
        width="100%" height="100%"
        src="https://file.y1b.cn/store/1-0/2465/66601ce7cb2ad.png"
        use-loading-slot
		fit="widthFix"
        :show-menu-by-longpress="true"
      ><van-loading slot="loading" type="spinner" size="20" vertical />
      </van-image>
</view>
</template>

<script>
export default {
	data() {
		return { }
	},
	onLoad() {
	},
	methods: {
	}
};
</script>

<style lang="scss">
page {
	background-color: #F9CCCB;
	padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
}
</style>

<template>
<view v-if="list.length">
	<view class="box" v-for="(item, index) in list" :key="index">
		<view class="title">{{item.title}}</view>
		<view class="img_box" @click="listHandle(item)">
			<van-image
				class="img_item"
				use-loading-slot lazy-load
				width="100%"
				:src="item.image"
				fit="widthFix"
			>
				<van-loading slot="loading" type="spinner" size="20" vertical />
			</van-image>
		</view>
	</view>
</view>
</template>

<script>
	import { popover } from '@/api/modules/configuration.js';
import { mapGetters } from 'vuex';
	export default {
		data() {
			return {
				list: []
			}
		},
        computed: {
			...mapGetters(['isAutoLogin'])
		},
		methods: {
			async init() {
				const res = await popover({ page: 10 });
				if(res.code != 1) return;
				this.list = res.data.list;
			},
			listHandle(item) {
				this.$emit('imgItem', item);
			},
		}
	}
</script>

<style lang="scss">
.box {
	box-sizing: border-box;
	padding: 0rpx 24rpx 48rpx 24rpx;
}
.img_box {
	position: relative;
	padding-bottom: 15rpx;
	width: 702rpx;
	margin-top: 32rpx;
	.img_item{
		width: 100%;
	}
}
</style>

<template>
<van-popup
    :show="isShow"
    custom-style="overflow: visible;background: transparent;"
    round
    :z-index="100"
    :safe-area-inset-bottom="false"
    :catchtouchmove="true"
    @close="popupClose"
>
	<view class="dia_cont ani_active" @click="popupClose">
        <image class="dia_cont-img" src="https://file.y1b.cn/store/1-0/231124/65603dcaf062c.png" mode="widthFix"></image>
        <!-- <view class="btn_box"></view> -->
	</view>
</van-popup>
</template>
<script>
export default {
    props: {
        isShow: {
            type: Boolean,
            default: false
        },
    },
	data() {
		return {
		}
	},
	methods: {
		popupClose() {
			this.$emit("close");
		}
	}
}
</script>
<style scoped lang="scss">
.dia_cont {
    position: relative;
    z-index: 0;
    width: 750rpx;
    .dia_cont-img{
        width: 100%;
        height: 500rpx;
    }
}
.btn_box{
    position: absolute;
    width: 320rpx;
    height: 100rpx;
    background: gray;
    bottom: 180rpx;
    left: 50%;
    transform: translateX(-50%);
}
</style>
<template>
	<van-popup
		:show="isShow"
		custom-style="overflow: visible;background: transparent;"
		round
		:z-index="100"
		:safe-area-inset-bottom="false"
		@close="onClose"
	>
		<view class="cont_box">
			<van-image
				width="750rpx" height="700rpx" fit="widthFix"
				:src="showImg"
				use-loading-slot class="banner_img"
				:show-menu-by-longpress="true"
				><van-loading slot="loading" type="spinner" size="20" vertical />
			</van-image>
		</view>
	</van-popup>
</template>

<script>
import { getPlatform } from "@/utils/auth.js";
export default {
    props: {
      isShow: {
        type: Boolean,
        default: false
      },
    },
    computed: {
      showImg() {
        const isGetPlatform = getPlatform();
        console.log('isGetPlatform', isGetPlatform);
        // return 'https://file.y1b.cn/store/1-0/24822/66c6919137e72.png'
        return isGetPlatform == 'ios' ? 'https://file.y1b.cn/store/1-0/2485/66b033c19aae4.png' : 'https://file.y1b.cn/store/1-0/2473/66851b585493d.png';
      }
    },
    data() {
      return {
      }
    },
    methods: {
      onClose() {
        this.$emit("close");
      }
    }

}
</script>

<style scope lang="scss">
.cont_box {
  position: relative;
  z-index: 0;
  width: 100%;
}
</style>

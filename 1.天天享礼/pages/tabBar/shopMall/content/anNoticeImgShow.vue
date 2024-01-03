<template>
<view class="notion_Img-box" v-if="isShow" id="notionImgDom">
    <van-image
        width="100%"
        height="40px"
        fit="widthFix"
        :src="config.image"
        use-loading-slot
        use-error-slot
        @click="notionImgHandle"
    >
        <van-loading slot="loading" type="spinner" size="24" vertical />
        <van-icon slot="error" color="#edeef1" size="120" name="photo-fail" />
    </van-image>
    <image
        class="close_icon"
        src="https://file.y1b.cn/store/1-0/23118/654b2a62cefd7.png"
        mode="scaleToFill"
        @click.stop="popupClose(true)"
    ></image>
</view>
</template>
<script>
import goDetailsFun from "@/utils/goDetailsFun.js";
import { popover, popoverRember } from "@/api/modules/configuration.js";
export default {
    mixins: [goDetailsFun],
    props: {
        switchTime: {
            type: Number,
            default: 5000,
        },
    },
    data() {
        return {
            isShow: false,
            config: null,
            list: [],
            timer: null
        };
    },
    methods: {
        notionImgHandle() {
            const { xf_type, qz_url } = this.config;
            if(xf_type == 1) return this.$go('/pages/userModule/order/index?activeTab=1'); // 待付款悬浮
            if(xf_type == 2) {
                this.$emit('draw');
                return;
            }
            this.textDetailsFun_mixins({
                ...this.config,
                configDia: true,
                is_popover: 1,
            });
        },
        async popupShow() {
            if (!this.config) return;
            this.isShow = true;
        },
        async popupClose(isRecode) {
            this.isShow = false;
            if(!this.config) return;
            const { id } = this.config;
            if (isRecode) {
                this.config = null;
                this.list.shift();
                this.$emit("heightUpdate", 0);
                id && await popoverRember({ id });
                if(this.list.length) {
                    this.timer = setTimeout(() => {
                        this.config = this.list[0];
                        this.timer = null;
                    }, 5000);
                }
            }
        },
        async init() {
            this.isShow = false;
            const res = await popover({
                page: 1,
                people_type: 2,
                is_xf: 1,
            });
            if (res.code != 1 && res.data.list.length) return;
            this.config = res.data.list[0];
            this.list = res.data.list;
        },
        warpRectDom(idName) {
            return new Promise((resolve) => {
                setTimeout(() => {
                // 延时确保dom已渲染, 不使用$nextclick
                let query = uni.createSelectorQuery();
                // #ifndef MP-ALIPAY
                query = query.in(this); // 支付宝小程序不支持in(this),而字节跳动小程序必须写in(this), 否则都取不到值
                // #endif
                query.select("#" + idName).boundingClientRect((data) => {
                    resolve(data);
                    }).exec();
                }, 20);
            });
        },
    },
    beforeDestroy() {
        this.timer = null;
        clearTimeout(this.timer);
    },
}
</script>
<style lang="scss">
.notion_Img-box {
  position: relative;
  width: 100%;
  height: 40px;
  font-size: 0;
  .close_icon{
    position: absolute;
    right: 32rpx;
    top: 50%;
    width: 40rpx;
    height: 40rpx;
    transform: translateY(-50%);
  }
}
</style>

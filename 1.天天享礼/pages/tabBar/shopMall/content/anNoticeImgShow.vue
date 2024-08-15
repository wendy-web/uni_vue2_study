<template>
<view class="notion_Img-box" v-if="isShow" id="notionImgDom">
    <van-image width="100%" height="40px"
        fit="widthFix" :src="config.image"
        use-loading-slot use-error-slot
        @click="notionImgHandle">
        <van-loading slot="loading" type="spinner" size="24" vertical />
        <van-icon slot="error" color="#edeef1" size="120" name="photo-fail" />
    </van-image>
    <image class="close_icon" mode="scaleToFill"
        src="https://file.y1b.cn/store/1-0/23118/654b2a62cefd7.png"
        @click.stop="popupClose(true)"></image>
</view>
</template>
<script>
import { popover, popoverRember } from "@/api/modules/configuration.js";
import { hwHome, jumpLink } from '@/api/modules/discounts.js';
import goDetailsFun from "@/utils/goDetailsFun.js";
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
            timer: null,
            payWayObj: {
                'WXZF': {
                    name: '微信支付订单',
                    path: '/pages/userModule/order/detail?id=',
                },
                'qianzhu_x': {
                    name: '星巴克订单',
                    path: '/pages/userModule/takeawayMenu/starbucks/order/index?oid=',
                },
                'qianzhu_k': {
                    name: '肯德基订单',
                    path: '/pages/userModule/takeawayMenu/kfc/order/index?oid=',
                },
                'qianzhu_m': {
                    name: '电影订单',
                },
                'HW_ruixing': {
                    name: '瑞幸订单',
                    path: '/pages/userModule/takeawayMenu/luckin/order/index?oid='
                },
                'HW_mdl': {
                    name: '麦当劳订单',
                    path: '/pages/userModule/takeawayMenu/mcDonald/order/index?oid='
                },
                'HW_wallace': {
                    brand_id: 1,
                    name: '华莱士订单',
                },
                'HW_burger': {
                    brand_id: 2,
                    name: '汉堡王',
                },
                'HW_pizza': {
                    brand_id: 3,
                    name: '必胜客订单',
                },
                'HW_heytea': {
                    brand_id: 4,
                    name: '喜茶订单',
                },
                'HW_nayuki': {
                    brand_id: 5,
                    name: '奈雪订单',
                },
            }
        };
    },
    methods: {
        async notionImgHandle() {
            // this.popupClose(true);
            const { xf_type, pay_way, appid, path, oid, orderNo } = this.config;
            if(appid && path) {
                this.$openEmbeddedMiniProgram({
                    appId: appid,
                    path
                });
                return;
            }
            // if(xf_type == 1) return this.$go('/pages/userModule/order/index?activeTab=1'); // 待付款悬浮
            if(xf_type == 1) {
                const currentObj = this.payWayObj[pay_way];
                const { path, brand_id } = currentObj;
                // this.$go('/pages/userModule/order/index?activeTab=1'); // 待付款悬浮
                // if(_haiWeiObj == 'WXZF'){
                //     this.$go(`/pages/userModule/order/detail?id=${oid}`);
                // }
                if(path) return this.$go(`${path}${oid}`);
                if(brand_id) {
                    const res = await hwHome({ brand_id });
                    if(res.code != 1) return this.$toast(res.msg);
                    const link = encodeURIComponent(res.data);
                    this.$go(`/pages/webview/webview?link=${link}&bgColor=#fff`);
                }
                // 千猪电影订单
                if(orderNo) {
                    const res = await jumpLink({
                        type: 1,
                        page: 'order',
                        orderNo,
                        status: 1
                    });
                    const link = encodeURIComponent(res.data.url);
                    this.$go(`/pages/webview/webview?link=${link}&bgColor=#FCDB28`);
                }
                return;
            }
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
            const { id, xf_type } = this.config;
            if (isRecode) {
                this.list.shift();
                this.$emit("heightUpdate", 0);
                id && await popoverRember({ id, xf_type });
                this.config = null;
                if(this.list.length) {
                    this.timer = setTimeout(() => {
                        this.config = this.list[0];
                        this.timer = null;
                    }, 5000);
                }
            }
        },
        async init() {
            // this.isShow = false;
            const res = await popover({
                page: 1,
                people_type: 2,
                is_xf: 1,
            });
            if (res.code != 1 && res.data.list.length) return;
            this.config = res.data.list[0];
            this.list = res.data.list;
        }
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
    right: 12rpx;
    padding: 20rpx;
    top: 50%;
    width: 40rpx;
    height: 40rpx;
    transform: translateY(-50%);
  }
}
</style>

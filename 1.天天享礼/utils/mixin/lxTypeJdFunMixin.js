import { bysubunionid } from '@/api/modules/jsShop.js';
import { goodsPromotion } from '@/api/modules/pddShop.js';
import { mapMutations } from 'vuex';
const lxTypeJdFunMixin = {
    data() {
        return {}
    },
    onLoad() {

    },
    methods: {
        ...mapMutations({
            setMiniProgram: "user/setMiniProgram"
        }),
        async lxTypeJdFun(item) {
            let {
                lx_type,
                is_flow,
                cid1,
                skuId,
                cid3,
                positionId,
                isJdLink,
                link,
                is_popover = 0,
                goods_sign,
                has_coupon,
                type_id,
                jdShareLink,
                mobile_url,
                active_id,
                tag
            } = item;
            if (is_flow == 1) {
                let urlPar = `cid1=${cid1}&skuId=${skuId}&cid3=${cid3}`
                if (lx_type == 3) urlPar = `goods_sign=${goods_sign}`; // 拼多多商品
                this.$go(`/pages/shopMallModule/feedDetailsList/index?${urlPar}&positionId=${positionId || 0}&has_coupon=${has_coupon}`);
                return;
            }
            const params = {
                positionId,
                tag: tag || 0,
                active_id: active_id || 0
            };
            let api = '';
            if (lx_type == 3) {
                api = goodsPromotion;
                params.goods_sign = goods_sign;
            } else {
                api = bysubunionid;
                params.skuId = skuId;
                params.is_popover = is_popover;
                params.has_coupon = has_coupon || 0;
                isJdLink && (params.link = link);
            }
            const skuRes = await api(params);
            // 商品已下架
            if (skuRes.code == 0) return this.$toast(skuRes.msg);
            // 半屏的中转详情页面
            if (is_flow == 2) {
                this.$go(`/pages/shopMallModule/productDetails/index?lx_type=${lx_type}&queryId=${goods_sign || skuId}&positionId=${positionId}&active_id=${active_id || 0}&tag=${tag || 0}`);
                return;
            }
            type_id = skuRes.data.type_id;
            mobile_url = skuRes.data.mobile_url;
            jdShareLink = skuRes.data.jdShareLink;
            this.setMiniProgram(lx_type);
            this.$openEmbeddedMiniProgram({
                appId: type_id,
                path: jdShareLink || mobile_url
            });
        }
    }
}
export default lxTypeJdFunMixin;

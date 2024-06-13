import { bysubunionid } from '@/api/modules/jsShop.js';
import { goodsPromotion } from '@/api/modules/pddShop.js';

// 检测商品是否存在进入 - 京东/拼多多
function lxTypeStatusCheckout(item) {
    return new Promise(async(resolve, reject) => {
        const { lx_type, positionId, goods_sign, skuId, is_popover = 0, has_coupon, isJdLink, is_rebate } = item;
        const params = { positionId };
        let requestApi = '';
        if (lx_type == 3) {
            requestApi = goodsPromotion;
            params.goods_sign = goods_sign;
        } else {
            requestApi = bysubunionid;
            params.skuId = skuId;
            params.is_popover = is_popover;
            params.has_coupon = has_coupon || 0;
            isJdLink && (params.link = link);
        }
        is_rebate && (params.is_rebate = is_rebate);
        const skuRes = await requestApi(params);
        if (skuRes.code == 0) {
            uni.showToast({
                title: skuRes.msg,
                icon: 'none'
            });
        }
        resolve(skuRes);
    }).catch((e) => {});
}
export {
    lxTypeStatusCheckout
};

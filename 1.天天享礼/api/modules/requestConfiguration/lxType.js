import { goodsQuery, jingfen, material } from "@/api/modules/jsShop.js";
import { goodsRecommend, goodsSearch } from '@/api/modules/pddShop.js';

export function getApiParams(item, {
    pageNum,
    groupId_index
}, isPositionId = true) {
    const { id, cid, cid2, cid3, eliteId, groupId, type, lx_type, positionId } = item;
    let params = {
        id,
        page: pageNum,
        size: 10,
    };
    let queryApi = goodsQuery;
    // type 1-猜你喜欢 2-京东精选 3-关键词查询, 4 选品库组合
    switch (type) {
        case 1:
            // 拼多多接口的访问
            if (lx_type == 2) {
                queryApi = goodsRecommend;
                isPositionId && (params.positionId = positionId);
            } else {
                queryApi = material;
                params.eliteId = eliteId;
                params.groupId = groupId;
                params.size = 10;
            }
            break;
        case 2:
            if (lx_type == 2) {
                queryApi = goodsSearch;
                isPositionId && (params.positionId = positionId);
            } else {
                queryApi = jingfen;
                params.eliteId = eliteId;
                params.groupId = groupId;
                params.size = 20;
            }
            break;
        case 3:
            queryApi = goodsQuery;
            params.cid1 = cid;
            params.cid2 = cid2;
            params.cid3 = cid3;
            break;
        case 4:
            queryApi = jingfen;
            params.eliteId = eliteId;
            params.groupId = groupId[groupId_index];
            params.size = 20;
            break;
    }
    return {
        queryApi,
        params,
        groupId,
        type
    }

}


import { goodsQuery, jingfen, material } from '@/api/modules/jsShop.js';
import { goodsRecommend, goodsSearch } from '@/api/modules/pddShop.js';
export default function getQueryApi(curObj = {}) {
    const {
        id,
        cid,
        cid2,
        cid3,
        eliteId,
        groupId,
        type,
        pageNum,
        groupId_index,
        positionId,
        lx_type
    } = curObj;
    let params = {
        id,
        positionId,
        page: pageNum,
        size: 10,
    }
    let queryApi = goodsQuery;
    // type 1-猜你喜欢 2-京东精选 3-关键词查询, 4 选品库组合
    switch(type) {
        case 1:
            // 拼多多接口的访问
            if (lx_type == 3) {
                queryApi = goodsRecommend;
                params.positionId = positionId;
            } else {
                queryApi = material;
                params.eliteId = eliteId;
                params.groupId = groupId;
                params.size = 10;
            }
            break;
        case 2:
            if (lx_type == 3) {
                queryApi = goodsSearch;
                params.positionId = positionId;
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
    };
    return {
        params,
        queryApi
    }
}
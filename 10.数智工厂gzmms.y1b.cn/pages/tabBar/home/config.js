import { getCamelCase } from "@/utils/index.js";
const modulePathMap = new Map();
// 物料模块下，需要显示的菜单
modulePathMap.set(0, [{
        parent: "/buy",
        child: [
            "order", //采购单
            "refund", //采购退货单
            "swap", //采购换货单
        ]
    },
    {
        parent: "/storage",
        child: [
            "buy-in", //采购入库
            "other-in", //其他入库
            "ret-goods", //退货出库单
            "get-supplier", //领料出库单
            "ret-supplier", //退料入库单
            "split", //拆装单
            "allot", //调拨单
            "check", //盘点单
            "scrap", //报废单
        ]
    },
    {
        parent: "/forms",
        child: [
            "goods-stock", //货品库存
        ]
    }
])

// 设备模块下，需要显示的菜单
modulePathMap.set(1, [{
        parent: "/device/archive", //固资管理
        child: [
            "equipment", //资产档案
        ]
    },
    {
        parent: "/device/maintain", //维保管理
        child: [
            "repair", //设备维修单
            "plan", //保养计划
            "work-order", //保养工单
        ]
    },
    {
        parent: "/device/inspection", //点巡检管理
        child: [
            "plan", //点巡检计划
            "record", //点巡检记录
        ]
    }
])

// 设备模块下，需要显示的菜单
modulePathMap.set(2, [{
        parent: "/device/archive", //固资管理
        child: [
            "equipment", //资产档案
        ]
    },
    {
        parent: "/device/inspection", //点巡检管理
        child: [
            "plan", //点巡检计划
            "record", //点巡检记录
        ]
    }
])


let arr = []
let config = [];
export function getConfig(list = arr, type = 0) {
    let showPathList = modulePathMap.get(type) || [];
    // console.log("showPathList", showPathList);
    let menuList = uni.$uv.deepClone(list);
    let menuConfig = []
    menuList.forEach((item) => {
        let {
            _children,
            ...rest
        } = item;
        let parentRes = showPathList.find((el) => el.parent == item.page_path);
        // console.log("parentRes", parentRes);
        if (parentRes) {
            let child = parentRes.child;
            let children = _children.filter((newitem) => {
                return newitem.page_path && child.includes(newitem.page_path)
            });
            menuConfig.push({
                ...rest,
                _children: children
            })
        }
    })
    config = menuConfig;
    return menuConfig;
}

export function getHomeMap(configQuery = config, type = 0) {
    console.log("configQuery", configQuery);
    let moduleType = Number(type)
    let homeMap = new Map();
    /* 物料模块 */
    const purchaseModule = "/pages/purchaseModule/";
    const warehouseModule = "/pages/warehouseModule/";
    const reportModule = "/pages/reportModule/"
        /* 设备模块*/
    const deviceModule = "/pages/deviceModule/"
    configQuery.forEach((item) => {
        let childObj = {}
        item._children.forEach((newitem) => {
            let pageName = getCamelCase(newitem.page_path);
            switch (moduleType) {
                case 0:
                    if (item.page_path == "/buy") {
                        childObj[newitem.page_path] = {
                            page: `${purchaseModule}${pageName}/list/list`,
                            img: `/static/home/${pageName}.png`,
                        }
                    } else if (item.page_path == "/storage") {
                        childObj[newitem.page_path] = {
                            page: `${warehouseModule}${pageName}/list/list`,
                            img: `/static/home/${pageName}.png`,
                        }
                    } else if (item.page_path == "/forms") {
                        childObj[newitem.page_path] = {
                            page: `${reportModule}${pageName}/list/list`,
                            img: `/static/home/${pageName}.png`,
                        }
                    }
                    break;
                case 1:
                    if (item.page_path == "/device/archive") {
                        childObj[newitem.page_path] = {
                            page: `${deviceModule}archive/${pageName}/list`,
                            img: `/static/deviceHome/${pageName}.png`,
                        }
                    } else if (item.page_path == "/device/maintain") {
                        childObj[newitem.page_path] = {
                            page: `${deviceModule}maintain/${pageName}/list`,
                            img: `/static/deviceHome/maintain-${pageName}.png`,
                        }
                    } else if (item.page_path == "/device/inspection") {
                        childObj[newitem.page_path] = {
                            page: `${deviceModule}inspection/${pageName}/list`,
                            img: `/static/deviceHome/${pageName}.png`,
                        }
                    }
                    break;
                case 2:
                    if (item.page_path == "/device/archive") {
                        childObj[newitem.page_path] = {
                            page: `${deviceModule}archive/${pageName}/list`,
                            img: `/static/deviceHome/${pageName}.png`,
                        }
                    } else if (item.page_path == "/device/inspection") {
                        childObj[newitem.page_path] = {
                            page: `${deviceModule}inspection/${pageName}/list`,
                            img: `/static/deviceHome/${pageName}.png`,
                        }
                    }
                    break;
                default:
                    break;
            }
        })
        homeMap.set(item.page_path, childObj)
    });
    return homeMap
}
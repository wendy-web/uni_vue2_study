import { number } from "../../../uni_modules/uv-ui-tools/libs/function/test";
import {
	getCamelCase
} from "@/utils/index.js"


/** 需要隐藏的page_path数组, 用于判断是否接口返回的菜单 */
const hideList = [
	"/setting",
	"supplier",
	"goods-manage",
	"goods-record",
	"inout-record",
	"getsupplier-record",
	"buyin-record",
	"ret-stocks",
	// ~~~~~~~~~~~~~~~~~~~~~分割线~~~~~~~~~~~~~~~~
	"study-file",
	"/device/maintain",
	"/data/settings",
	"/energy/manage",
	"/device/report-forms"
]
/** 可以点击进入的数组列表,如果这个数组中不包含的page_path,预防后台添加了菜单,小程序还没有页面的情况以及根据page_path获取图片失败时加载默认图片 */
const openList = [
	"order", //采购单
	"refund", //采购退货单
	"swap", //采购换货单
	"buy-in", //采购入库
	"other-in", //其他入库
	"ret-goods", //退货出库单
	"get-supplier", //领料出库单
	"ret-supplier", //退料入库单
	"split", //拆装单
	"allot", //调拨单
	"check", //盘点单
	"scrap", //报废单
	"goods-stock", //货品库存
	"inout-record", //出入库明细
	// ~~~~~~~~~~~~~~~~~~~~~分割线~~~~~~~~~~~~~~~~
	"equipment",
	"project",
	"plan",
	"record",
]
let arr = []
let config = [];

export function getConfig(list = arr) {
	let menuList = uni.$uv.deepClone(list);
	let menuConfig = []
	menuList.forEach((item) => {
		let {
			_children,
			...rest
		} = item;
		let children = _children.filter((newitem) => {
			return newitem.page_path && !hideList.includes(newitem.page_path)
		});
		if (item.page_path && !hideList.includes(item.page_path)) {
			menuConfig.push({
				...rest,
				_children: children
			})
		}
	})
	config = menuConfig;
	return menuConfig
}

export function getHomeMap(configQuery = config, type = 0) {
	let moduleType = Number(type)
	let homeMap = new Map();
	//所有子集菜单名的数组,无用处,只打印出来看看
	let keyList = [];
	/* 物料模块 */
	const purchaseModule = "/pages/purchaseModule/";
	const warehouseModule = "/pages/warehouseModule/";
	const reportModule = "/pages/reportModule/"
	/* 设备模块*/
	const deviceModule = "/pages/deviceModule/"


	configQuery.forEach((item) => {
		item._children.forEach((newitem) => {
			keyList.push(newitem.page_path);
			let pageName = getCamelCase(newitem.page_path);
			let isOpen = openList.includes(newitem.page_path);
			switch (moduleType) {
				case 0:
					if (item.page_path == "/buy") {
						homeMap.set(newitem.page_path, {
							page: `${purchaseModule}${pageName}/list/list`,
							// img: "",
							// img:  `https://file.y1b.cn/public/erpxcx_img/home/cgd@2x.png`
							// img: require(`@/static/home/${pageName}.png`)
							// img: `/static/home/${pageName}.png`
							img: isOpen ? `/static/home/${pageName}.png` : '/static/home/order.png',
							open: isOpen
						})

					} else if (item.page_path == "/storage") {
						homeMap.set(newitem.page_path, {
							page: `${warehouseModule}${pageName}/list/list`,
							// img:  `https://file.y1b.cn/public/erpxcx_img/home/${pageName}.png`
							// img: require(`@/static/home/${pageName}.png`)
							// img: `/static/home/${pageName}.png`
							img: isOpen ? `/static/home/${pageName}.png` : '/static/home/buyIn.png',
							open: isOpen
						})
					} else if (item.page_path == "/forms") {
						homeMap.set(newitem.page_path, {
							page: `${reportModule}${pageName}/list/list`,
							// img:  `https://file.y1b.cn/public/erpxcx_img/home/${pageName}.png`
							// img: require(`@/static/home/${pageName}.png`)
							// img: `/static/home/${pageName}.png` 
							img: isOpen ? `/static/home/${pageName}.png` : `/static/home/goodsStock.png`,
							open: isOpen
						})
					}
					break;
				case 1:
					if (item.page_path == "/device/archive") {
						homeMap.set(newitem.page_path, {
							page: `${deviceModule}archive/${pageName}/list`,

							// img: isOpen ? `/static/home/${pageName}.png` : '/static/home/order.png',
							img: isOpen ? `/static/home/order.png` : '/static/home/order.png',
							open: isOpen
						})
					} else if (item.page_path == "/device/inspection") {
						homeMap.set(newitem.page_path, {
							page: `${deviceModule}inspection/${pageName}/list`,
							// img: isOpen ? `/static/home/${pageName}.png` : '/static/home/order.png',
							img: isOpen ? `/static/home/order.png` : '/static/home/order.png',
							open: isOpen
						})
					}

					break;
				default:
					break;
			}



		})
	});

	return homeMap
}





// arr.forEach((item) => {
// 	let {
// 		_children,
// 		...rest
// 	} = item;
// 	let children = _children.filter((newitem) => {
// 		return newitem.page_path && !hideList.includes(newitem.page_path)
// 	});
// 	if (item.page_path && !hideList.includes(item.page_path)) {
// 		config.push({
// 			...rest,
// 			_children: children
// 		})
// 	}
// })


// console.log("config", config)
// let homeMap = new Map();

// //所有子集菜单名的数组,无用处,只打印出来看看
// let keyList = [];
// const purchaseModule = "/pages/purchaseModule/";
// const warehouseModule = "/pages/warehouseModule/";
// const reportModule = "/pages/reportModule/"

// /* img: 线上的img图片忘记改对应的名字了,暂时先用本地图片 */
// config.forEach((item) => {
// 	item._children.forEach((newitem) => {
// 		keyList.push(newitem.page_path);
// 		let pageName = getCamelCase(newitem.page_path);
// 		// console.log("pageName", pageName)
// 		if (item.page_path == "/buy") {
// 			homeMap.set(newitem.page_path, {
// 				page: `${purchaseModule}${pageName}/list/list`,
// 				// img: "",
// 				// img:  `https://file.y1b.cn/public/erpxcx_img/home/cgd@2x.png`
// 				img: require(`@/static/home/${pageName}.png`)
// 			})

// 		} else if (item.page_path == "/storage") {
// 			homeMap.set(newitem.page_path, {
// 				page: `${warehouseModule}${pageName}/list/list`,
// 				// img:  `https://file.y1b.cn/public/erpxcx_img/home/${pageName}.png`
// 				img: require(`@/static/home/${pageName}.png`)
// 			})
// 		} else if (item.page_path == "/forms") {
// 			homeMap.set(newitem.page_path, {
// 				page: `${reportModule}${pageName}/list/list`,
// 				// img:  `https://file.y1b.cn/public/erpxcx_img/home/${pageName}.png`
// 				img: require(`@/static/home/${pageName}.png`)
// 			})
// 		}

// 	})
// });

// config.forEach((item) => {
// 	item._children.forEach((newitem) => {
// 		if (newitem.page_path) {
// 			keyList.push(newitem.page_path);
// 		}
// 	})
// });
// console.log("keyList", keyList)

// homeMap.set("order", {
// 	page: "",
// 	img: "",
// })
// homeMap.set("refund", {
// 	page: "",
// 	img: "",
// })
// homeMap.set("swap", {
// 	page: "",
// 	img: "",
// })
// homeMap.set("buy-in", {
// 	page: "",
// 	img: "",
// })
// homeMap.set("ret-goods", {
// 	page: "",
// 	img: "",
// })
// homeMap.set("get-supplier", {
// 	page: "/pages/warehouseModule/getSupplier/list/list",
// 	img: "",
// })
// homeMap.set("ret-supplier", {
// 	page: "",
// 	img: "",
// })
// homeMap.set("split", {
// 	page: "",
// 	img: "",
// })
// homeMap.set("allot", {
// 	page: "",
// 	img: "",
// })
// homeMap.set("check", {
// 	page: "",
// 	img: "",
// })
// homeMap.set("scrap", {
// 	page: "",
// 	img: "",
// })
// homeMap.set("goods-stock", {
// 	page: "",
// 	img: "",
// })
// homeMap.set("inout-record", {
// 	page: "",
// 	img: "",
// })

// console.log("homeMap", homeMap)
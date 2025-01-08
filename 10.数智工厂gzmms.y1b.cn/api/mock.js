// 参考列表数据
const orderList = [{
	"id": 52,
	"procure_no": "CGD202309230",
	"all_price": "1000.00",
	"all_num": 20,
	"note": null,
	"file_info": {
		"src": "",
		"name": ""
	},
	"dept_id": 6,
	"ct_name": "管理员【总经办】",
	"ct_uid": 1,
	"status": 0,
	"create_time": "2023-09-23 09:38:08",
	"assoc_type": 0,
	"type": 1,
	"product_name": "收银贴音箱,平衡重式无人叉车",
	"total_rem_num": 20,
	"total_rec_num": 0,
	"total_ret_num": 0
}, ]


export function apiGoods(pageNum, pageSize, keyword) {
	return new Promise((resolute, reject) => {
		//延时一秒,模拟联网
		setTimeout(() => {
			try {
				let data = {
					list: [], //数据列表
					total: 0, //总条数
				}
				for (let i = 0; i < pageSize; i++) {
					let id = Math.floor(Math.random() * 999) + 1;
					let newObj = {
						id: id,
						procure_no: "CGD2023082916",
						wh_rec_no: "KLL202310070",
						wh_inv_no: "PD202310094",
						ct_name: "陈肖利【采购部】" + id,
						note: "我是备注" + id,
						create_time: "2023-09-23 09:38:08",
						status: Math.floor(Math.random() * 6) + 1
					};
					data.list.push(newObj);
				}
				data.total = 10;

				resolute(data);
			} catch (e) {
				//模拟接口请求失败
				reject(e);
			}
		}, 1000)
	})
}
import {
	nearby
} from "@/api/modules/zmTraceability.js";

import {
	getUserLocation
} from "@/utils/getUserLocation"

export default {

	data() {
		return {
			prizeratetype: 1,
			list: [],
			type: 0
		}
	},
	methods: {
		tabsChange(val) {
			this.type = val
			this.getData(0);
		},
		/*上下拉刷新相关*/
		async getData() {

			let {
				data
			} = await getUserLocation()

			let params = {
				...data,
				prizeratetype: this.prizeratetype
			}

			nearby(params).then(res => {

				this.sort(res.data.list.map(item => {
					if (item.dist > 1000) {
						item.distText = (item.dist / 1000).toFixed(2) + '公里';
					} else {
						item.distText = Math.round(item.dist) + '米';
					}
					return item
				}))

			})

		},
		sort(array = []) {
			//距离排序
			if (this.type === 0) {
				array.sort(function(a, b) {
					return b.score - a.score;
				});
			}
			//数量多时，分块渲染，优化体验
			if (array.length > 20) {

				this.list = array.slice(0, 20);

				setTimeout(() => {
					this.list = this.list.concat(array.slice(20, array.length));
				}, 0);

			} else {
				this.list = array;
			}
		}
	}
}
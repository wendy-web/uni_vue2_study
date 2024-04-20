import {
	scanLog
} from "@/api/modules/zmTraceability.js"
import {
	parseTime
} from '@/utils/index.js';

export default {
	data() {
		return {
			isOpen: false,
			listData: [],
			select_time: [],
			minDate: new Date().getTime(),
			maxDate: new Date().getTime(),
			prizeratetype: 1
		}
	},
	methods: {
		upCallback(page) {
			let parmas = {
				next: page.num,
				prizeratetype: this.prizeratetype
			};
			//配置查询参数
			if (this.select_time && this.select_time.length > 0) {
				parmas.start_time = this.select_time[0];
				parmas.end_time = this.select_time[1];
			}
			//联网加载数据
			scanLog(parmas).then(res => {
				let data = res.data || {
					list: []
				};
				//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
				this.mescroll.endSuccess(data.list.length);
				//设置列表数据
				if (page.num == 1) this.listData = []; //如果是第一页需手动制空列表
				this.listData = this.listData.concat(data.list); //追加新数据
			}).catch(() => {
				//联网失败, 结束加载
				this.mescroll.endErr();
			});
		},
		showCalendar() {
			this.minDate = new Date(2024, 0, 1).getTime();
			this.maxDate = new Date().getTime();
			this.isOpen = true;
		},
		onClose() {
			this.isOpen = false;
		},
		reset() {
			this.select_time = [];
			this.mescroll.resetUpScroll();
		},
		onConfirm(event) {
			this.isOpen = false;
			this.select_time = [parseTime(event.detail[0], '{y}-{m}-{d}'), parseTime(event.detail[1],
				'{y}-{m}-{d}')];
			this.mescroll.resetUpScroll();
		}
	}
}
import {
	optionalGoods,
	groupGoods
} from "@/api/modules/ttxl.js"

export default {

	data() {
		return {
			goodsMixin_pathType: 0,
			goodsMixin_list: [],
			goodsMixin_downOption: {
				auto: false,
				use: true,
				bgColor: "#ffffff",
			},
			goodsMixin_upOption: {
				auto: false, // 不自动加载
				use: true,
				page: {
					num: 0,
					size: 1,
				},
				noMoreSize: 4,
				empty: {
					use: false
				},
				toTop: {
					src: "",
					bottom: 250,
					left: 20
				},
				textNoMore: '----- 没有更多了 -----'
			},
			goodsMixin_redRot: false,
			goodsMixin_pageNum: 1,
			//多选品库
			goodsMixin_groupIdArr: [],
			goodsMixin_currGroupId: ""
		}
	},
	methods: {
		/*上下拉刷新相关*/
		goodsMixin_upCallback({
			num,
			page
		}) {
			if(num < 3) {
				this.mescroll.hideUpScroll();
			} else {
				this.mescroll.showUpScroll();
			}
			let Api = optionalGoods;
			let params = {
				page: this.goodsMixin_pageNum,
				size: 10,
				path_type: this.goodsMixin_pathType
			}
			//多选品库参数
			if (this.goodsMixin_currGroupId) {
				//goodsMixin_currGroupId == -1 代表首次||goodsMixin_groupIdArr没有值，则不传groupId参数
				if (this.goodsMixin_currGroupId > 0) params.groupId = this.goodsMixin_currGroupId
				Api = groupGoods
			}

			Api(params).then(res => {

				let {
					list,
					total_count,
					redRot,
					groupIdArr,
					page_num
				} = res.data || {
					list: [],
					total_count: 0,
					redRot: 0,
					groupIdArr: [],
					page_num: 0
				}

				//更新订单状态
				if (res.data?.redRot) this.goodsMixin_redRot = Boolean(redRot)
				//设置多选品库参数
				if (!this.goodsMixin_groupIdArr?.length && groupIdArr?.length) {
					this.goodsMixin_groupIdArr = groupIdArr
				}
				let isNextPage = this.goodsMixin_pageNum < page_num
				//如果是第一页需手动制空列表
				if (num == 1) {
					this.goodsMixin_list = []
					this.goodsMixin_pageNum = 1
				};
				//追加新数据
				this.goodsMixin_list = this.goodsMixin_list.concat(list);
				this.goodsMixin_pageNum++
				//没有下一页了
				if (!isNextPage) {
					//有选品id 并且选品id数组还不为空
					if (this.goodsMixin_currGroupId && this.goodsMixin_groupIdArr?.length) {
						this.goodsMixin_currGroupId = this.goodsMixin_groupIdArr.pop()
						this.goodsMixin_pageNum = 1
						isNextPage = true
					} else if (!this.goodsMixin_currGroupId) {
						//当前goodsMixin_currGroupId选品id为空则代表 商品列表接口数据已请求完 切换 频道推荐接口
						this.goodsMixin_currGroupId = -1
						this.goodsMixin_pageNum = 1
						isNextPage = true
					} else {
						this.goodsMixin_currGroupId = -2
					}
				}
				this.mescroll.endSuccess(list.length, isNextPage);
				//接口数据为空但还有接口未请求的情况
				if (this.goodsMixin_currGroupId === -1 && isNextPage) {
					this.goodsMixin_pageNum = 1
					this.mescroll.triggerUpScroll()
					this.goodsMixin_currGroupId = -2
				}

			}).catch(() => {
				this.mescroll.endErr()
			})

		},
		goodsMixin_downCallback() {
			this.goodsMixin_pageNum = 1
			this.goodsMixin_currGroupId = ""
			this.goodsMixin_groupIdArr = []
			this.mescroll.resetUpScroll();
		}
	}
}
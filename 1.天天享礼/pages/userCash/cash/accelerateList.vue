<template>
<view class="record_box">
<mescroll-body
	id="mescrollBody"
	ref="mescrollRef"
	:sticky="true"
	@init="mescrollInit"
	@down="downCallback"
	:down="downOption"
	:up="upOption"
	@up="upCallback"
>
	<xh-navbar
		:fixedNum="true"
		navbarImageMode="widthFix"
		:overFlow="true"
		:navbarImage="isShowTitle ? bg_img : ''"
	>
		<view slot="title" class="nav-custom">
			<image  mode="widthFix" class="custom_left" src="https://file.y1b.cn/store/1-0/24123/65af12e4a98e3.png"
				@click="$leftBack"></image>
			{{ isShowTitle ? orderTitle : '' }}
		</view>
	</xh-navbar>
	<image  mode="widthFix" class="nav_bg"
		:style="{'--margin': navHeight + 'px' }" :src="bg_img" id="navBgId"></image>
	<view :class="['remind_lab', isShowTitle ? 'opacity_active' : 'opacity_non']" :style="{'--top': navHeight + 'px' }">
		下单约2分钟后查看结果
	</view>
	<good-list :list="listData"></good-list>
</mescroll-body>
</view>
</template>
<script>
import { speedGoods, speedXq } from '@/api/modules/cash.js';
import { goodsQuery, jingfen, material } from '@/api/modules/jsShop.js';
import { goodsRecommend, goodsSearch } from '@/api/modules/pddShop.js';
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { warpRectDom } from '@/utils/auth.js';
import getViewPort from '@/utils/getViewPort.js';
import goodList from './component/goodList.vue';
	export default {
		mixins: [MescrollMixin], // 使用mixin
		components: {
			goodList
		},
		data() {
			return {
				downOption: {
					auto: true,
					use: true,
					bgColor: "#ffffff",
				},
				upOption: {
					auto: false, // 不自动加载
					use: true,
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 10, // 每页数据的数量
					},
					noMoreSize: 99,
				},
				speed_id: 0,
				orderTitle: '',
				bg_img: '',
				order_num: 0,
				active_id: 0,
				listData: [],
				shopGroup: [],
				shopGroupIndex: -1,
				pageNum: 1,
				isShowTitle: false,
			}
		},
		computed: {
			stickyActTop() {
				let viewPort = getViewPort();
				return viewPort.navHeight + 'px';
			},
			navHeight() {
				let viewPort = getViewPort();
				return viewPort.navHeight;
			}
		},
		watch: {
			bg_img: {
				handler(newValue, oldValue) {
					setTimeout(async () => {
						const navBgRes = await this.warpRectDom('navBgId');
						this.nav_bgTop = navBgRes.height - this.navHeight;
					}, 2000);
				},
				immediate: true
			}
		},
		// 页面周期函数--监听页面加载
		async onLoad(option) {
			if(option) {
				const { id, active_id } = option;
				this.speed_id = id;
				this.active_id = active_id;
			}
		},
		methods: {
			warpRectDom,
			async downCallback() {
				const res = await speedXq({
					speed_id: this.speed_id,
					active_id: this.active_id
				});
				if(res.code != 1 || !res.data) return;
				const { order_num, shopGroup, title, bg_img} = res.data;
				this.order_num = order_num;
				this.shopGroup = shopGroup;
				this.orderTitle = title;
				this.bg_img = bg_img;
				// uni.setNavigationBarTitle({ title });
				this.mescroll.resetUpScroll();
			},
			async upCallback(page) {
				// 列表的京东与拼多多的请求
				if (this.shopGroupIndex >= 0) return this.requestShopGroup(page);
				const params = {
					speed_id: this.speed_id,
					active_id: this.active_id,
					size: 10,
					page: page.num
				}
				speedGoods(params).then(res => {
					if(res.code != 1) return;
					const { list, total_count } = res.data;
					if (page.num == 1) this.listData = []; // 如果是第一页需手动制空列表
					this.listData = this.listData.concat(list); // 追加新数据
					let isNextPage = ((params.page * params.size) < total_count);
					if (isNextPage) return this.mescroll.endSuccess(list.length, isNextPage);
					this.mescroll.endSuccess(0, true);
					this.shopGroupIndex = 0;
					this.mescroll.triggerUpScroll();

				}).catch(err =>  this.mescroll.endErr());
			},
			requestShopGroup(page) {
				if(!this.shopGroup.length || this.shopGroupIndex >= this.shopGroup.length) {
					this.mescroll.endSuccess(9, false);
					this.mescroll.showNoMore();
					return;
				};
				if (!this.shopGroup[this.shopGroupIndex]._listLength0) {
					this.shopGroup[this.shopGroupIndex]._listLength0 = 0;
				}
				let shopGroupItem = this.shopGroup[this.shopGroupIndex];
				const {
					id,
					cid,
					cid2,
					cid3,
					eliteId,
					groupId,
					type,
					lx_type,
					active_id,
					tag
				} = shopGroupItem;
				let params = {
					id,
					page: this.pageNum,
					size: 10,
					active_id,
					tag
				}
				let queryApi = goodsQuery;
				switch (type) {
					case 1:
						if (lx_type == 2) {
							queryApi = goodsRecommend;
						} else {
							queryApi = material;
							params.eliteId = eliteId;
							params.groupId = groupId;
						}
						break;
					case 2:
						if (lx_type == 2) {
							queryApi = goodsSearch;
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
						if (!this.shopGroup[this.shopGroupIndex]._groupIdIndex) {
							this.shopGroup[this.shopGroupIndex]._groupIdIndex = 0;
						}
						const _groupIdIndex = this.shopGroup[this.shopGroupIndex]._groupIdIndex;
						params.eliteId = eliteId;
						params.groupId = groupId[_groupIdIndex];
						params.size = 20;
						break;
				};
				queryApi(params).then(res => {
					const { list, total_count } = res.data;
					// 联网成功的回调,隐藏下拉刷新和上拉加载的状态;
					let isNextPage = (params.page * params.size) < total_count;
					this.pageNum += 1;
					if (!isNextPage && type == 4 && this.shopGroup[this.shopGroupIndex]._groupIdIndex < (groupId.length - 1)) {
						// 无下一页
						this.shopGroup[this.shopGroupIndex]._groupIdIndex += 1;
						this.mescroll.endSuccess(params.size, true);
						this.pageNum = 1;
					} else if (!isNextPage && (this.shopGroupIndex < (this.shopGroup.length - 1))) {
						this.shopGroupIndex += 1;
						this.pageNum = 1;
						// this.mescroll.triggerUpScroll();
						this.mescroll.endSuccess(params.size, true);
						this.mescroll.triggerUpScroll();
					} else {
						if(!list.length) {
							if(this.shopGroup[this.shopGroupIndex]._listLength0 >= 2) {
								this.shopGroupIndex += 1;
								this.pageNum = 1;
							}
							this.shopGroup[this.shopGroupIndex]._listLength0 += 1;
						} else {
							this.shopGroup[this.shopGroupIndex]._listLength0 = 0;
						}
						this.mescroll.endSuccess(params.size, isNextPage);
					}
					this.listData = this.listData.concat(list); // 追加新数据
					if ((list.length <= 6 && isNextPage) || this.listData.length < 6) {
						this.mescroll.triggerUpScroll();
					}
				}).catch(() => this.mescroll.endErr());
			},
			onPageScroll(event) {
				const scrollTop = Math.ceil(event.scrollTop);
				// this.isShowTitle = (scrollTop >= this.navHeight);
				this.isShowTitle = (scrollTop >= this.nav_bgTop);
			},
		}
	}
</script>
<style lang="scss" scoped>
.nav_bg {
    width: 100%;
    margin-top: calc(0px - var(--margin));
}
.record_box {
	position: relative;
	z-index: 0;
	box-sizing: border-box;
	background: #f7f7f7;
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
}
.remind_lab{
	background: #f7f7f7;
	position: fixed;
	top: var(--top);
	width: 100%;
	left: 0;
	line-height: 86rpx;
	font-size: 32rpx;
	text-align: center;
	color: #9d4218;
	transition: all .3s;
	z-index: 9;
}
.sticky_box{
	z-index: 9;
	position: sticky;
	top: 0;
	background: #f7f7f7;
	padding: 32rpx 16rpx;
}
.cash_top{
  background: rgba(255,255,255,0.65);
  border-radius: 32rpx;
  backdrop-filter: blur(12rpx);
  padding: 32rpx;
  box-sizing: border-box;
  text-align: center;
  transform: all 1s;
  transition-duration: .1s;
  border: 3rpx solid #fff;
  .cash_title {
    font-size: 34rpx;
    color: #9d4218;
    line-height: 72rpx;
	height: 72rpx;
    text-align: center;
  }
}
.cash_time-txt {
  font-size: 26rpx;
  text-align: center;
  color: rgba(157,66,24,0.60);
  line-height: 36rpx;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  &::before {
    content: '\3000';
    display: block;
    width: 72rpx;
    height: 2rpx;
    background: linear-gradient(90deg,rgba(227,190,170,0.00), #c28971 100%);
    border-radius: 2rpx;
    margin-right: 8rpx;
  }
  &::after {
    content: '\3000';
    display: block;
    width: 72rpx;
    height: 2rpx;
    background: linear-gradient(-90deg,rgba(227,190,170,0.00), #c28971 100%);
    border-radius: 2rpx;
    margin-left: 8rpx;
  }
}
.nav-custom {
	flex: 1;
	font-size: 42rpx;
	color: #fff;
	font-weight: bold;
	text-align: center;
	.custom_left {
		position: absolute;
		width: 40rpx;
		height: 40rpx;
		left: 24rpx;
		top: 50%;
		transform: translateY(-50%);
	}
}
</style>

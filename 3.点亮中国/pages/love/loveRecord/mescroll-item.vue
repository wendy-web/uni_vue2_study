<template>
	<!-- 
	swiper中的transfrom会使fixed失效,此时用height="100%"固定高度; 
	swiper中无法触发mescroll-mixins.js的onPageScroll和onReachBottom方法,只能用mescroll-uni,不能用mescroll-body
	-->
	<!-- ref动态生成: 字节跳动小程序编辑器不支持一个页面存在相同的ref (如不考虑字节跳动小程序可固定值为 ref="mescrollRef") -->
	<mescroll-uni ref="mescrollRef" :fixed="false"  @init="mescrollInit"
		:down="downOption" @down="downCallback" :up="upOption" @up="upCallback" @emptyclick="emptyClick">
		<!-- 数据列表 -->
		<!-- <template > -->
               <!-- 捐献记录 -->
			   <donation-record  v-for="item in listData" :config="item" :key="item.id"/>
			   <!-- 获取记录 -->
		<!-- </template> -->
	</mescroll-uni>
</template>

<script>
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
	import MescrollMoreItemMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mixins/mescroll-more-item.js';
	
	import {getUserDonateList,getTeamDonateList} from '@/api/modules/love.js'
	import {getUserLoveList,getTeamCity} from '@/api/modules/home.js'
	import donationRecord from './donationRecord.vue'
	//分页
	export default {
		mixins: [MescrollMixin, MescrollMoreItemMixin], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
		components:{
			donationRecord
		},
		data() {
			return {
				downOption: {
					auto: false // 不自动加载 (mixin已处理第一个tab触发downCallback)
				},
				upOption: {
					auto: false, // 不自动加载
					noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					// empty: {
					// 	tip: '~ 空空如也 ~', // 提示
					// 	btnText: '去新闻页'
					// },
					toTop: {
						src: ''
					},
					textNoMore: '~ 暂无更多信息 ~'
				},
				//列表数据
				listData: [],
				NEXT:0
			};
		},
		props: {
			currTabs: {
				type: Number,
				default: 0
			},
			identity:{
				type: Number,
				default: 0
			}
			
		},
		mounted() {
			this.NEXT = 0
		},
		methods: {
			/*下拉刷新的回调 */
			downCallback() {
				this.NEXT = 0
				// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
				this.mescroll.resetUpScroll();
			},
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			upCallback(page) {
				//联网加载数据
				let currTabs = this.currTabs;
				let identity = this.identity;
				//请求参数处理
				let API = ''
				if(currTabs == 0){
					API = identity == 0?getUserDonateList:getTeamDonateList
				}else{
					API = identity == 0?getUserLoveList:getTeamCity
				}
				
				let parmas = {
					limit:10
				}
				
				if(this.NEXT != 0)parmas.next = this.NEXT

				//获取数据next:NEXT,
				API(parmas).then(res => {
                    
					const {total,list,next} = res.data
					
					let data =  {
						list: list||[]
					};

					//联网成功的回调,隐藏下拉刷新和上拉加载的状态
					this.mescroll.endSuccess(data.list.length);
					//设置列表数据
					if (this.NEXT == 0) {
						this.listData = []; //如果是第一页需手动制空列表
						if(total)this.$emit('setTotal',total)
					}
					this.NEXT = next
					//填充数据
					if(currTabs == 1){
						data.list = data.list.map(item=>{
							let title = '';
							if(item.type === 1){
								title = `点亮【${item.ext_record}】`
							}else if(item.type === 4){
								title = `收能量`
							}else{
								title = `解锁【${item.ext_record}】勋章`
							}
							return {
								id:item.id,
								love:item.love||1,
								// title: item.type === 1?`点亮【${item.ext_record}】`:`解锁【${item.ext_record}】勋章`,
								title,
								create_time:item.create_time,
								isHarvest:1
							}
						})
					}
					
					this.listData = this.listData.concat(data.list);
					
				}).catch(err => {
					//联网失败, 结束加载
					this.mescroll.endErr();
				});

			}
		}
	};
</script>


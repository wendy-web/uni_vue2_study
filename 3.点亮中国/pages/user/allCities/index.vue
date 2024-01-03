<template>
	<view class="all-cityes">
		<view class="cityes-column" v-for="(item,index) in listData" :key="index">
			<view class="cityes-column-head">
				{{item.name}}（已点亮{{item.num}}/{{item.list.length}}）
			</view>
			<view class="cityes-list">
				<view class="cityes-item" v-for="(_item,_index) in item.list" :key="_index" @click="showCity(_item)">
					<view class="cityes-logo" :class="{'brightness':_item.status == 0}">
						<van-image  width="160rpx" height="160rpx" fit="cover" :src="_item.image+'@thumb.png'" radius="10px" lazy-load use-loading-slot>
							<van-loading slot="loading" type="spinner" size="20" vertical />
						</van-image>
						<view class="cityes-date" v-if="_item.status == 1">
							{{_item.lit_time}}
						</view>
					</view>
                    <view class="cityes-name">
                    	{{_item.city}}
                    </view>
				</view>
			</view>
		</view>
		<!-- 城市点击弹窗 -->
		<city-popup ref="cityPopup" @share="cityShare"/>
		<!-- 城市分享 -->
		<city-share-card ref="cityShareCard"/>
		<!-- 自定义分享 -->
		<van-share-sheet
		  :show="showShare"
		  :options="shareOptions"
		  @select="shareSelect"
		  @close="shareClose"
		  :overlay="false"/>
		  <!-- 分享朋友圈 -->
		  <wechat-moments ref="wechatMoments"/>
		  <!-- 隐私协议的组件 -->
		<privacy ref="privacy"></privacy>
	</view>
</template>

<script>
	import {getAllUserCity,getAllTeamCity} from '@/api/modules/home.js'
	import {mapGetters} from 'vuex'
	import cityPopup from '@/components/popupWindow/cityPopup.vue'
	import cityShareCard from '@/components/popupWindow/cityShareCard/index.vue'
	import wechatMoments from '@/components/wechatMoments.vue'
	//区分团队与个人
	let _type = 0
	let _team;
	export default {
		components:{
			cityPopup,
			cityShareCard,
			wechatMoments
		},
		computed:{
			...mapGetters(['userInfo'])
		},
		data(){
			return {
				listData:[],
				showShare:false,
				shareOptions:[
					{ name: '微信', icon: 'wechat', openType: 'share' },
					{ name: '朋友圈', icon: 'wechat-moments'},
					{ name: '保存图片', icon: 'https://file.y1b.cn/public/img/dlzg/downImage.png' }
				],
				share_title: ''
			}
		},
		onShow() {
			// 隐私协议判断
			this.$refs.privacy.LifetimesShow();
		},
		onShareAppMessage(data) {
			let share = {
				title: '点亮全中国，一起攒能量',
				path: '/pages/tabBar/home/index'
			}
			const shareImgData = JSON.stringify(this.$refs.cityShareCard.getShareImgData());
			if(data.from == 'button') {
				// 分享城市
				share.title = this.share_title;
				share.imageUrl = this.$refs.cityShareCard.getImageUrl();
				share.path = '/pages/tabBar/home/index?type=cityShare&shareImgData=' + shareImgData;
			}
			return share;
		},
		onShareTimeline(data){
			let share = {
				title: '点亮全中国，一起攒能量'
			}
			share.path = '/pages/tabBar/home/index'
			const imageUrl = this.$refs.cityShareCard.getImageUrl();
			const shareImgData = JSON.stringify(this.$refs.cityShareCard.getShareImgData());
			if(imageUrl){
				share.imageUrl = imageUrl;
				share.title = this.share_title;
				share.path = '/pages/tabBar/home/index?type=cityShare&shareImgData=' + shareImgData;
			}
			return share;
		},
		onLoad(o) {
			_type = +o.type
           this.initData()
		},
		methods:{
			shareSelect(e){
				//保存图片
				if(e.detail.name == "保存图片"){
					this.$refs.cityShareCard.save()
				}else if(e.detail.icon == "wechat-moments"){
					//朋友圈
					this.shareClose()
					this.$refs.wechatMoments.show()
				}
			},
			shareClose(){
				this.showShare = false
				this.$refs.cityShareCard.popupClose()
			},
			cityShare(data){
				/*全部城市，城市名片【分享】 */
				wx.reportEvent("click_allsharecity", {
				    authorized_or_not:1
				})
				let avatar = _type == 0?this.userInfo.avatar_url:_team.image
				let name = _type == 0?this.userInfo.nick_name:_team.name
				this.$refs.cityShareCard.showTime({
			        avatar,
					name,
					cityImage:data.cityImage,
					date:data.lightDate,
					cityName:data.cityName
				})
				this.showShare = true
			},
			showCity(item){
				const {city,image,lit_time,status, share_title} = item;
				this.share_title = share_title;
				this.$refs.cityPopup.popupShow({
					cityImage:image,
					isLightUp:Boolean(status),
					cityName:city,
					lightDate:lit_time
				})
			},
			initData(){
				const Api = _type == 0 ? getAllUserCity:getAllTeamCity
				Api().then(res=>{
					let {list,team} = res.data
				     list = list||[]
					 _team = team
					/*延时渲染*/
					const length = list.length
					if(list.length === 0)return
					const size = Math.ceil(length/3)
					let count = 0
					for(let i = 0;i<size;i++){
						setTimeout(()=>{
							this.listData = this.listData.concat(list.slice(count,count+3))
							count+=3
						},i*200)
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #FCECCD;
		padding: 10rpx;
		box-sizing: border-box;
	}
	.all-cityes{
		padding: 60rpx 30rpx;
		background-color: #FFFEFB;
		border-radius: 10px;
		.cityes-column{
			margin-bottom: 10rpx;
		}
		.cityes-column-head{
			font-size: 32rpx;
			font-weight: 700;
			color: #000018;
			padding-bottom: 30rpx;
		}
		.cityes-list{
			display: flex;
			flex-wrap: wrap;
		}
		.cityes-item{
			text-align: center;
			margin-bottom: 30rpx;
			width: 25%;
		}
		.cityes-logo{
			position: relative;
			font-size: 0
		}
		.cityes-date{
			position: absolute;
			left: 50%;
			right: 0;
			bottom: 0;
			width: 160rpx;
			height: 42rpx;
			background-color: rgba(0, 0, 0, 0.5);
			font-size: 20rpx;
			font-weight: 400;
			color: #fff;
			border-radius: 0 0 10px 10px;
			text-align: center;
			line-height: 42rpx;
			transform: translateX(-50%);
		}
		.cityes-name{
			font-size: 28rpx;
			font-weight: 400;
			color: #000018;
			margin-top: 15rpx;
		}
		.brightness{
			filter: brightness(.4);
		}
		
	}
</style>
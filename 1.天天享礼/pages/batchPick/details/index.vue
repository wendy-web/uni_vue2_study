<template>
	<view class="batch-pick-details">
		<!-- 商品信息 -->
		<view class="bpd-card shop-info">
			<view class="shop-info-top">
				<view class="product-title">{{cardInfo.product_title}}</view>
				<!-- <text>¥{{cardInfo.face_value}}</text> -->
			</view>
			<view class="shop-info-bottom">
		<!-- 		<text>250ml*24罐(整箱)</text>
				<text>x2</text> -->
				<text>¥{{cardInfo.face_value}}</text>
			</view>
			<!-- 背景 -->
			<image class="shop-info-bg" src="../static/shop_name_bg.png" mode="aspectFill"></image>
		</view>
		<!-- 卡劵信息 -->
		<view class="card-info bpd-card">
			<view class="card-title bpd-title">
				卡券信息
			</view>
			<view class="card-info-item" @click="clip(cardInfo.card_no)">
				<text class="cii-label">卡号：</text>
				<text class="cii-value">{{cardInfo.card_no}}</text>
				<text class="cii-copy">复制</text>
			</view>
			<view class="card-info-item" @click="clip(cardInfo.card_close)">
				<text class="cii-label">券码(卡密)：</text>
				<text class="cii-value">{{cardInfo.card_close}}</text>
				<text class="cii-copy">复制</text>
			</view>
			<view class="card-info-item">
				<text class="cii-label">过期时间：</text>
				<text class="cii-value-time">{{cardInfo.expire_time}}</text>
			</view>
		</view>
		<!-- 需要核销 -->
		<block v-if="isNeedHx">
		<!-- 二维码信息 -->
			<view class="bpd-card hx-qrcode">
				<view class="bpd-title hx-qrcode-title">
					核销二维码
				</view>
				<!-- 二维码 -->
				<view class="qrcode-box">
					<!-- 背景 -->
					<image class="scan-border" src="../static/scan_border.png" mode="aspectFill"></image>
					<!-- 二维码 -->
					<!-- <image class="qrcode" :src="imgUrl+'/static/images/avatar_default.png'" mode="aspectFill"></image> -->
					<view class="qrcode">
						<w-qrcode v-if="qrOptions.code" :options="qrOptions"></w-qrcode>
						<van-loading v-else />
					</view>
				</view>
				<!-- 条形码 -->
				<view class="bar-code-box">
					<!-- <image class="bar-code" src="../static/card_shadow.png" mode="aspectFill"></image> -->
					<w-barcode v-if="brOptions.code" :options="brOptions"></w-barcode>
					<van-loading v-else />
				</view>
				<!-- 背景 -->
				<image class="scan-bg" src="../static/scan_bg.png" mode="aspectFill"></image>
			</view>
		    <!-- 使用说明 -->
			<view class="use-info bpd-card">
				<view class="bpd-title use-info-title">
					使用说明
				</view>
				<view class="use-info-item">
					{{cardInfo.manual||'无'}}
				</view>
<!-- 				<view class="use-info-item">
					2.使用详细可到店咨询工作人员；
				</view>
				<view class="use-info-item">
					3.卡券都有时间，从用户兑换之日起算，建议到店后在兑换成使用二维码；
				</view>
				<view class="use-info-item">
					4.提供网址链接，浏览器中打开网址链接，即可显示兑换券条形码，到店直接出示条形码，可代替先进使用，一次性使用不找零。
				</view> -->
			</view>
		</block>
		<!-- 不需要核销 -->
		<view class="use-info bpd-card" v-else>
			<view class="bpd-title use-info-title">
				使用说明
			</view>
			<view class="use-info-item">
				{{cardInfo.manual||''}}
			</view>
<!-- 			<view class="use-info-tips">
				如有质量问题，请在购买后24小时内联系客服，过期做废，非质量问题无法退换，介意勿拍。
			</view> -->
		</view>
		<!-- 兑换方法 -->
		<view class="bpd-card exchange-info" v-if="cardInfo.content">
			<view class="bpd-title ei-label">
				兑换方法
			</view>
			<view class="content" @click="showContent">
				<van-image
				  use-loading-slot
				  width="100%"
				  lazy-load
				  fit="widthFix"
				  :src="cardInfo.content">
				  <van-loading slot="loading" type="spinner" size="20" vertical />
				</van-image>
			</view>
		</view>
    <privacyOpen ref="privacyOpen"></privacyOpen>
	</view>
</template>

<script>
	import {cardDetail} from '@/api/modules/batchPick.js';
	import {getImgUrl} from '@/utils/auth.js';
	export default{
		data(){
			return {
				imgUrl: getImgUrl(),
				isNeedHx:true,
				cardInfo:{
					card_close: "",
					card_no: "",
					expire_time: "",
					face_value: "",
					id: null,
					product_id: null,
					product_image: null,
					product_title: "",
					status: 0
				},
				qrOptions:{
					code: '',// 生成二维码的值
					size: 248,// 460代表生成的二维码的宽高均为460rpx
				},
				brOptions:{
					width: 584, // 宽度 单位rpx
					height: 130, // 高度 单位rpx
					code: '',// 生成条形码的值
				}
			}
		},
		onLoad(o) {
			cardDetail({id:o.id}).then(res=>{
				if(res.code == 1){
					this.cardInfo = res.data||{}
					this.isNeedHx = this.cardInfo.product_type === '到店二维码'
					this.qrOptions.code = res.data.card_close
					this.brOptions.code = res.data.card_close
					return
				}
				uni.showModal({
					title:'温馨提示',
					content:res.msg
				})
			})
		},
		methods:{
			clip(data){
				wx.setClipboardData({
				  data: data,
				  success (res) {
			           wx.showToast({
			           	title:'复制成功',
						icon:'none'
			           })
				  }
				})
			},
			showContent(){
				let {content} = this.cardInfo
				wx.previewImage({
				  current: content, // 当前显示图片的 http 链接
				  urls: [content] // 需要预览的图片 http 链接列表
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F5F5F5;
	}
	.batch-pick-details{
		padding-bottom: 80rpx;
	}
	.bpd-card{
		background: #ffffff;
		border-radius: 12px;
		padding: 24rpx;
		margin: 24rpx;
	}
	.bpd-title{
		font-size: 28rpx;
		font-weight: 400;
		color: #333333;
		position: relative;
		padding-bottom: 24rpx;
		&::after{
			content: '';
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 2rpx;
			background-color: #F3F3F3;
		}
	}
	.shop-info{
		padding: 32rpx 24rpx;
		height: 156rpx;
		box-sizing: border-box;
		position: relative;
	}
	.shop-info-bg{
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
	}
	.shop-info-top,.shop-info-bottom{
		display: flex;
		justify-content: space-between;
		position: relative;
		z-index: 1;
	}
	.shop-info-top{
		font-size: 30rpx;
		font-weight: 700;
		color: #333333;
		margin-bottom: 16rpx;
	}
	.product-title{
		position: relative;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		width: 90%;
	}
	.shop-info-bottom{
		font-size: 24rpx;
		font-weight: 400;
		color: #999999;
	}
	.card-info-item{
		padding-top: 32rpx;
		display: flex;
	}
	.cii-label{
		width: 172rpx;
		flex-shrink: 0;
		font-size: 26rpx;
		font-weight: 400;
		color: #999999;
	}
	.cii-value,.cii-value-time{
		flex:1;
		font-size: 26rpx;
		color: #333333;
	}
	.cii-value{
		font-weight: 700;
	}
	.cii-copy{
		font-size: 22rpx;
		font-weight: 400;
		color: #333333;
	}
	.use-info-title{
		margin-bottom: 32rpx;
	}
	.use-info-item{
		font-size: 26rpx;
		font-weight: 400;
		color: #666666;
		margin-bottom: 16rpx;
	}
	
	// .exchange-info{

	// }
	.ei-label{
		font-size: 28rpx;
		font-weight: 400;
		color: #333333;
	}
	.ei-tool{
		font-size: 28rpx;
		font-weight: 400;
		color: #999999;
		display: flex;
		align-items: center;
	}
	.hx-qrcode{
		width: 702rpx;
		height: 714rpx;
		box-sizing: border-box;
		position: relative;
		background-color: transparent;
	}
	.qrcode-box{
		width: 314rpx;
		height: 314rpx;
		margin: 41rpx auto;
		font-size: 0;
		position: relative;
	} 
	.scan-border{
		width: 314rpx;
		height: 314rpx;
	}
    .qrcode{
		width: 248rpx;
		height: 248rpx;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.scan-bg{
		position: absolute;
		left: 0;
		top: 0;
		width: 702rpx;
		height: 714rpx;
		z-index: -1;
	}
	.bar-code-box{
		width: 584rpx;
		height: 130rpx;
		font-size: 0;
		margin: 89rpx auto 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.bar-code{
		width: 584rpx;
		height: 130rpx;
	}
	.use-info-tips{
		font-size: 24rpx;
		font-weight: 400;
		color: #999999;
		background-color: #F6F6F6;
		padding: 16rpx;
		border-radius: 8px;
	}
	.content{
		margin-top: 24rpx;
		font-size: 0;
	}
</style>
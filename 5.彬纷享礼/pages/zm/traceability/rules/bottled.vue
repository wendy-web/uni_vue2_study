<template>
	<view class="rules-bottled">
		<!-- 导航 -->
		<xh-navbar navber-color="transparent" left-image="/static/images/left_arrow.png" :fixed="false">
			<image slot="title" class="top-icon" src="https://file.y1b.cn/public/hn29th/rules/icon_01.png"
				mode="aspectFill"></image>
		</xh-navbar>
		<!-- 规则 -->
		<view class="rules-box">
			<!-- 背景 top -->
			<image class="bg-top" src="https://file.y1b.cn/public/hn29th/rules/icon_03.png" mode="aspectFill"></image>
			<image class="bg-bottom" src="https://file.y1b.cn/public/hn29th/rules/icon_02.png" mode="aspectFill">
			</image>
			<!-- icon -->
			<image class="rules-box-icon" src="https://file.y1b.cn/public/hn29th/traceability/icon_02.png"
				mode="aspectFill"></image>
			<!-- head-title -->
			<image class="head-title" src="https://file.y1b.cn/public/hn29th/rules/icon_05.png" mode="aspectFill">
			</image>
			<view class="info-box">
				<!-- 具体内容 -->
				<view class="text-h1">
					活动主题：马上换购1元乐享
				</view>
				<view class="text-h1">
					活动时间：即日起至2025年6月30日止
				</view>
				<view class="text-h1">
					活动范围：<text class="text-inline">除广东省、云南省以外的中国大陆地区</text>
				</view>
				<view class="text-h1">
					产品范围：310mL战马能量型维生素饮料
				</view>
				<view class="text-p" style="margin-top: 35rpx;">
					为感谢广大消费者的支持和厚爱，即日起至2025年6月30日止，凡在活动开展地区购买战马能量型维生素饮料罐装促销装产品，发现拉环上印有“1元乐享”字样即可凭该完整拉环加1元人民币购买同规格战马能量型维生素饮料1罐。
				</view>
				<view class="text-p">
					“1 元乐享”数量：1920万个
				</view>
				<view class="text-h1" style="margin-top: 25rpx;font-size: 32rpx;">
					活动说明
				</view>
				<view class="text-h1">
					1.“1元乐享”换购方式：<text class="text-inline">凭完整“1元乐享”拉环至指定换购网点加1元人民币购买同规格战马能量型维生素饮料1罐。</text>
				</view>
				<view class="text-h2">
					2.活动截止时间为2025年6月30日,逾期视为自动放弃。
				</view>
				<view class="text-h2">
					3.活动综合中奖率40%。
				</view>
				<view class="text-h2">
					4.换购商品市场总价值约11520万元人民币。
				</view>
				<view class="text-h2">
					5.活动区域：除广东省、云南省以外的中国大陆地区。
				</view>
				<view class="text-h1" style="margin-top: 25rpx;font-size: 32rpx;">
					注意事项
				</view>
				<view class="text-h2">
					请在参加本活动前仔细阅读本规则中的各项条款，如果您参加了本活动，则战马公司认为您已理解并同意该规则中的各条款。
				</view>
				<view class="text-h2">
					1. 拉环换购时需保持清洁、完整,拉环仅有舌片不予换购。
				</view>
				<view class="text-h2">
					2. 换购饮料不可兑换为现金。
				</view>
				<view class="text-h2">
					3.战马公司对本次活动促销产品及其附属物（如产品包装、二维码等）的真实性和有效性有鉴定及确认权。
				</view>
				<view class="text-h2">
					4.所到商户若无法换购饮料，可拨打活动热线（400-818-5599）咨询，战马公司可安排消费者进行换购、以确保消费者换购权益。
				</view>
				<view class="text-h2">
					5.拉环图样、促销产品以实物为准，活动站点及相关宣传资料上提供的图片仅供参考。
				</view>
				<view class="text-h2">
					6.本促销产品总数4800万罐，如遇不可抗力事件，包括但不限于地震、台风、水灾或其他自然灾害、火灾、爆炸事故、骚乱、战争、疫病、政府政策的改变、任何国家主管机关就此次活动做出任何判决、决定、命令，或未能合理控制的任何其他不可预见事件，战马公司有权在不事先通知的前提下变更或取消本活动。
				</view>
				<view class="text-h2">
					7.如果参加者在活动中使用任何不正当的手段参加活动，战马公司有权在不事先通知的情况下取消其参加活动的资格，同时保留依法追究其法律责任的权利。
				</view>
				<view class="text-h2">
					8.战马公司保留对争议和异议的处理权利。战马公司对于消费者因参加本活动所发生的任何直接、间接费用和产生的任何损害不负任何责任。
				</view>
				<view class="text-h2">
					9.本规则的解释与适用，以及与规则有关的任何争议，均以中华人民共和国法律为依据。
				</view>
				<view class="text-h2" style="text-indent:1em">
					活动咨询热线：400-818-5599
				</view>
				<view class="text-h2" style="text-indent:1em">
					(工作日：8:30-11:30、13:00-17:30)
				</view>
				<view class="text-h2" style="text-indent:1em">
					战马官方网站：www.warhorsechina.com.cn
				</view>
			</view>
		</view>
	</view>
</template>

<script>
</script>

<style>
	page {
		background-color: #FFDE00;
	}

	.rules-bottled {
		font-size: 0;
		padding-bottom: 28rpx;
	}

	.top-icon {
		width: 100%;
		height: 104rpx;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		bottom: 0rpx;
	}

	.rules-box {
		position: relative;
		z-index: 10000;
		width: 100%;
		box-sizing: border-box;
		padding-top: 188rpx;
		padding-bottom: 60rpx;
		padding-left: 29rpx;
		padding-right: 33rpx;
		z-index: 1;
	}

	.bg-top {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 394rpx;
		z-index: 0;
	}

	.bg-bottom {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 394rpx;
		z-index: 0;
	}

	.info-box {
		background-color: #FCF6CC;
		padding-left: 30rpx;
		padding-right: 30rpx;
		position: relative;
		z-index: 1;
	}

	.rules-box-icon {
		width: 274rpx;
		height: 262rpx;
		position: absolute;
		top: -34rpx;
		right: 34rpx;
		z-index: 2;
	}

	.head-title {
		width: 204rpx;
		height: 46rpx;
		position: absolute;
		left: 74rpx;
		top: 79rpx;
	}

	.head-dot {
		width: 280rpx;
		height: 16rpx;
		position: absolute;
		left: 10rpx;
		top: 145rpx;
	}

	.text-h1 {
		color: #000018;
		font-size: 28rpx;
		font-weight: 700;
		line-height: 1.8em;
	}

	.text-h2 {
		color: #000018;
		font-size: 28rpx;
		line-height: 1.8em;
	}

	.text-inline {
		font-weight: 400;
	}

	.text-p {
		font-size: 28rpx;
		font-weight: 400;
		color: #4e4d52;
		text-indent: 1em;
		line-height: 1.8em;
		text-align: justify;
	}
</style>
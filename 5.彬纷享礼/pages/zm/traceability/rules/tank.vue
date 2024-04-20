<template>
	<view class="rules-tank">
		<!-- 背景 -->
		<image class="rules-tank-bg" src="https://file.y1b.cn/public/hn29th/rules/icon_07.png" mode="aspectFill"></image>
		<xh-navbar navber-color="transparent" left-image="/static/images/left_arrow.png" :fixed="false" />
		<!-- 规则 -->
		<view class="rules-box">
			<!-- 背景 -->
			<image class="rules-box-bg" src="https://file.y1b.cn/public/hn29th/rules/icon_08.png" mode="aspectFill"></image>
			<!-- title -->
			<image class="rules-box-title" src="https://file.y1b.cn/public/hn29th/rules/icon_09.png" mode="aspectFill"></image>
			<!-- 具体内容 -->
			<view class="text-h1">
				活动主题：<text class="text-inline">马上换购1元乐享</text>
			</view>
			<view class="text-h1">
				活动时间：<text class="text-inline">即日起至2025年6月30日止</text>
			</view>
			<view class="text-h1">
				活动范围：<text class="text-inline">中国大陆地区</text>
			</view>
			<view class="text-h1">
				产品范围：<text class="text-inline">400mL战马能量型维生素饮料</text>
			</view>
			<view class="text-p" style="margin-top: 35rpx;">
				为感谢广大消费者的支持和厚爱，即日起至 2025年6月 30日止，凡在活动开展地区购买战马能量型维生素饮料瓶装促销装产品,发现瓶盖上印有“1
				元乐享”字样即可凭该完整瓶盖加1元人民币购买同规格战马能量型维生素饮料1瓶。
			</view>
			<view class="text-p">
				“1 元乐享”数量：132万个
			</view>
			<view class="text-h1" style="margin-top: 25rpx;font-size: 32rpx;font-weight: 700;">
				活动说明
			</view>
			<view class="text-h1">
				1.“1元乐享”换购方式：<text class="text-inline">凭完整"1元乐享”瓶盖至指定换购网点加1元人民币购买同规格战马能量型维生素饮料1瓶。</text>
			</view>
			<view class="text-h2">
				2.换购截止时间为2025年6月30日,逾期视为自动放弃。
			</view>
			<view class="text-h2">
				3.活动中奖率40%。
			</view>
			<view class="text-h2">
				4.换购商品市场总价值约660万元人民币。
			</view>
			<view class="text-h2">
				5.活动区域：中国大陆地区。
			</view>
			<view class="text-h1" style="margin-top: 25rpx;font-size: 32rpx;font-weight: 700;">
				注意事项
			</view>
			<view class="text-h2" style="padding-right: 320rpx;position: relative;">
				请在参加本活动前仔细阅读本规则中的各项条款,如果您参加了本活动,则战马公司认为您已理解并同意该规则中的各条款。
				<image class="zm-icon" src="https://file.y1b.cn/public/hn29th/rules/icon_10.png" mode="aspectFill"></image>
			</view>
			<view class="text-h2">
				1.“1元乐享”瓶盖换购时需保持清洁、完整。
			</view>
			<view class="text-h2">
				2.换购饮料不可兑换为现金。
			</view>
			<view class="text-h2">3.战马公司对本次活动促销产品及其附属物（如产品包装、二维码等）的真实性和有效性有鉴定及确认权。</view>
			<view class="text-h2">4.所到商户若无法换购饮料，可拨打活动热线（400-818-5599）咨询，战马公司可安排消费者进行换购、以确保消费者换购权益。</view>
			<view class="text-h2">5.瓶盖图样、促销产品以实物为准，活动站点及相关宣传资料上提供的图片仅供参考。</view>
			<view class="text-h2">
				6.本促销产品总数330万瓶，如遇不可抗力事件，包括但不限于地震、台风、水灾或其他自然灾害、火灾、爆炸事故、骚乱、战争、疫病、政府政策的改变、任何国家主管机关就此次活动做出任何判决、决定、命令，或未能合理控制的任何其他不可预见事件，战马公司有权在不事先通知的前提下变更或取消本活动。
			</view>
			<view class="text-h2">7.如果参加者在活动中使用任何不正当的手段参加活动，战马公司有权在不事先通知的情况下取消其参加活动的资格，同时保留依法追究其法律责任的权利。</view>
			<view class="text-h2">8.战马公司保留对争议和异议的处理权利。战马公司对于消费者因参加本活动所发生的任何直接、间接费用和产生的任何损害不负任何责任。</view>
			<view class="text-h2">9.本规则的解释与适用，以及与规则有关的任何争议，均以中华人民共和国法律为依据。</view>
			<view class="text-h2" style="text-indent:1em">活动咨询热线：400-818-5599</view>
			<view class="text-h2" style="text-indent:1em">(工作日：8:30-11:30、13:00-17:30)</view>
		</view>
	</view>
</template>

<script>
</script>

<style>
	.rules-tank {
		padding-bottom: 28rpx;
	}

	.rules-tank-bg {
		position: fixed;
		z-index: -1;
		top: 0;
		left: 0;
		bottom: 0;
		height: 100%;
		width: 100%;
	}

	.rules-box {
		position: relative;
		width: 710rpx;
		height: 2900rpx;
		margin: 0 auto;
		z-index: 1;
		box-sizing: border-box;
		padding: 45rpx 40rpx 0;
	}

	.rules-box-bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
	}

	.rules-box-title {
		width: 532rpx;
		height: 114rpx;
		display: block;
		margin: 0 auto;
	}

	.text-h1 {
		color: #CBCCD6;
		font-size: 28rpx;
		line-height: 1.8em;
	}

	.text-h2 {
		color: #FFFFFF;
		font-size: 28rpx;
		line-height: 1.8em;
		position: relative;
		z-index: 1;
	}

	.text-inline {
		color: #FFFFFF;
	}

	.text-p {
		font-size: 28rpx;
		font-weight: 400;
		color: #FFFFFF;
		text-indent: 1em;
		line-height: 1.5em;
		text-align: justify;
		position: relative;
		z-index: 1;
	}

	.zm-icon {
		position: absolute;
		width: 330rpx;
		height: 296rpx;
		top: -60rpx;
		right: -20rpx;
	}
</style>
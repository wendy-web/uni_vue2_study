<template>
	<view class="log-list">
		<uv-steps direction="column" :current="0">
			<!-- copy了一份uv-steps-item组件,新增了props属性:right-title,right-desc,success,以及它们的样式 -->

			<!-- <uv-steps-item-copy title="天天采购" right-title="天天仓库" desc="提交" right-desc="2022-06-23 12:45:26"></uv-steps-item-copy> -->
			<!-- <uv-steps-item-copy title="采购经理" desc="10:35"></uv-steps-item-copy> -->
			<!-- <uv-steps-item-copy title="制定审批人:财务审计" desc="待审批"></uv-steps-item-copy> -->
			<template v-for="(item, index) in info">
				<uv-steps-item-copy
					:title="item.ct_name"
					:desc="descFn(item.act,item.act_msg)"
					:right-desc="item.create_time"
					:key="item.id"
					reverse
				></uv-steps-item-copy>
			</template>
		</uv-steps>
	</view>
</template>

<script>
/**
 * 本组件是 详情页-单据日志组件
 * @property {Array} info
 */
export default {
	name: "wdocument-log",
	props: {
		info: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {};
	},
	methods: {
		descFn(act,act_msg){
			if(act_msg){
				return act + "：" + act_msg
			}else{
				return act
			}
		}
	},
};
</script>

<style lang="scss">
.log-list {
	background-color: #fff;
	margin-top: 20rpx;
	padding: 30rpx 40rpx;
}
</style>

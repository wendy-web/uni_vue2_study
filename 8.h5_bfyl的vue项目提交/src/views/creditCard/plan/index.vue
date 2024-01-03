<template>
	<div class="page-box">
		<!-- <div class="nav-box"> -->
		<van-nav-bar
			:title="title"
			left-text=""
			right-text=""
			:fixed="true"
            :safe-area-inset-top="true"
            :placeholder="true"
			:left-arrow="true"
			@click-left="onClickLeft"
		/>
		<!-- </div> -->
		<div class="content-box safe-area">
			<saveMoneyPlan v-if="type == 1"></saveMoneyPlan>
			<discountPlan v-if="type==2"></discountPlan>
		</div>
	</div>
</template>

<script>
	import discountPlan from './component/discountPlan/discountPlan.vue';
	import saveMoneyPlan from './component/saveMoneyPlan/saveMoneyPlan.vue';
	export default {
		name: 'ZXPlan',
		components: {
			discountPlan,
			saveMoneyPlan
		},
		data() {
			return {
				type: '',
				title:''
			}
		},
		created() {
			this.initOptions()
		},
		methods: {

			initOptions() {
				let query = this.$route.query;
				console.log('query:', query);
				let {
					type = ''
				} = query;
				this.type = type;
				this.title = type == 1 ? '省钱卡赚钱计划' : '话费折扣赚钱计划';
			},
			onClickLeft() {
				this.$router.go(-1);
			},
		}
	}
</script>

<style lang="scss" scoped>
/deep/ .van-nav-bar {
    z-index: 999;

    .van-icon {
        color: #333333;
    }

    .van-icon-arrow-left {
        font-size: 24px;
    }

    .van-nav-bar__text {
        color: #333333;
    }
}
.page-box{
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	// height: 100vh;
	// overflow: hidden;
	// .nav-box{
	// 	flex-shrink: 0;
	// 	width: 100%;
	// 	min-height: 40px;
	// 	position: sticky;
	// 	top: 0;
	// }
	// .content-box{
	// 	flex: 1;
	// 	flex-shrink: 0;
	// 	overflow: scroll;
	// }
}
</style>
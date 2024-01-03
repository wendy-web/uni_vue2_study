<template>
    <div class="page-box">
        <van-nav-bar
            title=""
            left-text=""
            right-text=""
            :left-arrow="true"
            :fixed="true"
            :safe-area-inset-top="true"
            :placeholder="true"
            @click-left="onClickLeft"
        />
        <div class="title">彬纷有礼2023年度账单用户授权协议</div>
        <p class="mt-10">
            在您正式开始查看“2023年度账单”之前，应仔细阅读并理解本协议中的全部内容，如您不同意本协议中的任何条款，请立即停止参加本次活动。当您点击“立即开启”活动时，即被视为您已经仔细阅读、充分理解并接受本协议所有条款。
        </p>
        <p>
            1、
            为了生成您2023年度账单，我们将依据您的授权查询您在彬纷有礼的账单，及您在彬纷有礼平台2023年1月1日至2023年12月31日的相关用户信息，其中关于您的用户注册时间、订单信息、核销信息、奖励信息会以您访问当天的最新数据进行调取并展示，所涉及平台主要包括彬纷有礼APP、彬纷有礼小程序。
        </p>
        <p>
            2、
            所需使用的用户信息主要包括：账号信息、注册信息、身份信息、订单信息（如您在彬纷想你所产生的已完成的订单明细，包括您购买、兑换的商品、获得的奖励、支付时间、完成时间、收货地址等）。我们将根据前述信息进行汇总统计分析，以用于本次活动页面向您进行信息展示。
        </p>
        <p>
            3、
            您的2023年度账单为算法自动生成结果，可能会与实际有偏差，无法保证相关数据的绝对准确性和有效性。
        </p>
        <p>
            4、
            您可通过保存账单到相册，向其他人分享本活动生成的年度账单数据；当您选择向其他人发送您的报告页面截图时，其他人会看到相关数据（其中包括但不限于个人信息），请您谨慎选择。
        </p>
        <p>
            5、
            我们非常重视对您个人信息的保护，除用于本次活动页面向您进行信息展示外，不会对本次查询的信息作其他任何处理。
        </p>
        <p>
            6、
            如您对本活动有任何疑问，可联系彬纷想你客服咨询400-870-7076，工作时间：周一至周五8:30-17:30，周六至周日
            10:00-19:00（法定节假日除外）。
        </p>
        <p>7、 我司（深圳市天兴诚科技有限公司）享有本协议最终解释权。</p>
    </div>
</template>
  <script>
export default {
    name: "Service",
    props: {
        defaultActive: {
            type: Number,
            default: 0,
        },
        data: {
            type: Array,
            default: () => {
                return [];
            },
        },
    },
    data() {
        return {
            active: this.defaultActive,
        };
    },
    methods: {
        onClickLeft() {
            // this.$router.push({ name: "Bill2023", params: { hideLoading: true } });
            this.$router.go(-1);
        },
    },
};
</script>
  
<style scoped lang="scss">
/deep/ .van-nav-bar {
    background-color: transparent;
    z-index: 999;
    .van-icon-arrow-left {
        font-size: 24px;
    }
    .van-icon {
        color: #333;
    }
    .van-nav-bar__text {
        color: #333;
    }
}
/deep/.van-hairline--bottom::after {
    border-bottom: unset;
}
.page-box {
    box-sizing: border-box;
    height: 100%;
    padding: 0px 10px 20px 10px;
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 18px;
    line-height: 30px;
    .title {
        font-weight: bolder;
        font-size: 20px;
        text-align: center;
    }
    .mt-10 {
        margin-top: 10px;
    }
    p{
        margin-top: 20px;
        text-indent:20px;
        text-align: justify;
    }
}
</style>
  
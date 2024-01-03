<template>
    <view class="volunteer-card">
        <!-- <view class="my-volunteer-head">
            <view class="volunteer-tabs">
                <view class="tabs-item">
                    <view class="tabs-num">
                        {{ total.com_cert_num }}
                    </view>
                    <view class="tabs-title"> 捐献次数 </view>
                </view>
                <view class="tabs-item">
                    <view class="tabs-num">
                        {{ total.com_num }}
                    </view>
                    <view class="tabs-title"> 已助力公益 </view>
                </view>
            </view>
        </view> -->
        <view :class="['volunteer-card-box', listData.length ? '': 'active']">
            <mescroll-uni
                ref="mescrollRef"
                :fixed="false"
                @init="mescrollInit"
                :down="downOption"
                @down="downCallback"
                :up="upOption"
                @up="upCallback"
                safearea
                class="model_s"
            >
                <list-item
                    v-for="item in listData"
                    :key="item.id"
                    :config="item"
                    @lookCard="lookCard"
                />
            </mescroll-uni>
        </view>
        <!-- 单个证书 -->
        <honor-card ref="honorCard" />
    </view>
</template>

<script>
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import {
    getUserCertList,
    getTeamCertList,
    getCert,
} from "@/api/modules/love.js";
import listItem from "./listItem.vue";
import honorCard from "@/components/honorCard/honorCard.vue";
//分页
let NEXT = 0;
export default {
    mixins: [MescrollMixin],
    components: {
        listItem,
        honorCard,
    },
    props: {},
    data() {
        return {
            downOption: {
                auto: true, // 不自动加载 (mixin已处理第一个tab触发downCallback)
                textColor: "#fff",
            },
            upOption: {
                auto: false, // 不自动加载
                noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
                toTop: {
                    src: "",
                },
                textNoMore: "~ 暂无更多信息 ~",
            },
            //列表数据
            listData: [],
            total: {
                com_cert_num: 0,
                com_num: 0,
            },
            shareImgData: null
        };
    },
    computed: {},
    methods: {
        getShareImg() {
           return this.$refs.honorCard.getImageUrl();
        },
        getShareImgData() {
            return this.shareImgData;
        },
        // 查看單個證書
        lookCard(data, type) {
            // isLoveFinish 是否温暖包完成
            console.log('data :>> ', data);
            getCert(data).then((res) => {
                const { cert_content, cert_date, user, team, share_title } = res.data;
                const image = team ? team.image : user.avatar_url;
                const name = team ? team.name : user.nick_name;
                this.shareImgData = {
                    share_title,
                    image,
                    name,
                    cert_content,
                    time: cert_date,
                }
                if(type == 0) {
                    return this.$refs.honorCard.showTime(this.shareImgData);
                }
                console.log('阅读包的内容', this.shareImgData);
                uni.navigateTo({
					url: `/pages/tabBar/shareCard/index?data=${JSON.stringify(this.shareImgData)}&source=readShare&com_id=${data.com_id}`
				});
            });
        },
        /*下拉刷新的回调 */
        downCallback() {
            NEXT = 0;
            // 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
            this.mescroll.resetUpScroll();
        },
        /*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
        upCallback(page) {
            const API = getUserCertList;
            let parmas = {
                limit: 10,
            };
            if (NEXT != 0) parmas.next = NEXT;
            //获取数据next:NEXT,
            API(parmas)
                .then((res) => {
                    const { total, list, next } = res.data;
                    let data = {
                        list: list || [],
                    };
                    //设置列表数据
                    if (NEXT == 0) {
                        this.listData = []; //如果是第一页需手动制空列表
                        this.total = total;
                    }
                    NEXT = next;
                    //填充数据
                    if (total.com_cert_num == 0) {
                        //联网成功的回调,隐藏下拉刷新和上拉加载的状态
                        this.mescroll.endSuccess(0);
                        return;
                    }
                    this.listData = this.listData.concat(data.list);
                    this.mescroll.endSuccess(data.list.length);
                })
                .catch((err) => {
                    //联网失败, 结束加载
                    this.mescroll.endErr();
                });
        },
    },
    mounted() {}
};
</script>

<style scoped lang="scss">
.xh-navber .left-tools {
    filter: brightness(0);
}

.my-volunteer-head {
    height: 426rpx;
    position: relative;
}

.volunteer-icon {
    width: 278rpx;
    height: 284rpx;
    position: absolute;
    left: 0;
    top: 0;
}

.volunteer-tabs {
    display: flex;
    position: relative;
    z-index: 1;
    padding-top: 20rpx;
}

.tabs-item {
    flex: 1;
    text-align: center;
}

.tabs-title {
    font-size: 32rpx;
    font-weight: 400;
    color: #2b2b2b;
    margin-top: 20rpx;
}

.tabs-num {
    font-size: 72rpx;
    font-weight: 700;
    color: #ff7507;
    margin-top: 22rpx;
}

.volunteer-card-box {
    position: absolute;
    height: auto;
    top: 280rpx;
    bottom: 0;
    left: 0;
    right: 0;
    &.active {
        top: 35%;
    }
}
</style>
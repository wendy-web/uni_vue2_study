<template>
<view class="xh-navber-box">
	<!-- 具体导航 -->
	<view class="xh-navber"
		:class="{'fixed':fixed, 'fixedNum': fixedNum, 'overFlow': overFlow }"
		:style="{
            height: statusBarHeight + navBarHeight + paddingBottomHeight + 'px',
            background: navbarColor
        }">
		<!-- 状态栏 -->
		<view class="status-bar"
			:style="{height:statusBarHeight+'px'}"
		></view>
		<!-- 导航背景图片 -->
		<image v-if="navbarImage"
			class="navbar-image"
			:src="navbarImage"
			:mode="navbarImageMode"
		></image>
		<!-- 导航栏 -->
		<view class="xh-navber-nav"
			:class="titleAlign"
			:style="{
				height: navBarHeight+'px',
				color: titleColor,
				paddingLeft:!leftImage&&titleAlign !== 'titleCenter' ? '10px' : 0
			}"
		>
			<!-- 右边留白 -->
			<view v-if="leftImage&&titleAlign !== 'titleCenter'"
				class="left-white"
				:style="{width:navBarHeight/2+'px'}"
			></view>
			<!-- 默认中间部分 -->
			<view v-if="title&&!isHome" class="title-text" @click="txtClick">{{title}}</view>
			<!-- 自定义中间部分 -->
			<slot name="title" />
            <!-- 标题底部的cont -->
            <slot name="title_cont" />
			<!-- 胶囊安全宽度 -->
			<view class="capsule"
				v-if="titleAlign === 'titleRight'"
				:style="{width:menuWidth+'px'}"
			></view>
			<!-- 左边tools -->
			<image v-if="leftImage"
				@click="leftClick"
				class="left-tools"
				:src="leftImage"
                mode="heightFix"
				:style="{height:navBarHeight/2+'px',width:navBarHeight/2+'px'}" />
			<view v-if="isHome"
				class="left-tools left-tools-home"
				@click="leftClick">
				<van-icon name="wap-home-o" color="#ffffff" size="25" />
				<text v-if="title" class="title-text">{{title}}</text>
			</view>
		</view>
	</view>
	<!-- 空间占据者 -->
	<view :style="{height:statusBarHeight+navBarHeight+'px'}" v-if="fixed && !isFloat"></view>
</view>
</template>

<script>
import {
getNavbarData
} from './xhNavbar.js';

export default {
    props: {
        title: {
            type: String,
            default: ''
        },
        titleColor: {
            type: String,
            default: '#333'
        },
        fixed: {
            type: Boolean,
            default: true
        },
        fixedNum: {
            type: Boolean,
            default: false
        },
        isHome: {
            type: Boolean,
            default: false
        },
        statusBar: {
            type: Boolean,
            default: true
        },
        navbarColor: {
            type: String,
            default: 'transparent'
        },
        navbarImage: {
            type: String,
            default: ''
        },
        titleAlign: {
            type: String,
            default: 'titleCenter'
        },
        leftImage: {
            type: String
        },
        navbarImageMode: {
            type: String,
            default: 'contain'
        },
        overFlow: {
            type: Boolean,
            default: false
        },
        isFloat: {
            type: Boolean,
            default: false
        },
        // 用于头部超出的展示
        paddingBottomHeight: {
            type: Number,
            default: 0,
        },
    },
    created () {
        getNavbarData().then(data => {
            this.navBarHeight = data.navBarHeight;
            this.statusBarHeight = data.statusBarHeight;
            this.menuWidth = data.menuWidth;
        });
    },
    data () {
        return {
            statusBarHeight: 47,
            navBarHeight: 40,
            menuWidth: 104
        };
    },
    methods: {
        leftClick () {
            //自定义回调 Custom callback
            this.$emit('leftCallBack');
        },
        txtClick() {
            if(this.titleAlign == 'titleLeft') this.leftClick();
        }
    }
};
</script>

<style lang="scss">
.xh-navber {
    width: 100%;
    position: relative;
    &.overFlow {
        overflow: hidden;
    }
}

.xh-navber.fixed {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 99;
    &.fixedNum {
        z-index: 1;
    }
}

.xh-navber .titleCenter {
    justify-content: center;
}

.xh-navber .titleLeft {
    justify-content: flex-start;
    padding-left: 50rpx;
}

.xh-navber .titleRight {
    justify-content: flex-end;
}

.xh-navber .navbar-image {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
}

.xh-navber .xh-navber-nav {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
}

.xh-navber .left-tools {
    position: absolute;
    left: 0;
    top: 50%;
    padding-left: 20rpx;
    padding-right: 10rpx;
    transform: translateY(-50%);
}

.xh-navber .left-tools-home {
    border-radius: 50%;
    display: flex;
}
.title-text {
    font-weight: 600;
    font-size: 36rpx;
}

.xh-navber .left-white {
    padding: 0 5px;
}
</style>

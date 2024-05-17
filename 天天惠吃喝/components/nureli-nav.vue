<template>
<view class="nav">
	<view class="ul">
		<view class="li"
				:class="active == 1 ? 'active':''"
				@click="activeBtn(1)">
			<image src="@/static/images/nav/home.svg"></image>
			<text>باشبەت</text>
		</view>
		<view class="li"
				:class="active == 2 ? 'active':''"
				@click="activeBtn(2)">
			<image src="@/static/images/nav/category.svg"></image>
			<text>تۈرلەر</text>
		</view>
		<view class="li"
				:class="active == 3 ? 'active':''"
				@click="activeBtn(3)">
			<image src="@/static/images/nav/find.svg"></image>
			<text>بايقاش</text>
		</view>
		<view class="li"
				:class="active == 4 ? 'active':''"
				@click="activeBtn(4)">
			<image src="@/static/images/nav/collection.svg"></image>
			<text>توپلام</text>
		</view>
		<view class="li"
				:class="active == 5 ? 'active':''"
				@click="activeBtn(5)">
			<image src="@/static/images/nav/member.svg"></image>
			<text>مىنىڭ</text>
		</view>
		<view class="indicator">
		</view>
	</view>
</view>
</template>

<script>
export default {
    data () {
        return {
            active: 1,
        };
    },
    onLoad () {

    },
    methods: {
        activeBtn (e) {
            var _this = this;
            _this.active = e;
        },
    }
}
</script>

<style>
* {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}
page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: #222327;
}
.nav {
    position: relative;
    width: 400px;
    height: 70px;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
}
.ul {
    display: flex;
    width: 350px;
}
.li {
    height: 70px;
    flex: 1;
    position: relative;
    list-style: none;
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
.li::before {
    content: "";
    position: absolute;
    top: 10px;
    left: 0;
    width: 100%;
    height: 100%;
    background: orange;
    border-radius: 50%;
    filter: blur(5px);
    opacity: 0;
    transition: 0.5s;
    transition-delay: 0s;
}
.li image {
    width: 30px;
    height: 30px;
}
.li text {
    display: flex;
    align-items: center;
    height: 25px;
    font-size: 16px;
    font-weight: 300;
}
.active {
    border-radius: 50%;
    background: orange;
    transform: translateY(-27px);
    transition-delay: 0.25s;
}
.active::before {
    opacity: 0.5;
    transition-delay: 0.25s;
}
.indicator {
    position: absolute;
    top: -35px;
    margin-left: -5px;
    width: 80px;
    height: 80px;
    background: #fff;
    border-radius: 50%;
    z-index: 1;
    transition: 0.5s;
}
.indicator::before {
    content: "";
    position: absolute;
    top: 5px;
    left: -26px;
    width: 30px;
    height: 30px;
    background: transparent;
    border-radius: 50%;
    box-shadow: 15px 18px #fff;
}
.indicator::after {
    content: "";
    position: absolute;
    top: 5px;
    right: -26px;
    width: 30px;
    height: 30px;
    background: transparent;
    border-radius: 50%;
    box-shadow: -15px 18px #fff;
}
.li:nth-child(1).active ~ .indicator {
    transform: translateX(calc(70px * 0));
}
.li:nth-child(2).active ~ .indicator {
    transform: translateX(calc(70px * 1));
}
.li:nth-child(3).active ~ .indicator {
    transform: translateX(calc(70px * 2));
}
.li:nth-child(4).active ~ .indicator {
    transform: translateX(calc(70px * 3));
}
.li:nth-child(5).active ~ .indicator {
    transform: translateX(calc(70px * 4));
}
</style>

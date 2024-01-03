<template>
  <view class="user-map">
    <view class="user-map-box">
      <!-- 地图 -->
      <map
        id="map"
        v-if="isShowMap"
        class="map"
        subkey="D4HBZ-KKLK3-NMX3K-3MDGT-R3VQS-AGFRU"
        :scale="scale"
        :latitude="isAutoLogin ? center[0] : initCenter[0]"
        :longitude="isAutoLogin ? center[1] : initCenter[1]"
        layer-style="2"
        :markers="markers"
        :polyline="polyline"
        @callouttap="markertap"
        @markertap="markertap"
        @regionchange="regionchange"
        :enable-rotate="false"
        :enable-scroll="mapEnableBool"
      ></map>
      <!-- 即將點亮 -->
      <!-- <view class="jjdl" v-show="next_city.city">
				<text>即将点亮：</text>
				<text class="city">{{next_city.city}}</text>
			</view> -->
      <!-- 重置按钮 -->
      <view class="replay" @click="resetMap" v-show="isShowReset">
        <van-icon name="replay" color="#1989fa" size="28" />
      </view>
    </view>
    <!-- 用户/能量值 -->
    <view class="user-show-box" :style="{ top: navbarData.height + 'px' }">
      <!-- 背景 -->
      <image
        class="usb-bg"
        src="/static/home/home_tray.png"
        mode="aspectFill"
      ></image>
      <!-- 用户头像 -->
      <view class="user-icon" @click="goUserTeam">
        <van-image
          width="84rpx"
          height="84rpx"
          :src="avatar"
          fit="cover"
          radius="50%"
          lazy-load
          use-loading-slot
        >
          <van-loading slot="loading" type="spinner" size="20" vertical />
        </van-image>
      </view>
      <!-- 捐能量 -->
      <view class="donate-energy" @click="goLove">捐能量</view>
      <!-- 能量值 -->
      <view class="energy-num">
        <image
          class="lightning"
          src="/static/home/lightning.png"
          mode="aspectFill"
        ></image>
        <text id="user-show-box">{{ love }}</text>
      </view>
    </view>
    <!-- 		<view class="love-box" :style="{top:navbarData.height + 'px'}">
			 头像 信息
			<view class="user-box" @click="goUserTeam">
				 头像
				<image class="user-icon" :src="avatar" mode="aspectFill"></image>
				 底座
				<view class="large-love">
					<image class="large-love-icon" src="/static/home/large_love.png" mode="aspectFill"></image>
					<text class="large-love-text">我的</text>
				</view>
			</view>
			能量值信息
			<view class="love-info">
				<image class="small-love" src="/static/home/small_love.png" mode="scaleToFill"></image>
				<view class="love-num">
					{{loveConfig.love||0}}
				</view>
			</view>
			 劵能量
			<view class="donate-love" @click="goLove">
				捐能量
			</view>
		</view> -->

    <!-- 积攒能量 -->
    <view
      class="collect-energy"
      :class="[!medal ? 'bottom-174' : '']"
      @tap="handleCollect"
      v-if="isAutoLogin"
    >
      <view class="collect-out-img">
        <image src="/static/images/wbk_ty_wu@2x.png" mode="" />
      </view>
      <view class="collect-hint" v-if="energy_num >= 3 && collect_hint_show">点我收能量</view>
      <image
        src="/static/images/qp_xx@2x.png"
        class="collect-out-star"
        mode=""
      />
      <!-- <view class="collect-hint">点我收能量</view> -->
      <image
        src="https://file.y1b.cn/public/img/bfzx/qp_nl@2x.png"
        mode=""
        class="energy-max"
        v-if="judgeEnergyNum"
      />
      <view class="collect-flow" v-else>
        <view class="collect-flow-in"></view>
        <view class="dot-box">
          <text class="dot start-flicker1"></text>
          <text class="dot start-flicker2"></text>
          <text class="dot start-flicker3"></text>
        </view>
      </view>
      <image src="https://file.y1b.cn/public/img/bfzx/20230712/xin_sd@2x.png" mode="" class="energy-falsh" />
      <text class="energy-num">{{ energy_num }}</text>
      <text class="number-increment" :animation="animationData"
        >+{{ add_num }}</text
      >
      <image
        src="https://file.y1b.cn/public/img/bfzx/shou_nl@2x.png"
        mode=""
        class="energy-hint"
        v-if="judgeEnergyNum"
      />
      <image
        src="https://file.y1b.cn/public/img/bfzx/chan_nl@2x.png"
        mode=""
        class="energy-hint"
        v-else
      />
    </view>
    <!-- 最近点亮 -->
    <view
      class="recently-lit"
      @click="goRankBoard"
      :style="{ top: navbarData.height + 'px' }"
      v-if="isAutoLogin"
    >
      <view
        class="recently-icon border"
        v-for="(item, index) in lit_user"
        :key="index"
      >
        <van-image
          width="60rpx"
          height="60rpx"
          :src="item.avatar_url"
          fit="cover"
          radius="50%"
          lazy-load
          use-loading-slot
        >
          <van-loading slot="loading" type="spinner" size="20" vertical />
        </van-image>
      </view>
      <image
        class="recently-icon"
        src="/static/home/recently_more.png"
        mode="aspectFill"
      ></image>
    </view>
    <!-- 正在点亮的勋章 -->
    <view class="medals-being-lit" v-if="medal && isAutoLogin" @click="showMedal">
      <view class="mbl-box">
        <image class="mbl-icon" :src="medal.image" mode="aspectFill"></image>
        <!-- 水波纹 -->
        <image
          class="water"
          src="/static/home/water_black.png"
          :style="{ bottom: (medal.prop * 100).toFixed(0) + '%' }"
        ></image>
      </view>
      <!-- 进度 -->
      <view class="mbl-progress-box">
        <view class="mbl-progress-text"
          >{{ (medal.prop * 100).toFixed(0) }}%</view
        >
        <view
          class="mbl-progress"
          :style="{ width: (medal.prop * 100).toFixed(0) + '%' }"
        ></view>
      </view>
      <view class="mbl-province">
        {{ medal.province }}
      </view>
    </view>
    <!-- 		<view class="love-value" @click="goLove">
			<view class="love-num">
				 能量
				<image class="love-icon heartBeat" src="/static/home/love.png"></image>
				<image class="angel-wings" src="/static/home/angel_wings.png"></image>
				<view class="love-v">{{loveConfig.love||0}}</view>
			</view>
			<view class="love-text">{{type===0?'捐能量':'团队能量'}}</view>
		</view> -->
    <!-- 我的 -->
    <!-- 		<view class="user-info" @click="goUserTeam">
			 头像
			<image class="user-icon" :src="avatar"></image>
			<view class="user-name">
				{{type===0?'我的':'团队'}}
			</view>
		</view> -->
  </view>
</template>

<script>
import {
  getUserGeo,
  getTeamGeo,
  getTotalLoveApi,
  collectLoveApi,
} from "@/api/modules/home.js";
import { mapGetters, mapMutations } from "vuex";
import mapOtions from "./mapOptions.js";
import { debounce } from "@/utils/index.js";
import calcCoorArr from "@/utils/calcCoorArr.js";
import { setCurrMedal } from "@/utils/auth.js";
import { getNavbarData } from "@/components/xhNavbar/xhNavbar.js";
import { getLocation } from "@/utils/auth.js";

//map实例
let _map = null;
// 自动增加能量的定时器id
let autoTimerId = null;
// 记录collect_hint_show是否切换过为true,1记录,0无记录
let collect_hint_num = 0;
export default {
  props: {
    mapEnable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      //缩放比例
      scale: 3,
      initCenter: [37.24659203091866, 103.46915943605336],
      center: [37.24659203091866, 103.46915943605336],
      markers: [],
      polyline: [],
      lit_user: [],
      loveConfig: {},
      next_city: {},
      medal: null,
      type: 0, //个人还是团队
      level: 1, //层级
      stateScale: 0,
      isShowMap: true,
      navbarData: {
        height: 88,
        paddingTop: 28,
      },
      mapEnableBool: true,
      energy_num: "0.000", //能量球的能量值
      add_num: 0, //点击收取能量时显示的增加能量
      add_show: false,
      collect_hint_show: false, //点我收能量的弹窗控制
      animationData: {},
      add_top: 0,
      count_left: 0,
    };
  },
  computed: {
    ...mapGetters(["userInfo", "isAuthorization", 'isAutoLogin']),
    avatar() {
      return this.userInfo.avatar_url || "/static/images/avatar_default.png";
    },
    isShowReset() {
      return this.level == 2 || this.stateScale > 3;
    },
    love() {
      let love = this.loveConfig.love;
      if (!love || !this.isAutoLogin) return 0;
      if (love > 9999)  return "999+";
      return love;
    },
    userMarkerIcon() {
      let avaUrl = '/static/home/user_marker.png'
      let { avatar_icon, image_icon } = this.loveConfig;
      if (this.isAutoLogin) {
        avaUrl = avatar_icon || image_icon || '/static/home/user_marker.png'
      }
      return avaUrl;
    },
    // 能量值是否大于3
    judgeEnergyNum() {
      return this.energy_num >= 3;
    },
  },
  mounted() {
    //地图实例
    _map = wx.createMapContext("map", this);
    //自定义导航栏需要
    getNavbarData().then((res) => {
      let { navBarHeight, statusBarHeight } = res;
      this.navbarData = {
        height: navBarHeight + statusBarHeight,
        paddingTop: statusBarHeight,
      };
    });
    this.mapEnableBool = this.mapEnable;
  },
  methods: {
    ...mapMutations({
      setSoonMedalId: "user/setSoonMedalId",
      setNextCity: "business/setNextCity",
    }),
    setMapEnableFal() {
      this.mapEnableBool = false;
    },
    setMapEnableTrue() {
      this.mapEnableBool = true;
    },
    goLove() {
      /*上报 点击【捐能量】*/
      wx.reportEvent("click_contributeenergy", {
        authorized_or_not: Number(this.isAuthorization),
      });
      // 退出登录的状态
      //前往授权
      if (!this.isAuthorization) {
        this.$emit("loginToast");
        return;
      }
			if (!this.isAutoLogin) return this.$emit("loginToast", true);
      //有授權但沒有團隊
      if (this.type == 1 && !this.userInfo.team_id) {
        this.$emit("createTeam");
        return;
      }
      //直接跳详情
      this.$router.navigateTo({
        url: `/pages/love/loveDetails/index?com_id=0&type=${this.type}`,
      });
    },
    goUserTeam() {
      /*点击“头像”  */
      wx.reportEvent("click_profilephoto", {
        authorized_or_not: Number(this.isAuthorization),
      });
      //前往授权
      if (!this.isAuthorization) {
        this.$emit("loginToast");
        return;
      }
      //有授權但沒有團隊
      if (this.type == 1 && !this.userInfo.team_id) {
        this.$emit("createTeam");
        return;
      }

      const url =
        this.type == 0
          ? "/pages/tabBar/user/index"
          : "/pages/user/myTeam/index";

      this.$router.navigateTo({
        url,
      });
    },
    goRankBoard() {
      /*点击榜单入口 */
      wx.reportEvent("click_ranking", {
        authorized_or_not: Number(this.isAuthorization),
      });
      //前往授权
      if (!this.isAuthorization) {
        this.$emit("loginToast");
        return;
      }
			if (!this.isAutoLogin) return this.$emit("loginToast", true);
      //直接跳详情
      this.$router.navigateTo({
        url: "/pages/rankBoard/index",
      });
    },
    showMedal() {
      /*点击悬浮勋章 */
      wx.reportEvent("click_danglingmedal", {
        authorized_or_not: Number(this.isAuthorization),
      });
      //前往授权
      if (!this.isAuthorization) {
        this.$emit("loginToast");
        return;
      }
      uni.navigateTo({
        url: "/pages/user/currentlyLit/index?medal_id=" + this.medal.id,
      });
    },
    resetMap() {
      if (this.level == 1 && !this.isShowReset) return;
      //恢复为第一级
      this.level = 1;
      this.initData(this.type);
      //停止动画
      // clearInterval(_markerInterval)
    },
    initData(type) {
      this.type = type;
      this.level = 1; //重置
      this.markers = [];
      this.polyline = [];
      this.loveConfig = {};
      this.next_city = {};
      this.resetMapScaleCenter();
      if (this.isAuthorization) {
        // this.$emit('nextCity', '')
        this.getGeoData();
        // this.getEnergyNum()
      }
      //停止动画
      // clearInterval(_markerInterval)
    },
    getGeoData(province, center) {
      const API = this.type === 0 ? getUserGeo : getTeamGeo;
      let location = getLocation();
      let parmas = {
        province,
      };
      if (location) {
        parmas = {
          province,
          ...location,
        };
      }
      API(parmas, true).then((res) => {
        if (res.code == 1) {
          const { user, team, list, next_city, scatter, lit_user, medal } =
            res.data;
          //最近点亮的用户
          this.lit_user = lit_user;
          this.loveConfig = user || team;
          this.next_city = next_city;
          //正在点亮的勋章
          if (!province) {
            this.medal = medal;
            this.setSoonMedalId(medal.id);
            //缓存到本地
            setCurrMedal(medal.province);
          }
          // this.$emit('nextCity', {
          // 	type: this.type,
          // 	city: next_city && next_city.city,
          // 	image: next_city && next_city.image
          // })
          if (next_city) {
            this.setNextCity(next_city);
          }
          this.createMap(list, scatter);
          if (province) {
            this.scale = 7;
            this.center = center;
          }
          // 获取元素的位置
          this.getCountMoveLocation();
        }
      });
    },
    initRankBoard() {
      const API = this.type === 0 ? getUserGeo : getTeamGeo;
      API().then((res) => {
        if (res.code == 1) {
          const { lit_user } = res.data;
          //最近点亮的用户
          this.lit_user = lit_user;
        }
      });
    },
    markertap(e) {
      //如果进入市内就不处理marker点击事件
      if (this.level == 2) return;
      //设置为第二级
      this.level = 2;
      //当前markerId
      const { markerId } = e;
      //用户标记不处理
      if (markerId == 10010) return;
      //待定
      let currMarker =
        this.markers[this.markers.findIndex((item) => item.id == markerId)];
      //获取省下一级数据
      this.getGeoData(currMarker.title, [
        +currMarker.latitude,
        +currMarker.longitude,
      ]);
      //停止动画
      // clearInterval(_markerInterval)
    },
    createMap(list, scatter) {
      //处理地图数据
      const { points, markers } =
        this.level == 1
          ? this.leveProvince(list, scatter)
          : this.leveCity(list, scatter);
      //路径数大于1时渲染
      if (points.length > 1) {
        this.polyline = [
          {
            points: points,
            color: "#FF5211",
            width: 1,
          },
        ];
      } else {
        this.polyline = [];
      }
      //标记
      this.markers = markers;
      //是否开启标记动画
      // if(markers.length>1){
      // 	this.startMarkerAnim()
      // }
    },
    leveProvince(list, scatter = []) {
      let len = list.length - 1;
      let points = [];
      let markers = [];
      const that = this;
      list.forEach(function (item, index) {
        const { latitude, longitude, adcode, id, name } = item;
        //起点marker
        if (index === 0) {
          if (index !== len) {
            markers.push({
              id: adcode,
              latitude,
              longitude,
              title: name,
              iconPath: "/static/home/star_marker.png",
              width: 26,
              height: 26,
              zIndex: index,
              label: mapOtions.markerLabel(name),
              callout: {
                content: "起",
                color: "#fff",
                padding: 0,
                fontSize: 12,
                bgColor: "transparent",
                textAlign: "center",
                display: "ALWAYS",
                anchorY: 20,
              },
            });
          }
        } else {
          //其它marker
          markers.push({
            id: adcode,
            latitude,
            longitude,
            title: name,
            iconPath: "/static/home/marker01.png",
            width: 18,
            height: 18,
            zIndex: index,
            label: mapOtions.markerLabel(name),
            callout: mapOtions.markerCallout(name),
          });
        }
        //当前用户marker
        if (index === len) {
          markers.push({
            id: adcode + 199,
            title: name,
            latitude: latitude,
            longitude: longitude,
            iconPath: that.userMarkerIcon,
            width: 40,
            height: 48,
            zIndex: len,
            label: mapOtions.markerLabel(name),
            callout: mapOtions.markerCallout(name),
          });
        }
      });
      //散点
      scatter.forEach(function (item, index) {
        const { latitude, longitude, adcode, id, name } = item;

        //其它marker
        markers.push({
          id: adcode,
          latitude,
          longitude,
          title: name,
          iconPath: "/static/home/marker01.png",
          width: 18,
          height: 18,
          zIndex: index,
          label: mapOtions.markerLabel(name),
          callout: mapOtions.markerCallout(name),
        });
      });

      return {
        points,
        markers,
      };
    },
    leveCity(list, scatter = []) {
      let len = list.length - 1;
      let points = [];
      let markers = [];
      let prePoint;
      const that = this;
      list.forEach(function (item, index) {
        const { latitude, longitude, adcode, id, name } = item;
        //路径
        if (prePoint) {
          //路径
          points = points.concat(
            calcCoorArr(prePoint, longitude + "," + latitude, 10)
          );
        }
        prePoint = longitude + "," + latitude;
        //起点marker
        if (index === 0) {
          if (index !== len) {
            markers.push({
              id: adcode,
              latitude,
              longitude,
              title: name,
              iconPath: "/static/home/star_marker.png",
              width: 26,
              height: 26,
              zIndex: index,
              label: mapOtions.markerLabel(name),
              callout: {
                content: "起",
                color: "#fff",
                padding: 0,
                fontSize: 12,
                bgColor: "transparent",
                textAlign: "center",
                display: "ALWAYS",
                anchorY: 20,
              },
            });
          }
        } else if (index !== len) {
          //其它marker
          markers.push({
            id: adcode,
            latitude,
            longitude,
            title: name,
            iconPath: "/static/home/marker02.png",
            width: 40,
            height: 40,
            anchor: {
              x: 0.5,
              y: 0.4,
            },
            zIndex: index,
            label: {
              content: name,
              color: "transparent",
              padding: 0,
              bgColor: "transparent",
              textAlign: "center",
            },
            callout: {
              content: name,
              color: "#000018",
              padding: 0,
              fontSize: 12,
              bgColor: "transparent",
              textAlign: "center",
              display: "ALWAYS",
              anchorY: 10,
            },
          });
        }
        //当前用户marker
        if (index === len) {
          markers.push({
            id: adcode + 199,
            title: name,
            latitude: latitude,
            longitude: longitude,
            iconPath: that.userMarkerIcon,
            width: 40,
            height: 48,
            zIndex: len,
            label: mapOtions.markerLabel(name),
            callout: mapOtions.markerCallout(name),
          });
        }
      });
      //散点
      scatter.forEach(function (item, index) {
        const { latitude, longitude, adcode, id, name } = item;
        //其它marker
        markers.push({
          id: adcode,
          latitude,
          longitude,
          title: "",
          iconPath: "/static/home/marker02.png",
          width: 40,
          height: 40,
          anchor: {
            x: 0.5,
            y: 0.4,
          },
          zIndex: index,
          label: mapOtions.markerLabel(name),
          callout: mapOtions.markerCallout(name),
        });
      });

      return {
        points,
        markers,
      };
    },
    resetMapScaleCenter() {
      this.scale = 3;
      this.stateScale = 3;
      this.center = [37.24659203091866, 103.46915943605336];
      this.isShowMap = false;
      setTimeout(() => {
        this.isShowMap = true;
      }, 0);
    },
    regionchange: debounce(function () {
      if (!_map) {
        _map = wx.createMapContext("map", this);
      }
      _map.getScale({
        success: (e) => {
          // console.log(e)
          this.stateScale = e.scale;
        },
      });
    }, 500),
    // ,
    // startMarkerAnim(){
    // 	let markers = this.markers
    // 	let size = this.markers.length-1
    // 	let index = 0
    // 	let currMarker = this.markers[size]

    // 	_markerInterval = setInterval(()=>{
    // 		if(index>=size){
    // 			clearInterval(_markerInterval)
    // 			return
    // 		}
    // 		let marker = markers[index]
    // 		let {latitude,longitude,title} = marker

    // 		currMarker.latitude = latitude
    // 		currMarker.longitude = longitude
    // 		index++
    // 	},200)
    // }
    // 获取元素的位置
    getCountMoveLocation() {
      // 获取元素高度
      let query = wx.createSelectorQuery().in(this);
      query
        .select("#user-show-box")
        .boundingClientRect((rect) => {
          let user_top = rect.top;
          let user_left = rect.left;

          let query1 = wx.createSelectorQuery().in(this);
          query1
            .select(".collect-energy")
            .boundingClientRect((rect) => {
              let energy_top = rect.top;

              let eneygy_left = rect.left;
              let count_top = energy_top - user_top;
              let count_left = eneygy_left - user_left;

              this.add_top = count_top;
              this.count_left = count_left;
            })
            .exec();
        })
        .exec();
    },

    // 获取用户已经积攒的能量
    async getEnergyNum() {
      collect_hint_num = uni.getStorageSync("collect_hint_num") || 0;
      console.log("collect_hint_num", collect_hint_num);
      const result = await getTotalLoveApi();
      let { total_love } = result.data;
      // console.log("我获取的能量total_love",total_love)
      this.energy_num = total_love.toFixed(3);
      if (!collect_hint_num) {
        this.collect_hint_show = true;
      }

      this.energyAutoAdd();
    },
    // 每三秒钟 能量自动加1
    energyAutoAdd() {
      autoTimerId = setInterval(() => {
        if (parseFloat(this.energy_num) >= 3) {
          // 能量积攒到3就是max满值了,清除定时器
          clearInterval(autoTimerId);
          return;
        }
        this.energy_num = (parseFloat(this.energy_num) + 0.001).toFixed(3);
        // console.log('this.energy_num',parseFloat(this.energy_num) )
        // 如果能量值大于等于3,则显示收取能量的提示,清除定时器
      }, 3000);
    },
    // 销毁定时器
    clearAutoTimer() {
      clearInterval(autoTimerId);
    },
    // 点击收取能量
    async handleCollect() {
      console.log(this.energy_num < 1);
      if (this.energy_num < 1) {
        uni.showToast({
          title: "产满1能量才可以收哦",
          icon: "none",
          duration: 2000,
        });
        return;
      } else {
        let result = await collectLoveApi();
        // 接口返回的剩余能量值
        let love = result.data.love;
        // let love = 1;
        let energy_num = parseFloat(this.energy_num);
        // 如果能力值大于等于3,则关闭
        if (this.collect_hint_show) {
          this.collect_hint_show = false;
          uni.setStorageSync("collect_hint_num", 1);
        }

        let add_num = Math.floor(energy_num);
        console.log(add_num);
        this.add_num = add_num;
        this.add_show = true;
        // 定义动画内容
        let animation = uni.createAnimation({
          duration: 2000,
          timingFunction: "ease-out",
        });

        animation
          .opacity(1)
          .left((this.count_left - 10) * -1)
          .top((this.add_top - 21) * -1)
          .step();
        // 导出动画数据传递给data层
        this.animationData = animation.export();
        this.energy_num = love.toFixed(3);
        if (autoTimerId) {
          clearInterval(autoTimerId);
          this.energyAutoAdd();
        }
        setTimeout(() => {
          this.add_show = false;
          this.loveConfig.love = this.loveConfig.love + add_num;

          animation.opacity(0).left(-20).top(28).step({ duration: 0 });
          this.animationData = animation.export();
        }, 2000);
      }
    },
  },
};
</script>

<style lang="scss">
.user-map {
  .user-map-box {
    width: 100%;
    height: 370px;
    position: relative;
  }

  .map {
    width: 100%;
    height: 370px;
  }

  .user-show-box {
    width: 304rpx;
    height: 88rpx;
    position: fixed;
    z-index: 1000;
    top: 148rpx;
    left: 20rpx;
    transform: translateY(15rpx);

    .usb-bg {
      position: absolute;
      top: 0;
      right: 0;
      width: 100%;
      height: 100%;
    }

    .user-icon {
      width: 84rpx;
      height: 84rpx;
      background-color: rgba(0, 0, 0, 0);
      border: 2rpx solid #ffffff;
      border-radius: 50%;
      position: absolute;
      z-index: 1;
      top: 0;
      left: 0;
    }

    .donate-energy {
      font-size: 24rpx;
      font-weight: 400;
      text-align: center;
      color: #ffffff;
      width: 104rpx;
      height: 42rpx;
      line-height: 42rpx;
      text-align: center;
      white-space: nowrap;
      position: absolute;
      z-index: 1;
      right: 0;
      top: 35rpx;
      // animation: flash 3s;
      overflow: hidden;
      &::before {
        content: "";
        position: absolute;
        width: 1rpx;
        height: 85rpx;
        top: -54rpx;
        left: 0rpx;
        // background: linear-gradient(0deg, rgb(201, 200, 200) 0, #fff 90%, rgb(216, 214, 214) 100%);
        background: rgba(255, 250, 250, 0.8);
        transform: rotate(25deg);
        animation: shank 4s 0s linear both infinite;
        // box-shadow: 1rpx 0 0 3rpx #fff;
        box-shadow: 2rpx 0 0 6rpx rgba(255, 250, 250, 1);
      }
    }
    @keyframes shank {
      0% {
        top: -54rpx;
        left: 0;
        opacity: 0;
      }
      12% {
        // top: 0rpx;
        opacity: 1;
        // box-shadow: 2rpx 0 0 3rpx #fff;
      }
      25% {
        top: 10rpx;
        left: 104rpx;
        opacity: 0;
        // box-shadow: 2rpx 0 0 2rpx #fff;
      }
      100% {
        top: 10rpx;
        left: 104rpx;
        opacity: 0;
      }
    }
    .energy-num {
      display: flex;
      align-items: center;
      position: absolute;
      z-index: 1;
      left: 85rpx;
      top: 35rpx;
      font-size: 24rpx;
      font-weight: 400;
      text-align: center;
      color: #b88400;
      white-space: nowrap;
    }

    .lightning {
      width: 25.6rpx;
      height: 41.6rpx;
      margin-left: 12rpx;
      margin-right: 6rpx;
    }
  }

  // .love-box{
  // 	height: 62rpx;
  // 	background-image: linear-gradient(92deg,#ffdbaa 11%, #ffd3c6 92%);
  // 	border: 2rpx solid #ff7507;
  // 	border-radius: 32px;
  // 	position: fixed;
  // 	z-index: 1000;
  // 	top: 54rpx;
  // 	left: 50rpx;
  // 	transform: translateY(32rpx);
  // 	display: flex;
  // 	align-items: center;
  // }

  // .user-box{
  // 	position: absolute;
  // 	left: 0;
  // 	top: 50%;
  // 	text-align: center;
  // 	transform: translate(-35%,-50%);
  // }

  // .user-icon{
  // 	width: 74rpx;
  // 	height: 74rpx;
  // 	border: 2rpx solid #ff7507;
  // 	border-radius: 50%;
  // }

  // .large-love{
  // 	width: 96rpx;
  // 	height: 54rpx;
  // 	position: relative;
  // 	font-weight: 700;
  // 	color: #ffffff;
  // 	text-align: center;
  // 	line-height: 40rpx;
  // 	margin-top: -40rpx;
  // }
  // .large-love-icon{
  // 	width: 96rpx;
  // 	height: 54rpx;
  // 	position: absolute;
  // 	left: 0;
  // 	bottom: 0;
  // }

  // .large-love-text{
  // 	position: relative;
  // 	z-index: 1;
  // 	font-size: 18rpx;
  // }

  // .love-info{
  // 	margin-left: 80rpx;
  // 	text-align: center;
  // 	font-size: 0;
  // 	line-height: 1;
  // }

  // .small-love{
  // 	width: 28rpx;
  // 	height: 25rpx;
  // }

  // .love-num{
  // 	font-size: 28rpx;
  // 	font-weight: 700;
  // 	color: #e3001b;
  // 	margin-top: 2rpx;
  // }

  // .donate-love{
  // 	width: 108rpx;
  // 	height: 42rpx;
  // 	background: #f7304d;
  // 	border: 2rpx solid #ffaaaa;
  // 	border-radius: 24px;
  // 	font-size: 24rpx;
  // 	font-weight: 400;
  // 	color: #ffffff;
  // 	display: flex;
  // 	justify-content: center;
  // 	align-items: center;
  // 	margin-left: 20rpx;
  // 	margin-right: 10rpx;
  // }

  .recently-lit {
    position: fixed;
    right: 24rpx;
    transform: translateY(32rpx);
    display: flex;
    z-index: 11;
  }

  .recently-icon.border {
    border: 2rpx solid #ff7507;
  }

  .recently-icon {
    width: 60rpx;
    height: 60rpx;
    border-radius: 50%;
    box-sizing: border-box;
    position: relative;
  }

  .recently-icon.recently-icon {
    margin-left: -25rpx;
  }

  .medals-being-lit {
    width: 108rpx;
    height: 108rpx;
    position: absolute;
    border-radius: 50%;
    right: 42rpx;
    bottom: 170rpx;
    background-image: linear-gradient(180deg, #ffd690, #ff8902);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
  }

  .mbl-box {
    position: relative;
    width: 98rpx;
    height: 98rpx;
    overflow: hidden;
    border-radius: 50%;
    font-size: 0;
    -webkit-backface-visibility: hidden;
    -webkit-transform: translate3d(0, 0, 0);
  }

  .mbl-icon {
    width: 98rpx;
    height: 98rpx;
    border-radius: 50%;
  }

  .water {
    position: absolute;
    height: 120rpx;
    bottom: 0%;
    left: 100%;
    transform: translateX(-100%);
    animation: waterAnim 5s infinite linear alternate;
  }

  .mbl-progress-box {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 50%);
    width: 92rpx;
    height: 30rpx;
    background: #ffffff;
    border: 2rpx solid #ff9518;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mbl-progress {
    position: absolute;
    left: 0;
    top: 0;
    background-color: #ff7507;
    height: 30rpx;
    border-radius: 14px;
  }

  .mbl-progress-text {
    position: absolute;
    z-index: 1;
    font-size: 28rpx;
    -webkit-text-stroke: 1rpx #e33e00;
    text-stroke: 1rpx #e33e00;
    color: #ffffff;
    font-weight: bolder;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .mbl-province {
    position: absolute;
    bottom: -55rpx;
    left: 50%;
    transform: translateX(-50%);
    font-size: 28rpx;
    font-weight: 400;
    color: #f55b21;
    white-space: nowrap;
  }

  .jjdl {
    position: absolute;
    top: 190rpx;
    left: 50%;
    transform: translate(-50%);
    font-size: 36rpx;
    color: #000018;
    z-index: 10;

    .city {
      font-size: 40rpx;
      color: #ff7507;
      font-weight: Bold;
    }
  }

  .replay {
    position: absolute;
    left: 50%;
    bottom: 30px;
    background-color: #fff;
    border-radius: 10px;
    padding: 10rpx;
    transform: translateX(-50%);
    z-index: 10;
  }
}
.collect-energy {
  width: 110rpx;
  height: 112rpx;
  position: absolute;
  right: 42rpx;
  bottom: 340rpx;
  border-radius: 50%;

  //   border: 4rpx solid #ffd86a;
  //   box-sizing: border-box;
  .collect-out-img {
    width: 110rpx;
    height: 112rpx;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    image {
      width: 100%;
      height: 100%;
    }
  }
  &.bottom-174 {
    bottom: 170rpx;
  }
  .collect-out-star {
    position: absolute;
    left: -14rpx;
    top: -16rpx;
    width: 134rpx;
    height: 68rpx;
    image {
      width: 100%;
      height: 100%;
    }
  }
  .collect-hint {
    width: 150rpx;
    height: 48rpx;
    position: absolute;
    top: -28px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    background: url("https://file.y1b.cn/public/img/bfzx/wzk@2x.png") no-repeat;
    background-size: 100% 100%;
    color: #b88400;
    font-size: 26rpx;
    text-align: center;
    line-height: 40rpx;
  }
  .energy-max {
    width: 102rpx;
    height: 102rpx;
    position: absolute;
    top: 5rpx;
    left: 4rpx;
    z-index: 1;
  }
  .energy-falsh {
    width: 104rpx;
    height: 102rpx;
    position: absolute;
    top: 0rpx;
    left: 4rpx;
    z-index: 5;
  }
  .energy-num {
    width: 200rpx;
    height: 200rpx;
    position: absolute;
    top: 56rpx;
    left: 20rpx;
    z-index: 9;
    color: #b88400;
    font-size: 26rpx;
  }
  .energy-hint {
    width: 98rpx;
    height: 36rpx;
    position: absolute;
    bottom: -20rpx;
    left: 6rpx;
    z-index: 10;
  }
  // 点击收取能量时的动画
  .number-increment {
    position: absolute;
    top: 56rpx;
    left: -40rpx;
    z-index: 9;
    color: #b88400;
    font-size: 26rpx;
    font-weight: 700;
    opacity: 0;
    // animation: counter 2s ease-out; /* 动画效果 */
  }
  @keyframes counter {
    from {
      transform: translate(30rpx, 30rpx) scale(1.5);
      opacity: 1;
    }
    to {
      transform: translate(-600rpx, -300rpx) scale(1);
      opacity: 0;
    }
  }
  .collect-flow {
    width: 100rpx;
    height: 100rpx;
    position: absolute;
    left: 3rpx;
    bottom: 4rpx;
    border-radius: 50%;
    box-sizing: border-box;
    overflow: hidden;
    background-color: #b1d2d2;
    .dot-box {
      position: absolute;
      top: 0;
      left: 20rpx;
      z-index: 4;
      display: flex;
      .dot {
        display: block;
        width: 10rpx;
        height: 10rpx;
        border-radius: 50%;
        // background-color: #D0FDFF;
        background-color: #d0fdff;
        box-shadow: 2rpx 2rpx 10rpx #00000050;
      }
      .start-flicker1 {
        // margin-left: 40rpx;
        margin-top: 20rpx;
        animation: flicker1 2s ease-out infinite; /* 动画效果 */
        @keyframes flicker1 {
          from {
            transform: translateY(20rpx) rotate(0deg);
            opacity: 0;
          }
          to {
            transform: translateY(-18rpx) rotate(180deg);
            opacity: 1;
          }
        }
      }
      .start-flicker2 {
        margin-top: 10rpx;
        margin-left: 10rpx;
        animation: flicker2 2s ease-out infinite; /* 动画效果 */
        @keyframes flicker2 {
          from {
            transform: translateY(20rpx) rotate(0deg);
            opacity: 0;
          }
          to {
            transform: translateY(-30rpx) rotate(360deg);
            opacity: 1;
          }
        }
      }
      .start-flicker3 {
        margin-left: 20rpx;
        margin-top: 10rpx;
        animation: flicker3 2s ease-out infinite; /* 动画效果 */
        @keyframes flicker3 {
          from {
            transform: translateY(20rpx) rotate(0deg);
            opacity: 0;
          }
          to {
            transform: translateY(-18rpx) rotate(240deg);
            opacity: 1;
          }
        }
      }
    }
    .collect-flow-in {
      position: absolute;
      top: 0;
      right: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
      transform: rotate(180deg);
      &::after {
        content: "";
        position: absolute;
        top: 0px;
        left: 50%;
        width: 180%;
        height: 180%;
        border-radius: 40%;
        background-color: #e2feff;
        transform: rotate(90deg);
        animation: real 5s linear infinite;
      }

      @keyframes real {
        0% {
          transform: translate(-50%, -65%) rotate(0deg);
        }

        100% {
          transform: translate(-50%, -65%) rotate(180deg);
        }
      }
      &::before {
        content: "";
        position: absolute;
        top: 0px;
        left: 50%;
        width: 170%;
        height: 170%;
        border-radius: 42%;
        // background-color: #bdebec;
        background-color: #52b0b0;
        animation: virtual 7s linear infinite;
      }
      @keyframes virtual {
        0% {
          transform: translate(-50%, -60%) rotate(0deg);
        }

        100% {
          transform: translate(-50%, -60%) rotate(180deg);
        }
      }
    }
  }
}
</style>

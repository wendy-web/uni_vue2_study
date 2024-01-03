// pages/warhorse//index/index.js
const api = require("../../../utils/api");
const utils = require("../../../utils/util");
const auth = require("../../../utils/auth");
const app = getApp();
const COS = app.globalData.COS_URL;
const zmshuoming = "为回馈终端客户及消费者的鼎力支持，即日起至2021年3月31日止，凡在活动区域购买带有“箱内码红包”标识的整箱战马能量型维生素饮料，可通过微信扫描箱内二维码获得红包，最高有机会赢取30元红包。\n 红包总数量5000000个，其中：\n 30元红包共计50000个，中奖率为1%;\n 10元红包共计100000个，中奖率为2%；\n 5元红包共计3975000个,中奖率为79.5%;\n 3元红包共计875000个，中奖率为17.5%。\n"
let zmshuoming2 = "1、参与活动：微信扫描纸箱内二维码，即可进入【彬纷有礼】小程序，按照页面指引操作，点击【扫一扫】再次扫描箱内二维码，即可领取红包。领取红包后，可在【我的余额】里查看红包记录。余额大于1元即可提现，提现后金额将直接转到微信零钱，提现金额48小时内到账。每日提现次数不得超过5次，每日提现总金额不得超过200元。";
zmshuoming2 += "\n2、活动综合中奖率100%，奖金总价值3125万元。";
zmshuoming2 += "\n3、活动截止时间：2021年3月31日，逾期视为自动放弃。";
zmshuoming2 += "\n4、本次活动范围：中国大陆范围内的终端客户及消费者，本市产品箱内二维码仅限本市扫码参与，如经终端客户及消费者扫码后页面出现“您已超出活动范围，无法参与活动”提示，则不可参与活动。";

const zmzhuyi = "请在参加本活动前仔细阅读本规则中的各项条款，如果您参加了本活动，则战马公司认为您已理解并同意该规则中的各条款。" +
  "\n 1．战马公司对促销包装的真实性有鉴定及确认权。" +
  "\n 2．纸箱图样以实物为准，活动站点及相关宣传资料上提供的图片仅供参考。" +
  "\n 3．战马公司有权按照中华人民共和国个人所得税的相关规定代扣代缴获奖者在本次活动中依法应当缴纳的个人所得税。本次活动所产生的个人所得税由战马公司依法代扣代缴，奖金和奖品均为税后所得。" +
  "\n 4．如遇不可抗力事件，包括但不限于地震、台风、水灾或其他自然灾害、火灾、爆炸事故、骚乱、战争、政府政策的改变、任何国家主管机关就此次活动做出任何判决、决定、命令，或未能合理控制的任何其他不可预见事件，战马公司有权在不事先通知的前提下变更或取消本活动。" +
  " \n 5．如果参加者在活动中使用任何不正当的手段参加活动，战马公司有权在不事先通知的情况下取消其参加活动的资格，同时保留依法追究其法律责任的权利。" +
  "\n6．战马公司保留对争议和异议的处理权利。战马公司对于获奖者因参加本活动所发生的任何直接、间接费用和产生的任何损害不负任何责任。" +
  "\n 7．本规则的解释与适用，以及与规则有关的任何争议，均以中华人民共和国法律为依据。" +
  "\n 活动咨询热线：400-818-5599（周一至周五8：30-17：30，法定节假日除外）";
let gamePage = [
  "/pages/warhorse/slotmachine/index",
  "/pages/warhorse/rotate/index",
  "/pages/warhorse/goldenEgg/index",
];
let radomUrl = ''; //随机页面地址
let chai = false; //拆红包中
let InnerAudio_one = ''; //开红包音效
let cosAddress = auth.getCosAddress();
//活动规则图片
const act_rule_obj = app.globalData.unboxActRuleObj;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hongbaoImg: COS + "/public/img/WarHorse/0917/zmhongbao.png",
    ruleImg: COS + "/public/img/WarHorse/0917/rule.png",
    opened: false, //红包开启状态 默认false
    hasTask: false, //是否有任务 默认false
    openImg2: COS + "/public/img/WarHorse/0917/openImg2.png", //有任务，底部2个按钮：放弃翻倍查看余额，看视频红包翻倍
    rule: false, //活动规则
    zmshuoming: zmshuoming,
    zmshuoming2: zmshuoming2,
    zmzhuyi: zmzhuyi,
    //视频组件传参
    videoPop: false,
    capsule: '',
    videoUrl: "",
    reconfirmPop: false, //跳转余额再次确认弹窗
    remindIcon: COS + '/public/img/WarHorse/0917/remindIcon.png',
    btnurl: app.globalData.COS_URL + "/public/img/WarHorse/0917/watch_video_btn.png",
    title: COS + '/public/img/WarHorse/0917/zm_title.png',
    warhorseImg: COS + '/public/img/WarHorse/0917/goldenEgg/warhorse.png',
    ribbonImg: COS + '/public/img/WarHorse/0917/zm_ribbon.png',
    zmhbImg: COS + '/public/img/WarHorse/0917/zm_hb.png',
    chai: false,
    hbtype:6,//红包类型，战马:4,5,6类型不同，活动规则不一样 默认4
    ZM_activity_five_rule:COS+'/public/img/WarHorse/2021/02/ZM_activity_five_rule.png',
    image_load_failed:false,//2021年3月19日 网络图片加载失败时默认显示普通按钮
    yuerText:"点击查看余额",
    // 2022年新增战马箱内码活动类型：6
    icon_zm_logo:COS+'/public/img/WarHorse/2022/01/icon_zm_logo.png',//战马logo
    icon_zm_rule:COS+'/public/img/WarHorse/2022/01/icon_zm_actrule.png',//活动规则图标
    zm_activity_six_rule:COS+'/public/img/WarHorse/2022/01/zmActivityRule2022011801.png',//活动类型6规则详情
    icon_zm_activity:COS+'/public/img/WarHorse/2022/01/icon_zm_activity03.png',//战马活动主图
    icon_redpacket:COS+'/public/img/WarHorse/2022/01/icon_zm_open01.png',//未开红包
    icon_redpacket_opened:COS+'/public/img/WarHorse/2022/01/icon_zm_opened_2.png',//已开红包
    icon_zm_bottom:COS+'/public/img/WarHorse/2022/01/icon_zm_bottom01.png',//底部图标
    icon_zm_title:COS+'/public/img/WarHorse/2022/01/icon_zm_title.png',//恭喜您获得
    icon_zm_btn_yuer:COS+'/public/img/WarHorse/2022/01/icon_zm_btn.png',//查看余额按钮
    icon_btn_yuer:COS+'/public/img/WarHorse/2022/01/icon_zm_btn.png',//查看余额按钮
    icon_zm_help:COS+'/public/img/WarHorse/2022/01/icon_zm_help.png',//查看助力按钮
    icon_zm_btn_video:COS+'/public/img/WarHorse/2022/01/icon_zm_btn_video.png',//看视频翻倍按钮
    icon_zm_btn_giveup:COS+'/public/img/WarHorse/2022/01/icon_zm_btn_giveup.png',//放弃翻倍
    icon_zm_btn_scan:COS+'/public/img/WarHorse/2022/01/icon_zm_btn_scan.png',//继续开箱扫码
    pop_zm_bg:COS + "/public/img/WarHorse/2022/01/pop_zm_bg.png",
    zm_activity_four_rule:COS+'/public/img/bfyl/202202/img_zm_26th_rule.png',//活动类型4规则详情
    zm_activity_seven_rule:COS+'/public/img/bfyl/202206/img_zm_7_rule.png',//活动类型7规则详情
    img_zm_main:COS+'/public/img/bfyl/202212/img_zm_main_test2.png',//活动类型8 主图
    img_bg_zm:COS+'/public/img/bfyl/202212/img_bg_zm.png',//活动类型8 背景
    pre_act_zm:false,//往期战马
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("warHorse page onLoad options:", options);
    if (options.hbdata) {
      this.setData({
        hbdata: decodeURIComponent(options.hbdata),
      });
    }
    if (options.hbtype) {
      let hbtype = decodeURIComponent(options.hbtype);
      let pre_act_zm = false;
      if ([4, 5, 6, 7].includes(+hbtype)) {
        pre_act_zm = true;
      }
      this.setData({
        hbtype,
        pre_act_zm
      });
    }
    //删除本地缓存的qrcode
    wx.removeStorageSync('qrcode');
    //获取用户信息
    var userdata = wx.getStorageSync('userdata');
    if (userdata) {
      this.setData({
        userdata: userdata
      });
    } else {
      utils.getUserInfoNew().then(res=>{
        this.setData({
          userdata: res
        });
      })
    }
    InnerAudio_one = utils.InnerAudio({
      url: COS + "/public/music/k_3.mp3"
    });
    //获取广告地址
    if (cosAddress&&cosAddress.A8) {
      let videoUrl = cosAddress.A8.value[0].video_zm[0];
      this.setData({
        videoUrl
      });
    } else {
      utils.getAd().then(data=>{
        cosAddress = data;
        let videoUrl = cosAddress.A8.value[0].video_zm[0];
        this.setData({
          videoUrl
        });
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var radomUrl = gamePage[Math.floor((Math.random() * gamePage.length))];
    this.setData({
      radomUrl: radomUrl
    });
    console.log("随机跳转页面：", radomUrl);
    chai = false;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let userdata = wx.getStorageSync('userdata');
    if(userdata&&userdata.condition == 2){
      this.setData({
        yuerText:"点击查看助力",
        icon_zm_btn_yuer:this.data.icon_zm_help
      })
    }else{
      this.setData({
        yuerText:"点击查看余额",
        icon_zm_btn_yuer:this.data.icon_btn_yuer

      })
    }
  },
  //活动规则
  showRule: function () {
    let hbtype = this.data.hbtype;
    let url = act_rule_obj[+hbtype];
    if(url){
      console.log("url:",url)
      wx.previewImage({
        urls: [url],
      })
      return
    }
    // if(this.data.hbtype==4){
     
    //   wx.previewImage({
    //     urls: [this.data.zm_activity_four_rule],
    //   })
    //   return
    // }
    // if(this.data.hbtype == 5){
    //   wx.previewImage({
    //     urls: [this.data.ZM_activity_five_rule],
    //   })
    //   return
    // }
    // if(this.data.hbtype == 6){
    //   wx.previewImage({
    //     urls: [this.data.zm_activity_six_rule],
    //   })
    //   return
    // }
    // if(this.data.hbtype == 7){
    //   wx.previewImage({
    //     urls: [this.data.zm_activity_seven_rule],
    //   })
    //   return
    // }
  },
  //关闭活动规则弹窗
  iknow: function () {
    this.setData({
      rule: 0
    })
  },
  open: function () {
    var that = this;
    this.setData({
      animate: 1
    });
    if (chai) return;
    chai = true
    if (this.data.opened) return;
    var data = {
      code: that.data.hbdata
    }
    console.log("拆红包参数：", data);
    //拆红包
    api.post('/api/scan/open', data).then(res => {
      InnerAudio_one.play();
      chai = false;
      console.log("warhorse index 拆红包返回：", res);
      if (res.code == 1) {
        console.log("任务长度：", Object.keys(res.data.task).length)
        let len = Object.keys(res.data.task).length;
        if (len !== 0) {
          //有任务根据 data.id 作为键值存缓存，跳转页面传id 落地页取任务
          console.log("任务id:", res.data.id);
          console.log("任务:", res.data.task);
          wx.setStorageSync('getRewarded', null);
          let getRewarded = {};
          getRewarded[0] = res.data.task[0];
          getRewarded = JSON.stringify(getRewarded);
          wx.setStorageSync('getRewarded', getRewarded);
          that.setData({
            task: res.data.task,
            hbData: res,
            hasTask: true,
            opened: true,
          });
          return ;
        }

        that.setData({
          hbData: res,
          opened: true,
        });


      } else {
        console.log("res.data:", res.data);
        that.setData({
          hbData: res,
          opened: true,
        })
      }


    }).catch(res => {
      chai = false;
      console.log("warhorse index 拆红包catch：", res);
      
    });

  },
  goYuer: function (e) {
    var go = e.currentTarget.dataset.go;
    console.log("再次确定跳转:", go);
    //判断用户扫码红包 是否有翻倍任务，有就二次弹窗，没有直接跳转
    var task = this.data.task;

    if (go == 1 && task && Object.keys(task).length > 1) {
      this.setData({
        reconfirmPop: true,
      });
      return false;
    }
    //检查用户手机号,存在则跳转
    var userdata = wx.getStorageSync('userdata');
    console.log('获取本地userdata:', userdata);
    if (userdata && userdata.mobile) {
      //本地缓存用户信息 redirectTo
      let url = '';
      if (userdata.condition != 2) {
        url = "/pages/zhongduan/geren/yuer/index"
      } else {
        url = "/pages/zhongduan/geren/zhuli/index"
      }
      wx.redirectTo({
        url: url,
      })
      return false
    } else {
      //请求接口获取最新数据
      utils.getUserInfoNew();

    }
  },
  //跳转游戏页面
  playGame: function (e) {
    //videoEnd :0 视频未完整播放不跳转(弹出观看视频弹窗或不做处理)  1：视频播放完走业务逻辑
    console.log("视频组件页面触发：", e);
    var detail = e.detail;
    if (detail.videoEnd == 0) {
      return
    }
    if (detail.videoEnd == 1) {
      console.log("视频播放结束触发：", detail.videoEnd);
      this.setData({
        videoEnd: 1
      });
      // return;
    }
    //随机跳转到任意游戏页面
    var task = this.data.task;
    task = encodeURIComponent(JSON.stringify(task));
    // console.log("任务：",task);
    var radomUrl = this.data.radomUrl;
    wx.redirectTo({
      url: radomUrl + '?task=' + task, //跳转携带task

    })

  },
  closePop: function () {
    this.setData({
      reconfirmPop: false
    });
  },
  triggerOpen: function () {
    if (this._triggered || this.data.opened) return
    this._triggered = true;
    this.open();
  },
  //观看视频
  watchAd: function () {
    this.setData({
      videoPop: true,
      reconfirmPop: false
    });
  },
  imgError:function(error){
    let name = error.currentTarget.dataset.name;
    if( name == "hongbaoImg"){
      this.setData({
        image_load_failed:true,
        hongbaoImg:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAkAAAAJECAMAAADJ1WsSAAAAulBMVEXSEB4AAADLCxvGDhzLEB/GCxvHDx3SDx3XDRzRDRzLHiPJFSLOJCPPLCTUPybRMiXMDBvSOCbYUSjcYCrFCxraWCnZHibzyWbzu1PWSyfeaSvWRijzwV3z0G7hdi3gbyz/x2/jfi7lhjC9ChnnjjDtDCGoBxazCBfplzLXHCSZBRPTGyJ3Ag3q0Ezy30bocUHws2DroTb57GeFEBTqikzroFb57o379bG3GR6fKSCvRy/HdkTCXTC9RiQ+n8qgAAAACHRSTlPqABuf2Xy+ReX3eJ8AAK0NSURBVHja5JtbttMwDEVN4cJCTRf+8GICfDL/+ZHokY2uYkIojw8Ux88W2npzJLmlvblgt9uHDy8vb9+/f/8Oa1py02Z2b3crubp+idxlbX5460Xvd16P9nhVfGXZJ5Zt1B5WbPHuE8xJu1t9fM2mc0Vh9Ex5//blw+1nmWgX4FnR2dC4//cmKydLKssSS0uYMNBVtWW3h8j9n9qXqGu5t3fvYegZgKDn5e3KDn+v2njq1uovmNy5KDqWu9U6QzPpMYIDcNB5XYEZASY1Jph7wgbV5fvEhjJ0uz0NEPTEX6vteOKF/0mTI16OjBXximbaY7Q8XkuQOKuLLjlAy58DqNrVf7zpskKr1t69PZehdorPB+jRSmsaOictfbrXDTnIt1RSZG/hysYsaQclArxJz0dLMVvylSAqeTAp/ADvEzAVMR9nLX1spDmH6MvPINTO8UkvcsBvwvWsvdM+i9EEFFCJHq1EodIlmsTWYY+B6UxWoVjX4Vbpw7y/6LN+pwCN6fRkF2K7+pD17luXEk9DjrB2glA7wafVPR/U/nr2lzUZ85xkVykq/qQCAh/0K2GSmSrQTXoIl3OBCdJkKwaQUybHClS15zJVo7gwdmYteTtkDNmvDkshQSMrUrycd29vvwgQ+JgBAvjoq5Ctp1cZa6/6rusQyXxO8gAcmIQ04APBBNTUhTFQnQkJsuZuZgs+sUNGhI1de6vYmMKDdd0JPn/RaujILmaLV0CRRHz23cvtFwC6vbz7PuACIbq8IHp5LP5KJ+//mgl3IiA7pbyos9Y58mH0YS1PsMLI+ZkokK0EL0GXrgZ1iNIFhi74MxceveiupW0mo7Ff63qRCKvF4TI/dhmgD+9bjpxfIWpwN7fuLePRpY2QomejHakTVWNoxVseW8mRAkmRMDqSfRjgPEjC8G2EQE5ZPHvBiMBA9tl4egQD4p+7sBVmXbSwX/gHRMhbEbkz9X4mQm0qPwhbCc4Jf7odsfbW5GMTHX0eOm5tHe0SNH/Pyc7JqcEOsFQgmCgZ2CFNDHIFTw7Cwy8HBgXCayFHgn+LEqL0m21402WIOQDfi21Ttmq9e9OOLZkU+bNwM84PgfU8EmrT6Gfk2GzQhR6D+HNby9Zs7eiQbgrUZTyTclU/Az4VHmZ4WGXgKJ5mNq0DFW1RoMcdaSIECjcXf46OvSSi7cIK6qfIvIqAPBRtfb1tV9Zbt2usI52ytnXVoJRcBz+S//z2/sMpQLgv9IbNB3DzXxvYfaN5mCSOtW+TjnzfRMiC6mvCAzL03TIGdW9r3IMQvWKBddFGUsXG+hQKdaBAgUhMCzE0p4j53LEcdFaMmL1knm21bm7AdqUP2xnTI3VjPu6kOl98cwR+9LYCQScAveSjnxz6Ru7VHGHF2Qfd0A4/O0Q81j/U2TN86lwWjzBGTEqdhziKAEmqDi86NQbyJy4oECGzIEBuujxlpOSXF3UoErCul5KjO4TyuKkuSWue6OBgRC3G2LsP5wAR/miV6i/WiEb0jvJWzNzF+lBf/FD58WTxukm6pSwLyzyC2eKw9l7C5sKFByN/zzE0CkQ8dCcE2i9eMCoLSQWia6Y8eNquO2G7o9uzb5v31YV4NtbFkHF+6uniOCCoVX5aEp8aovdhjjVQ7p9jECTtAVAcDl0Lf2QynQmo0RAVjfZAZYqPLsUDeFgUKgMIFgIgNCaSMO1NcjC8as0C6dNeiYe68WNCJK13jUmHS48HQ313HZ18zMNnBwgFommFoFb5SbIzSiStXCvQIO0RkJKtqHeTUa9l/CI87PPsEDBvQt6GE32hoTAbdyVIlkeEPyRhkgRo2QeuNqxqlZ1qpSRpa4HpXIE4PFSIuvQm4SRwFntPEzI9KBo9ACpgjmMNapUfaEGAdnS221n2Rr2qstxaAN1lhIrqdRY9Q0YdMcUMCOVsnH5pgTHrS3Tosw48Nm9DYugVJCs6rxoDQEFXvApwW+eKQBbVtIbezwdBhsyOT9eTxM+WGsd2eQqmdYza9pTdQkACn1kc1Co/8Vginy8+0tdiAgjAOQSKLEy6wa+xHDxfthzjRpPzd4zHvRaawgNFTVu6DJne68dqqIkrkJL1UD6yAqX4yCCSEu4zsBINSxdoMngCIu22reoNYwO3MiyfHl3CkvKQjFWC2qv8i+NMsPOJISNnX2s7/BDIu7Forx0hvUIMd06eoUYoaXaWXuk4w1PgYLrOZ8yMBLe1FyrDihKCGPEtR8zlmJk7QzI5yvyRRZKzFlyY9ZQe3SpSsa3CxhBs4i00m79NAfpA/h4tYZDKjwVfxmsRICrp+0uXAUHjatCMVc0BIVoavQAg+6FyhyVvdoiSkuDgOEgbQLpCVr/zot2Ug/HdKg1R3OQXTtdSfBkS/3jBKMKgsmFbsVHiZxDKRBVEpDPpls4PwSY38esAIfviYMEK3nRE5Nz3+mrCLnykzBdRcgOiHwbK6M/E6kolzBTI+fnknYdICJDZ4u5Mu06FsmMU1WNRKUfuVCjwT/oyQ6fvGAVMra/qg8ewUDZs915E0NPTu/ZyDNDt7X36ROU4sB1O7uDcpydVCoKkR7maskNJ+V6zwkKfPJzu1DNxF3WqfosFRcOuDaH1XsSMhW1AeGR08fv7enqZ31+ew3JiNjfVfbxX30FqOAxkKPZN34HIVwMIG1roDMIgACKAhjQ0LH5IEoHOgQQ1TB8tFLl0jpj/ydU44SjRlZxmAQ7dw3gZfBidGpxw+YL23aUtrlNkbnMXhrrWAIj2QhYvhJ9adNT69/6ihwyZdcPHbQdACGVmYVBLAVBCDj/YR09+0xwnQLv8eGmuPaLF4D+XH4LhAshRWB0jqpKDZ0ygCG6uGwB9Wq8CkAVHLkBER+bB4ooov55k+cI8ZmbMcjXXGwIhT4nJwtxzsGfxDoiA6gYNvcxebgWg2/vMDviYDLYQoGT98ysF0kg+hOfMgZWPiqyKxcPEtsY8BDxYgSgNn+BH6dEaSoTjadRIl1h0vIr7TYW7SrKwMDVJZ0D+2yAdkIW5/+h7/LOJplWSk0EcEWDgxADo9sKDrPniHY6eA94oJGFMNgvgwo15/35q9auhrEEz0YGdGtAwYMTwCYBCgUKFWAAg8jP4sYu80IUoye0kChK654b+hAZ5b/MZI47x2DjUR4OgwASUHAsIwYk1HBhHjjR9GD7292ax6d7iS7uGzwE8fvhEe6wwqRdjJngoOxAVNiPneYOTJEGEQO7CACY9ydZ5dbyLg1CHoa6VKe5iu/bL6MaS97//Wj4CoZbxSQLEcTTOy7vtBYDIwAbqYwPTwt4kiw0Jl6rQAOX99Wq9O7KLsXO0GRta2VtBfxhi9H8nQE5QtCkE2pBCpgBIh1oJqsnFG2VIDUQywUaOFMju9SIrJoS1HtnXEtXOgbNUv9IijgagDy0hlr+6CLUhcCcH6yFCQ9YBnmtE01+F0DLToiLWQp31CtaOdAaqrnFxDSAMDxZjBsWD6RSww0/0veTounLDmBoj+hGrYl/aWti9YdlXFqB7ESCowZchQY0IOsjLv5tv8WPanuMdYiLnWbo0xLM7PDozc145SY9O/ZICWmgA5inNWV53l+nl9jgFCH4QJ86OEuRoEZ9GDZvN8meBTZ0Y2Xw4BtkmhQM76f6OQcgpQIBgBkAGUVALAeK/KebgmeQrzg/CdOA/tTVUumLOCahfpz80rFU9KMkxc4XoIjvBCsgwUQ20pgAxnwWI8MiqTPk9k1RFiHGVnPqZhQU8vi1B0ei6R76XoyV8rMMfsVrgUL8YRYIaAsSyFfVe0t1j4jY9BDKS9iXB0Sbut6rwMhPhGvvUn33lgOe6BMHCdQXi64pP32g7F92mgSCKrqCANNRikfIH/P8/kswjx+PrxQSVsZt9RNDGHO7M7KvPSwVIczBv7bsa+npJvi5UXUzVs6RDr1kL2a2l726ozKPrbMsQrZCgcRCgtrmxRgy8SGqjXkPQLPkn7r/tBXSVhKnMmEgSN0m6eC26XtEdauqjovdupeuP1gshEPUG0CGsRj7pOQ2q9219YHQ1Yz2fe6nSIvNAyFx8cvQZhBox0BRYUFYrVycOJsFI2dh3MVlGexwJGkhS/GjMAJcaMZGhn5AOURrpq4uKPPwraLhoFx0Pyxp2b7fWe72f+pMiVJS8A5R6sGjRpXMpfRpPNxNJmk8Da3JuN2MugKwmiXrIkPmH4jrojzdPBhJp+Kz8YBIDTxPfjgGDvepUHrafFPNsjc3YBb/go+POcKTUNGSqjhFAXMKj7dKUzopx9XYgFDXo2Xb8NA8mApQZP10qnXDEJdPIRIO6s1UkCA3CM3CaQdfeuPnTbqulPVV9+5YA5TJE5MqnTktsdqpDQo/6mPOsSwgIgfaAdFp4CrY6eaMR9FrEjMw0LIoamKnyQoHiaxf+OETe791XHuzdccMEJcFItmnTUy1MhH4a/yBVkJd1WT4TINYDQc+vhIkwemQIjVxZrPuZVuENoz+Pnmiy9HBmys6PZxQ21yOGXYx7IsaFrr+YbZEB9WrCATKwQo0ijeadmxCgFCLvfOrSj/cdQJr4qweTT4bcns2BKUp1NYbwYqlBWYEos/YcegDEiBDs0EiqMpMfHkI3lfLBZ2Zss6y8i2XP3jaGnifSIw4MQ5Ep+ijQ6QS7TI1eKw+lFyIttF4xZ8f58Zf8Oyou8rbXRYAA6EKCdIRdH5X9YW6IYh8HzTYzhqKeBkCWI9J7cNCitsB+3D3YbqzRQZhkXLuZ21aOSLwGg86JD/A4PpgkodZ7qeqYD/ZKph7QFDmH4Oaf7Ufiky9g5W3/q8PBXQC0JokaOpNF82Yyu6FmExUiqHB+OkJNf/qcvJ5hVt2/Hj5slAdj685tLFbPZsmYdCRcMxiH82oeZZWq6A8PRAac/zJg7hGwVSYOOh9jjglGr/enAAU/GVt0fgShhTdDfU6mWfszxaQfR2azKIrw5yhAxL/wc2vn0EWDlRqRhz0AeuvbTudz2VqWrjyseK5kzMZEf1y5euxsp58LcujgfYb1ZZ3pCzNZ3Tvhuz4IIOwpQOnWti0cGNqER3P/Bulrw11rQK3hjo4VhVGb+4V9vn+Z/1VV7DHcz8lP5yHBO1md+HYHiBwsBWiMGfdNNlxQjDnMhjPTAvy8vb4Ydkd1JCTUSS9diHqtQMdE/EMt6Kh761R5k7fMr+DH7RDPX5tO22sSpo+RDlL6+XQLBjZNf/Kmy8MhzlP0bavem3cEQcNXku22ne6CHnZ85UvtZ/RypuL4S0gkY1XqkUFIV99RIxURbb/AxlsY7HysqQDhwH5kQwWoAm5i+0twzjZXo9ASM/5x40bAE26hOS/Vn8o5OCemNChO6ekTq/cgaNRSVqfHZ0+fORYCxCEcWRpTLW3e1LtLAAURyz7liWfTJfwVvwVO/wMdQiA06ADVVgChTQhSatLdhPw1QhILAYuOL/b3lCG/ToZMz/THUBUUyP0Y8XIEQeMRAnHi4TTSLVmCmGpU9JT+yBCDzppSnM82y+7jK4bI1JeJ1X+haPuDAOHAYMseHXTx02LKkFK0PFrE7eJ8M5YIsd/xz/rzPHd/eqada71qcXJ9xYTq+DYItKcP8fSgZ+62XOSLzTmKF8Z+2AFgmhhAC71ygiXwYBcKhEs/Tbbs8pXi9RCavg39UQFqY9ZA1JaRrPHBuhDJQaG6B1EZMj4KWkOGbpU51l8YUNicdbKr+f5SYum3T8OP40h6cuy5BT1i09qWixCfis+mxMiyv5S6rI5HfLjV2pNf07Bm6EMFaGtN6hIz8fPAUFOgq+xeFOh0Mytt9QT9qZjmX3klQOmXPKOaIULsM66TFsbnBMhHlcdhr/tAfrLiE7n71SZZVAefgdJEWvnaqw8VTI3HzqMQZP6fA8OEH/RG/kT2YQGRLGlbWPfsGjrD0GIbZucHBez8eB8CFFzkQa/Ty4iHngNEtwdAoT9G4hU3W4faBuo5EZ+aYmEAyJQedIcRn5X+YOu0S+a0orpgyFrrP0RAnR8VIAJuMXTglYXZLPiAH6GmqT18YLbgJ5AugOw267xL82gmM7L9NvnxNSIgTu0k8uHUn7zNIST8YeyZsZ8GvUitwCOqsxz3wW3xDJQau6bgn9BZCBCt/ftCHEER1qiWVbUCjeb0XurKMippyYN8W/BBf6y6LRUol6W6DnHEfYRBAdDbd9Ye3vYCREgUFknaNFb9BErsAFh7ZMDh7svEuFfwhGm03Dw7heC12XbF0UbRq+Dws+5OlHozesjK1PgwKNCF9eemc9PnAdDZt23pF3oe7QyBhktQKlCoUfvdA1/GCBfGUA+hT7bZc+o3ey6IgSL/Ws+5A5GbEoRVS3SdwXcx7bVr0WlotD5eNk5lARCIUTVaR9BqKgnorJo+JS5VnCNGHECM71R+GEPM0aE6lMGmH/sdVT+cPOMgD6Fj+p3TxkKESoHYdjrNUJ2+3g185BehSGngo+c7rYKeKtrk6Bol2wuIbfY3+GwLBWo4lAZ1oLZGy1UErWaHvGwNESLdGOLRnrow/fwS/jCqEB0k8RkFxZdlPhabRROg220O28lPXwRNCMSQj9/4ryh14QYwrQ9PZbqUmiIky3kw3ui9EKAGNH55CUTb4RjouESARH9e50c5QoCqUAOhtqeMW1buHT64CT9cFTB5JeMff4375iQZv+XnDpD5nuk8v5M7LMUogvEChoEgkviWTWIS5i3yrsu4uc9RmGZbf2cA4nVLRGCpixFdwg8N9Ocn/LzkwMCHxqkO6aFX6sWOKmT8ejwe2ZIfq4DaMjlP3XEiam/rHM+JMVegWfkWNmsPfLxjw2FBbnbVmOs9eC/1y4sjdqmtbOGu6MBQFdtEe+ACWYEbXnmHCvw4JMgR/NB6XYA0HVsrEFINQUpRD3+2A6XH9OvATygR49DhvW4ZBD3HgyxjoJtVviUSVF2s6+8zqAxBd+elEkS9E7Q2JMfra2pM8qyr3Aq4hJTWUH5+Kj/CyvZ3/BjFqtPyWkBEhcReT4zMD+6Xvav86LhQ1ZwYB4EkLAUo4uhSoAdlDplK0N2KOPzWcXW2nWCju7z2l85ZKDzU9cHjuWDnfU0P+kJNL2nAWCTwRdAWTeCAFb5bR+wCIV341slRhICoybpkY6bDZEacwfuNH29FCGTTX9q59rf6RWOpQDYds1P9ceCcFY7dSHp+k3Zuy63bMBTNQ6czZawjZcZv+f//rI2LFgEIpt2CtkTSSXrJygZIgpSzBDdwEkdhVOuSV28lKWwsPNjWeCyayU2Z9Tidrag/js8P/NhH/ODCT48Qte1p9MPRJT5cQgljMY5mRIAJMhr9Ecp08fXLNUinpGVa6ImFStAZA40D7WEeyCuk8mtlTiDzzPk69YBXAx3U5w3XJa+8hYJrJKMnByBiqVW/e8NeT3vy8bNrUZoe7U5/bll/1jY0kVrtUUvzixmjFqgSP9/CuMDIwF0AKpHRkIaFQEwBqfxozSXIFeh+IDzMAz3eQ6jjuOd68EZeda85l3X/UowCW4xwVYWhPuipHM2DcWQlACWQyI3OuSW8GENIEfrjvcTfgR9krzehBwtDJjB6ucQRi4fPUYGEH2xE3+b8eH3cdepZFWfoGIynrt6PU4G+MNEsuSpykqIRcn/iYB7ZqbuWrTNFzgtwrBRWsuCPnhqgoVA1rMRUavgYs9ZN/dVpJj4CE5OJihaEGHJ0ynXFT48Q+XNdMF1jIdzXrEDz5NBIeQEEQGS0KgjH3aIgFSKbHXpyIAp0jCA97Ho/ZPH93s3+HOBT0lfpBJ/+9Ms6ZWgMNaCM7tdyGSBzASYnzBACG+5m4LMrP17VrzJSDBUkqwZF60X+TV8QxF+LvjvnVeeFcF+Ibxl+RZv5MTEytRmWifFlQuR0jHuOge7hKOjxKKo4vImAfPBVfFhCCn56xwU9zk1dOk5ANWEP7URMCnQghTfcRHww0xphwz+2Yvzg01R/wsivY6nKD8v3QYWsNMYuXqlN7Dg+4XdxtTJ/DlpIg1UadCKa1TAbn437EyB2oqJACtu0L79EQBGfy/PY6i7TV54LBeqX2VGZRE+mpsTDdADLysAHfrzG57u0lUnHh87JaUbU84prtYu/IbO1J+NJC/wbRPlJ1vEzhgQ/h+/DsdUwnnCoMRBjLvF1Ptg/TH/AyOFh7TSpTSYqbHBvJOjGrR52kGzrgh7uVqQmlU0aYPOuCS6YN+HnbG8Y8uP6EyUoiAJB1F5tq/mLi7V6ptVCMKiVTn5IjB7QpGZ6IWyc+5JZtThUgXzBAwHysBv9mdYxtJo3A4BOPr8liU+jQXXcPlYBM8jwjkEOLTFuH+MDP/CS5Ijvsv4z/tmkQtFmiLcLQxsEXchQQxGBEMLjlUZ/tqQ/rKciQeqNPFnMQBEtMgV6EBSX3pn9Kbsu0qb3cmB/2LndH+9T4CF4/miusI639CtS0PO54a2wxE9qAxVjNAKuswo8zCGB0CsJQpqXs9M801XuOfyhfwYmJHpAkIQ/p+bo/TjD5EMAkk/mh6BKrK0xOPj4+2kAghTBFDi9dSZCiJ3bCedtPEtEp418wOZzfADhz+OlBf1Z8lN7wScU+KkMsdG12mCxvomDTPO6B5SlXCfnB+NL7Tcucc8DjqEL8gqK7VSVxdTDkn4IgYblGJL4QzlG0RcgGs3hzv34q/gsRlw0upSw67AZBfqP+Cg9GDjte08KnXi1G0VboYMENcUnydArekAoM+SDBBgq4Y8BzPzzaDLNfNRk00Ffw3cOascxnjHQwaPrvBIfOUjoo1fwcRvXr1WyIe7rxdq0Kk9NZ65/0Oev6P/ZLqRokQv8GBm79NGGH6iKBjy4sXMSgLAboJZpIJ0T0/8LFOEHy0P7wk8825eHbEwP2vC2K9C4kwOtuzF88vni2JY0/YMC5eCZskp2zgkxXPFdr+cL57/v/2uiPvbyixGF+/L+ik/lBylM2gguUrgv8kBYKpRK5se8NgAxm4L74sFTLT84MZWOJx8hUn5UVYHuQ7DiPPqUeigNEp/Bh4YVbnG/Tp+xcaNgNLp1ihwCMVIXnP4HPiI/ojyqPo4P/CBQmR96qxGNeYzvxFCkB6IAqLMaTFcfPueq18nFzI/2YFPau50MRUbQ/W4KdDx9mEKl8hPzDalb4iEE1eeiRHxgqA2gs7/KvBTtKbEPcfPH5Oxl6KXcuO9SfLQPfqxlbbh7lNZ/oUV8CwTBTXJlHThWbs1zYHicoj/ZhdTESYFwX1WAIEiL7gdMy/LHXRTIompi66uzPaWz7Ct1WgpCq9GXyXBM9iEOWitQwedzUx7sjrYoIIy+vLHvSooTZuGPQRVVaW07GSK5vKlA7APEfUHPwzbnx34pJR+z5weM1H3ZVSixEZkGyucojJ2oxkxK3NAfAC2Xi1+jZm1wKaGP4dOzkkOfLXCj5X+O1rkrPgbHw9AfbeO+nCy4U36s+4NpAhbWsg5JJQI0eMXEhNM8zNrlLRT52gbuC4iG88PCyrjVUz1OVyQ30yCdCjoeXswmEoctpRI+h4WLlHqIEOmFZpWfxoORXykFGy1O85UVLrl8hMyO9ugNaTFYJv8lbfRHmvC0ZfDe50fMRQgpiqp0W1g839r+c5QdgW9O/AwJUlF+WOFlKjgEQapAIiG+P0fX5YflRJ8nbxxfJjtcSX42Suxe9582M8/NRp0KzugzDPWK/oDQ53KDcVi4Bz8UiXlwZcqYfw1Co1ARZf+3RZK5UOlDIL8TDxH+mAK5OBlAeREa+TnxGeS6hkg6KJDHQH5m0KEuTNTnLqSZ6pTraNINrzYrgw73Lnoeq01cBD5+wX8tbQ81pcXu1t7FDAKKQPMHvTkdlbXtxylUqNQH8gM7JKrFUtfC/MKdBo+AsQh6YGFtDPnJf68uDGEodh9TDOyr8bbwrgokWfXoz7NwQYcIddJwvdtw0evPYmP7VkZic9H227aDi14p8kJ9EkFAZb9enNuPcwd5L/nZO372tDpbAdpW+w/9Iui4C9siPx4/EusgP8REKAMAaTvs41J6xj+SoHgfApDHQIPwR2qkHuaz9u2dYyEIavCZOboAaWxSup2AlHf1Z6dq0CA7qA9xM5PP0q22i/HZjsEPqtTiU90X435PRAvOrFtBrhq0TfRILfKzuaE/I8eXLHDGsbwRwHN7v/wkF5+J/tJzhPzIjfTEbqHHly8gxXAJTCk6L1cvKjRUSpa81GqOxtoIlMEG0ZFbZEDpcYMfBcMpsy/asT+YT97wHChMOtM8N4ZwZYJyNMgWuGT8Z1oQnflBa6L84NeIbH3trM5GW+U4bFXMFUj4OZAcalpFauph83XH6csjfmrGPCtedMCOlCQ7a4b2GvjsO283wGDmR2vWDRgGk7dBD8WKVnnWl+EDQmk5hFCaTYp5e1s57nGDXblc8bPLbTM46ggXJfDZaO9gWZSFMeaBTIGeOIWgBx0Ko6+at2qfpLmfds00WGgiPbCD9EDPWnmq7ngzGsEP5qMvpAjKCj+lG1No02SlMyfEGUJpKmqfRmVpU0W1QUoa/8EFH9MfFjakNy23EtkSTZ/mqsKkDvNAAtDjLru+ygS0CFEJfshUpbs+G+XlZveOIvDJEQ/0rLwWulORqfxgsED/3vNzdklvbwz+gmY5Que6hvk3Ehr3MHHT2CCliCdwlrlFV6CbD+kzm8zIXExHOwwW0SgpxwgKxK4dK1QuHhJH9FPnfXp0Xo1Jt8hOTb6CnrUChVHWZ/g07ouORn4WBGn5CcskTCcJOXIL80LMnVoF63d06IQO8kMmye4TizVEGAQhpA+lQJqTxbzyJW7NAPJuAYw8NMen7jSNeUCUfvKnPVeMgReW6FkbwauXBh4UZM1PJqV+85of9nv5SA+M4EdrKXE2LhpHhkZ+yotdWd1IU4ub9cNkjKrn5TLcClE0b49u7HyOv58AfefTxrjPkIAMnsxevf7ATSc/WCM877ku6EF7PpYf0KjhD/lflZ+1GTyE7CE5VtjPAIVSNGj4hlYgEkrg5zSVH+WnIIl7sZhKO5IXS37sLuOw+3CAoIYvY/FrQhRgEj4L/Sn7TMflmPRj37UD0Vp5sD9rflpHRS+qtKbIpYcbe4P+FIAcrgaiZkP0FuiCns3dFzlTMISjMrpQpLA7I50IZSGQA0SgFNwdbMaHW4QP4vir05/MDrZ1oTNDsDc9F2L+QfCMnR/8wo+10J8En8DDZ50x1w0/cwLbT/VgmR8K4Q/oxN30SgqG/GzpR4XNGmaNAhkbMcHnBAjVcSUiAFJDfTBg6jKewWi9TWdLIrRGRwx65PaZ/PzqS1kAnx/H59c+/gEF64afkIwhl0tiowJ5crXlFm3MEQEQInRFUJafJE4PiwOzKRdm5seNzT5M7vmVicH4TNNvUyAj6EiMpQgZZGriT5v1AzRt9FPlZ7kJcI8C9A47pIvCjhNE9Izc0FR+DBN6TZUCQQ1GAolaTq72XEcy9e0a9+7HJPC6oxX9wbm5Nnv0HNOFBJ/LbGnriPIxL4f5JbqwI4nTyLPN4cfW1NV+0R03BkO66NXus9DqmwP2JT38QuFCX78g80QDufGmdp2qwBclfuATjlA84GHiiJV892ek7ksHRvJK4SectIeBD/KzqbFVtsuWHkWBfJTFFLPUju+oQIiPsQU/yE4OhNod7+zXWSeLJflZk5McV2dQY1chQLHxm16kX+o2FS1VM9IutBevJp/EXJ4aFKVAnXh8cmgqQHWCCMtDi/DfBT9halrBSiN6KzFbsSZ11Gdts8ddikICQOHY5yPww4VGyZyvBjwriJiWeHPSEN3Z3nFbnCqmjLiMSDH58Sb8eIdKT+wNWAlJaYsgNycHgsK4Xop7MAiq8MTt0fuUPd3wY2flIT+eaC82zh0PKVs6LXA6BeSnCiYeAQHQ9zEuD/4Jm0yT++pTf2ra4eBK8Jwc+2rcta8G7GDDe1YIIQB61JwfWkF/jJHUCz1y0zcJ8QhRwQd+Qn6s8BNmiKo5PcoIGlf4MYScH36AqI/JD8kTuAEEKA2742SzL3wFgCYBmr6LqryXsz/Ez+tzVQHJ48QVPtvKdwENTfZ+KjW4LsJnB4s8aPTHLOhPzid0lRJDgep8E+6LmFoBstbZgdVYKG4I2go+PPeX6Gc3BTrxGeBTBaiohm8QPC9FgZhMxP1xQ4i0EhM3qnGgTTPvg/4sjn6CnvUKFxoAO97jXICBWOUnDO7Bp/KzA5G9d2+JETNd8gNDzhqrHFtjKtTxPy7KTxnWhxwF7TV6QroH6xpVgbwi8sN4/p4A8kkgIvCawNoMv75Xk4ejCX5SeSlAELQImvMGGXdfv8F5EcpYldaj+bDEj/T8wg+WFIhaDNThJ+Su6YENJFwv93bc4qGxYSG6TksbNq5ALNZzkND1IYowQEgdM36SAjGbiNzAED+U0qy7l2Mysf5gH7mskny09IbzcILQBWZ/rAgoSoyhYS3DJPNj/fBTLO/M4R/mHAX3hQiZAOHDeoBEUIxSdv5srfyQDFWThXBvDGHKiSuRhrCaCkAxdbE+ohJyqvr0y6fQU/brXM2LLaxVH2jxKq7EmugPBWK87S2aaoWqpfFNYAs/12GRj8HWCuSQPl8uHFV+6HKGbuQKzfzE06++GwWyis8maqADQCAEOGZs56lL71CUR1/FRjt0X046ozzLBDEpVAg0+S0aPFKHmJOfXzWhCxLo/V3zQ8hNmUGpAOXFshU/CN6872ny4SnVw8oty0+co0SArAARFY49vAToUrbyQgalW/uCGe7dji9d61utWcBQL0AUayBFhMm/+mbABTBGCm2fXqTXv2nNT3WYP/CTbJKlc2Vs7wFiT/Q+jb5nN14GZBoHZXziupEgVDios4qeL/bdAETQQ4vKW+6riZ197SLGPq33Ypn9jRwNXBjYIPXCgPsgryXFiaSw0yfww1yR8bXSnzSdTX8DkCtQzspvTkFj6WvCJwdEZJpFfkh1dZQ4SQhmkqqwKgZAf1X1Iehp8emf0ZRlpy58Efr0A/edmpaKDMKTKxRCGPRHiIAfgAlKY4VeuvWrsQISkRTrHo1fw4OZsW+x5SeeAuuPY4CfJD8E1eBDopm8pCX8YLAUx9+qQN+XACFUtTnm0lkOnam166aLXJ/VoH1WmuS4mEFGdwIwnf7Aj3T+y9kZbbdOxFCUB566oF2kqw8mH8H//x1G0mGP5lhxQHbsOA0Frvc9kkaa8cHnvvwL2Tf4iB/KJfxAvq2X/ltehmxMAKE/PNpFo0LggxU+tAWR1Img1hw0K9C/j3I2BRqfcaEPbPLOkHs1hqQ/Y8/Pm7NzRoZaJXyTni/uWvDjrojLQCVYeeSlLD47zk8f6A/M9HycsBxfCT9tGHPL7a3WMTBka3tKf/T8hZkfFuekqhFbIBQC9FKBQIEUbFIgXz288BsTsBJH0BnsP7SrTuTASxccKRBCkK8GzyBAIiVY6fpzIEHb5GfcV7yXGPFrGSxAfiCI5H5ssnY/RgS/DAw19+XRj63xFiaCAh8mszYJMgXSOQaBRgXibVek1w4M+eFo1uumswCxDSZ+PPmK/fOr5eBmutEhOIf4KQlCU9J/Haf+nIfiqoVBNiQofDDwQXMET5zwYDb3wyCiaXH5DPftS5cLKm4If75NhJYIesrCujOS/VIACZ1BiTz/whAgC3t8xte6zZk7jYaT2wIeNiFz8qM3Az9xx8s5FTFByiF+cF+xpV9zAyS9Jn7k11yBrGQ/AKSOD58OTVLfng0MPhirPywEpQKpvIF4+DpQxokpkKf+PnXZ/dfQ+uOxzxv4MHZ4Hzh7zCNLfzLrD9HxkffykNKsoMQn53aC5fzsBS183s4PUTUUCaIEiKu4NtPfKo0gdP3p/FBBvuRnUffih/4OBScIiDsjY8gUyBc/nJcdA5824mPc2NqqY8md8AczAUrV9uGeVB/So5Wfx7nntqhLaE7pj4MSP34kRXw+goRXhB9hFdYZWse/t0brK4RoGUKAiKrhp3VCXUxiXf1XHjKKpsAKDKMCfYwKxLln8uAzOjCfOjjXTmd8hrTL+v12+SHoqYtzzxsKPmnQATGBUgU68KMPH/r8zp4ViCereD2A6vlZ8EM7SZ4IX2yGNO1D8ENSL/mhT8jxoZMTBVIEjfV8/FKB9iAapwVE9EHftG4wdhiHIfyxVeWHsefZdwme1nzTrU+dycxc6IT8BAqFTCpSXCQsLQKKD0q0+PyVKV7qWZs5UeGTO41KpUEEMBtATA664MfbzL7MeYUVOOe+ejGjp+VNGD9qAHHpkRPyE6fhgQW+5kZs4IMC3U0yHYumfc6D+CHryp20WrdU8PxzAT9lwU+whNAs33jk601+Esp0hzZWgAbhwHo/QFyTW5qxwJ6NKpKOxWGQn6+FomTHlqMiDrIeHuMCgDxYRqXuk/ePad2ay/Xlscl9mXVopqSrIFqz6xoDZCPl+scU2hQpj87P47Tj3P6RoTfxUcKP+1Im59ZDIIYWbZarzS7r66LDD+1sQ5s08CBA3uMhfDhg4BFvTYEwQLstnzb5yTf+YC/Lv+Z+1dm2qBmGFDWDD6HHiQWqIEQCHiHzTErO6zUASnriB/q8DyLr1VxiQAmLDBU8BoSWIcbY8GCGEZUyknrjJxtqkXzwoTCmS4r0bv9ZgXzdHwufdRqXXG3Q8KbzczN0OOnPlHUlPcujBqgyxE0NcohmuNtBRkAQrJTQxM5ncaiSFvk39OiQIpZxOZwSFcFPN3mw1sOP3roAkcPzYAb4SYTEj8kP7GiX/jg8TYcmBfoYFAi+TIDGZX/erF7MNtGTB4OHhKsJ0Gp17wqd4yAACnoEUF4EPwiNmAoTVtxnfZDHBC6YLNdoQRE+1AGqX4QH22ZMlzGrrC1wbgt78Kzf/kwph+iV/uTmZXSZK1D/Jqhpc6PpeZr0zgP+b+iRoDo8jPt0fphH3t1WXSAzCmslQCCDAwsDj+BBCAV2ANO9WcNHEVMP1CVAh1JBB0ihdW+jFUGytpxe8JME7fzwiF+pT0OoPvot9po3dkkQIGANkUmBpFCev3v5VMTcC9CYunvw7AzZkI8FPt6kE8Es7KzCkHBUbKNgGYDiM+zID+Hl0HtxdQi2DIKebRg7GCSKj70BRNU+LvkfRX7XeYjioIByfsKa89rcoT4WP240fN0o0EcBBCvj5B0zz9x1ofYxX+PZyZlHni3xEj8ID/gwJtyHcQh+xMuzHNijknOC5SfF8mSqpCnubwY6sZ3v842IU7CduMFPokNmBjp1pg0JD7YYHmyptzJhUoIU/BBP710e/GmaxT3TZgY1two06M+wdC8KZLX36SkXg/+SMx/wiaMn7uhPX/HCs2rS94MYOfAoD6YLcRImheJbT7HD20WUVndXmZyi8GJIGCNEYojya2G6orPE09Rbe05fAmT8tCYzOBy6hC4VSOeOjcXKAZB/BekiJB+KF178wlrrxoiQ09Nndn3t1dJPtsky8ZL+ZNKeP8hbK34OHJWEID7D+FwExaaBnORHyKkHMSMi/gsqFaxCGQfqHD7jQ36sL9Gw5fTBz+UTOL3RpSEURfh7CcrdFIgtAdJXhod2T/4rX0Pxfc3eZ3oyGZjGDevU1GcJgCxuxgigT0uGLL5prNDvKlHiW2UhPCccutt5dbRwSfKjKKvFQHFgkwBhAMTfmLrzmwdTvSajadIxmU0vAB9v83B04gUjrkAAhQujyqHjCqEJ0Pu9h+mTnZ6b6RbLsLzKFV853gwzrkEk6khAYKQBmxYcLxeyTYDyo4RHEJ2v85PQGr5NGKW8jh9lel9ClCSRFDaAXIHSkZkAiad1VZgFn/YLvDiyRa6SIDN80CsF+oUCqy8lPj+wm3+7dqudsmG3a8n7xEDvUiUCunZkGfPEJgvnYgLknJgAxadxrPOT9+gPYZTo0X8DW7s+njSSkJN1I/7T+MG2ZmdmY8bPxW+AIu8SUkQyyVDarEBtfNrWHxvrXyCj3Os/jh6OZS9tOoX6gA5Jl5tkZkHjcXBzN83hogpWhQQmqmKLPcnJV/uyCRg/ySPbkQQlQGRl+gthxnyOXYCIpluJ1XWMXN70B4gMIe2xjQpU5HjjEL/D4meNGzaMe/vY69rXlHn5tGQZaftLfBTnHNrTgp5Nc1Z3RvMqxg+SGMFzXH7ZAygF0cN2KNxXbC0sZIiHqm5Fgbz3uioMIyINHx1BaHhqy+zEkJUbBeJ7ryNoe2TeBwmXDx9ihtDc70wqS53960Z9mMZX4OzhyWmjACUdJkBJS7zAZhYgkHQV0msrrAhHZp25CLFgrAuQfHgrkDVDzTs+rQKOAhk9CNCsQMTONvtrLl98/M/iF49CMXjw02Tunzq22VhuFBbWOGf0L0e/KEw6AT8PoRMvncIMtomfp9iJU0oSQ0YhaDTNws/gwf5YBxUvSvRf6ecHiuCnm0Ayg54bBUKhtMd2371x/6Amw2cuXdAi1rwXtXbsD4OHHeeFGT/FClfqSvz5xx65PQ7wwaRDDSDRNxkI6ZguSyl+REQ9v+z8oEBxXQDp+1FhZUjI6Inj6L1QICAaK2OuQFMF7OaZuZyH+ilmDA3q04LoLfIZ5Ad8KES4HYHPJUAnLQf2CHiCHn7Q4Glfjq/qX+D8uB1iqAQoRqfVG0lemSjZ8noxpIEH6+m8HmsPQ1s0Zfz4OLCBQyofNiqQzwCzISCZr9rr44fC6L1FomCHDXq8U8M9F8Xygzj5Ipnig/A/EpsDy4/iJQEaLTFL5HaHNvgyBhhphnwcTBaBIBDSXOngJBBaBIhoWut0QhDWmswmL8YTST2Z13GIgfBgHgDN899xne9Gz19kYHczvcDnnw1xH/BRWfM8XwvQQYYu3xSY5EUXIMB4zU98OazagN6zQ0Xa6iyp/WjuuclQ8BNBtngyAQrTH1XrU1CT2c3Dn7maIyGzgKUUCLom98X0i7n8Je81IDRFzzrZughsDs9lk9dzEKBMunXP4cc8GPqTP3jMAC3BUouesFGLMgTSiDn92CDE/7gASphIyazCuv+juUt+fsdBGD6ZFCFCQ2dHlyAx9WsF0TDl7ssFyAx8qL6PbauuP/sIIv0acDPTUz06faTQYuSuOaUyuwDhwtQkFl8WSQYbvy+uQOjODvLFQ70lliS0eYnhwVCgXYD63zYQosfsqt/YbY6irxUoAPLwejNxaez6w74Geu6aVkm9mG1RDt0EyBa5OAqhIQKq+Dfur9AQK4/mlFbD3yxZnT5LYOo3wpO2NwBCgOgVaAi12W3dg/U1GWzp4PZc1krQhofWkU+bBI1VsS5BBZBnYEYROnc58VTHefzQBchnCrboWfoz+S9CHxXTLwFCMlYPVhtoOD8lEGCkTQDC4OMBP29h9CReO+JyMASor5LXoul83zTIlvEoeiCICtSHKZB5MYmQ97jKhbX617z0IUYAba0/40qrY819Sd4/CX8GfGhmj8K4jv/sxk9wsPmcfv8hwwBSUw8nh01AEjyxDRBV3l9tH4GPA0RGBUBhLOqxL/IKQ7mDT5cgj4KsN8it4AAVXRADkYMN9s4zU/L0fu1UFBVI0DMNPBMwBzq1xX6YAClIhp/YF4CKDPgBC8BBiOCof7ELEO8NoVZb0ftwaANCn+7BYqdErwAaBdIhvZcT1CIi42jK5vFgcww0zAHDOWJt3cxh6Bl0aFw1duaqKQY9vDnioM2KU9y/NUXXDW+OSnvnJw16OG+wdUESRDcMbQPjpahuHgJlRtYLZFvwhPy4DbFzq21OqfysQPdPP20TeLwB0SfvOEO3M03FDno86Q/BMwy1YsIPBBVA3WlxARv66Pvn+1sA7RjBJ+bwoUMG0VA6Iym4UKDHCJBmkvEPwE+TH/NiLQ5yjFAgD6NdgWwK6pS+70UwECIFM4SG0oWP/XzmUQrskU+PnCt1L3IYatYtjA1+rgFaCfn5DvvJzZ1OOwdo+dqBAiMTow5Qc2hhzhCLexBSJzYKhi6fSTbIz5SMdXSkQj4kzcZJWdg0BcPWnnfDsb5b/JqXp6ud1N3HfYh+si+ZRsE9F5IAmeZwsVjQ8FP8gFbs4KPv1te+9Qudnp9XEVEXoAMFMoSqBVZ5uQLqxYN5/u/y057hy43TyaPpKZTeJ4eRhb2egBonx0jo3A8/u/70+To0/EymP13yrgqcn0ft+C0g0oybHxn6cULQBCgkKI9zBs6XQQ08zQYRorQbZhPvn32CNgJUABFNKxjydV5vFAhwCEfkZqRA7sMGBbIA2iMgi38g6H7V57lzlewrTdozOjDoQXjizGgwO8k4tzjeByddgX7KfeXpMdvm7cTPeTkjpF2yuCWMrPYiGbIZtkrpAUgV+jgt9DB5dVAgYYTl7ZTB0DRhY6m+hwJRQx2fnFsnkLXm1dF/Xdre9LMtrjE1G6I9z8ZOGv6COmdL0XW/v8tTdSa0n4cKwyVpGF+WYHFdCC0gXSdnlRmu/IggZQe4suw3kwIB0Kei6VWykJ8bDWqhtHswOTFjx+f6oECMQI/P7v74P/2HHkCz+WR3x4fYgKrXmnnR8KVbtN68NWuSYPxzDnMB0g47LaHTCdYAaJGvZow/AdEG0AE/+LKyIyZzHPpzIQRSgXWr69j6wANDnZ96R5ZkEmSlVUai76YQYh4Ahd1OvZjTr8IHAXpVsoiIp2b0FTmfa5uX3EWcTYDq3oqVvIAP8EkqAgyYUaeZfbl7NGHUpMhYUvGsdQswbxoJyoWHKJVJgAiG9gDoanngu3R+7g4CIdcg7VKgKX8njNbwId4MjIelN25Hf2Bokh8c2EHFS43tYoeRws3M5yRAJUFiQqrEjtvhO3xgWoX+5DvR6vjkRu9RAVRTPjwTO3qt/smMVpHEWPy4SLnzY+CwrBwiMaZirkCrCzPb0dzzQLIvt5fhDx3Pho8hdORL4MTBO0wxFCj4WaNj3A8D1nHH2aVjEAmd3dv9QCQU8RaKmlsl4KffrYYjsi2Ocs0jY6CuQPiy7sDQ+Ls4qG+6s9IJhhLj5BokhqiFjRXUME7NKH8NCHnvoc/5gh8fdUaBMmdPlcdzveInCEGA8Fo/4gdCAiCMoBfVYUtc0CqI1BmcRBlG/xBDnctwqLJLVYurD4CcPseEAGiNnKDnfS/GzSQX63HQFAYxEo32OEP2AO/32w+nmYNdf6bKV2+UfzLoHPgkQhiJOvgsyXjd3uAnAYgL9AVJOW1PnHpGLhrRF6HD7xA6bF0WxTspGfPNnoc89mm1eCMAmQItgTdNDf9BhHLHPBXzqiphtGKguYdszr6A6I3wGXrYZL7GRgsMQ3d63au5LxMgVRkACEmQAMWBQRoEiBDYTSzpi6IQn8VeJ5QoISIwWxWoWiZF0KfWmmExrLZoHr5sf5r9F9s9QYsEyYvV6b5Fmi0AAqzO0fQEDF997E0BssHnEJ+hW56nAqxJO7kX1kcKiUh0qxi2yQsclbD4bvYY8EmDtfoqpEAQ+uOejP/cpVinKdPkY+HBUoHa8vpPxoPWJ55pIY//EAdRwRzmOudx7i4jC4OcIf6ZOhBvun9GAVrDH28a6yMh2si9VlOBCny2Qb4lw9L9J1KGCQxa1jf2ZQkQLm13X+iQrlvx1Zr6n6QICUcV4hRDs1axA9Tm0r+JUBI0Gs0dxtClAs0QGTxefHebl3oudihcXJdOY7xQ6Zf+YDejT/BHUqBT3iuCHiLesgsm/uQHs+2sfcPOX4v76pEQB9o/rCm75PUzD0xR4gExqUD2VCk5sHGV6UGCPBBqamESZAj1IBrbep95C0L/1X2Z/nzN002pCeUm95XRD8Zy4IGJhmAY88kNHcDBtcC26Dm3CaBJrQyob2FEMoYKefHVJp99BkXCQ01s9afBBLLKxgDIV8XDXhEERPRIS3rqTGHV4+iohfFpN+tfvVjDbgboPnjGgWGAg+9aql7dWs8psQaAZE8r3qVHMJjE52/OzmXJdSqGoowpYMAEbio3Jl3M3VR1U/z/l2HrkXWk7dM2yM6DTkhzbxZb0pGOvPrDqQDxVujbThCy1wG5RNKGRE3JMNIxO6oC+RajmQBhOLLRLtY0NBSajO5Agc6GSEGkXPb9/8Q/0jOvDNGySsOhpF3QY98I4BDDGj+VmbkHW2+hQvgbM1qEYC3fygemeg1SsxpnPTmjHS0BEoReetsmVcewvCzRfxsAAh1m2l1cEOpOTGACn6pCANRMd4AhbezdwX2pzbbuMOywtK5iTNjgUt1lPNhAT+3Q0cU7z5AIetCLDtCIxAoAPEFCkp/bdvKJaBIwAXIrspEWlpbapkKlQTfqq1Q1tte4rh0AYSzXnioQMtSw4XG+2XCuQPs5SBh2jtBx+cvP+OPRuyHpFzsuKHsdBz8ckZz3BT3XHwVIBciRSCiIX/RIzOLdfCAchcHNOiCU/LCwmTra8QGgnRDGO75mepQra3b/BT+XF6W7EcPkATq0uM4USD5OdvBM8OnoJDlxUvyayw9dYwTPEvrYrXfzcFIQVQ92C2ISAIcn72Do4ChvRm9ut2Wz4SdYQ3qEfaz2ghAYleGdOTx4p4WZ09HuCkCAdGBzfESERIq+UiC1cR1JQSKIVjtpPiR41uutl+gnGw7Bp8tP2ejXFvFQoGMBWtbP9/c/3j8/FmfCkVj3u4n4NH6SNefv8bF92v39c73ZZ4UMYRBDuoggDSIEQ8WDMdHcQ6AyezGaOlSD4sllCdJwRZs7tKgqAKVcFQRH+bmev7P1i22nrXND86/s3Ngs4JHYB3Dsee8GSxsKD6RMnm193v9we/94qZGfpFIYPDk/Zu7BjMaP9/i0++eSv4uQCBtdqmweMiiKDB2PV/NZxY5YXjIhCkHVxIlN21xhSDb5oCHOhpgp0MU9GDr/WU3kRxIw9p0qPXZjuw4Lz5PUCwGCn77M4/jYkdHO+vkH9rkTgUHMscW7VmPObCmftuwvJTur3W5FEEuEBTwIUe1v4ioMw0wGJlDDj501F3O7ns2Dz6yyqi5MFCjEaraFGXqu6g/Vd3FfatRMS6+zhM6TFmWztdbUWeJxDxTfOPbhTKzORlEMeZasGXTxgR/+MfDouRxB0rC41Dqv0VAcMggZPtGv2AToVy5kRbu0HZP1oDMNQhqK42oJmUA0i4Hqv6YdHFfjn9nMMTsny4fSc4ihOQUhMvUCEjk6y3wWuNg3jr0/HIlLCuTyM6jVbXX/BY+vIH27IyICZzMiIAxVRYBiBwcAWQjE4HLjiL/MqkFccuxSaRV5KNozhSdYKQDpJnie0cBxnr/rzKjqvrTwxbCNif4gPh0fil1p8MPCjbG1Pzz4xpGgFKGKi6KEr1v9tRQgeFwiTspI+sZ/TdJNPxLc+M2P0jDkdQ0WpbNHyN6UCsRkMiwmKl5bUdShC4rRoQAdrQNJ9Uv81/X+DRk6hvyI/pj/iuIFDFWCFB8ESAEa0+78/tOBff/te37lEgLN7IYFbEvgeP/999+Cx4jJI/4xKoF5KLUYPwWhMsuBQXuWi/YrfOSlOKLfnjU18LnWHsR+MShKA4PpJaFSgTAB5+IEF2GHg9qXzHBjwqof7PcarAvPtxEf+ikk5oh1P1LuXRfuwc/377/FV/7cBUUAMh8kAC23tcD2vAc/mwVKD5e8zWp5v8ua7JhHgbaz7ODAg0U0/brEOJdI7HPKqc5fIcjRkdKY1ufFFCAKsd0S0MsFeC2fHurPZjQ868pzdV5lAkfxDJnz2F34NRZtXEAygv7t+28bQfiwHY0l3uUnHOVp/NzsbrX3EkL/vlug+WlvCoiAuTvGdFEwNP4PAl2xqMg8an8Ccn2aB/jQG9TtfN984KQTO2AoY6BKUBtAth+XRrgccpOxHLm7+q4iP5OVZ9DB/O+9lDPz+8dThBSEAm2PowAlQJ+LU7F49DuXIMcsMIocHgFKJ3Z/xi91dgnsb9K1VgiqE9FyIf2bW5/JwFIiALn8NAmaVDWm3WXT/sRZYbUB5JxpI+JA0fX4h/An9Ed6n6EnGzea/PThGOBDz3utRXnQ86Iq86smQDs/2y3zsMAiwRGO7HR88s7XoN8ToHuXIMAF70Aqe5XgJxDCWrtZumsXIGKm4+mKLZA+EqKz/jI3LbD2oS+iQLIH7FoL2WT0YTyU9Evcl2Zfgo/QwzZRAFrzW/K82Q5PmPBgK/qzx0Dpw3YoloTCDr3bbssSMdBy5MEg6FnwcX6o9ZPWg0mIEErb+s3y5TLWLFL5yg5xEHaxw8zZEW6kLK8KhPxM4x/gPGsACtjr+g/6o6vPOeT5aOm5JrdFfrRFsBapSJty1bhEQIFQSsZiUBR6eBqP9ia7GWx4sN9MgPY7JAh++M9gYVq3O1cR6g2LMtRjvPKiGuhwXKmL0WffoiD80ZcxUI2ZtIIxVaDD/Rey/tMs8El4DrIv2MGK+PQQaIUgj6DDUoA+UoACH3yYMWGc2I2KKWmc0ePHajzgwYwekaAMxuLN2jOL+mT/NgBlu1DZxlqvCIQC6WRXLYxdXk+EnAyCZfLdXIHm+Zfm76o/Wn1Hf1r+VZN3si9Kp1L3Ap8yQmHMv2qjBQCpABlCJPImK4FK3pKe/AcDaN3PhO32/IMQyGyUIFk7is8CIN01PzQXsDX7NaEYgDDmu9ZcTDQozvOihlQ0WmXiRIF4O77wZITdvICh+gNCxM6M2xjooUJUjS3Hba054SmuI00FaD9eediH8bMZCPk54rRg4e6Wj/BgZmMc/Xa7ATH1V5bEDxAimKaHNv8KWBNq+Hh1teEzu2jY9fagLyYodoQACNqwSxcx+KL9mZ3LCg9L0Ielr4SHKBq5txvdEfiZbOrhu/NFQhUgo2iz8GFBUCCDkcY1gHZ7ZAh0t6NIkOqPVdFedTAMNXVQxnlVqbv+htjCfaZAUhhLeASi2dwOf+iGezpWIA1/Jk2Ip/rT5Oc4/aL4Rd+zFk514Rl2Rn5osbC7sm4THmwJAXJ24giAnsaEqk5YCtC63R52b68Ny9A9ClrBp9b6aU8TH5b4UPOIP34b6tEBYhyMrgdhl3eLcRR2eFAFUgFiDCKSdhI/awIWxsW+oAcXRu+qZO9QROyM8wKgrDjR6wU/hlAXoFcIRCKPAM1seWzHdiJASybx6A8SZL8zIm6stigWY4YZWxKTH7cA6EiBJjKkfdLXK/MT/aE1CAX6SXaBzRRIbb570MVnUrsIdLJzo8U/2vPcMy/MsAl41tKT4d9fVigWIqBMwvYjF6MfZwCZ9rj8PFyu8GDozyBB6B8iVMYwHAxTLOtaoJIvEU3LhGAQmmvQ6ZZV4miUo8+Ul0z+BxSIeLuNYb1WwNDhh2y/mIxPyG3Lx8UvBIjUCw0q5XYcz4oHM/0JBbKAxczIIY8nCDoD6MHh7yWJR4GQoIB3P9cofmA69wWO6J9tq0JDlyIQxWwOHVDuNsKT4el/9mI0SSce2E8/FAWaBdDTFF5MLnp6nHwxLsrlB2vJl0bPGKuHyE8ToF05fBHnLfipCpQS9LaMsMRpt/jJ42Ho2J3Dlp9o1AARa0GBkL+5AgRB4sSk4Yx5j92DsefHbyJBdmAOz8X1RG0ts5NETBQI/bk+hb6Bow2I85nPBD94r9L2YyfhT8GHKjwdyj3Q8C9wFQEqMRCL0c4M33jegoOkx0EyAfqQHEwkyH7/9kT58XsdRwQ+ClDIcHj0sucHEcKO+qSvbXlOeL5sLysKxCvBTeXHobyQgNVLX3xZf9/OSN9VgFR+lJ5XkzPsrKY6CNBLgW4I0ESBPr2gCkX+kEpk8DzWnZ7VFciQlBwMCTJRS/oo1OpmnyZD4yaOuqyYe+qDqbLnh3OE51qbtIqQ7tGAnTi7ApUMTCdxXOhgLfyE4YmPWue1+kXwI0vPQMR29bpOFwxVD2Z2Q4DI4e00CaL6ADiULfJTHmaL3xtTT0KgONMIzP1jsntINg0RUws/zBpOwlKLWC4KgGIclSI0CYMua5DSA0VZPP3ZFGh8jSYgxpBdDICGBqBftABfZrZwnQupfUnyRX4CP0kQ0pN+J0vqvnBzSwG6HysQiTx6YcaDO7A082QliUd+RIJYdQx6MPbM56GzhxyScZ4wIOHCfMA9ybxGQtjluirdrVTFKklFgaAL0BCwswUgjYF+uVBBzZljRX5oDgahAo/wg62uH1lQL4vGIkChQPackCUsFSjxgZ/VGZJlaBhqEuSls6zq06RGrJMICT+pM6lHKFCb8JojJJWhXIEbO8wuLkjrdlUUhov0ZgzEz+BGYqCTDL7PX7VD6xdc53QePvfCezUW2ipA5OzGUAHo7Q4/XYG+RyIPMGqPYvZ7Xkk8aXyToPsbdTOHWsNoBEi3lbCuWACyB3YdfuNKG6xJg4+rUPKTCF1qsycNx5oC/SQKhGkT2fkVeDQAwnT1mfxd9+2ADwmu8ANA6ytcsW+KyoPFKwiQW1EgEvm5IT92vwxO8S4OTKMg+KHnsWzQoH9piJTKdBoJgeKIgVTEQWiQpmLZX3xpNYjvH5Phdx4D8UILgOJf/08jENvocDu1+zAnItf0S7yXzJdjgB38rKE+8X97/BQBomg14kNBnmoGwBR6doCeeVgMvQvQB/woQpTYPAK6qQqpENFOeaNnml2sADRUPryJyg80qNLTEYIeDYMUIQwXxtQyV6DWOX0eAU2v4H0uQH6n+qONYxxpyH1Y8V2x5IsDs9LDg05oVaDqwxIXntgR/KzPh909zYXtHuydZkSxsUJCiz0I2ZO6ox+JQoCYWUyX2fYEHzbMBjaEJBnryfw4axmbpmFARBxEuBMKdOy/cIAXxgBxTAKgcskUeudJv3RTC6k7huqbgc/qt+W1ovjIwnkRIImBqMjfnwaN3+DInm3ouAihQJHEswZd7R4SdDMrDPkpRgubvdqnFkc+H/ygQJu5BMm1orSmoZM7zheDEgQyMSDKGAjtkUsxn+KjFfh59lV2n0r9oojQUfRDzlv2+RH9mBejeSfKDggQ8KBAow97FN15cOC+7M6wiiRe4ZHWRNqB4hF+6jM6X2U8Ftc5AyB2jflw4IiDDssashwkdjqCE4wGDUKBNIy+vAtVL76s5dNwXTQfwg/6I6X3asx+SstaQ5QLhrZCw2eJjPv5Dj+iQHamv3nkGYc/M24gyAH6/ONu/CBAFSV2DGGJBzpEIARmBaBxVTGe6IhXV3MKGuADRcdL0oOdXAthOvHFAOpWPOAV/1UdmLqvJGhoP5TescAI+bF7Sd6xjJ3DiTlAEUITwNBI1vkxduyWIe8DgsyWePJ0gvzBhOpJEj+x1/qkGLs9MF5bS9f0GBIxZQiAsoncRD1jaUnn7TwaYPZfF4Nk/q8p0HQSYnzIGT8sAHHZbiQIgiLZ7PqT3c+67QKjhwZjn02YRTxu+dXvP8hxHNCjCmT29li6CNnTkJ/navw4QH/eCYGO4yCGxyxdhNCgfGh0lanC9Zou5skKP45Q0mM3jDBawiCxyR6N2Rx7FAiPdq0NuuEDz2G6+ZRTx2b+Kq0/0KPJlwB0y60SZmPzzmocjAIkCBEE4cM4Ax/Ex0776bMuQ99PJGjpEBEsHxX0kiAAIh/z0kbatzCSMV1ShCLJxK7tVm3jnksUtK9E//NjeRWETnehEj03/6X00AAk1VNHR1t/zgCywGe10+0BQEGAhdAaAYkCfX/5MNacQSjYSQ/2CA+2aRDBD9WMnog9vMIiRkoPYEYStQ3+wFypPFxZkyDooa6qJY1aFbtIEMk4AkTUDEDFLkZAaJDqDxSlU2b7lxn8NP2h8fBL/7UBRMEq86cMiyg6UMUAnkGBSk/HTofas5hD9UYIdMeLNQvHSGeIODJDKBRqnBvT4z2WUCltOEBlvLRnY9tJp73WVZEgqcxf2C7PE2IgAwiISPyvClCcjOBQfLIFsUZA2vyja4eMpCz4eL8YttotGnqQEXL4EwUy+5gDtALQbmMlfurE7qW3VXWINU9eW5nnUQDiQuWJV7tOQkQGXAFTJcgO7Q36f81lokAiQNe7oHUPIUa/pS5AU//S6hfqUy68VXJ46PHVvsW8RQPo8fJgf4NPrYXRlvj8WoDWBOgte8k4jowqbSIEQ2w5sxdhyEFhuFF4sHphcXrMOkHfYnj9hCLgmdQ05hqEES+jQFhJws70p2VgsxWg4Vrv8KMDD4EHgxsePG/xdp+InnPRkOaLFQ/2jgCJAvl9BkFf8YMC4cFwXQWiv1oYvR2CkOAzTpiBnxsCxLOEKRY/sLx4eLoxwYc46HpVVfZolAuEJ0BQlD7vggDJFcBy1bOnX/GH6vIjzc+9dkHo070YCfzY624HArSIB9OOxDGR/9OZ2Q57sMPsbTsA6Dl4MNo51O7U5EGo2hJGIQY7AkgUCA0iEXMJOq5q/I/BQdoZBDGiQOB2uAJUFQiGNHzWCryu/2j61Wqnmn4xa6VUy5fVAEKBouZwi5rn95kC5RmJvEMz1L0ewGOPzhQeDA0ShD5fPmwxo02287PGS7e18gNABEM0U3OlBDMgorkMfqaF+e7FTioaeg2EnwGoRUCKz1kN9fgCcimq1kOv+3dk5yA2sCMYEf1s9HjSDj/P3YE9zYPt+LwD0CQGysVopKfIj8Fj/Bhd6cGIf2ZBEJ1GIETWzkZXX4oQ/TE3hwC1a76GCwOhbDF3hnS7od2aAokbU3yUIEqmuDAlSE17ELWCigJlGMf0KF8zldEtEITxNxU3zFt+0J9c88lvKdf+fBURBfobfiQGSgl625mpBL05PH74T99KIRU3JkHQnSptQ4i9iitOrABE6RUByup8EkQNukhQwKOtHbpT7IIPK+jopAUUSGZpXp4k7jYZosCV4wYBIvtq/ov0yw5N33PhX+RnJwgHFh5s+bQY2qdxqAhtlgxFwGuE5N12M37szh79pVclfpKDAdEQBIkji8AfU37yggoAVBryy5wXAKLFrOMTBjzsptHGDk3EdOgLaTz8XJhkBz7BjxbAgF/LFxr/0K8p/kujHyKgRx5mS9jQObj3sr4XFyYKFHck8k9se270BEQRBL3qGP9Sdi46jRxBFI3ylKKEVUAI1mHJgqwERaAxstkIQ/7/t9JTD07XXDfO1owHQ5SIyIdbz+6GHIMIcNIIgnqEoi5Ewy3DoDKyWDtjqyxI61EJxNEcuYoD87uGQbpO439EQXGrqQIlRGN8QEiHyDA9dhn/xf948CO9d8SnBj8IUEfPBEDt+yTIGqnmwi6Ox0AxVWaI5D3zMxvP+R8TAkkVSCxbJL3WIJSJ0MQ0Lvx0ChRc4cuYsw9LhAiFmJKWEWmRIBg6JkEYMlQAYi/648uYc0R7HD2fMIJYEzDRH+Cpoz+CT5bfkp7JCSoAufNJgJoB0KAORDdjjQQBEAiZCN0tQqCDifydaVG0SBhSS8thkUZPwsWsWeEHzx0AwdDirLFlJpYEgRAL5r+2IE1qBToaRBNsjwCCHx71GB5M9v9BgPIq+ZeuPK3GNnbGDwJUALrOMLjx4wB93mwaJuNKdIRCmcgrP0lRspQerJl04wdpmOECQqwze0MrHFbuSJ3NMZZvk40VBYIhALJbp+y1MR8isLQj/GAaROO8jk8B1RpQmO7g2+zYACLtd115cV7Cn+An5zXcJn+lU3P/E8OIT65ARtDhLMwoYrO72wqQ2s16U0OgRIgQiLd10ChnroE+/Rg7NCY+9DVccxEgIAKdksxbHo8IoUGOjkzZqwSNASoMiQId3clFZxCpIA4ysBSfJOg0PVjqj186/qMnqCQ+rkAqQE5Q5lAWkzaADCEAAqLiwdjnZcAPtk4PJjGQQnQVADFj5PjcgM/8YjFApghBkKbz7FduYSNWEZpvFqxqT6yWg+DnuATVMzFRoK8oAQU8MgQtR/DkDhztwgo+SpBOzuO+Cj+Ez/6BBFAIkK8/bmYA9QTZ+w6dskb+KEBPARDghABpENQpEP2WrDJMeLE/uuYY24rAj3ElJ24sT2nBidWlYgfKiYuCtAbSYoOePGn8kYVguoxZEzD1Yq6i6I/6r3fWvWOcMxEW+IRNBozpT84PmgLZvohJkCZixED9bneXt5UfNTzYkRzsCQViQI0+CQw1VHqEsjYNQETTbIhtAIEQFUUiaROgYUX6q7qq40wMBfr1qxRIatAQhAAt8/ey+ov6z1B/MBQ+BCgjn/x7Tk3K2cHr2Mn5aWcEIUE0U/1y/SEIouw88GBXJPFFf9RQoCSIGL/zY4suPcWi5CfOI0d9pihLlxPr7HaEmA5iRlFmpGWt6tGVhiJBmoUdH4NWBVIBqg14XUJI/LPEZ1g+DHVXAbrJ2/XHP58Igdq1a5YSpApEIZFE/i66XyZA69t1uwtAWYauCrTpAyDeyaRjNkgm2rXMAi3XZEs+n4c5mMXYZh2JqQpk5aDRivmSyX/VWlVI8mZqycH+51ZksgweCfpdjj9NG52agmntp99HnJH56r/ay8wUyMw9WPt3d0lQUaB+WaFMlZn2GEDru6fLxt7l0916bTTND8rQVXg0BKKQCD5dq21yFVr06HO80gUoycoTFx2i9hAFojZSCLJOki6YP3ismHY0qsFIdWH7818XXTCxd4+yBB9scYIcFSDkhw6YTj/XwrNfmKfwdmc4wRJAAPLdfUcEhRfrQ+nPJPKGT+ujpV01hkyPbjOJL3XooS0GHW9CfwCJ9oaxEg0P39Qs+KEeFNG0G3uT1xMMa0Ha/BcXCGlP7HgmhgqVIPrl0zTIwY6sA8N/6TZA2T8t/CC078TP2r0AHg8VivuKK1cAApD/1b5OHUAY+FAJohh9e1vxcQzck93hwSgESRafIsSodQ+3w4MDY1oxq9L+60s96CyvyQkKiESCWG6YO+BhwzOejxM0UKCXf/6ZcG0jARofBX94CpoSEP5Ll7/38qPDY/HI9DaMZIapwfRgNwsFOv132k1TR5AqkFSCHmf5uTOhKbZ5xIM1gJwfUaBHGUncvP7hpGMZCbn+IELeGfM9IVh3AkAsXQ0JgqD+HDGpSPslqZg2M2oqr3ZoPLoB5AQxiHhkDlqb8IKQc69LmDE5t2CQe/XxMxOrU5k5JYTOCbDrAOjjc8OnAKT4ZD2aPKzxg/x09th5sBwCEtNe6vPZTeFnYjq2dOijwcoCt8QKfoyeXD0PPdSk/dlVpNuDpgamffn/sXsr+yXAz8+zAjXbfUgFUjt+lJP6L8ZY4UcyML8G8Q99RIwQ2tIYf4UvCH5ycNCj0H+3r1Oz95xYPkjk18mPEkQSPxsCRBamI61P29fkGobmm3EOJ4jGhgPkWLHFqxEk2y9IQbrPxVhuiHsYr1XVVP74bNnJWQPICPpNTlQZCBBHOQ0C6EB+vAQMdrAD9edyelfqT3qwPhwtAN26AiVAewHIwIGfxIclzncmM640cxutPcM2d4/+JuihGS9JGI2MVwcoYnPMeWFQ6K0wHQLk6VjvwCZUaOUA1TAIAUKC2G9BFMi+Yv9z26mqQaePu2/2/5g9nRhBgs9QgD4MZ4A8hpYICPmRBTwsPcWk/Byibh7M9cf9F/wwv9w+GgfoeTWQIImA2HQcfi4uri7MkqBLPNjQiz0uPFgDKOcZMRqpNOizNxz8pK0Wy+fhRySIbAwFIpAe16NB5z2CNAs7vXwwgMw2vx8f42imKTxG/hWr4GULjtyA7Fj/gugZi/VVb70AwoniwByg6wCo+bAZoQAI50Uz1R7kYVijx6/yDxwgyd7Hq3rarxBDjT1F4OOXs4MDY8FtH0FPORF1BkFxiQQxnyiLnVEhlaD/Nxfko/Vnlw8GUNjnUyHow3zBD5dsZIdJAkYFCAEiA4MfFR8QKlvGu/yE/5rwYHxGAHT/fCYSlALElVYoMbuy19VV/UdWRbQbknSe1Wx/bwDd2IvFHW4QhI6aAPlSJZt1paPxpkIoEAxpY74WFLUiralYcWISRsumU6vGz8PaAAo7A6AjB4IVAdIRsnC+idD7DVShB4RQH3Kw2OrS0MkkLNPknDv1jcRWM0Db02kFQBSiUSD4KZS49sSzAtQ7rk081UKA7rermESDoLoFCH8UswaxPxans3a9sin358w8DBXSriq7AB/K5DURw44uVP3lw/XMz8NLD9CXls5LBHQsA2MZKgxZDIQHo85VemCnWj8EopK+o0DuvdhuJQCyV/ESJkEft/f3XRR0pQpEEmYPIGnY2O2PQhBVaEDSMMgpfNlut9eJT3vtfGmH4pMaFBkZB0vlvvtIkIuSHHU4bMznwcYQ1NtXbd9KN+zk9sHs6Zv9l3+w6UMlaFSEDnqr1R48+LTr6wpAK8Z/8GBuic/k+Exv/DB+0dUST7f3JkFEQaJA3FdOEPGz3WgQ0lQTMCkl1hB6+9wAMgv9gRai/7ILdT9s/zZiVs9etaxD3RgQDRar6hbk7Xm8HK2J/Mmd83P1wzdbCPJkbBRBA6l2MZAgPcVARqALQmeDCnTgg/6gQDgvt4ypc/mNsWQAnT/f39/vQ4KkGn2BCmEE0MENGnSxbIOJSQQ0C9BzkA3ei5HE7G5M2RtjXDpGWKJURCJmCAEPjdW+X+T4yEIxaYm9VwsaaNDp40PYxTfb7f7TjA7J2DgCKgnYoSkgF8qyinm0B1ma0oP4LCNoJsZIwbKl4U4il96YD3OAtuclCpIszG8oStHJm0jaXngvvJjGQAjQdg9A7R3AB0IUF4MfnFsjhhY9J/iyiZkZTdV+pVjtqtazWLCYR8bA5x0f1tIvU59QoPY30hP0+fx/1KA5D75alqClBR9P4BnPP5N/gQ8OLOQHAWIRcpi/9ZGOf++RIAdIYiC7wj4BDbrDW++AoT9M1I8FyLJ4jHZqBm78D8DP5E7sDaAp9+F3Y6r1YDmRVEw1SBUIfhj1er+h8eGPmR8U6O9G0OYfDYR0kFUzMPwXFwVo8q9hCAQ5WB3eiJ4Qy047eCZP2YMfBMi+tg/BAdqeSSJ/QQwEQ5hjAzrtxpCgo0sK9zNAq4oPzKT64IhLPTH4OaPbahfNVLuTHhgiiKYibRqkKhR5mA6XjSXIwmds81NToL//3j4/wY/1NdSDjbpgWKziiSBItmHVCrQq0Cqvdpf0HX5oJmW+tZhgtrchQR+3LkHkYfQzSMFCfoDH6Yl3TpAzhAJlE0wheqwC9HyzLgClBEmH9W1RQBmV9pqQadAULoylYYNyELZc8MyeC8NETJ1Y9WAfH5OdOQf78dtvZn4aQS89QU+/awgNQgeHWNlL0yVTAyDUR/lxekR/KOnnoi+rl2C3+WHAj7G0nt9YEKQSRAi0REiiILJ4DA/WZWObsQDtbRDNDHwWQhqlT6acJgPIzPvzjJ3hwWoxiDAIDeompL2bIWH0aOtErPLz4ezpAXt5NoCMoL8LQZ/PJAQS/albkUkTXkvQ55SAhB9ZguEWuh2G5sOPKJC/W5sERRB0vxcflgQRShd8eD4gQA4PCOnedhoB3T+/xigj+oNudg0yRrrDvXH+hyf0U7qxwk9NxZCgxWCHX5GJjQ93HnTE4Oe368vCz7YBNONjrzmdx6bfIEh2Uhjs5WtGBE0Pnh7Ywn/pysEa/0BPJrwkYK0q1x6BT/Vga7tngE63KUG7TOThx9A5HADZlUG0QSQCJOiIAIUHWwfQS4t4rbTz3lxYCI4VhVKC/Eyis+rCQCgliKBBiomiQaEDiQ+hNNa5rwx/NvZo/BhAYZnOUxEKgoBn3MTwx3gKcezASg6fV+KD9vht8KA+uDD4sVDa/+ItD3t2CQqACkFcBZ+iQORfihAQYY9FgJq9+tKO2WpHPsvT4OPhtd/XqTf9qvqV7CJUu6r2lNkg2TVI5Me+BDxaTsR9zdUf7LWpzn0CtJ0laJGMbc4/QBDrUdkNWprwcpCKDgEtRlgHCVgi9EdRoBI37K7LBwI/7fLVOAZQhNHb1bQjiq7HPfG6sGp0LSAmQ7CjSRgQqQBdr8OBGe2Y4xM/BZ9c8cN2a20FwXy7G+NcfFSoVhMNoeHWZZzoUx0YAMVdionhvlr2jj3tDRoDKG0ZSn9pbkwEqPiw0VJ41Z/jPQz2j6oZfHVhVX7gpyiQ8VMkaLsHIARIatEiPtBzIVG0PbSQWAVobzQ72IlM3TcmFagMC5X/69RfpoMwKUmnD0vr+XGGPhaCciSwP1L1YBh9sn6o4c82FOj5DZ/5fvmyyMbKZhzivupKMBkie2cIUfdOKPBw/D8buVQP5j6AjaA8VG0/sa8hQe0/8K9J0LO7sAAIfphIxJAd3gKP5PH2Rg/JeE4BKg4sbrf8X6A64f4raWHKNVL5Zt3yeHZshaDxKo2gB3hkmdiJg3OwK//hPNzXJvlxYAygPzuEIhAiG2sK1mfwo9XwNOEhSHuohaE6hAg/EET+FTkKDiz+oKsC+V/6TI8jdNNJ0L+Nn1CgHiHoKRhVN/YgDF1KGD0UoGaoY1ydUVfvBGg55Tr5dJCNqKxASFIxXaVRhxOZDPp9cK4qLXkwmuWnZF+XL4ZKI+YegAKhZSD0ZXfyq6Rgwk6gfSgCIgGr+nN4AeH8IIAuO9l5CE3e0hVWiJvjTX5s1hD79z4kiDXO/mIeUei5+lTaYXiwSwiS+EcFaHuN/gg9lKYZl2bYnqYG39t42Qpy2G8TBxaJmKZipkCM2GO1FEQE9BtB0Me7Bw1/DKEZoD//bpcGQmmbU/uvVBcGRIC8WIc6OgZ1vIkmCgQ+bmXZ8u0U/qsAtE6CTIF2AZD1M5oEbdtcoAH0uSgQF/AcaWbQCyMVOy5ASFDADkBsRT2l/ngavzh2Kodd0R8E6L2KdF9NjOmyjDoEIzlZ3vTnt1XKz8bdl/GDAv1p/LTbmNJA6NN0Aj5OjiqQngWmERDJgnqvWv+xCwVCgCYPfvJPecCPmX1vC3xaFDRX9FyBPic+RYN44rr88RAFaY2hUSAq0TUF264MH3hBKd0I5yiLdlsd+YSHrTR8G+84q06M058IECgG+UNXy8fnph0xZydeIT+/0/tyfoyRsO8MoEbQzA8I7TdFhJ6aCA3nOOK3qX1Ufnn4kRLieXFgEkNTAEKAPItJRwBAaz6Zjp/QoNXzdkboxfnRHcqACAVingz9QYG4DofQn3YpQAmLfY0IH9jf8PGrGWOKZWwooOKgOk3mNYxmQnGxf+vh6bKDu0f/+tvZY3Ffryk+W6PFFcg0CIRwY0WEcGCOD/zkpnzahqeL8c4Q9DgBIwQygPh73RECUfipANnPvMjyup0J2s8ebCao7hMNQ9jVUoYY5rAH2GwOH9f8SgTkV1jPT0noY91Y57Vyyix+YP0MNlJUR3ZwtEN238yDfGBIdk4sy5x/v7ks8pPhT6dA3/85mwRCNDYQIY2hqSPmdnajJrzdcgD8YIRjKUCs2okICAW6xYM5PxEBJVF2PMF+VqBnU6DPuksrVhHiKh7M7+rI8GaE0C5A6+Q6f0lYB5+3lLJuJBRFxclTMXNgIkF4MeAZFoOCoSZEuvNdlaBgKOUH92X4wMkM0N/uwwDIRWrhxj5bJJSFbylCn0T8I10ww+e9GhDLdbUB5vg4Q6UD4FYiIBWgZgGZS5CvGLyQ03o0BiJ8hiOyMBTIMUKIKkB/rJupNua3FITsy3Tb+6wcEeJnpj9maFBJx6Qlpm35mRyi6A4fIqEEyOTn9lLcl7ER9mdVoFE2hghZGKRtsGBIi4hsRS8eDHrGFaCy6I5VgyDkPyNzzw+JDyqT6P12ViA7e87Y0ZHWbGWULKyk8WEa/yA/AEQKFsA40ABVM3oTIHBxelKEMpmHHicI09Gg5VKxsukLtSAQohydBJ0s5OduIT+GiysQCBlBiNAniYSIoEEoTMZYzRSfZtrF0BWEFBARoPnPFAUKpPzD2a1Jwe7a5R9Yfnar+QNtEZAokD9GDgx87IUCCTlVgS72kYKBDGDv1iFAxW4KP0xJWyZmDHUb4RX1kShIikF9Km/b/w5WqfodAvSxys/GsvfeDBhToL/+BKFegxhUpL/aENIz5VhMGEYOpkXoGv9I/wuERIFucWBu8JPdiwAIJ5Yc7VsW5h5scFZGStCyJfZgj1EaplNBF1EGuncB4vfCsmJub9J6n+Xv+YlZ8WCDQAgzhGoUBEIDN5ZhkMnPqsrP457cC/0JgDC8mPTG/Oun3e8eByU+0IMAyUbQ705BswUQ+Tvxs26csCMEsh/ht9o7o2fXXklO2mr2YGZk8bq9AiEQElTqQDJPtjF4rjZaiF7By9K0JpQl6UVT1UTI3VjuYoYbk2riIAoaLVTNDxB8KAWdRumZ6Bl8oAcF+ivw0WwsOhswtJnApyxFXcwhCkNh7KIJPTqBiAKVHKwqUHqwLtzpHBjmEvSSZ891ebxsMVUWZ8DRoVI0dydCrEjd34YOgtAdJfKIieAnRUc3oppcgzipjkM1xI2FUU7U1fJej6arqpNlLXim80X0vBQfMwBSL0YsbeCA0dPpYpS1nmfAXhzAg/F/jEkJCP1Jy3BHHZjz0ywD1Tu7O7tzpDYIEApUbqlE2/VuL8ze0NXAh20gmLAM/cnAmoQes/QMoliwigJVF6Zt+ZweZqVzcWEHl8pHNTqCZ5Uf8DGCAqEZIOOnQ8iv9GIk9F/m+4v5MbpxOogoQ0CLKbLhEngyeOLnGgHhvSDIqdkFQc5PJejubv72En6kG189GF/gSNIwu+NxsBl26b8Fv4Jdzg8ZmVNU8cEYMcttzJAghUh7YnTD+pZYv++dNMQ+nJzeivxI8OP4oEDNOoIAKClChIKjzSo8qMsPKbzjgwSJAI3yLwmA4gpz9yUKROIFP+3ik/Pv2vV4JQIU5CRF2o5v1FCIBh4dJ7sqU0G50VlG8/4bwA/5oT0QIBob0y1OzBQo91HEYEe7qqeVH3/qcWLgw2j9R7zXQH5QHxQorxFDiFC7wo+dn2gbXgIgs+VGHKFCqkBUgEjg4afWTdaOU+194bDMXI6atZ/gwEo3XiOgkScbzETzTiUIgFOBZiu1zp17MJp6TJ4RAd3U81Y1kD7XlhgNDSBa7B/NUVD4MHIvlR/F5y8UCIRqJMSY0Eui4xR9+bQ7TRGyBL42MUoCXz0YttIKEBVE3Je3hSjZ7qi99QIEPoUftypAWogGIZhhlfOhZioeTMPplCAAdo4KPrvwYS47VNnjmm51wAx8sqchs0FSCyIMqhrkeXzF57zkXio/FR8DZgbI8BEvFiKE7Z8sCCIh20wf+xh6lMTrOkJMatBY0AM/SwXKFIzeF3/wjo+9lgJEDKRdDIxK9EOJgS51IAgFUglyfoIhagsgTye1LCxBgfBgiZBkYj1GWgvqTJ1YcWMEPwyOifdCfebLATJ67LuxG9uaCP3H2dnwNk4EYRgJgYROQuhKSLgmPVoCVEjX2McaNW35/3+L9UyGZ8dvNgHGPsfhs8DDO+/MrNc7FKhewgrxSm9dh8gyDh1i8BYw0hcClBQo4AEfbi2Un8dWgcY1/KgC+R3o5AzWeTQ1NYS2zMKSBD02caYgK6y2hx9rdeUk9s9rVXMKS8sT4UenGUzEaAY5P7SBfrwbO/JD7UXMZddvKFANGEKDfLRBuJmupxFkl+lmlkFqMN0MUd7l1KvgKeBhCAGKDb6ogZODdoLCcAQ+9bDIAiQeSAVouT3ZJxja5ON02kUlKAX8IJqUA23kUp7nMthhIdfycCTro2lHi4/mQcN6+bjE5/FF8KlX1MdwyQCpExIVOr4Mf2YR2pVV5djoyQ4afJKDJlx6xACRvYIfEaB9PbMARXZwfuI/UwAUuzsnBUKAZG+g5nSCVIHOF/RLCRqhh4KMPpVXYMEPNNnlEMUYu4+rDYIcZAh2IoextrizZ9ntzRKfzZsWX63+BDDPX80A/RxfgQiGpK1oA1YwAiHtAelWUjmDkcBQoLtlC7r+yi3EEuv7zmUwi6UA0QPqKJDYIN1cKgvQtVc2x8bkRNtUoCMkK11hKC1xZUt7HWnITEyMNHksE1TD8NlDjmYvxSf4QYFAiDymCGGmwwpRkM0I1ehtB10/gYdYwIMAtfnrVIFFF5Hlzwzfy6N/ulcNepygsZ7wA0L6spVdckBQlKswliWCEGuiexLEz4cGhZR6JfCgPVLlhz06wAd27Oz3gpQgw2eFd8Y8t/wAT6bHuKkK9PVvP//823wIRJ7F1E3PeQwRms/h8P42CLITASKBkcPQH63BlKAYgik/7ZCpFaB65/g4P5uzCUyFR4sw6QNt4iSBiQSpCwqYDR8KsvyPlGfzZbkhsBppGFIFYnl0Zyhva6PBpw3NXvXM5ifweZ4V6GujJyG0dELamd45PhzDYRX8SAV/eQqPAAEP+cv5IfYiQBQ1jd14JIOJAKUExofukOiD+E/WikZ+ZCiWIRqXEjT6T5Tr+XaxNDONaHKxyB54jJ6uDfoQ6tOr5H9UBVJ8NHuFEwafCCcmFKje+yEIkcdyZ/o15bH5dIRw0GwGDT9pGVAeoqr+oEBLs4CFZniaHBD8jAhQR4H8yOKzY1+yOdRH/2sJGkN3iDIThOLYPQsVCTaUdoiQoFyIqZEOA0Q3GogcICvjV3nBvNZe2vhZ8EMKC4ZA6Np87GUCHruA0EUBAp68kbjvr635ixq+RnGxhyTnBwECoOBHBAiEkvJIIRYKhAdCgHI5L5EkyAkiQoD8ZNUZ/NBbBB9qebXRS4RYHt0dqdZ19WfUZyJ70TgEnwRPPWs8zwDVT/tqF0MobFAw9LsylEp6P12FUg7T9xHiguzQFAZBho9nMAKC8gJW+EF/nCARIPb5TUmMUQY7I6YnUzV4Rn7ouyB+llTR6zrXvZWXRGw+jgUijWGjqeWZaWghRnfFHRD4EJuUvYAHfsAnEAoFCobw00GRDDdySd+kMLuAENlLeohagTFDxQGxlD7TUyOqXuriJUB2ugBt4YdAgfzY7tayP1AN7QPpujJnSGONBOWg70Coj2YLdVSISl4UKLekk5E+szr6xvAR80PkRRuKjwUKFIEQhQ75RRMZbhoBCoTKDTvSZwUCHrFAIj/NKy0zP6FAOCAVIL71BUh3RxQF+uR3dKIBSTaM7knQFEoIPykEowJAmKCY7nSaQZfaibJt6/ub/Rl8XnTFaiM/BHbZUFkABD6GkPaFdMT6igkKhNblxvAhZC8ObUJ7LAlCgWL9XnF+/IvjowDhgBCgP3cEKUxmGbKsDAUShJQddUHbcTbyksBkrHHyd2nbDj86CkQvSJaV8ax82j3a8flg+Ih37mUv7Az0eKBA39uRQlMZeWypQtOfDT4eO0MobceqCAU+4aDNJIoAkcEKKWyPhxYLlIqeEQud8CGF9dYDnRaUsduvwSMKdEmEqOT9OAkQCDHXKCcnFAyl14DIHh0piQFRliAVoUrPipkXMS7wSfwYQzl7gRAK9D0QEYjQtYIMfMIP7aaPcybTGQZzMHXQodQdAYKe4IflP4pPruF7XSBRoOEUm7SmtSJitz0FGi5W8ihQS4+LJfmLWgyA0CB8NElMFtj395xyfGLi/lRP+6jX8S2bH+k7J3qAx7A5KdD3xo9fJJ11i3qt6etJ7IbDTUiQdoDavehDfzyBqQOCnxL/ku3EQ0sGs4tYaHXRys/qtnJ/Wxvrh3aHhXJ7KEO9TfhIE6gjQfaD2LVZ3dp+ITI/d0mD3AXFfq1Xpqq6qmN1c6/q4/igP6eusVpnCi/oqedvpxRm+NhpR05kokK/K0EzQkmGapifJoNJ+koKJP6nnp0aLPpvLP9BcgKiiCkE6E8hhwTWJrLhl39ioCc9zd9vD9OAAskg9ZIEjf6DAUz66lHoLuZV9WqDopAPhlhedaInE2T4mPUJ4bFQ9Ql2sD9auBOGigN0CiBqGcozDkLaQiBE7MrHG0y09BFx0FKD9UuwvX9h4J4FCJrqsenW8JLGPABoNYSPrrJ0+m3vjaEIlkV3YnsCyB0QwIB5/VbqpeTHntNyxAYhXmTI8mhX8ks+ehafu5HU1eIjpdd84p4zP0IPKax+I0hluabXCZkmMo3ddLDmqDogBEj5YePJhE88A4+DxgHhNMBpHAAIEWroAZ9h2gKQxRD2eXP4hSjAgwj5pZvDDB/tMTCaj2CJfXZBqkDynCGRekGGz0PgY9HxPqlvKPgs9CeSlilQYiexlHTIQtpCilD0FImhfGAdEE1oBMiHGLKKAwFy21PwCfMR1XoaVWYBqhZouKRAkcFmk/NLUQVyCwQ//FaDCGiGiyaohjp8RagEQTmJ4YJ0ZVAeyp97DctNlO1PSYMUH/LXJe8DP04QAOXIbkjmrIRWZDvDJ8d6uoMh2ctFetA4aCy0WwT60Cf9IYNR7CBAWKAL+atep/cmOapAa9cfogyb+ZimTT3KRAbT93+Tw8An81Mcf1mjaIf6aCaqaqP1QVW3DvdjSA7XjI8+ayGNH81dAUgG6LvzIBEQpH4ahGp3WmM3lI/wIw4IBcJBJ35wQFgg/ge2EHysDT2IAEkWm06IrLaiQNukPxqHwtYu/S1/+ckkiiOU10hDEO1EkSAq+ZtQICByfD7uN8FNss4vfeusQ4tcuxsP4ZdbBfquHnYFo1TYp1H95UWLx+NZhD7vpnt5I1izEPouG+hTBD4Mj5ylSGBeg4FMKsjGQTJYeluYB4SURRWG/vRjVZyc82VZnoeJUi6L+fR+eUIlqPukKhP5DyY+YGMk1c99wkfo6bV+VH3qJwBBz3z57vt34qjBSBFShl7XiZ1GhnIXulWg7IC0CVSjIECY0XqrCSwskHhoVaAGkWG3UKBB+VGEJvFAAhAxxgf4lMhh+mCY+mhdH629oErP3ePGiKkXPnzmJfgk74N1ZjLaRvQMkwIZNvWw+D4OReg3IYhE5gcIvQ0JIWToYWYo7ybuQ4yMD/oTPUQsNAnMHBDE5HAPPcggjA2mvPXznoy08EAT/PzQJ+j8aw9GAYiZRg70h13tUzNaJQh84Af783Hv4hPo+BdfsJHxsRN6LnlnVKcptd7NAL1L8Pin3b7LuSziciZjRlb9NOzYjd3u1tN9ZUheCGbHoohv5IddpHiKmcaPyI+dEwpE6Eb1BRYmAHq/XRfQ0oA6SV3SCfKfD3ziFzksBGiPCUoa1JMgGcp76gIdNEi7hrLc8Nc+Pnbxg0IdBfIDeFChhBAEKUKqQvjpz3bajcnQttQdt5iiwg705CK+4IGwQBYqQPzn2YQCEVDUPBN/AIapgemA+lyKCQWSGBygEz7jKKk2EIrU3Npo8BGCzkiQN9juPXX50Sav/V9H6fkIPv3Ki3lXClegyosELMFQX4WIrELVDA2LRPbZr7vBGEKBlCEyGBYINcICkRuWMVGEqYtujoaawu2K20uxujjUACDDp55xpFqeDUHBR5y0ClAaZ9S3Gz5a1eX0tPhssD50nJP8kLvwzi0+fqGyahUoxIfAC/mpJVkHociqBJnshE/cfq4M7e/+USDpQecMRqgAoTlI0Wh3g29Nbx5oOQ5DgZKP5o64LETl4kws6vgx+EGCRhRIdrTXUr6eREIo6HHjE9R0chfgdJ2PhiMTv1SBzmkPN4uKTAnSKdl8QYWoyT4HPHG73uznV3qhP85Q9tA+hKcPLY9gBDbihSo+DlAO3aV1CN+DB6pfWp9zOJTDKW4Oh1UWoGsKtHWA7IoA8cOmUfxeSnlKMYdH17YqPeSuhxfFB/GxI6sPGEGPmJ9Ggb5M+iMYVbyueyEvAAmtyaYdSayefsAQVRgK1BUgK+J7CYwv+8fBJGitBNEJsmtIUGnL+MP0A/fDUIbtZojjkASoi8/UDjMyQtBD/rKLlPLQoxLkJuD+cYzElehBfJJplqpdjLOOLIBHFehLFKiTx+YPZMj+ogQQIUNA1Dao18EQKmRHZejxnicxGGNIBYYCwQ8EtbkMgESBzu7SOhkldkMfKPzQbRmm1fy7Y45akgDZ0YsMUOCTHNtyaX1oECIEQ1mCZu2+d9+jR8Xn1YyzTNrxPbpiI3sfEEpB59AVqE1Z39RDKWLOEb0AaU9fQggZwgT5EXZotxkf7s93oYvbZ/B5ACAef1cLVP+oAYI6ChTn9mD4tNKy2m4PJynyemwVBJXkgPrxuBlFgWCInxN8+nWYPKBhov1Q6TFYeuIDPTruUnhkaIHt6SCEAkGPf0APSqQTDjgCIbFD6SmOYYcFSsdnYyh2+ocfclhJCkQKw1WM8GP/YaZhqilsWKdO9Pmd6rczPoWkZZOx4db4OdhvdoLQH4frJEADieyKAlGKMQrOGpSaQWdreYPnfj9uPHMtpcfLrmOasvfUB9eT6VnOLJYRFdYMELB0FUj6QgDEU60X7BBxtFTWgMNHZWg77Q2iACgbIPYPV35G+4oY2R87VYKuKBBT+WHRNpyXtJY6p7DfDEGbQy7hwUareRRICWKNWdYgXk4nLppC/t5sz8yKIxNn9HzeEj1L9emLj468/FR6kgcCHjsqQX5mhoSgGoGQPsWRk5k4ak9dsBO3syEaDaL7e/SnkMNUgEYsUCNC1tedJt6ze8EDOT5VbVLcVoC207CeJx0QNOXFHV6B9fA564HiZIohCEUgQafeag2kp0bKXqSuX1V8UB60R30P0Su7MDNujFEgZ2f+5fgIQrUea9nTBdRX9vdY2qFlCjuhZEK0eXywgB3DxvDpKxAwGUD3D0UAEgUyemJBkCiQxfTtL50oPNsMPsDDiw/GFKSwvC161GHJRp8ikvsD0mMHp9Pz+vIrJZeRI/So9Cg4oANCZC47VIHgyBESCVIZSs3FwIjQjV9BaLZDITyc/tWFyFSETcjKeQECGm5OAN2XkCA8UB6Gnc7pBiiSAtn5U+kNwdLbekSAJvpAGR/7lQdhtIKQILpBMdjJ0uPqk4yPVV1Ij+Ij9OjANLd+VHsQoPBAoBPhBJ3NYrkg+zkhpJvE4IeAqLVDwRD4fLarxW69cRJieJot0HgCiIQwNmpkLxAoZUYoSZDuVL8t4KMKtLU/oq8/sANCMgsbRIEwQH7kVdG6sAx4YCdO6OEtFn16VHpS1S4zr8RPIBTHOxTI8LErt+qmTxj1Fp2ppVYdsl+ZIUeIsw2HyKJjoQMaHND8xc24EQRAOo1nktpXoHo5nNefQAZ2iLFJYdMoEfQvLJCdjZE2doAH4wNCRs+D0SO2R+iRdT7aNIQiYqE8Ds9801egb9AgQYgkqL0htOh6LoMhUSA/WyV6TGsRCSPG+UGBHKCPr8WSGADJ9kACkHqg7QbnLPqT9qrvlvFlKUCyph6GUCCvQ/fjmNLWp3yH9kjeUnpSzQM5uezSwgtsOPwDD/QNx3z6RXOYB38JCIpDGFJTDUgs+6ieGg9EtEpkpogu4ogCpS6Q4+QAvRWRIHXRQ9addj3QdjsMhcFXE9/in7vyw3qgVxEgRBSIQoSwfo+t8sQNymOu2ejxbZyVHjE+9dRyC3rmj07LEGg4UhWG/oDPxa4Qf2lpDumT0bqPeZaiY63L1jtjiMsCpfWnjeUz0Z/5JJcB0IeXQyeH+ckoHl1pRhlTOdzcdtRp4tFUzu4w/vXxHD48lAQ/vLoc4SEgB3o0ayk84nmSUXZu6Dj3C6+ZGX5ZIf8lCtSmsLhXJw1CWpDF3z4jdEmIfk8QvZVtwxAfxJNTFE0UCJrZCYgA6HgoNbwO69fx7fyUL4iRxmFYPJY6XF7N8bIXfjx4Nrs1eSPCk/Hhc96S5e0va/ODjuYt8KkXlZ0QHek4i212ZDji93zxZVKgpEI0FSW0qIcicUMdQyQQYYgEHqXIIQIZSGoU6MYBMhO07nQSd7igH8p23U7ju+ZocvscV5ciSV8jAB330gXSJdGemy+yQ+J6eDsaPLBz2TMTuUZHe8BHEcLyCEE9BfIvOKMOQnFc0iGUSCHKi/IjmZW1QXSFo+oe+S+SPBAA9UwQ+MwxOReG2YAHmlbnH+MZ2FvBrleXA00AFKyDEOjAjtIDPJ64SFmat67Dk5qFgNRDpxEfv3DTKBD8EDCU0eGTqkx1SOsyZh20iJSiX4+zEK0FHpUio2hDVlgq0B9vkcMASLf5NQlaTW6I2kX1k+JzU/FZu/L0dmrVNtBrBgh8YjHczM7T5UB6nnmUog+PPtEuK3uaq0Zg0ogPn7FQNSsQcww7jB07OynMyfFTGeIJENGhTJEuqfZdao4vb2XYXaQnPp9aMXpsTfQfL5HDthCkT6b+NN0eBr/fbYFluz5I8jJ8WnT69FCEvRlAm4QPvCM7FyJcz7FXqws+ncSlNlnZAR0O5MduVYGcFw3tKipMVxjqOyIdmsXnsSI0C9G03WVonuyTb1D0ZBhlBaom6EAOE3rmsJshZmL5wcIpic9hxhB64sZAubS5wvrlSBWGTPpM61/D8/qXS895egjIkaUZEl3pkaMG+cYg8t8QVdg3vRQGPZLIRI8gVSJT1B94gNHx2e4FIlBqqYIi66w5QVWB/vggOUwUiIosA3Q7NM/FH8q0MXx43dNVBcJDG0AECes/wdNPW5q4gEh0px+kprZgb5eEhRwZPfXqADWTjF4EQ6I+Uti7VScQzryCSBDKvvr51+djPea7qkR/vZbN2jGBGz/jNnH0ZB2j/d2xmqCTAg2qQM0+v9xlgCaTokP983lzIe9aEffT8dB/HC2DbXDJ/xEekR4G6wRLwiRzXUQmuAGhnLg4cC6BE30gFEiD4ZgypDQ5n+901gFDsneVLImd2ZmPClH9MgvR88vb6+ZTymd8PHE++W8wc70/VhMkvURhiIstr48o222Z3fXpi83FwOe6BNGH/uPlv5CDYd6/deBRz4NfznmLeougrgpewEaAOQcRd65ATs81BVIjpLYaPv+XJYKj57+5O9flNoogCvMHSrJdlAtMwsVcDYZYCjIluyoh8P6vxUz3tj+1jtbjlVfKmp7V7ko2wZG+nL7NjIu9r6frci04Fa5uqlv7t/gzpAiE4Cc82ddVg/5evxeAoIfhh5tjUlL1OqNVNkys1KA/kPNoCLT+Zzg8Pws8Eu+gPCo9yH62cEtccVzyXDyMxkYtBXJjilBfTYgbLtSdMke9EREEGUAdRNeGkRc+HKJ/fikxBP5q05/F9XV1Yl8XgNZfGkH4MBiipVENDYKlyzRB2l6R/cafEgKtPwyAp2Tqxk5Pb0LLhJpx9cGj6KjkmBT5cq54gZOOTxygaKI2LAhShtSVAREMZTHqhyj4uXaI6pV3sghS8WdG0VujB27ivobSl7U+9M96/Q8AOSkUolmcChEl2LFhx/0GQPUF61jUs9/Z6R5ctkOiW/dgd+v1r09lp0Y873qydNBpsKNlwVzOwU/47RYefIBc4uCJX6gDFXuUHAIhRsMI4IP4DXrirDGR84M5QxFfux757d//fvjlvsQWG1E1p7fVh31YL0sQlBN5barer74KqxtEm31Rj82prGW30++++q28url/93dflFdWztJlnwcrFP/VZMcDHpxWQke9Voxk/XPg4QcoVFxONXYupuE0l1Ag4GgJkJNmBxQ1OUKJxJftFKJ3avXddH4iPbspT1yLPlhaTDCEAv2yXr6XRF4aGne/PctWeYM79WDL9dt2vPMuiU4KlVV4IEfrhD1BD5LCBctqQ0ALRfLwY3M+EDbAj7UQgnUc2o7IOtu709N3dWzYVnDkLJVHvXpg5Bhtp2HL6sNWXTG6Z6/E5wP0NfmY5GD3BWL7wXrCHeIdYh3hRnsTudDTw44OM5hIX9NoOWsAosVxGgrUCoHyJA/8mC5GVFMhbLTNCjp2AFFEj06PAxSZ2vtrN8foj65I9/pPi6KXksjnrvwhFegns+pGnRcYevt1QafITtYcgUc3im/VedRt+REGFTAkvoLXQYtHBhAFavNDp8wREnrcsXFWo9ioYTVSVLix490JFBFdm1mq/z7uw8Dol1K4q/Xof8o/fwmCRlegHD2rB/uQROfDlsMCnR52ZO2WlnnsLNIjiXgr0hBysg/he/CEn4oCNY3vBJ5QowZD2nzFqFefnp4Wdk7KuVxdjPytJLo2llCjbJ0y/fvvF1/9u16SyEPQuArk+ChE4cHWf9Q5GH/8XDUn/7gGDNio6qjLahcJz1M21UAHvRHfJRLE94BcKJAR9BRwtGVPGdJvcW5+7W/kA1HmqMBT6Dl5V48y6tnXm10JQGbeBLFHBNo2qpWP71+RoPEVCHqw1+HB1iXOKcYPWG8ovfeh4w+1/s6WhDNYS3/kKgoEShvYoUDGxVAFgqJUSHKMekuPELybocJOlaCCjz+MH38rw6NVMcKuUzuNL10XttZLK0avAGhgFvbqyQpkF53NulyuewqCA8lBcJSbCwp/p3iYYXYBOw0F4hYFykWelkELGKFMCbLG+iB+RgAqBBUJKqNojyF0euWGIP1enhBhbzXTfn9vPszsJvswFaC0JdD+ChTsCEDr5fKmE0h+SExCHchpzCTUPN3oscv+1lYgsn0UqMFNs7yoSCUgoawP+6RFlZ2KT3BUiIn30X2aPa/XE6MJgCLSxq6u1YfpTq2lyrxtl5eyIv7uNqwsFPu6jPt6Lk9SEi85WAHImGmIDuAoOb2Tlpmd81xwUsykINlJDAViQtkQevQJd9rNl6qR0u4SfGLcOEJ+jY3RyvOKk7m0yo4N9287Eaoxk/kwmdORmhp0NdzsVbaagqDoh2WDHISIRmrxYI0YuY8eJAfVkUQ9J9nj6A95juwRJUFI1IEa+AxESl9OPvLRRNIBcoaCpPh3GMlZYclStXIUgliSDz8QdLPEh2kQxEyOuNg1duvQ1WDMSMzLMlAg9WDCTZwcnz7VIUVvhMpNZHjf7cxtyzQkzwwBUB2HMrK3dj/WFWhRwdkQok6Bivx4WF2TWJeiKlKpD1JPgdBFOa7erylGbxMkDfi4Y6uybN/dMRXRZ9VD0+6pQAAEOfZQ02Vaalka0p1YbltKqUVMMmV1cPo/Q4GOwRARNnG12GKxOKnDFcgcGdG1O7arem8oWRgU+NCPtQjbnNxF58P6VvfEwCo+rOcRhFb3zhAgqQQRApkHow4YVyVHOqE6FaM2pXM/s6E5ypLW7ASSjBAkKafHUyAMinrLRIUdH/XkXiz6Z6chSa5GdThPGGYIXRhAy/W3JkESBKW5rDGz43b13Zbj2vUrwgiAwGdnGXq5flx1nBhOakyrSgXjpr+KdaH11F0ARyACEY7sujAFKETioBokEElXzQAyBWIURqIP6/i4S3OA3tlxRVMfb+YZ/8nFuxv3YaxQxZybTXjuV+wVxK524s++XFUYPQpiTpkq0J15sMfQIUHfqTqSOjcMf+WD3MhvRYGG2MUjAB1NgjJFOktkXvGpBkb+74/o2gBymvzYaqXR0zertcQ0KUgUyNmpWykIKb7gcGdE9J39kcwlkzJ0nQpUPVhv9zOuO9HJk3T8nqOfH9ghamDCoMSgKj6YyhCmLuwjWbRDgqQNdOI4JbomqK4cxeDT8GuA5JNCqg97/y21RE3ACjorki7hpxgapPb5F6tUiFYPlis6MXZzkyd2tbUHchgSLfgTfwDZYxxJttXLqwE0PIQ+VHxdATpbhJ3YY74dHVWiyNMIsoEoQDot8nR6I3lY/rXNt/0hs+1Ob/rE96jdPdJIXd50tHD0ak5wIx9eywAhWAGkdM7jmYYCfQI8H8lw0wWZNwun6KxDKH5UV6QKjcsRlaJdE0N8FIQsD8uTgkjA+loZbNfR7XFHXVH50RAoljQXgK4Dn7i0WqDUhFsmfetwV41yr06XEGAb+ELgaadA5x+dIbdCT+Hn1dmbN6hQCFB4tsUpcuQqZMqPZZpOrqoPW1FLZEFG/y6JbNfRVZ/tF8u3pwOpB8u75So3sAJFLSMKjlt/bMt57ypj/mMgwn8NkT6fEz0ReopV7XnjIvSm3tRH+TmJjoKolKidbm67pxbFaPFhUXi+hQ1sZdFPrAYrjx4Rir3K/KQerF9xEB1pXPZiQ46eMSiGArU7mLAzTH/UcTpAk7HFm2JVhs7KwxAKFzY3VgyhOQqU8zQaa8mulxt5mBP0OknQT/e79iALevxsCFFhxIGlKpCUoa/BZoOcPCurYbCTnwEE2Rav9eNDHra3UQnoYqCpWPDzyjXIRqRpi+TUQo0cq1PYsQApc/T7sviwL7fD6M3e12UGY2UFIzPoKWaFou9kr18Q0qlAVwYOa/bgvAWPBrwsD07zaFK8DFY5LAK6EK99sUlll4iB+NpoNitjsFViHJ9Xdq7WvSun9uSsDHNqRhLHLi1mt4l1IegrAHLxSXH0HXn76m6LHhCqalT3/P2KaWZ3CR5tpMoqK24anxPPgxidg5UFqKE/CJVMGB1q/IifHFKBZkMpcgVyhMpwNYovWXhkUJ1aRHQWeuQSlCx9XObDlv+uop1xCT0uQBEFFcZsJ6rgKuLnSk8ZrGC9tarjdwgQCIkHe2JEOs/gCBDhoMR7DbYQsX3BydJ4Om4MBDhOzxCGAiAXnzdn5WQjCkT+LETJb6gZnauR15gP+5b1YWxxF+fXFa0CR27Mm/L4OQ5jyDe5qxjdpxRMG6lXKo3ZwEZwCP+jBjyDUcKNAesgyYmkz6k+SAwEQYy2q4OfOkyHLJtHgSo+TtF54SnytbOOov53w33YOgVBBg4DcLJVooIgXJmZX9MWHZrE3ygx2h1PWpOOMOFjuPYQowSvA9iRDglZ3/gKBBdPRMhZs5tKh/Hj/iu5sPKCHZUWe3pWgaLuONfogUkKNw8+7N59WN5oE47i4Sf3XPAT+GAxp0xzsO/vqgfLTir9hJADMYc3AnI/NwrTWjayAY+HioGUnixL9oJ8cyhQBEL1AkA2XvlLDlTRqFeLMN4DeTfCh7E+DAnaJCdysmiwchg7NmCof39W92BrPBg+KhncHMmepkDz3iF1ggPVgZQfbhn6Ta46noTZLfzMHR93Yx4EuQhB0XwebxBvgmsQPswlKIIgRAh86M+jQFGQDoawHECrB3NuyKLESR3RwAdBedyUnriPm0Mp0Gyv4SIT6NQAaBug+mK9ds+NKY+EKkmyvC0Qch/2z0Y7w/FBffBkQVCRoQ35SfSAEP7rdlcZ+jqFN5Oo9zsFG3BsOzR1tFS7EdG4OVglej+AqvwEPWHzzhbIkwNk9DhGPiLePtdtjDQP0w1/iaZVgeJKHsYum7tnQ7+uK1J/n88nQ46+NRKdBTngpJ1ZMPLL4epAewEUuRflIBTIX/JzEGQMuQBBEMavf71a5jws+S8/EkWAw0UVKLfAtJF6MZ+mJVZ0mYY6LRI4sUP2woZCZHCYysBKAshzNH/V9WoRwTbBEcY6EPdhX+ikoBjGDvGzKpDEQBFFw5A2Us8HvlH5RsfzjVo0osOQcLlZ4T5kL2ywBlkShvp0JaH4YwIVR2teLJIyx8fR2iKIMKgWo//ufBgAkcZHBpbzLwRIFSioEXsoQ//efn/isCE3Y0JE3Ot0gJA/wCbNSpM2bRrjKdAoDIFPjYXOHI1434ydUCAkyMNof91GQoilaFc0VD2Rh584kYJZDB0Q0cvICpRX8txqI1U9WMABNHH40JvxhSgYQm6SK3tihZsvH74bP0iAXpVRD7s1yUGBqFJ3SmM+DcEqhxWHdqrQxY00VAmfIaj6MFpgXO0OBQoB6t+Uwz0YtMAM0Ow99qcIp14uMg/fbFDQP1Ilegx+Cg+vXhUGwOdVHUmBzPBVhs/Zw6tnAdeWCtnwhqoGQZsEVSvCAz+5l+Ej8GmvSP09UOEYacyfI0Rw4ldo2WM6xpQUqAgKCGFzHJwxYsMBirw/2DG2SNOw886HpRWq4JN8mOPDlWCIGMgBQoJ2N1IvBqhv2MYtmjWuM0vrfCTPGmzHmNI6AKCCUGUojnJ6eKtgqkvEcGsIE5Z0qL47dWIrlSB8GPqjbVRJ4u2EAD1ahj5XTuy0t42AUBDDeRg3x1cg7OlZvGG0rUDxZRObauUl92vERp1CxatGkb/Hi/nJdaxQRYJQHq7IT07H8F/oT73cEkTjwayRCi3j2KgRNbXA5zVWWJVRxkcWooh8zB5c2Ywyo32ZRMwiI6OmnABHbOH2Lq1QdddFIRoRAiKeABICxK/93r0i9co/9GITZcjs2Z/5EdeFzRoQkcGHK6sPWvVkWxb3FILC7y0iNHqIk+rNFkLna+nIo0B+UqOUSAhNDz5d1INhhxSij2zHWJXxtPLGrPDicBg7EQ7xhnV5mTMW0zpmlss7PQFRZGMcNmXoOq1QZd964Pneqz/lknQIJ4YH81PfilT3YAe0yRC0OPLK1Mc6YUaMs8PFis45RsLJ2euuSy48iFH1a6BUbb65QtXD6BgIECB9nxQoakPaQuUub+17NTuczefT0aAC0KefzHOJ+hDWebBmDOTU+Nl5ioTWImYUKAJpUyZ3bI5QZ+HVClgdQqexQpUwmhgIY0IHjowyov7KZmLp1EjFg42Oz6R8WAXoyCtTHwMo02NkkMt01KBAoUEVkY6rUJ+c0vsCxZt16sgHPQgQ9EgM5AzhvkSBGh7sfxsEuQIdzzQOotRcecGNhRPjjfMvokDuxYot7BX3WDYWHUkkZpGHxeoeUSAgAqNLycH0d6Xe9pShDwnQhBBaTEeBYsYYGDlKi02C+FIUrWcuQmBVjEg6puibXVgeBkA6IVrCodRQVQUKB6Zb+17MNuz/TJArUAqADotTIwYyM3BsmA/LEsRXnaFFBEIBkbFj3NgdEnRSi9GpoZomJAY/KQzaoT8pAetrpB42B5sMPhEDYQ18DkhQYYBKIgJUNEacWHyx3BAlPbTSohZgHPmzbsarNlS3NIcZ0ljmJ+2pyd3tETwY9ExSgY5l7UKiI4LI4MNKMTEpkJlrlFUaCZLiu6qxwOyK1T0Uo7dndGC041nNA0a9K1IP7MHmOsa2KPq2PkQUqGFH4YdUKjyVnVWCkjylVM0QCoLoxz44Olvd4wBFJcgPK/ts9MRwYTqNjFHMQGqXoV8SQ7M4+smCoONnYW0FggynAYAgyAfxdgEkJAoZCn1yfCzOu17m7RKpJeK/1EyANAiiCKSNVPVgLzOIbs4mWRxVgSih9sVAQEQ1SAhKhgi5CvkfE/rl4XP5kttV2i7xNqihHo1RBuqrITo0txQSvQz90EidH+g4LD+zJ31cR1UgmUqng/ka+KBgIySIMIhB0k8oZPYQ+cwKPcFPV4z+FgnK+gNGSFHeH0gVCGt6sBeShWnPW8dBYyAF+Ykj6U9qZywyQTsVCEc2n/upGnfeD8uTgi43Q2jYyTMTjZy39aQ5fILoMpeh5/A86lnTsAN6rGMrED8H9wMBCnZSIA0+0ZVn5MTeGcozcSI+Z1JQDqPjBEHMjs7LMfglK0DkhgfbaKR26I54ngeYaRwfHXbIOJQCyeyN9ligPwgQxUQQokwEbcTTQAQ8EUtHQzWH0ZG8A5J35NP2LihQnhBkKPU2Uhco0Qjig/6MQpAsQpuMAu0FtfYy4EQJQn8SPjwNGjvaophIQ/XOfZjzwwhLSwwVISrR6sFuOlwQQzs/i564LJ6XhfHtsnfKXsMBmtLCwiQsYJIAYu4QuRqXHtv0YTvD6KxDxSL/cnhIw1Agu8pUoOXVNjD4nv1tM6bT0WJImRlnOEATWdYTAL1RJIIgLNDCBCGRpEX4MJnTkdN5s9SLfwtClRlGsdvkwaIMPU/CUXQDDRl65g9oJPL7fhJTVqBBPzkBEKFNN5QgcrUnItQt9WGFKjsFRfSDBmUF8oHlSnRH0e5GKveLZ8U+4LhzDP0MXpQCuT0pCCIph464haCoOwZjTfPvq+YN1b+ZFET+lSmKAJoqkE7n8FPfVKC5fvyL/R0YDA7lhzf/JSrQMJ+bmmBc4/PfKqQ5b1iDIRqq6sNI5zEgysVo8Al0dCoQvLgHIgnjfv7U+8Th5AhqKNCxo2gcl16dIAwRepr5Mg7Ztp44mrs0EUhyMBAiEcOD9ZehVYna9zyHQBnN5ujLVaChUTRICEQQhC0G8WNv9LlOCtrcnWP3FndvywN8pBKdN6dHPohj0CABonm/eP7awtmLVaBh+NPFUAnqGBARGsKPmW2XuNpcYCj7Q4MPt4hQXhOmm9PPsFy9AQoYad5nGvu36zgmO4wRABoV/FwcPMsQBUHqxxrGAkWZFGQ+TBQob8xq4IgEhQDd+jk1UtGNeULJizjgQKVR79GurFq9Q5qQfAQvWoEGjW0F0nxMCGqqENzN3Yfd6KQgImgE6DXeyziSbioQ6VQgkkWDBiEOKlAYvzx+v4jnDXzgKJ6+bAUyG7zRL+RIZ9UJmmcX0VAhZMv/eTIpCB9GBN2xIwtSZXNfStHsqWAebJ5c0KJv9hOQkGvJPb5P6GkKEd9+yAFAo1OzF0NsTQZCUAQPYpAn9IRFOUEmBfXPh6YR/3azGy+zWnMj9Wl/ZY4UNcuts0Q42eZnj3bF9FxY+vu0R1yCFPA5w40lJloMUTrKBJVqdJ4UJP7rMg7qQH1reiKP35wKNCfYbY1MkzCUtbaNxf7cTEKBRHKGzRXIs+bPkgJxFYSEorDZzu+xfphOChIB0h3GhSGKQUwF8o0R94w+8F/+xC4bejLJMb4CZdXhrjkcoRTy0A4ThGbDDLoWTGxFgnZMiKYLJhsr2Am7TJvT7/dR42IZaJADNc0hAKkrGh77DH77AjZ2CQqEAOfZCMXiVZ8URB52K/wgPf7MJ7Tqyh6qiGxOv+8HIUDZxe3FKlAIiJ/GT7uQKcnJUwRtQ6PjYeZQbvqwO6rRgZAqEJf+UvRrGqmjuRzgmSo7TQXSfyOHQgiIkCBZgcrNYBGCS1+qITsFiUUfXuvQVKLtkM3pZwOHgMPrnShP1nslBWpzQCY51koMHVmCzqhJl9NzEAJCW+pzwsRW5tbnhTy6Qav2Un0mUPZgewmwPgmQpuy9BisQI1tOF/bEJxEkssPtMEcGPjqx9V8kqCMI+x7xeUsdSPN4P6sHGz7gZ9pZ14BJ9e1qp92MU4GQFrvUErEBKqRFagfoogAUizPCicHQjp2lRIHs0F2BXsbnPtoAoGGplNm4BQqMVL6FD1A06cFs87uyUxA+zJ1YtlwA0mYGCpSnAo0RO0876GG4faYAtWX4ENOUMkFJgdrN0labXnzYNT6McrRZbobJBptfpxhapgLNR/lYcuo+2SJQA6Dj/zg4MRSIu5ZZ+bkMaWrIvMQy3oUPW/3iEsQ+0ZqGXUoeFghFH4xG6vMGFtWxSRcRi80MoAngYyM5MT/GN8/DwocRR+O9OByhtyFB4sAQoNv3Y3gw7CWE0SjQBPhxyX5QbMKgESEikY+GarWfPZV/vBD0FnxQILfXo3owJnNMPxyaDECYhEGHsIdEvizO+DIysZTKsxSDOfWaxduRJrOO8d75MQF38ESCpuDCzLYDAIfnbHyI3pidrm3H1jot6MMvOLEsPjyBHxiKEJqpQM97G5LcTDl4npwCBTtJvxeyPmNMJzZb2OKMb1dfpkxMEjGC6O00rF7H82DJg/vtZMMgDIA+eggkk89TKnYAgha/2wJDT8Q+kIkBD814USC25ggB2isH08kscx2Ti4OyzaahQGXMdckd0zrGNdt082JpEvRl9WJkYlqHJgaSqRwI0P16Pw+WknaxiYbSmSID6OPjk1aARxFkQUFxLIpYInZ+YxJkUdDPGgZdfk8SX7OwHQpEFbr+hsLlzfCQBb9l18cAmlBNKDyt4zIRgIKhuS48Hd8qP7Pz6sOWX6wsE7v7kDVIVofp9i5eCdoQoMGNVC5tG4McFbpnOMp6mpQC6ZYCZjaTwx4jmsen5sM8k/+xFoP+IJCmBm0j4ZNjoJ9iZ1/fU6GdX/FKg57RPRlNTiwXlYcOFGgK/PRI+AE0yFeIuQ9bfmOJ2OqDlRONIPyYCJBEQT+FALEr0CAchlvQt5dD88vG8TzXiAJ9RH64oQPECvIDEPSwwvD82iWoEPTlBkG5lBgR9e4s7HUUEc2DzY5ryTHpG8q7qfPTOBh7sDMVBSLkiRM8eSg9om3sM2g+zGtBxX4IgsjByOG9HbY9m6wToLu1e7CPaSDDfQ4Oxi0KSBZ2HHzKMUDQ5wdwY5tv+IX5MCtHFxlCg0x4DB0Y0kq08RNFaFuOMSlLS6v0jX3uYqE+BWo5mlHI3Z1hcKP5wpuRENraatl8mDuxKkGrX9CgDqH+faKNnyhCuwd7cZZ+5MHqpArU1o6RZMisV3lkK52xREhWObsPW9dqYqkHFQnKBDGZI0bgsxFAf18c2AQ82GhMDRpZgVrxezFcalOeMJgQ5Hd2wVgjPq4IzbJZHuYEfbHq4qAPQRA9sL4YOvTn3hzY8uYFCtCz8ckK1HZbLCCVF22AQuDWtEi5sAVnoBtBhHb8j22zMsKg1UYcREnRQIoYGnw8//ImmHmw2f/A/qPu7HachoEozB3MXQVIi7jhp6hFMRJIgYuly/u/Fsat9zB8GiYuSE0m7dZxvGlaH585M05SG108A4WAaQXJLu6DhxGa6eGtnJ8++vxvJBT88Gi74WaTQZ2D3p0agl5VDmIeURJI+Kl76DfWtE0/rlW0ZCAiCLILIIrpJsFSQe4ZjYq2XgmhQGOZNRktBLV51fdfP3y7uLHuwHBtc8fP3cMFgYdtezA6nHEGGou6/fb+KhSFQOc+DTopbGQ4XX4MPvwMnYLEQW8qBTUOagjSzTl+t7edfzp+ppc6/M0V7F9u4CAGWnamqeXryayyuMf/NxKKaGTjE6zZVYeNgoSgGoxdpuY/XoRQNdzf5c7hp3mwgxLo2yoUxwjD6JELw6YEOUaYkEjwN7gDV1GDKKYvuRgaR88zqaBq98+bE+vXijUSajOnXQQJPdI/IiBZ2U7hj9XrNRCwk9mydoV/HcUAV1JE5hpBWAtDQ+ghMkVBNR/04nMDUIeQSKg7swYfxe/NLj+OYStwRoMF6grV5YvLRIOBEsuEji37qb4CggvSibTk6sHl8nE3CUHfqw+ri654flWXhp5qDTyin9PZfa1xFmPEQuofmwuDcv5fZpDB8R2QRTyq1IZzrVZiFA1OGe0/ye5/NB0tBFUG+vL2ri7e7r429zWfcbd/dLQr4ZVFBfNfMxMn1zGQdpY/In4xHFfMXgAV/5fDhFYyiozknJyYlFA1/bT821/LH/atqecLA82XEH6TMshaUfXjJEQGGjKJGxyP+OSxogg0Yf8bSMfcB4f7TgxoAkbbpLz82P3D6zOAhCAHoi/funiuL3Jg5rJWz7ZQMEoFc49sCRjIFtNgwQFERrelUN0nDEkSrCzjYCEFyfYNCd6RyYc1/HS7+3Kq8Onuq+Wg9xo5eofNFNSF/osZj8LoPfIsgkcAXFjxcrrXEgdGSQRBoVfGZXzIdMT9BXaeEvM0VPX0bwz0C0O1+K2ipwGnQ4iTYLYZEFE9aMWWpYUcAwE5uR81OFRvPDQqmwKesExQ5O7LQ0Z70Lp5JDUZRBA9nCqImn09nR6+31f0ONNpQJ7wthDVu2SK+QjmijMS2e2Fwpg1ZL+iFDLVDBUyeEIdTO6ilehr4ojjK4U0bZY9VvWHBLS5IVQ2IKZTFTB6RiIHtivGDFO8N4Eh40xEsiGq3ASIsCWnhwJZWi3iUCy32a0cLAopxJfrLXjW0SC2RSrot6mMp0/8V+CVjUGDKOCgqd4UeBEjhRGXqkUkyeCxZKiH0DTWHObF8Jk9//S9ube0m2uctCCza1R010ACEBmHfYEa9TzHtzrTNyTc8F+GJmAU1tCXMdQTvqGkIwTJcXkGmo4GOnXvtgqEhAXJxG68EihZxECIdihDRXaQjcwcUjRphfRCUlIjlhMGDOmucAR42O+nGDuPJfHPtM/jhZtL5bhgOEywQw4ez0BUgjQL9C/oBKhJGgEa5a+fjbE8ngjmJZ2Cyf/dYU4YSAQ0HXYCKEHeHfhq5TQ0DyKdRQCiBmLnGgCLJlQYPi5RqAKphbJrEzCvkICgR6/xVIlbd21EQh45s1vv7kvm2FT0toZ0Mwsan7LCiMVs6ZWpcmGGvuXoNzgzw8CHPILytzBFbXCO/o1oCPepvwiVQOTtjg4rs8dRR8903PkdCjoE+wrUjisw5cdsWS59ZBDRCG0KjwRvmmcZjDXOt6AJvRDJS4VWqyocd3DsBrG2O05KNjvcSDzvjCRpQZ53dfMbcCrIf9qyLBA1EDGEAIg93elIawC3Ae/kNy+NjZzkd5/H8/StmHgmVgUhjxmp6EnwsVxBMy6zGxYCZUt4jTMQ4qBYPpCf0Q7oQAMoLUt0Ferh1DjVzrBA5OM8MUfry+Nhmj2K6to8HY4vLQjy2FXmHamtQjxbFwQ410HlVD6TgVJHg+yvMdZilxrno8wJBiPZUAypK+hNyYk8DZJMKAsHp+1+gWia5gqk+pymQwXPjkMp7Cq3DjYvNygE/iy4YGuUgaQc3FV+tND906n4ajIX98SNwSyaGzwOZKpbFHtRYsqs2u5iZmE2IjZ6kVsJIEJbk5aMhi2DEBkoM72JkMUe7FY4JQIJAnJAR7qWYJbMlQOTWkMoAmTlX8VA85Wc6ZGcyFDGrssAA2WdQ0I2v4Hqnl4FIIQJYnKVQAVzVNph8XykF/3FTD7oPkcF0uewODwtt7oCg0iClB3HEDPRtGyrRbWURKRxg5AjpamFMJIfEKBHjJbAuY1a7tHUk7eQzqrQM5YVYxT0k7kzyKkcBoLohgW+QN3B8v3vx4KFFT01TSWFiTUjMcH8YPpNdXfZP3xsgI4MErHqLopwjQpTtMx0Lml+wDdCpksMZpUzvvP+6GKSURPYRxo10I8Azc8jg3Uzo4wHLuz0Yw8iwptzenwUflLYd+arXxmG+/PrXQwq0H9zVIS0OH7Q0kMboij4q3eLDNR1qQWuGqgcQ3tAl7nCfUzMasIGAZolM5g1y2u8MLOc3QsojZsKmlVoExbDFe+PVrsEhDRtW0OpRyGzrg2UrYEmr5zSs57tPnwXkYI4wUXP5q6FA04h25oe2u5Fmcz2TIcfAuQHZ/qkxeb3iuhnzcEmZXEipccZ5Ub0CNrWPLfONS+YME4PRoDEZeovhIOZbZICn1MfQYoSWkLEw7vlwl8cPxl525rEo2/AhqTbxRMgsvOOMYMpcKbq4JV99ASVKGtAr3qL5bqpOG4pUBYdHWCRIpaniHbnADeBRUKLHtvWgxXW/gzLZ7hjLT9uDaTiIv4pXrkF3GwDP5/X1TNQu2QHTkSNp+edi2SGyp0jkcKM2HuTlZclcptXpMX+Lb8Q7h6avjPfdLUqrhah5U6Tu5WhNjavrJWU7f7vK5HApHdLGOye70xl4bGgujxnpVQXRQDoAAgGn72W+FnVp4nxhWNzU9pmfYm2tVExI1HV87g1SHfa3ExlMORzkGfxStVLxG+cawId35m9FZ0f/nrsqu1vCAJABhLePCVQU7RAUiDsUP1Gz3yuEG/jkRs8m03LiS/D06glQt+A9QDlExaFxGLFlyFFaCc98TQ+izsYvvO2lUnjnsFSuXwfeq1An5UC6ecFvySf6JEK5tVtxn8SfhG9Sel3h2kJkaFub8xWIN3vm3WEM7566hub7v3VYW5nzB4inpCvLFEyw7qot4SoQIrHSNanFKiREL+An4Rq5jjxre88cFYVX0aaKDk81XlXgfSICz2lSS/enQNWAQ/DfFGqBYWKmyHrytmecfWf6EY1ClRH7DXBU6jw0k0L/aEUKcgnfWfkrGJTFYc0YUXjjXyXSSQICnRMkP00lg+PHPU8sNViydCAs4zo7+IGv+GGuQ3GEgdB2goU7a5sJvTHrOqQhio+n5JHiJo2rH6eJC0tHHvdfyqUAJD9n6mj5HxAlL5PJxr8MQjcpmyt9ijGzlHX4PNhN+zJMLk1vjyA9Ki6Vdju9r9bu8rLbx1HVwjJgapUzyZk0cxH/u4L+8upSc2R1vgOhALWXjg47z6P+UXeGe62DcNAuNiKok/wvf+jrlh+eMFBII45yQzGAkFkUxQlHylKolOHNAPkOVFD4aTz3cWuTEoXgIrlDpsycnyx5/cnicRU2At5ijzMFOnv6Sgi13tLDwDdTxQua08rmZNf2qZQ12W6NywAtEl5Ei1gSJv9EC7CuOfsRskLozF6MakeLdVsPtHnD5zTGUK4vh52Hv5LdAkyprBi5qe86t/38ejzEaze5yIwagF4qKBafi+lFeHvAnCMn/qn9C7z3UVWupreqhGzvq0eyLevOBh2RzK0mdUQ+gZ0KEdJKerAPmQZHx/vjRDBxnqe8rDWa/j9dSHTQ+DKAw1KL5RBbCpITs2sJF4Ugsed7fgDQJ/fNxL9u8pTnUTlJ+RU2xE8SaEo+YR8td7KwIuCKTvnUx4TCIvR0sidQNp8dsVnD4S/lEa4wsFrnojNK+Q0oJZMz0WyFYS7jjJosjF4EU0SOxMsadEt04w+JAYiqzjJODo8zjR4CAnSC7E0u/zYr3nyHojGffotMciYe0S76/FtD59kFdZcGx1+lHWSEXJ5P7EpbB61FyGVlx5I4e7H2QGtz6UDcJXPPC1n2Gj1yUI0LS0fHmje1hwZR+fzU/oW98mceOWNTDWfMRsDpbbj8njNy2EDXGcEa1yfdSd1FYZwhkb6/hMpOnoQsFtniXzePniJs++BAqd8Ok8f8HQO7/nAlIpNVwpBxXwJ6oG0jqp93O/SCdDJmiV3TZPE/AX13OSSeKBN0xBtURyB6BskrzujjNzZNbLigYLErtoY1XAk+Gz4cfXAsNlQT4qLFwtTKQkkAaJ0KE0aq2vUF/PxPjk7tea5hAfi+z1NjJRiNIIQLc7IrbQla0prPiQJyaNhJra2b2gKSKntcv0AVj1Q81gCuWF1ibFL7KOoQUt0k/IpnlBm7Tnn1ebEw6M2GP9Utqci89D5RIRErDwQ6cHwRTmBPRMG1LPgPHFH1tpzDER2rUTBzcEtGUrxfqfxjkPIbZdj1qMW3Hya5iqs3+VJ7tsnDjOT1883fXr5QBhio0dYtHBHyTZrHUYDNbOzEz5+/fwlBLPZvRDnpWLmfNeRrwX2iG7S4/VDAaSUPGY4gRoCzR05Md78ijynDhMVQPlGeVU06wrbU09RBqX3COV87ZGSFD4vAJkNsG8o01Z5LhZCUCeucRPmSInFGfEnD8RRuyLycPPYwRSbtw/y8MdT3ZjDjRjI7PH27dhBG4iRFvHFUFRk+wgIgEzTwFcksFOSqUvb6XDAFbEf3kRGeh0DkekYhcBUD5GPAHCJOipaLMkJON8Tfwrr21Mg4hAvMGdDTRR06qb1wltGUluRsq0B9N//nwEmSuSI1piiSg/Unw/8yW3jLh17zJ3GpDvhR2zwmVjdv2Kgfp/Q8vSUGHxWpJglC+NIyZATXPk6MRDB506Ek4QWHMFizYwtmAmW+BdAi3SOm45T0YoIS1Ubsx6O5jUrhhiabeYHtUECoEoOBUusng/Q4adRVBfrgcNoA1+1To1HDPRlyEwrM+k3xtZYxIDyNEDjc2NY/gUgVwN6unN+iEm1xQGe/TAh2sLXD4B+v94vIlpi8+bRhNFMbMS0wBkE+PysAaS0b4eGsthvFI+PgzbPhtkfp7W8J/zT3rXlyA0CQcDGzgnqDqO5//2SrKWgVQX1dLtgmCi9Hyth3LyqnzB4KynXZ/x9dbKBCTEPepELN6B6GdqQAcwHIQa1pHymjvibawmHSGPUmkDk+9ut9AUei/jP1PBoVZRqTnmpn6Z+H8uagU2X4HuEYRocEV6sBGybmM6cctmFPeRKMW8RkpW0m7KVDKKjnyghEDAMKbRUfgPoaE/GC/4COfhvdn9BjYehb0mZ718A2m72BdNnHu9hAZ1uDms5xEaBMYuz/QZQxwkKCSv4QUTS+WWY78FOSalOpjjRosrTI2SRmXRQSjUbAKIWRQRhIxDw8ZlXFull7jiCs57nSw/sUKfzC0Dl6FcxtI02hz5/I0CcS1/GtBhNqKZ2LxeAWipRRoueDJ3dCZ+fuBxrA3zYLgDlaZ8Ms1W/SFqgMwNQo4sr0ZQsJnI9NunMF4DK3q23wm8178gilyOQw7Nr6ycODjaOTWLlLO/lAlAL5NWxCjSdh/0IAuZQaPa59+kjxkeE/e0CULNhJh8ERDMehK34kdpAR6HoGVSWDsQjnNlNZ74A1OIw2VpBHoyySlsZXBZBEIOpxwrvVstR/gAo13SzZ7BXPm6GQvYdd8wYBDpkKgjkhxXsyU01NwC1DVVELUk8wvl4fdJfLAQdLQhA0whDsLyXBqCvVNA/Sf07dpf55VXjh0+yz6g5NwDlYZf9xpcBAaHFsEwajBEucmR+fAvtcrtvAOocbEVol2jNuYMyRsK8kcWPPiLmLeMVF+ZZcwOQQwXB9DxtghuqPHKE1yFURbuNB0GMq/9CtA+ge2kAaipo3nF+109736+9BKG6H1J6jwiyCb1CsAagFojNOFRqE6aGu3g1U7rkBUegIUygoxCAOrmggT3C3aqwC6UOdbSGC3dirQP7hUCr+5kZQGUTLHgo5a7fNIYDgdGGFrgqaiz1B/momQB0M5SHvPrYE1by9gfyxG2wwhBqODt5FAYQGzGWNcalDDv2CxKpR+yZMunIE4dwXyGHPmwulwFjADUj9pbLqxFcYH1HdHh3cJpwgBMaji0CIwCFd+XlPh5CCj5OkL8Sj4sgtrb6V2shACncIOvKEj3Bh1EYpRYfmYpUmlpzKw3y7m4lM4AagpIgJlX1/yN2Fv+dEwWvbPc1B7oDoFKTIcBykqe+MaYjcOgpgW7hRZR6mlGn4DhzB0AtFIv0BnIvG97hQYQwW3jgZ4g3qx6IZqThhwHEOkhPsIEvTwD08Q3pgto8MTUA07Ml/BCADAS92Kmb8ZZ+g/2t/BCtBS5X2LEwQ8IPAYgQZOQRDRI5Txi90BAxh6QmgosO9exxlccVfzGAmGogml/kymdiKwYwhP1XGDVGkkaSmUEi/BCABPkg7TyqzBoXQdRJzBAP6PWtf3r2WrINoIag42m1ZA9OP7f9y0iY8QL+j48vpnUVXk7k/hCAiMqWjFbg6Zp2vvV6CC4+CGnKiff0a/O0bL4YQEzl3IXa3k7fLHKzswDHcMRRVOKvO37QOM6SXQBqSkhCEES40/zoJS+59Gk8xDz+znbho3k/FoBYCR2GHfOaOH6os9xxRg4vG7MCSdiNzFHde23ejw0gTgntrIUmSRvc9QzZhGAMyqE5fhklUNYh8D/2jawXA8iA0JGsXgsIa1Rmih0cjIeq+nHBKECXXdprYfgwgKIQgl3EJQiolFa0wDXlrzf22e2mpnzcAGJfaGuWzKSZp3j0l5/hDpsVPruC9j88fekLPQ0+MQAxhlb6Kst/GkLPlNKx1YaeKICYSjnrkZ4/Hv//PuAvpcdf/3q0/6bj2H5hp4HnJfoJlT2XIswTR/cAAAAASUVORK5CYII='
      })
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
   
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    chai = false;
    this._triggered = false;
    this.setData({
      opened: false
    });
    InnerAudio_one.destroy();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  goScan: function () {
    app.globalData.toscan = true;
    wx.redirectTo({
      url: '/pages/zongduan/saoma/index',
    })
  },
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})
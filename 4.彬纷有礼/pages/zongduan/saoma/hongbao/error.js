const utils = require("../../../../utils/util");
const app = getApp();
const COS_URL = app.globalData.COS_URL;
const shuoming = "红牛进入中国已经25周年，为感谢广大消费者长期以来的支持和厚爱，即日起至2020年10月31日止，为回馈25年来终端客户及消费者的鼎力支持，大力支持环保，在活动开展区域配合回收并处理带有“箱内码"
const shuoming2 = "”标识的24罐红牛维生素功能饮料纸箱，可通过微信扫描箱内二维码获得"
const shuoming3 = "红包。"
const duijiang = "\n 1．参与活动：微信扫描纸箱内二维码，即可进入【彬纷有礼】小程序，按照页面指引操作，点击【扫一扫】再次扫描箱内二维码，即可领取红包。领取红包后，可在【我的余额】里查看红包记录。余额大于或等于1元即可提现，提现后金额将直接转到微信零钱，提现金额48小时内到账。每日提现次数不得超过5次，每日提现总金额不得超过200元。 " +
  "\n 2．活动截止时间：2020年10月31日，逾期视为自动放弃。" + "\n 3．活动开展地区客户：\n 1)扫码领3元红包活动开展地区:在广东省、海南省范围内的终端客户及消费者。" +
  "         \n 2)扫码领2元红包活动开展地区:在广西省、江西省范围内的终端客户及消费者。"
const zhuyi = "请在参加本活动前仔细阅读本规则中的各项条款，如果您参加了本活动，则红牛公司认为您已理解并同意该规则中的各条款。" +
  "\n 1．红牛公司对促销包装的真实性及有效性有鉴定及确认权。 \n 2．纸箱图样以实物为准，活动站点及相关宣传资料上提供的图片仅供参考。" +
  "\n 3．红牛公司有权按照中华人民共和国个人所得税的相关规定代扣代缴获奖者在本次活动中依法应当缴纳的个人所得税。本次活动所产生的个人所得税由红牛公司依法代扣代缴，奖金和奖品均为税后所得。" +
  "\n  4．如遇不可抗力事件，包括但不限于地震、台风、水灾或其他自然灾害、火灾、爆炸事故、骚乱、战争、政府政策的改变、任何国家主管机关就此次活动做出任何判决、决定、命令，或未能合理控制的任何其他不可预见事件，红牛公司有权在不事先通知的前提下变更或取消本活动。" +
  "\n 5．如果参加者在活动中使用任何不正当的手段参加活动，红牛公司有权在不事先通知的情况下取消其参加活动的资格，同时保留依法追究其法律责任的权利。" +
  " \n 6．红牛公司保留对争议和异议的处理权利。红牛公司对于获奖者因参加本活动所发生的任何直接、间接费用和产生的任何损害不负任何责任。" +
  "\n 7．本规则的解释与适用，以及与规则有关的任何争议，均以中华人民共和国法律为依据。" +
  "\n 活动咨询热线：400-810-1128" +
  "\n （周一至周五8：30-17：30） ";
const shuomings = "红牛进入中国已经26周年，为感谢广大消费者长期以来的支持和厚爱，即日起至2021年3月31日止，凡在活动区域购买带有“箱内码红包"
const shuomings2 = "”标识的24罐装红牛维生素功能饮料，可通过微信扫描箱内二维码获得相应金额的红包，最高有机会赢取25元"
const shuomings3 = "红包。"
const duijiangs = "\n 1.参与活动:微信扫描纸箱内二维码，即可进入【彬纷有礼】小程序，按照页面指引操作，点击【扫一扫】再次扫描箱内二维码，即可领取红包。领取红包后，可在【我的余额】里查看红包记录。余额大于等于0.5元即可提现（金额需为0.5的整数倍），提现后金额将直接转到微信零钱，提现金额48小时内到账。每日提现次数不得超过5次，每日提现总金额不得超过200元。 " +
  "\n 2.活动截止时间：2021年3月31日，逾期视为自动放弃。" + "\n 本次活动范围：\n 广东、海南、福建、浙江、江苏、上海、贵州、四川、重庆、云南、广西、湖南、湖北、河南、江西、安徽范围内的终端客户及消费者。"
const zhuyis = "请在参加本活动前仔细阅读本规则中的各项条款，如果您参加了本活动，则红牛公司认为您已理解并同意该规则中的各条款。" +
  "\n 1．红牛公司对促销包装的真实性有鉴定及确认权。 \n 2．纸箱图样以实物为准，活动站点及相关宣传资料上提供的图片仅供参考。" +
  "\n 3．红牛公司有权按照中华人民共和国个人所得税的相关规定代扣代缴获奖者在本次活动中依法应当缴纳的个人所得税。本次活动所产生的个人所得税由红牛公司依法代扣代缴，奖金和奖品均为税后所得。" +
  "\n 4．如遇不可抗力事件，包括但不限于地震、台风、水灾或其他自然灾害、火灾、爆炸事故、骚乱、战争、政府政策的改变、任何国家主管机关就此次活动做出任何判决、决定、命令，或未能合理控制的任何其他不可预见事件，红牛公司有权在不事先通知的前提下变更或取消本活动。" +
  "\n 5．如果参加者在活动中使用任何不正当的手段参加活动，红牛公司有权在不事先通知的情况下取消其参加活动的资格，同时保留依法追究其法律责任的权利。" +
  " \n 6．红牛公司保留对争议和异议的处理权利。红牛公司对于获奖者因参加本活动所发生的任何直接、间接费用和产生的任何损害不负任何责任。" +
  "\n 7．本规则的解释与适用，以及与规则有关的任何争议，均以中华人民共和国法律为依据。" +
  "\n 活动咨询热线：400-810-1128" +
  "\n （周一至周五8：30-17：30，法定节假日除外） ";
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
let hnTypeArr = app.globalData.hnTypeArr; //红牛箱内码红包类型
let zmTypeArr = app.globalData.zmTypeArr; //战马箱内码红包类型
//记录日志
let log = require("../../../../utils/log.js");
// 往期红牛活动类型对应周年
let pre_act_hn_obj = app.globalData.pre_act_hn_obj;

//活动规则图片
const act_rule_obj = app.globalData.unboxActRuleObj;

// 跳转小店优惠
import {
  xdyhMini,
  reportEvent
} from '../../../../api/openMiniProgram';
import {
  getConfig
} from '../../../../api/config';
import { debug } from '../../../../utils/log.js';
Page({
  data: {
    shuoming: shuoming,
    shuoming2: shuoming2,
    shuoming3: shuoming3,
    duijiang: duijiang,
    zhuyi: zhuyi,
    shuomings: shuomings,
    shuomings2: shuomings2,
    shuomings3: shuomings3,
    duijiangs: duijiangs,
    zhuyis: zhuyis,
    zmshuoming: zmshuoming,
    zmshuoming2: zmshuoming2,
    zmzhuyi: zmzhuyi,
    pageReady: 0,
    guideMask: false, //自定义蒙层
    goYuer: false, //红包是否本人领取：true，可以点击跳转我的余额
    rule: 0, //一期活动规则
    rules: 0, //二期活动规则
    huodongrule: app.globalData.COS_URL + "/public/img/to2/huodongrule.png", //红包规则图片
    year25: app.globalData.COS_URL + "/public/img/to2/25year.png", //25周年白底图片
    ikonw: app.globalData.COS_URL + "/public/img/to2/ikonw.png",
    hbdata: '',
    type: 1,
    yuerText: "点击查看余额",
    isRedBullType: true, //判断是否是红牛类型，默认true
    error_hn_banner: COS_URL + '/public/img/WarHorse/2022/01/error_hn_banner_3.png',
    error_hn_msgbox: COS_URL + '/public/img/bfyl/202201/error_hn_msgbox01.png',
    error_hn_foot: COS_URL + '/public/img/WarHorse/2022/01/error_hn_foot.png',
    icon_question: COS_URL + '/public/img/WarHorse/2022/01/icon_question.png',
    icon_zm_bottom: COS_URL + '/public/img/WarHorse/2022/01/icon_zm_bottom01.png',
    icon_zm_actrule: COS_URL + '/public/img/WarHorse/2022/01/icon_zm_actrule.png',
    icon_zm_logo: COS_URL + '/public/img/WarHorse/2022/01/icon_zm_logo.png',
    icon_zm_activity: COS_URL + '/public/img/WarHorse/2022/01/icon_zm_activity03.png',
    error_zm_msgbox: COS_URL + '/public/img/WarHorse/2022/01/error_zm_msgbox.png',
    tips: '',
    icon_zm_btn: COS_URL + "/public/img/WarHorse/2022/01/icon_zm_btn.png",
    icon_hn_27th: COS_URL + '/public/img/bfyl/202201/icon_hn_27th.png', //红牛第27周年
    icon_hn_title: COS_URL + '/public/img/bfyl/202201/icon_hn_title.png', //红牛27周年标题
    zm_activity_four_rule: COS_URL + '/public/img/bfyl/202202/img_zm_26th_rule.png', //活动类型4规则详情
    pre_act_hn: 27, //往期红牛活动类型，默认27
    pre_act_zm: false, //往期战马活动类型，默认false
    logo_hn_path: COS_URL + '/public/img/bfyl/202206/logo_hn_', //红牛logo 注意后面拼接尾缀.png
    hn_banner_type56: COS_URL + '/public/img/bfyl/202208/bg_hn_type56.png', //箱内码类型56，奖金最高10元
    img_zm_main: COS_URL + '/public/img/bfyl/202212/img_zm_main_test2.png', //战马类型8 主图
    img_bg_zm: COS_URL + '/public/img/bfyl/202212/img_bg_zm.png', //活动类型8 背景
    icon_btn_yuer: COS_URL + '/public/img/WarHorse/2022/01/icon_zm_btn.png', //查看余额按钮
    icon_btn_help: COS_URL + '/public/img/WarHorse/2022/01/icon_zm_help.png', //查看助力按钮
    // 2023年2月9日 红牛28周年
    img_hn_banner_28y: COS_URL + '/public/img/bfyl/202302/img_hn_banner_28y.png', //28周年背景
    icon_hn_28y: COS_URL + '/public/img/bfyl/202302/icon_hn_28y.png',
    // hn_28y_msgbox: COS_URL + '/public/img/bfyl/202302/img_hn_28y_open.png',
    hn_28y_msgbox: COS_URL + '/public/img/bfyl/2023/05/img_hn_28y_open_1.png',
    btn_check_help: COS_URL + '/public/img/bfyl/202302/btn_check_help.png',
    btn_check_yuer: COS_URL + '/public/img/bfyl/202302/btn_check_yuer.png',
    icon_hn_28y_clear: COS_URL + '/public/img/bfyl/202302/icon_hn_28y_clear.png',
    img_hn_bg_28y: COS_URL + '/public/img/bfyl/202302/img_hn_bg_28y.png',
    icon_query: COS_URL + '/public/img/bfyl/202302/icon_query.png',
    btn_get_benefit: `${COS_URL}/public/img/bfyl/2023/09/btn_get_benefit.png`, //2023年5月19日 领取更多福利按钮 9月20号换图
    btn_go_receive: `${COS_URL}/public/img/bfyl/2023/05/btn_go_receive.png`, //前往领取按钮
    banner_reward: `${COS_URL}/public/img/bfyl/2023/05/banner_reward.png`, //福利banner
    config: '', //引流配置
  },
  onLoad: function (options) {
    console.log("error页面参数:", options)
    log.addFilterMsg("scanError");
    log.error("扫码异常页传参：", JSON.stringify(options));
    var that = this;
    if (options.msg) {
      if (options.msg == '您已经领取过该红包了') {
        this.setData({
          goYuer: true
        });
      }
      this.setData({
        msg: options.msg,
      });
    }
    if (options.tips) {
      this.setData({
        tips: options.tips,
      })
    }
    if (options.type) {
      this.setData({
        type: options.type,
      })
      // 判断是红牛还是战马箱内码活动类型
      if (hnTypeArr.includes(+options.type)) {
        //pre_act_hn:往期活动25、26周年
        let pre_act_hn = pre_act_hn_obj[+options.type] || this.data.pre_act_hn;
        this.setData({
          isRedBullType: true,
          pre_act_hn
        })

      }
      if (zmTypeArr.includes(+options.type)) {
        let pre_act_zm = false;
        if ([4, 5, 6, 7].includes(+options.type)) {
          pre_act_zm = true;
        }
        this.setData({
          isRedBullType: false,
          pre_act_zm
        })
      }
    }
    log.info("isRedBullType:", this.data.isRedBullType);
  },
  async onReady() {
    // 判断红包类型，红牛战马顶部导航栏显示不同颜色
    let {
      pre_act_hn,
      isRedBullType
    } = this.data;
    if (isRedBullType) {
      let bgcolor = '#d82731';
      if (pre_act_hn == 28) {
        bgcolor = '#d72019'
      }
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: bgcolor,
        animation: {
          duration: 100,
          timingFunc: 'easeIn'
        }
      })
    } else {
      wx.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#ffffff',
      })
    }
    /// 获取引流配置
    try {
      let config = utils.getCache('xdyzConfig230810');
      if (config) {
        this.setData({
          config:JSON.parse(config)
        })
      } else {
        let res = await getConfig();
        let {
          code,
          data
        } = res;
        if (code == 1 && data.ad1) {
          utils.setCache('xdyzConfig230810',JSON.stringify(data),1800)
          this.setData({
            config: data
          })
        } else {
          this.setData({
            config: null
          })
        }
      }
    } catch (error) {
      console.log("初始化配置error：", error);
    }
  },
  onShow: function () {
    this.setData({
      pageReady: 1
    })
    let userdata = wx.getStorageSync('userdata');
    if (userdata && userdata.condition == 2) {
      this.setData({
        yuerText: '点击查看助力',
        btn_check_hn: this.data.btn_check_help
      })
    } else {
      this.setData({
        yuerText: '点击查看余额',
        btn_check_hn: this.data.btn_check_yuer

      })
    }
  },
  //活动规则
  showRule: function () {
    let type = this.data.type;
    if (type == 1) {
      this.setData({
        rule: 1
      })
      return
    }
    // [2,3,50,51,52] 红牛箱内码任务红包  +type:转换为number类型
    if ([2, 3, 50, 51, 52].includes(+type)) {
      this.setData({
        rules: 1
      })
      return
    }
    let url = act_rule_obj[+type];
    if (url) {
      console.log("活动规则地址：", url);
      return wx.previewImage({
        urls: [url],
      })
    }

  },
  //关闭活动规则弹窗
  iknow: function () {
    this.setData({
      rule: 0,
      rules: 0,
      zmrule: 0
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //获取上一个页面
    if (prevPage) {
      prevPage.setData({ //修改上一个页面的变量
        hided: true
      })
    }
  },
  onHide: function () {
    this.setData({
      guideMask: false
    })
  },
  //跳转yuer页面
  goYuer: function () {
    if (!this.data.goYuer) {
      return false;
    }
    //检查用户手机号,存在则跳转
    var userdata = wx.getStorageSync('userdata');
    if (userdata && userdata.mobile) {
      //本地缓存用户信息
      let url = '';
      if (userdata.condition != 2) {
        url = "/pages/zhongduan/geren/yuer/index"
      } else {
        url = "/pages/zhongduan/geren/zhuli/index"
      }
      wx.redirectTo({
        url: url,
      })
    } else {
      //请求接口获取最新数据
      utils.getUserInfoNew()

    }
  },
  // 打开小店有惠小程序
  openXdyh(event) {
    // 2023年9月4日 新增点击事件埋点：img图标，btn按钮
    let {type=''} = event.currentTarget.dataset;
    if(type){
      let event_name = type == 'btn'?'click_gobtain':'click_picture';
      let { platform='' } = app.globalData.systemInfo;
      let event_data = {
        "devices": platform
      }
      reportEvent(event_name, event_data)
    }
    let {
      config
    } = this.data;
    if (config) {
      xdyhMini({
        path: config.ad1.url,
        halfScreen: config.boxCode
      });
      
    }
  },

})
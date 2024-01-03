// pages/couponActivity/component/box-progress.js
let num = ''; //开箱数
let minNum = ''; //最低开箱数
let kpi_num = ''; //开箱基数
let maxNum = ''; //最大开箱数
let percent = ''; //百分比
let progressPercent = ''; //进度条百分比
let maxCoupon = ''; //最多可获得奖券数
let curTarget = ''; //区间的情况，当前的目标
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    actInfo: {
      type: Object,
      value: {},
      observer: function (actInfo) {
        console.log("组件初始化数据actInfo：", actInfo)

        if (actInfo) {
          let type = actInfo.issues == 4 ? 1 : 2;
          this.setData({
            type: type
          })
          //4：基数 6：区间类型
          if (actInfo.issues == 4) {
            this.initBase(actInfo);
          } else if (actInfo.issues == 6) {
            this.initSection(actInfo);
          }
        }

      }
    },
    type: {
      type: Number,
      value: 1,
      observer: function (val) {

      }
    },

    actEnd: {
      type: Boolean,
      value: false, //活动结束
      observer: function (num) {}
    },
    baseProgressShow:{
      type:Boolean,
      value:true
    }

  },
  options: {
    styleIsolation: 'apply-shared'
  },
  /**
   * 组件的初始数据
   */
  data: {
    num: '',
    minNum: '',
    maxNum: '',
    maxCoupon: '', //最多券数：新一期东莞活动为8月基数乘以倍数
    percent: '', //最低开箱百分比
    progressPercent: '', //进度条百分比
    icon_box: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG8AAABJCAMAAAAE7oh5AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAACuUExURUdwTHgkDL1zDJk/EOJjGfuvB4MxC8V6DPapB4E7ANSICf66C/66C81WFt+YC+6bBPCnCvUOGf61CP64Cv+vBPkmHPcaGvYSGv+sA/68DPozHvs4HvkrHfovHfggG/YVGv+xBf1IIP6yBvxCH/5OIfgiHPcdG/YXGvw8H/9TIfE3HXs5JeQ7G/agB+hcMvezDOKdDe+sDfRIHtaFCN5JGOaRBfJyGJNRILx5GLBqGbKEBYcAAAAQdFJOUwAwnFTHLxwO5gVvyp3Q6qzkU8dsAAAD00lEQVRYw92ZDVvaMBCAZQxKERUoHy2gYotSunbFqt32///YckkurbQXqgbns5fSR4Hcy4U0OcLZ2SFWf3DuCZI8//lW8jxxROvzQd86O0Z3IF2eu7sdzeejNzMfzbMEgww6Wpvdxxd6+TtUhXM3VkZNjhZ2pJcuRh9jqlI87xzXJfej96Y3h5bstFXCHiG0mc7x4MN2p/OPc1sI67t04EjGy7kJpj6PBl1al11H6fJbM2wwotevEZ7js+7D1hAJhuzZ1fTGyG5miG0gI9YlOECdfz8zRoJBq59gD99L/mCKm1muOu2wQ+2iO2/MEaioh5eE5SPBvTFuVipqh/StpgZp4Jt+sm9lkjXpWyPXJplg1Hf6FuwerYoDHli8yzdBFhRLdr+OOKvSeaFDRaV9S5poIXRRrE7g07Ro4AspQBjFhzDjkmwSuqTPRci2QQi659eAMND4kAOfXfgCijDL4jiZuK9InuMooKn32bZtJcmQH8kdRZBFcT5hPeTjwXDzOMsCso2K2mGOQmdZ3UQwpH13LL+EDW1/4svDZ//4zHen8cmoHctCIdN1u60XZEOSZc+JX+E5y+gmKmq720Uh17WfkB0J+MYVwEe12Kio7RYIMb3WVa8Jl5cpVwz3gPRdXjZqe9WSCYKuzYfa65HHhwPvMbHuj9N0uE+hftv/4PwRtdD+MZVfUKB65QWeqEsAGFEyXLslElS+wgQumPTEBzSGGwN9zm/h+1XySVPJBjcYUf5kLa74PuGTE0Lhw/x88EEa6BNJifzg4DZH1V1cB4gLp4lvXUpP5Ef4KvlVfIbzK4z/a37OJ+fnnSQ/4np4S34g7B31yfzgD/SJh5v62ji/gK/V/oZ8p7m4GEKkJzm/iLgXF5oWKmoxf8r1YY/o52v+rvd8Ck7Xcn3Y0E1U1NL6wJfb7iNCrCy7DfeJ6o4nJis97XqkopbWPyFMEf36N6kQ63wqanl954OUDWg22FPP0a7vL0qD4yrRre+bVAT1vEp9xjdC4BlN/ZLFuXsIq1/o8uVOBk1rfXwZczTVFhRMFV2UaVrIoDX5qeuHrgfDsK7ezVhlSvuQGh+fkjwn1BS8AVbz6ojCKNTAd18In4T6KsDq+YgdIVcu8cx08FRINNLld8SH31lK5+OMSZ+q7xbNiY6+QkU14luY8Bn9Pt3AZ3S/wP8yvn+2//LZvnuTNPDdmKTB/pJZ3/H9pQeTNNjPmpmkwX6WWd/x/aWtSRr4bk3ifj3f3CQN9uvM+oj9upJvZBLSZ5/WN+lWfh47qa/6A1mnd0pfp+6X8N6pfFeF7i+VWvUo/4PgfwAAAABJRU5ErkJggg==',
    icon_box_section: 'data:image/png;base64,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',
    icon_box_grey: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF4AAABECAMAAAA/QXKhAAAAe1BMVEUAAACvr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+wsLCvr6+vr6+vr6+vr6+vr6+vr6+vr6/k5OSvr6+0tLTi4uLFxcXg4ODY2NjV1dXc3NzOzs6zs7PT09PCwsKxsbHe3t7Kysq4uLiwsLC7u7u2trbQ0NC+vr5flrUIAAAAE3RSTlMA+/jsmvMsFQoC3qR7QMy4imxDCsj2SQAAAWhJREFUWMPt1lmPgjAUhmE2d53tfJS1sgn6/3/hjKVxZIYLlUOipO9NL4xPywkBrEvLjzVYmr3Prb+tPBt8vS26+twF6mNBIgCCkB4qPP+XqDjWgLO71nc25J6IRIZ8Tw+3z5GpVcL+ujq7jSahnwLIiAYUSZTnNangXOazdOEXalcclD7AP0BdfeFjbek2Wg0lUhpYCj/U+3y2+gIoqR3NiQZ3QqDWErOV4j00Qh0+RzKcTw65Or5osFW8i1TvlxFDGUo9JlfxgKBzFWIOPkalVgFovr0qSMHBC6ln3OVTZMRShmMPHyDl4VMEPXyNiIePUPfwPgoePkHTw+cQPLxA3sMDxBRg+NfhYx/d/JiTV3rXZ+L7fwQMPyUebffwuKn//G2Nz9MlnuH8Zvhp809z3+vu4J/pmWP4W1/lL/Qh8tpfaYY3vOENb/gp8PEYfKx5B1XIz4cVbMVvMFKe4peegxGabVeW9Q2eZs00oPZCXgAAAABJRU5ErkJggg==',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //issues:4 基数类型
    initBase(actInfo) {
      //开箱数
      num = actInfo.s_num;
      //最低开箱数
      minNum = 0;
      kpi_num = actInfo.kpi_num; //开箱基数
      //最高开箱数：基数*倍数 向上取整
      maxNum = Math.ceil(kpi_num * actInfo.kpi_1);
      // maxNum = maxNum > 40 ? 40 : maxNum;
      percent = minNum / maxNum * 100;
      progressPercent = num / maxNum * 100;
      //最高开箱数*0.5倍，向上取整
      maxCoupon = Math.ceil(maxNum * 0.5);


      // 超出100部分统一显示100%
      if (progressPercent > 100) progressPercent = 100;
      this.setData({
        num: num,
        minNum: minNum,
        maxNum: maxNum,
        percent: percent,
        progressPercent: progressPercent,
        maxCoupon: maxCoupon,
      })
      // console.log(num,minNum,maxNum,maxCoupon,percent,progressPercent)
      wx.hideLoading({
        success: (res) => {},
      })
    },
    //issues:6区间类型
    initSection(actInfo) {
      //开箱数
      num = actInfo.s_num;
      //最低开箱数
      minNum = actInfo.calc.mode[0][0];
      let modeLength = actInfo.calc.mode.length
      maxNum = actInfo.calc.mode[modeLength - 1][0];
      progressPercent = num / maxNum * 100;
      //最多可获得券数，calc.mode数组最后一项，第三个值
      maxCoupon = '';
      // if(num>=5){
      progressPercent = progressPercent * 1.2;
      // }
      // 超出100部分统一显示100%
      if (progressPercent > 100) progressPercent = 100;
      curTarget = minNum;
      let targetSection = '';
      let modeArr = actInfo.calc.mode;
      //找出当前开箱目标所在区间
      let curr_index = 0
      for (curr_index = 0; curr_index < modeArr.length; curr_index++) {
        if (num <= modeArr[curr_index][1]) {
          console.log("modeArr[i],num:", modeArr[curr_index], num)
          targetSection = modeArr[curr_index];
          break
        }
      }
      //当前区间+1
      curr_index += 1;
      // curr_index == 4 ? 3 : curr_index;
      let nextSectionArr = [];
      if(curr_index < 4){
        nextSectionArr = modeArr[curr_index];
      }
      console.log("当前区间:", targetSection);
      console.log("下一个区间:", nextSectionArr);
      let curRewardNum = minNum;
      if (targetSection) {
        curTarget = targetSection[0];
        curRewardNum = targetSection[2];
        maxCoupon = targetSection[2];
      } else {
        maxCoupon = actInfo.calc.mode[modeLength - 1][2];
      }
      //计算开箱目标所占百分比
      let sectionArr = modeArr.map((item, index) => {
        let percent = item[0] / maxNum * 100;
        if (index > 0) {
          // percent *= 0.75;
          if (percent > 100) percent = 100;
        } else {
          percent = 5;
        }
        return {
          percent,
          num: item[0]
        }
      })
      console.log("区间数组sectionArr:", sectionArr, progressPercent);

      this.setData({
        num: num,
        minNum: minNum,
        maxNum: maxNum,
        progressPercent: progressPercent,
        maxCoupon: maxCoupon,
        curTarget,
        sectionArr,//当前区间
        nextSectionArr,//下一个区间
        curRewardNum,//当前已获得奖券
      })
      wx.hideLoading({
        success: (res) => {},
      })
    }
  },

  attached() {

  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      // console.error("lifetimes attached");
    },
    moved: function () {
      // console.error("lifetimes moved");
    },
    detached: function () {
      // console.error("lifetimes detached");
    },
  },
})
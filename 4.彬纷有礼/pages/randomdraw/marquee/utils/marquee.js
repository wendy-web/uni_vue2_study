/**
 * @description 跑马灯游戏逻辑部分
 * @author pfan
 * * 调用方式：
 * 
 * 例如：import Marquee from "./utils/marquee.js"
 * 
 * wxss 文件需要引入 marquee.wxss
 * `@import './utils/marquee.wxss'`
 * 
 * wxml 文件需要引入 marquee.wxml
 * 例如：<import src="utils/marquee.wxml" />
 *      <template is = "marquee" data="{{...marquee}}"></template> 
 * 
 * js 中调用
 * 
 *  this.marquee = new Marquee(this, {
 *    len: 9, //宫格个数
 *    ret: 9, //抽奖结果对应值1～9
 *    speed: 100,  // 速度值
 *    callback: () => {
 *      //结束回调    
 *    }            
 *  })

 */



export default class Marquee {
  constructor (pageContext, opts) {
    this.page = pageContext
    this.len = opts.len || 9
    this.ret = opts.ret
    this.speed = opts.speed
    this.isStart = false
    this.endCallBack = opts.callback
    this.page.start = this.start.bind(this)
  }

  start () {

    let { idx,  len, isStart } = this
    let ret = this.page.data.ret;
    let speed = this.page.data.speed;

    if(isStart)return
    this.isStart = true;
    
    this.page.setData({
      marquee:{
        gameMask:true

      }
    })  
    let range = Math.floor(Math.random()*2 + 2)
    let count = 0;
    let spd2 = speed*2
    !(function interval(self){
      setTimeout( () => {
        count++
        if(count > range * len){
          speed = spd2
        }
        if(count != (range + 1) * len + ret ){
          interval(self)
        }else{
          self.isStart = false
          self.endCallBack && self.endCallBack()
        }
        self.page.setData({
          marquee: {
            gameMask:true,
            idx: count % 9  == 0 ? 9 : count % 9
          }
        })
        
      }, speed)
    })(this)
  }

  reset () {
     this.page.setData({
      marquee: {
        idx: ''
      }
    })   
  }

}

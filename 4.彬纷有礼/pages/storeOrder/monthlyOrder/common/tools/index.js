/**状态已注册 */
const _STATUS_ = {1:'待确认',2:'待配送',3:'待核销',4:'已完成',5:'已取消'}
const _STATUS_ICON_ = {1:'/pages/storeOrder/static/icon_status_1.png',2:'/pages/storeOrder/static/icon_status_7.png',3:'/pages/storeOrder/static/icon_status_8.png',4:'/pages/storeOrder/static/icon_status_9.png',5:'/pages/storeOrder/static/icon_status_cancel.png'}
//处理请求参数
function getParams(type){
  switch (Number(type)){
    case 0://全部
    return {status:0,pay_type:2}
    case 1://待受理
    return {status:1,pay_type:2}
    case 2://待配送
    return {status:2,pay_type:2}
    case 3://待收货
    return {status:3,pay_type:2}
    case 4://待结算
    return {status:4,pay_type:2,is_pay: 2}
    case 5://已完成
    return {status:4,pay_type:2,is_pay: 3}
 }
}

//获取订单当前状态文字
function getStatusText({type,status,rev_status,p_amount},isNeedIcon){
      //设置状态名称      
      let statusText = _STATUS_[status] 
      let statusIcon = _STATUS_ICON_[status]
      let textColor = '#E3001B'
      /**待接单 */
      if(status == 1&&type == 2){ 
        statusText = '待接单'
        statusIcon = '/pages/storeOrder/static/icon_status_djd.png'
      }
      /**待收货 */
      if(status == 3&&rev_status ==2){
        statusText = '待收货'
        statusIcon = '/pages/storeOrder/static/icon_status_3.png'
      }
      /**待结算*/
      if(status == 4&&Number(p_amount) ==0){
        statusText = '待结算'
        statusIcon = '/pages/storeOrder/static/icon_status_djs.png'
      }

      if(statusText == '已取消'){
        textColor = '#797979'
      }

      if(statusText == '已完成'){
        textColor = '#00AF29'
      }



      if(isNeedIcon){
        return {
          statusText,
          statusIcon,
          textColor
        }
      }

      return {
        textColor,
        statusText
      }
}

//获取按钮控制
function  getToolsBtn(statusText,condition){ 

  let toolsBtns = []
  
  switch (statusText){
    case "待确认":
      if(condition == 1){
        toolsBtns = [{name:'拒绝',key:'refuse',isPlain:true},
                     {name:'确认订单',key:'confirmOrder'}]
      }
    break
    case "待配送":
      toolsBtns = [{name:'催送货',key:'urgeDelivery',isPlain:true}]
    break
    case "待收货":
      toolsBtns = [{name:'确认收货',key:'confirmReceipt'}]
    break
    case "待接单":
      if(condition == 1){
        toolsBtns.push({name:'取消订单',key:'cancel',isPlain:true})
      }
        toolsBtns.push({name:'催接单',key:'urgeOrder',isPlain:true})
    break
    case "待结算":
      if(condition == 1){
        toolsBtns.push({name:'确认结算',key:'confirmSettle'})
      }
    break
    case "待核销":
    case "已完成":
    case "已取消":
    break
  }

  return toolsBtns

}

module.exports = {
  getParams,getStatusText,getToolsBtn
}

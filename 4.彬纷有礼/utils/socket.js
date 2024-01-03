const log = require('./log')
/*socket 是否已连接*/
let isOpenSocket = false;
/* 心跳包定时器 */
let heartbeat = false;
/*定时重连*/
let loopAgain = false;
/**/
let LOGCOUNT = true
//获取小程序版本号
const getVersion = wx.getAccountInfoSync();
const envVersion = getVersion.miniProgram.envVersion || 'release';
console.log("获取小程序版本：", envVersion, getVersion);
log.info("getVersion:", getVersion);
const SOCKETURL = envVersion == 'release' ? 'wss://socket.y1b.cn/txc/' : 'wss://new-test.y1b.cn/wss/'; //正式、测试; 
//消息回调
let _loopBack = {}
//未处理队列
let _queueTask = []
//钩子 用于判断 是否继续释放队列
let _hooks = {}
//当前tab页
let _currTab = ''

/** 添加socket回调 */
function addLoopBack(attr,func){
  //注册
  _loopBack[attr] = func
  _currTab = attr//当前tab
  //仅个人和店铺码特殊处理
  if(['geren','storeQr'].includes(attr)){
    //注册钩子 
    if(!_hooks[attr])_hooks[attr] = 'recovery'
    //当前钩子已回收才释放队列
    if(_hooks[attr] === 'recovery'){
      releaseQueueTask()
    }
  }
}
/**清除当前tab状态 处理*/
function cleanCurrTab(){
  _currTab = ''
}
/**释放当前钩子 处理*/
function cleanCurrHook(attr){
  _currTab = ''
  _hooks[attr] = 'recovery'
}

/**释放队列 */
function releaseQueueTask(){
  //token
	const islogin = wx.getStorageSync('islogin')
  //队列里有消息没处理，并且是在个人和店铺码页
  let size = _queueTask.length
  if(size === 0||!islogin||!['geren','storeQr'].includes(_currTab))return 
  //先进先出原则
  let item = _queueTask[0]
  //已经释放过并且 attr不等于当前释放者，则关闭之前释放打开的弹窗
  if(item.attr&&item.attr != _currTab){
    cleanNextHooks(item)
  }
  //推送给了谁？
  item.attr = _currTab
  //推送监听者
  _loopBack[_currTab](item.data,item.id)
  //修改钩子状态 已释放
  _hooks[_currTab] = 'release'
}

/**清除同类 释放未回收 */
function cleanNextHooks(item){
  
  let keys = Object.keys(_hooks)
      
  keys.forEach(function(key){
     
    let state  = _hooks[key]
    if(state == 'release'){
      //...item  避免影响源数据
      _loopBack[item.attr]({...item.data,clean:true})
      //直接释放
      _hooks[key] = 'recovery'
    }
  })

}

/**处理回调 */
function releaseQueueTaskBack(id){
  //删除当前消息，防止重复处理
  let _index = _queueTask.findIndex(item=>item.id == id)
  /**如果为 -1 可能其它地方已处理 */
  if(_index !=-1){
    let {ckey,attr} = _queueTask[_index]
    //回复socket
    sendMessage({
      type:"Msgs-clear",
      ckey
    })
    //清除防止多次弹窗
    _queueTask = _queueTask.filter(item=>item.id != id)
    //修改钩子状态--回收钩子
    _hooks[attr] = 'recovery'
  }
  //继续释放
  releaseQueueTask()
}


/* 连接方法*/
function socketConnect() { 
	//用户数据
	const token = wx.getStorageSync('token')
	//可以打印日志
	LOGCOUNT = true
	/*是否已经连接*/
	if (isOpenSocket) return;
	/*设置开启连接状态*/
	isOpenSocket = true;
	/*发起连接*/
	wx.connectSocket({
		url: SOCKETURL//baseUrl.replace('https', 'wss') + '/wss/'
	});
	/*连接打开事件的回调函数*/
	wx.onSocketOpen(function(res) {
		/*清除loop重连定时器*/
		if (loopAgain) {
			clearInterval(loopAgain);
			loopAgain = false;
		}
		/*没有token直接调关闭*/
		if (!token) return closeSocket();
		//获取用户信息
		let accountInfo = wx.getAccountInfoSync ? wx.getAccountInfoSync() : {
			miniProgram: {
				version: ''
			}
		};
		//获取设备信息
		wx.getSystemInfo({
			success(res) {
				res['token'] = token;
				res['type'] = 'Login-index';
				res['mini_version'] = accountInfo.miniProgram.version;
				//发送消息
				sendMessage(res);
				if(LOGCOUNT){
					log.setFilterMsg('getSystemInfo');
					log.error(JSON.stringify(res));
					LOGCOUNT = false
				}
			},
			fail(res) {
				//发送消息
				sendMessage({
					type: 'Login-index',
					token: token,
					mini_version: accountInfo.miniProgram.version
				});
			}
		});
		//开启心跳包发送
		if (!heartbeat) heartbeat = setInterval(function() {
			sendMessage(1);
		}, 30000);
	});
	//连接被关闭
	wx.onSocketClose(function(res) {
		console.log('onSocketError', res, loopAgain)
		isOpenSocket = false;
		if (!loopAgain) loopAgainConnect();
	});
	//wss连接错误
	wx.onSocketError(function(res) {
		console.log('onSocketError', res, loopAgain)
		isOpenSocket = false;
		if (!loopAgain) loopAgainConnect();
	});
	//接收消息
	wx.onSocketMessage(function(res) {
		console.log('onSocketMessage', res)
		let tempSocket = res.data&&JSON.parse(res.data);
    if (tempSocket.type == 'relogin') return closeSocket();
    console.log('onSocketMessage',res)
    if (tempSocket == 1) {
       sendMessage(tempSocket)
    }else{
      //执行所有注册的回调
      for(let attr in _loopBack){
        //执行回调 'geren'需要特殊处理
        if(attr !== 'geren'){
          _loopBack[attr](tempSocket)
        }
      }
      //如果是个人相关socket消息，并且还未注册事件，先将消息存储后再分发
      if(['ess','act_1','act_2','order_1','rec','public'].includes(tempSocket.type)){
        //添加队列
        addQueue(tempSocket)
      }
    }
	});
}

/**socket消息队列新增处理 */
function addQueue(tempSocket){

  let ckey = tempSocket.data.ckey||tempSocket.type

  switch(tempSocket.type){
        /**活动结果 活动奖励发放*/
        case 'act_2':
          let {pro_id} = tempSocket.data.msg
          addQueueTask(ckey+pro_id,ckey,tempSocket)
        break
        /**订单通知*/
        case 'order_1':   
          let {oid} = tempSocket.data.msg
          addQueueTask(ckey+oid,ckey,tempSocket)
        break
        /**电子签*/
        case 'ess':
        /**活动进行中 活动完成情况*/
        case 'act_1':
        /**陈列复核情况*/
        case 'rec':
        case 'public':  // 2023年8月11日 公共信息
        addQueueTask(ckey,ckey,tempSocket)
        break
  }

  console.log('_queueTask',_queueTask,_currTab)
  /**已注册回调事件 并且钩子是回收状态*/
  if(['geren','storeQr'].includes(_currTab)&&_hooks[_currTab]&& _hooks[_currTab] === 'recovery'){
    releaseQueueTask()
  }
}

function addQueueTask(id,ckey,tempSocket){
    let index = _queueTask.findIndex(item=>item.id == id)
    //没有的话直接添加
    if(index === -1){
      _queueTask.push({
        id:id,
        ckey:ckey,
        data:tempSocket
      })
    }else{
      //如果已被打开，先释放掉
      if(_queueTask[index].attr){
        cleanNextHooks(_queueTask[index])
      }
      //替换
      _queueTask[index] = {
        id:id,
        ckey:ckey,
        data:tempSocket
      }
    }
}
/* 开屏上报 */
function appShowSendMessage() { 

	if (!isOpenSocket) return;

	sendMessage({
		'type': 'User-show',
		'is': 1
	});
	console.log('appShowSendMessage')
}

/* 黑屏上报 */
function appHideSendMessage() { 

	if (!isOpenSocket) return;

	sendMessage({
		'type': 'User-show',
		'is': 0
	});
	console.log('appHideSendMessage')
}

/* 关闭webSocket */
function closeSocket() { 
	/* stop 心跳 */
	clearInterval(heartbeat);
	/* 状态恢复初始阶段 */
	heartbeat = isOpenSocket = false;
	//停止socket
	wx.closeSocket();
}

/*通过 WebSocket 连接发送数据*/
function sendMessage(data) {
	
	let result = JSON.stringify(data);
	//判断是否处于连接状态
	if(isOpenSocket) {
		wx.sendSocketMessage({
			data: result
		});
		console.log('sendMessage', data)
	}
}

/*循环重连*/
function loopAgainConnect() {
	/* stop 心跳 */
	clearInterval(heartbeat);
	/* 状态恢复初始阶段 */
	heartbeat = isOpenSocket = false;
	/*开启循环重连*/
	if (!loopAgain) loopAgain = setInterval(function() {
		//发起重连
		socketConnect();

	}, 5000);
}

module.exports = {
  addLoopBack,cleanCurrTab,cleanCurrHook,sendMessage,closeSocket,appHideSendMessage,appShowSendMessage,socketConnect,releaseQueueTaskBack
}


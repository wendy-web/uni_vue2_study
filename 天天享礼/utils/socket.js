import log from '@/utils/log.js';
import {getToken,getSocketUrl } from '@/utils/auth';
/*socket 是否已连接*/
let isOpenSocket = false;
/* 心跳包定时器 */
let heartbeat = false;
/*定时重连*/
let loopAgain = false;
/**/
let LOGCOUNT = true


const SOCKETURL = getSocketUrl(); //正式

/* 连接方法*/
export function socketConnect() {
	//用户数据
	const token = getToken()
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
				res['act'] = 'Login-index';
				res['group'] = 1;
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
					group: 2,
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
		if (tempSocket == 1) sendMessage(tempSocket);
	});
}

/* 开屏上报 */
export function appShowSendMessage() {

	if (!isOpenSocket) return;

	sendMessage({
		'act': 'User-show',
		'is': 1
	});
	console.log('appShowSendMessage')
}

/* 黑屏上报 */
export function appHideSendMessage() {

	if (!isOpenSocket) return;

	sendMessage({
		'act': 'User-show',
		'is': 0
	});
	console.log('appHideSendMessage')
}

/* 关闭webSocket */
export function closeSocket() {
	/* stop 心跳 */
	clearInterval(heartbeat);
	/* 状态恢复初始阶段 */
	heartbeat = isOpenSocket = false;
	//停止socket
	wx.closeSocket();
}

/*通过 WebSocket 连接发送数据*/
export function sendMessage(data) {
	
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

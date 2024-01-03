var dsBridge=require("dsbridge");

export function initTokenBridge(){
	return new Promise((resolve)=>{
		dsBridge.call("getAppToken","", (token)=>{
			resolve(token)
		})
	})
}
export function wxShareBridge(str){
	return new Promise((resolve)=>{
		dsBridge.call("getWXShare", str, (res) =>{
			resolve(res)
		})
	})
}
export function closeWebview(str){
	return new Promise((resolve)=>{
		dsBridge.call("htmlBack", str, (res) =>{
			resolve(res)
		})
	})
}
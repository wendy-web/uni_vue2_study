import http from '../http.js';

//获取题目
export function getQuestion() {
	return http({
		url: '/api/quiz/getQuestion',
		method: 'post'
	});
}
//获取题目
export function answers(data) {
	return http({
		url: '/api/quiz/answers',
		method: 'post',
		data
	});
}
//获取看视频揭秘次数
export function getWatchNum(data) {
	return http({
		url: '/api/quiz/getWatchNum',
		method: 'post'
	});
}
//获取看视频揭秘次数
export function updateWatchNum(data) {
	return http({
		url: '/api/quiz/updateWatchNum',
		method: 'post'
	});
}
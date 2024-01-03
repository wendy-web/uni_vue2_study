import http from '../http.js';


export function create(data) {
	return http({
		url: '/api/team/create',
		method: 'post',
		data
	 });
}

export function getJoinUrl() {
	return http({
		url: '/api/team/getJoinUrl',
		method: 'post',
	 });
}

export function joinTeam(data) {
	return http({
		url: '/api/team/joinTeam',
		method: 'post',
		data
	 });
}
export function removeTeamUser(data) {
	return http({
		url: '/api/team/removeTeamUser',
		method: 'post',
		data
	 });
}
export function quitTeam() {
	return http({
		url: '/api/team/quitTeam',
		method: 'post'
	 });
}
//获取邀请用户信息
export function getJoinUser(data) {
	return http({
		url: '/api/team/getJoinUser',
		method: 'post',
		data
	 });
}
//获取邀请用户信息
export function getInfo() {
	return http({
		url: '/api/team/getInfo',
		method: 'post'
	 });
}
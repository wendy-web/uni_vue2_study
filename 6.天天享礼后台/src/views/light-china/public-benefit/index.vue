<template>
	<CommonPage show-footer title="公益计划">
		<template #action>
			<n-button type="primary" @click="handleAdd">
				<TheIcon icon="material-symbols:add" :size="18" class="mr-5" />新建计划
			</n-button>
		</template>
		<CrudTable ref="$table" v-model:query-items="queryItems" :scroll-x="1200" :columns="columns"
			:get-data="http.getList">
		</CrudTable>
	</CommonPage>
	<!-- 优惠券操作 -->
	<operate-benefit ref="operateRef" @refresh="refresh" />
</template>

<script setup>
	import {
		NButton,
		NTag
	} from 'naive-ui'
	import {
		renderIcon
	} from '@/utils'
	import {
		useMessage
	} from 'naive-ui'
	import http from './api'
	import operateBenefit from './operateBenefit/index.vue'
	defineOptions({
		name: 'publicBenefit'
	})
	//表格操作
	const $table = ref(null)
	/** QueryBar筛选参数（可选） */
	const queryItems = ref({})

	onActivated(() => {
		$table.value?.handleSearch()
	})

	function refresh(type) {
		type === 3 ? $table.value?.handleSearch() : $table.value?.handleRefreshCurr()
	}
	const statusObj = ref({
		0: '进行中',
		1: '已结束',
	})
	const columns = [{
			title: '名称',
			key: 'title',
			align: 'center'
		},
		{
			title: '开始日期',
			key: 'start_time',
			align: 'center',
		},
		{
			title: '结束日期',
			key: 'end_time',
			align: 'center'
		},
		{
			title: '目标人数',
			key: 'plan_num',
			align: 'center'
		},
		{
			title: '目标能量',
			key: 'plan_love',
			align: 'center'
		},
		{
			title: '状态',
			key: 'status',
			align: 'center',

			render(row) {
				let name = statusObj.value[row.status] || '未开始';
				let color = row.status == 0 ? '#67c23a' : ''
				return [
					h(
						NTag, {
							style: {
								color,
								backgroundColor: '#ffffff',
							},
							bordered: false,
						}, {
							default: () => name,
						}
					),
				]
			},
		},
		{
			title: '操作',
			key: 'actions',
			align: 'center',
			fixed: 'right',
			render(row) {
				return [
					h(
						NButton, {
							size: 'small',
							type: 'primary',
							style: {
								'margin-right': '10px'
							},
							secondary: true,
							// disabled:row.status == 1 ? true : false,
							onClick: () => editItem(row),
						}, {
							default: () => '编辑',
							icon: renderIcon('material-symbols:edit-document-rounded', {
								size: 14
							})
						}
					),
					
					h(
						NButton, {
							size: 'small',
							type: 'info',
							style: {
								'margin-right': '10px',
								'display':row.status < 0  ? 'inline-flex' : 'none'
							},
							secondary: true,
							// show:row.status < 0  ? true : false,//项目可开始：status<0
							onClick: () => updateStatus(row,0),
						}, {
							default: () => '开始',
							icon: renderIcon('material-symbols:line-start-circle-rounded', {
								size: 14
							})
						}
					),
					h(
						NButton, {
							size: 'small',
							type: 'info',
							style: {
								'margin-right': '10px',
								'display':row.status == 0  ? 'inline-flex' : 'none'
							},
							secondary: true,
							// show:row.status == 0  ? true : false,//项目可结束：status==0
							onClick: () => updateStatus(row,1),
						}, {
							default: () => '结束',
							icon: renderIcon('material-symbols:line-end-circle-rounded', {
								size: 14
							})
						}
					),
					h(
						NButton, {
							size: 'small',
							type: 'info',
							style: {
								'margin-right': '10px',
								'display':row.status == 1  ? 'inline-flex' : 'none'
							},
							secondary: true,
							// show:row.status == 1  ? true : false,//可推送消息：status==1
							onClick: () => sendWxMsg(row),
						}, {
							default: () => '推送消息',
							icon: renderIcon('carbon:send-alt-filled', {
								size: 14
							})
						}
					),
					h(
						NButton, {
							size: 'small',
							type: 'info',
							secondary: true,
							show:row.status <0 ? false : true,//未执行的项目可删除：status<0
							style: {
								'margin-right': '10px',
								'display':row.status <0  ? 'inline-flex' : 'none'
							},
							onClick: () => deleteItem(row),
						}, {
							default: () => '删除',
							icon: renderIcon('material-symbols:delete-outline', {
								size: 14
							})
						}
					),
				]
			},
		},
	]
	// 公益计划操作
	const operateRef = ref(null)
	//提示展示
	const message = useMessage()

	/**编辑 */
	function editItem(row) {
		operateRef.value.show(2, row)
	}
	/** 删除 */
	function deleteItem(row) {
		
		console.log("删除的行数据row：",row);
		let {id:com_id} = row
		let params = {
			com_id
		}
		console.log("删除传参：",params);
		http.delete(params).then(res=>{
			if (res.code == 1) {
				message.success(res.msg)
				refresh()
			} else {
				message.error(res.msg)
			}
		})
	}
	/**新增活动 */
	function handleAdd() {
		operateRef.value.show(3)
	}
	/** 更新状态 **/
	function updateStatus(row,status){
		let {id:com_id} = row;
		let params = {
			com_id,
			status
		}
		console.log("updateStatus传参:",params);
		http.updateStatus(params).then(res=>{
			if (res.code == 1) {
				message.success(res.msg)
				refresh()
			} else {
				message.error(res.msg)
			}
		})
	}
	/** 推送消息	*/
	function sendWxMsg(row){
		let {id:com_id} = row;
		let params = {
			com_id
		}
		console.log("sendWxMsg传参:",params);
		http.sendWxMsg(params).then(res=>{
			if (res.code == 1) {
				message.success(res.msg)
				refresh()
			} else {
				message.error(res.msg)
			}
		})
	}
</script>

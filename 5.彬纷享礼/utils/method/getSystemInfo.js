//系统相关信息
let $system = null;
let _system = null; //存储最后一次成功数据

export default function(isRefresh) {
	//执行了

	if (isRefresh) $system = null

	if ($system) return $system

	try {

		$system = wx.getSystemInfoSync()

		_system = $system

	} catch (e) {

		if (_system) $system = _system

	}

	return $system

}
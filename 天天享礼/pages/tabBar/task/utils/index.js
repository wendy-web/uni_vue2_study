// 后台API上传时候定义的格式
export function starSignFormat() {
	return {
		"白羊座": 1,
		"金牛座": 2,
		"双子座": 3,
		"巨蟹座": 4,
		"狮子座": 5,
		"处女座": 6,
		"天秤座": 7,
		"天蝎座": 8,
		"射手座": 9,
		"摩羯座": 10,
		"水瓶座": 11,
		"双鱼座": 12
	}
}
// 日期计算星座: 传入参数strBirthday：xxxx-xx-xx或者xxxx年xx月xx日。
export function getAstro(strBirthday) {
	let format = starSignFormat();
	var birthYear, birthMonth, birthDay;
	if (!strBirthday) return null;
	var strBirthdayArr = strBirthday.split("-");
	if (strBirthdayArr.length > 0) {
		birthYear = strBirthdayArr[0];
		birthMonth = strBirthdayArr[1];
		birthDay = strBirthdayArr[2];
	}
	if (strBirthday.split("年").length > 0) {
		birthYear = strBirthday.split("年")[0];
		birthMonth = strBirthday.split("年")[1].split("月")[0];
		birthDay = strBirthday.split("年")[1].split("月")[1].split("日")[0];
	}
	if (!birthMonth || !birthDay) {
		console.log("格式不对")
		return null
	}
	var s = "摩羯水瓶双鱼白羊金牛双子巨蟹狮子处女天秤天蝎射手摩羯";
	var arr = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22];
	let obj = {}
	let name = s.substr(birthMonth * 2 - (birthDay < arr[birthMonth - 1] ? 2 : 0), 2) + '座'; //12  21

	let index = format[name];
	return {
		name,
		index
	}
}

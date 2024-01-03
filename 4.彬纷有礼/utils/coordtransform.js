
//定义一些常量
const PI = 3.1415926535897932384626;
const a = 6378245.0;
const ee = 0.00669342162296594323;

function transformlat(lng, lat) {
        lat = +lat;
        lng = +lng;
        let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
        return ret
    };
  
function transformlng(lng, lat) {
        lat = +lat;
        lng = +lng;
        let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
        return ret
    };
	
	
/**
 * WGS84转GCj02
 * @param lng
 * @param lat
 * @returns {*[]}
 */
export function wgs84togcj02(lng, lat) {
	lat = +lat;
	lng = +lng;

	let dlat = transformlat(lng - 105.0, lat - 35.0);
	let dlng = transformlng(lng - 105.0, lat - 35.0);
	let radlat = lat / 180.0 * PI;
	let magic = Math.sin(radlat);
	magic = 1 - ee * magic * magic;
	let sqrtmagic = Math.sqrt(magic);
	dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
	dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
	let mglat = lat + dlat;
	let mglng = lng + dlng;
	return {
		longitude: mglng,
		latitude: mglat
	}
};
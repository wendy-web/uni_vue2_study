const ENV = 'test'; // 测试 test 正式 production
// const ENV = 'production'; // 测试 test 正式 production
let BASEURL;
let wxAppid = 'wx98a1cc9f6a76fdf3';


const accountInfo = wx.getAccountInfoSync();

const envVersion = accountInfo.miniProgram.envVersion;

const currentVersions = envVersion == 'release' ? accountInfo.miniProgram.version : envVersion;

// const currentVersions = 'v1.4.0'; // 版本



if (ENV === 'test') {
    BASEURL = 'https://bfzx-test.y1b.cn';
} else {
    BASEURL = 'https://bfzx.y1b.cn';
}
module.exports = {
    ENV, // 测试 test 正式 production
    BASEURL,
    wxAppid,
    currentVersions
};
import { imgupload } from '@/api/modules/login.js';
export default function uploadImgAI(file, parmas) {
    wx.showLoading({
        title: '上传中',
        mask: true
    })
    return new Promise(function(resolve, reject) {
        wx.uploadFile({
            url: imgupload(), // 仅为示例，非真实的接口地址
            filePath: file,
            name: 'img',
            header: {
                'authorization': wx.getStorageSync('token')
            },
            formData: {
                ...parmas
            },
            success(res) {
                let result = JSON.parse(res.data);
                if (result.code == 0) {
                    reject({
                        msg: result.msg
                    })
                    wx.showModal({
                        title: '温馨提示',
                        content: result.msg
                    });
                    return
                }
                if (result.code == -1) {
                    return reject({
                        msg: result.msg,
                        isRefresh: true
                    })
                }
                resolve(result.data)
            },
            fail(err) {
                reject({ msg: JSON.stringify(err) })
            },
            complete() {
                wx.hideLoading({ fail() {} })
            }
        })
    }).catch((e) => {});
}

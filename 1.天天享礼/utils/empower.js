import store from '@/store';
import { getStorage } from '@/utils/auth.js';


export default function() {
    return new Promise((resolve, reject) => {
        let bfxl_userdata = getStorage('bfxl_userdata');
        // 有用户信息提示授权用户信息
        if (bfxl_userdata) {
            bfxl_userdata = JSON.parse(bfxl_userdata)
            let {
                nick_name,
                avatar_url
            } = bfxl_userdata
            uni.showModal({
                content: "您需要授权天天享礼使用您的微信头像和昵称",
                success: (res) => {
                    if (res.confirm) {
                        store.dispatch('user/updateUserNew', {
                            nick_name,
                            avatar_url
                        }).then(() => {
                            resolve({ result: 'handle' });
                        }).catch(() => {
                            resolve({ result: 'not' });
                        })
                        return;
                    }
                    resolve({ result: 'not' });
                }
            })
            return
        }
        /* 未授权前往授权 */
        uni.reLaunch({
            url: '/pages/tabAbout/login/index'
        });
        resolve({ result: 'not' });
    });
}

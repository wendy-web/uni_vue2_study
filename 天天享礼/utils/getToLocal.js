export default function(base64data) {
    return new Promise((resolve, reject) => {
        const fsm = wx.getFileSystemManager();
        const FILE_BASE_NAME = 'tmp_base64src'; //自定义文件名
        const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64data) || [];
        if (!format) {
            return (new Error('ERROR_BASE64SRC_PARSE'));
        }
        const filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}.${format}`;
        const buffer = wx.base64ToArrayBuffer(bodyData);
        fsm.writeFile({
            filePath,
            data: buffer,
            encoding: 'binary',
            success(r) {
                resolve(filePath)
            },
            fail() {
                reject(new Error('ERROR_BASE64SRC_WRITE'));
            },
        });
    })
}

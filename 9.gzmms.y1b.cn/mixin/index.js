import {
	mapGetters,
	mapState
} from "vuex";
/**
 * @example 1-显示消息框的方法;2-小程序名称;3-图片基地址
 *
 */
const myMixin = {
    // 计算属性
    computed: {
        ...mapState("app", ["adminTitle", "msgTemplateId"]),
        ...mapGetters(["adminTitleShow"]),
        imgBaseUrl() {
            return this.$imgBaseUrl
        }
    },
    methods: {
        /**@example 显示消息提示框(页面uv-toast组件配合),并且刷新(传入回调函数),此函数共两个参数
         * @param {Object} options 传入对象,键:msg(默认空,需要传值),duration(默认值2000,可以不传),type(默认success,可以不传),情况一:第一个参数为对象
         * @param {String} msg 传入字符串,如果传入字符串则直接设置为msg的值,情况二: 第一个参数为字符串
         * @param {Function} callback 要执行的会回调函数
         */
        showToastRefresh(options, callback = () => {}) {
            let msg = '';
            let duration = 2000;
            let type = 'success';
            if (typeof options === 'string') {
                msg = options;
            } else if (typeof options === 'object') {
                msg = options.msg;
                duration = options.duration || duration;
                type = options.type || type;
            }
            this.$refs.toast.show({
                type,
                message: msg,
                duration,
            });
            callback()
        },
    }
}

export default myMixin

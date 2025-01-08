// 在 myMixins.js 中定义一个 age 字段和 getAge 方法,用来获取年龄信息
import demo from './demo.vue'
console.log('demo', demo)
export const myMixins = {
    components: {
        demo
    },
    data() {
        return {
            age: 18,
        }
    },
    mounted() {
        this.getAge()
    },
    methods: {
        getAge() {
            console.log(this.age)
        }
    }
}
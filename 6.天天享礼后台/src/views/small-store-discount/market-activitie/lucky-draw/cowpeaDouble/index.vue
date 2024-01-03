<template>
    <n-drawer v-model:show="showModal" :default-width="drawerWidth" resizable>
        <n-drawer-content :title="modalTitle" closable>
            <n-form
                    ref="formRef"
                    :model="model"
                    :rules="rules"
                    label-placement="left"
                    label-width="120px"
                    require-mark-placement="right-hanging"
            >
                <n-form-item label="活动名称" path="title">
                    <n-input
                            v-model:value="model.title"
                            :style="{
              maxWidth: '300px',
            }"
                            :disabled="modalType === 1"
                    />
                </n-form-item>
                <n-form-item label="参与条件" path="need">
                    <n-input-group>
                        <n-input-group-label>每次抽奖消耗</n-input-group-label>
                        <n-input-number
                                v-model:value="model.need"
                                :min="0"
                                :precision="0"
                                :disabled="modalType === 1"
                                :style="{ width: '150px' }"
                        />
                        <n-input-group-label>积分</n-input-group-label>
                    </n-input-group>
                </n-form-item>
                <n-form-item label="抽奖次数" path="num">
                    <n-input-group>
                        <n-input-group-label>每人每天抽奖</n-input-group-label>
                        <n-input-number
                                v-model:value="model.num"
                                :min="1"
                                :precision="0"
                                :disabled="modalType === 1"
                                :style="{ width: '150px' }"
                        />
                        <n-input-group-label>次</n-input-group-label>
                    </n-input-group>
                </n-form-item>
                <n-form-item label="活动时间" path="datetimerange">
                    <n-date-picker
                            v-model:formatted-value="model.datetimerange"
                            :disabled="modalType === 1"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            type="datetimerange"
                            clearable
                    /></n-form-item>
                <n-form-item label="奖品设置" path="draw_detail">
                    <div>
                        <n-button mb-10 type="info" :disabled="model.draw_detail.length >= 8 || modalType === 1" @click="addPrize"
                        >添加奖品 {{ model.draw_detail.length }}/8
                        </n-button>
                        <n-data-table w-1000 :columns="prizeSetColumns" :data="model.draw_detail" :pagination="false" />
                    </div>
                </n-form-item>
                <n-form-item label="转盘设置" path="position_detail">
                    <n-data-table w-1000 :columns="turntableColumns" :data="model.position_detail" :pagination="false" />
                </n-form-item>
                <n-form-item w-1100 label="描述" path="intro">
                    <n-input v-model:value="model.intro" type="textarea" :disabled="modalType === 1" />
                </n-form-item>
                <div flex justify-center w-1000>
                    <n-button mr-10 @click="closeModel"> 关闭 </n-button>
                    <n-button v-if="modalType === 2 || modalType === 3" type="info" @click="handleValidate"> 保存 </n-button>
                </div>
            </n-form>
        </n-drawer-content>
    </n-drawer>
    <!-- 新增奖品 -->
    <operat-prize ref="operatPrizeRef" @refresh="back" />
</template>
<script setup>
    import { ref } from 'vue'
    import { NImage, NButton, NSelect, NInputNumber, useMessage } from 'naive-ui'
    import operatPrize from './operatPrize.vue'
    import http from '../api'
    /**弹窗显示控制 */
    const showModal = ref(false)
    /**抽屉宽度 */
    const drawerWidth = window.innerWidth - 220 + 'px'
    /**弹窗类型 1.查看 2.修改*/
    const modalType = ref(1)
    const modalTitle = ref(1)
    //提示展示
    const message = useMessage()
    /**表单 */
    const formRef = ref(null)
    /**新增奖品 */
    const operatPrizeRef = ref(null)
    //表单数据
    const model = ref({
        draw_detail: [],
        position_detail: [],
    })
    let id = ''
    //校验数据
    const rules = ref({
        title: [
            {
                required: true,
                validator: function (rule, value) {
                    return value.length > 0
                },
                trigger: ['blur', 'input'],
                message: '请输入活动标题',
            },
        ],
        need: [
            {
                required: true,
                validator: function (rule, value) {
                    return value >= 0
                },
                trigger: ['blur', 'input'],
                message: '请输入每次抽奖消耗',
            },
        ],
        datetimerange: [
            {
                required: true,
                validator: function (rule, value) {
                    return value.length > 0
                },
                trigger: ['blur', 'input'],
                message: '请输入活动时间',
            },
        ],
        num: [
            {
                required: true,
                validator: function (rule, value) {
                    return value > 0
                },
                trigger: ['blur', 'input'],
                message: '请输入每天抽奖次数',
            },
        ],
        draw_detail: [
            {
                required: true,
                validator: function (rule, value) {
                    return value.length > 0
                },
                trigger: ['blur', 'input'],
                message: '请设置最少一个奖品',
            },
        ],
        position_detail: [
            {
                required: true,
                validator(rule, value) {
                    if (
                        value.some(function (item) {
                            return !item.draw_index
                        })
                    ) {
                        return new Error('转盘每个位置的奖品必须选择')
                    } else if (
                        value.reduce(function (o, i) {
                            return o + i.prob
                        }, 0) != 100
                    ) {
                        return new Error('转盘总获奖概率必须为100%')
                    }
                    return true
                },
                trigger: ['blur', 'input'],
            },
        ],
    })
    //奖品设置
    const prizeSetColumns = [
        {
            title: '奖品名称',
            key: 'title',
            align: 'center',
        },
        {
            title: '奖品类型',
            key: 'type',
            align: 'center',
            render(row, index) {
                return h(
                    'span',
                    {},
                    {
                        default: function () {
                            if (row.type === 0) {
                                return '积分'
                            }
                            if (row.type === 1) {
                                return '未中奖'
                            }
                        },
                    }
                )
            },
        },
        {
            title: '奖品积分',
            align: 'center',
            key: 'credits',
            render(row, index) {
                return h('span', {
                    style: 'color:red;',
                    innerHTML: row.credits,
                })
            },
        },
        {
            title: '奖品总量(份)',
            align: 'center',
            key: 'num',
            render(row, index) {
                return h('span', {
                    style: 'color:red;',
                    innerHTML: row.count,
                })
            },
        },
        {
            title: '图片',
            key: 'image',
            align: 'center',
            render(row, index) {
                return h(NImage, {
                    width: '100',
                    src: row.img,
                })
            },
        },
        {
            title: '操作',
            align: 'center',
            render(row, index) {
                return h('div', [
                    h(
                        NButton,
                        {
                            type: 'success',
                            style: { marginRight: '15px' },
                            disabled: modalType.value === 1,
                            onClick: function () {
                                operatPrizeRef.value.show(1, row, index)
                            },
                        },
                        { default: () => '编辑' }
                    ),
                ])
            },
        },
    ]
    //转盘设置
    const turntableColumns = [
        {
            title: '转盘位置',
            key: 'position',
            align: 'center',
            width: '100px',
            render(row, index) {
                return h('span', {
                    style: 'color:red;',
                    innerText: row.position,
                })
            },
        },
        {
            title: '奖品',
            key: 'draw_index',
            align: 'center',
            render(row, index) {
                return h(NSelect, {
                    options: model.value.draw_detail,
                    disabled: modalType.value === 1,
                    value: row.draw_index,
                    onUpdateValue(v) {
                        console.log(v);
                        model.value.position_detail[index].draw_index = v
                    },
                    'label-field': 'title',
                    'value-field': 'draw_index',
                })
            },
        },
        {
            title: '获奖概率',
            key: 'prob',
            align: 'center',
            width: '160px',
            render(row, index) {
                return h(
                    NInputNumber,
                    {
                        style: { width: '150px' },
                        disabled: modalType.value === 1,
                        value: row.prob,
                        precision: 2,
                        min: 0,
                        max: 100,
                        onUpdateValue(v) {
                            console.log(v);
                            model.value.position_detail[index].prob = v
                        },
                    },
                    {
                        suffix: () => h('span', { innerText: '%' }),
                    }
                )
            },
        },
    ]

    /**展示弹窗 */
    function show(operatType, data) {
        id = data.id
        modalType.value = operatType
        switch(operatType){
            case 1:
                modalTitle.value = '查看'
                break;
            case 2:
                modalTitle.value = '修改'
                break;
            case 3:
                modalTitle.value = '新增'
                break;
        }
        init()
    }

    function init() {
        if(modalType.value != 3) {
            http.xq({id}).then((res) => {
                let {
                    id,
                    title,
                    intro,
                    need,
                    num,
                    draw_detail,
                    position_detail,
                    datetimerange
                } = res.data
                // position_detail = []
                if (position_detail.length > 0) {
                    position_detail = position_detail.map(function (item) {
                        item.prob = Math.floor(item.prob * 100 * 100) / 100
                        return {
                            ...item,
                        }
                    })
                } else {
                    position_detail = Array.from({length: 8}, (v, i) => ({draw_id: '', position: i + 1, prob: 0}))
                }
                model.value = {
                    id,
                    title,
                    intro,
                    need,
                    num,
                    draw_detail,
                    position_detail,
                    datetimerange
                }
                showModal.value = true
            })
        }else{
            model.value = {
                title: '',
                intro: '',
                need: 0,
                num: 0,
                draw_detail: [],
                position_detail: Array.from({length: 8}, (v, i) => ({draw_id: '', position: i + 1, prob: 0})),
                datetimerange: ''
            }
            showModal.value = true
        }
    }

    function back(data, index){
        var arr = []; //定义数组
        for (var i in data) {
            arr[i] = data[i];
        }
        if(index == -1) {
            arr.draw_index = model.value.draw_detail.length * 1 + 1;
            model.value.draw_detail.push(arr);
        }else{
            arr.draw_index = index+1;
            model.value.draw_detail[index] = arr;
        }
        console.log(model.value.draw_detail);
    }

    /**关闭弹窗 */
    function closeModel() {
        showModal.value = false
    }

    /**校验表单 */
    function handleValidate() {
        formRef.value?.validate((errors) => {
            if (!errors) {
                let position_detail = model.value.position_detail
                let draw_detail = model.value.draw_detail
                draw_detail = draw_detail.map(function (item) {
                    return {
                        title: item.title,
                        type: item.type,
                        credits: item.credits || 0,
                        img: item.img || '',
                        count: item.count || 0,
                        draw_index: item.draw_index
                    }
                })
                /**还原数据 */
                position_detail = position_detail.map(function (item) {
                    return {
                        draw_id: item.draw_id,
                        position: item.position,
                        prob: item.prob / 100,
                        draw_index: item.draw_index
                    }
                })
                let params = { ...model.value, draw_detail, position_detail }
                //delete params.draw_detail
                /**还原数据 */
                if(modalType.value != 3) {
                    http.dos(params).then((res) => {
                        if (res.code == 1) {
                            message.success(res.msg)
                            emit('refresh')
                            showModal.value = false
                        } else {
                            message.error(res.msg)
                        }
                    })
                }else{
                    http.create(params).then((res) => {
                        if (res.code == 1) {
                            message.success(res.msg)
                            emit('refresh')
                            showModal.value = false
                        } else {
                            message.error(res.msg)
                        }
                    })
                }
            }
        })

        return false
    }

    /**暴露给父组件使用 */
    defineExpose({
        show,
    })
    /**回调父组件函数注册 */
    const emit = defineEmits(['refresh'])
    // 添加奖品
    function addPrize() {
        operatPrizeRef.value.show(1, '')
    }
</script>

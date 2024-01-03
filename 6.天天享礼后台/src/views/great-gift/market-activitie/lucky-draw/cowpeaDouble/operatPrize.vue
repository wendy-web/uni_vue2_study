<template>
    <n-modal
            v-model:show="showModal"
            :mask-closable="false"
            preset="dialog"
            :title="modalType === 1 ? '新增' : '编辑'"
            :positive-text="modalType === 1 ? '确认' : '确认'"
            negative-text="关闭"
            :style="{
      width: '700px',
    }"
            @positive-click="handleValidateButtonClick"
            @negative-click="onNegativeClick"
    >
        <n-form
                ref="formRef"
                :model="model"
                :rules="rules"
                label-placement="left"
                label-width="100px"
                require-mark-placement="right-hanging"
                :style="{
        maxWidth: '500px',
      }"
        >
            <n-form-item label="奖品名称" path="title">
                <n-input v-model:value="model.title" />
            </n-form-item>
            <n-form-item label="奖品类型" path="type">
                <n-select v-model:value="model.type" :options="options" />
            </n-form-item>
            <n-form-item v-if="model.type != 1" label="奖品积分" path="credits">
                <n-input-group>
                    <n-input-number v-model:value="model.credits" :min="1" :precision="0" :style="{ width: '150px' }" />
                </n-input-group>
            </n-form-item>
            <n-form-item v-if="model.type != 1" label="奖品份额" path="count">
                <n-input-group>
                    <n-input-number v-model:value="model.count" :min="1" :precision="0" :style="{ width: '150px' }" />
                    <n-input-group-label>份</n-input-group-label>
                </n-input-group>
            </n-form-item>
            <n-form-item label="活动图片" path="img">
                <n-upload
                    action="/apios/Tools/uploadImg"
                    list-type="image-card"
                    :default-file-list="fileList"
                    :max="1"
                    name="img"
                    @finish="handleFinish"
                    @before-upload="beforeUpload"
                >
                    <n-button quaternary>上传文件</n-button>
                </n-upload>
            </n-form-item>
        </n-form>
    </n-modal>
</template>
<script setup>
    import { ref } from 'vue'
    import { useMessage } from 'naive-ui'
    import http from '../api'
    /**弹窗显示控制 */
    const showModal = ref(false)
    /**弹窗类型 1.新增 2.编辑*/
    const modalType = ref(1)
    const modalIndex = ref(1)
    /**弹窗取消 */
    function onNegativeClick() {}
    /**表单 */
    const formRef = ref(null)
    //提示展示
    const message = useMessage()
    //表单数据
    const model = ref({})
    //商品类型
    const options = [
        {
            label: '积分',
            value: 0,
        },
        {
            label: '未中奖',
            value: 1,
        }
    ]

    //已上传的图片
    const fileList = ref([])
    //图片上传
    function handleFinish({ event }) {
        let { response, responseText } = event.currentTarget
        let res = JSON.parse(response || responseText)
        model.value.img = res.data.url
    }

    async function beforeUpload(data) {
        if (!/image\/(png|jpg|jpeg|gif)/i.test(data.file.file?.type)) {
            message.error('只能上传png|jpg|gif格式的图片文件，请重新上传')
            return false
        }
        return true
    }

    //校验数据
    const rules = ref({
        img: {
            required: true,
            trigger: ['blur', 'input'],
            message: '请上传奖品图片',
        },
        count: {
            required: true,
            validator: function (rule, value) {
                if (model.value.type !==1) {
                    return true
                }
                return Boolean(value)
            },
            trigger: ['blur', 'input'],
            message: '请输入奖品总数',
        },
        credits: {
            required: true,
            validator: function (rule, value) {
                if (model.value.type === 3) {
                    return true
                }
                return Boolean(value)
            },
            trigger: ['blur', 'input'],
            message: '请输入奖励积分',
        }
    })

    /**表单验证 */
    function handleValidateButtonClick() {
        formRef.value?.validate((errors) => {
            if (!errors) {
                let parmas = model.value
                emit('refresh', parmas, modalIndex.value);
                showModal.value = false
            }
        })

        return false
    }
    const deviceType = ref();
    /**展示弹窗 */
    function show(operatType, data, index = -1) {
        modalType.value = operatType;
        modalIndex.value = index
        fileList.value = []
        model.value = {
            title: data.title,
            type: data.type,
            count: data.count || 0,
            img: data.img,
            credits: data.credits || 0,
            draw_group_id: data.draw_group_id,
        }
        /**图片预览 */
        if (data.img) {
            fileList.value = [
                {
                    id: 'c',
                    name: '已上传的图片',
                    status: 'finished',
                    url: data.img,
                },
            ]
        }
        showModal.value = true
    }

    /**暴露给父组件使用 */
    defineExpose({
        show,
    })
    /**回调父组件函数注册 */
    const emit = defineEmits(['refresh'])
</script>

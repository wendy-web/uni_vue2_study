<template>
  <n-drawer v-model:show="showModal" :default-width="drawerWidth" resizable>
    <n-drawer-content :title="modalType === 1 ? '查看' : '修改'" closable>
      <n-form
        ref="formRef"
        :model="model"
        :rules="rules"
        label-placement="left"
        label-width="120px"
        require-mark-placement="right-hanging"
      >
        <n-form-item label="任务名称" path="name">
          <n-input
            v-model:value="model.name"
            :style="{
              maxWidth: '300px',
            }"
            :disabled="true"
          />
        </n-form-item>
        <n-form-item label="主标题" path="title">
          <n-input
            v-model:value="model.title"
            :style="{
              maxWidth: '300px',
            }"
            :disabled="modalType === 1"
          />
        </n-form-item>
        <n-form-item label="副标题" path="subtitle">
          <n-input
            v-model:value="model.subtitle"
            :style="{
              maxWidth: '300px',
            }"
            :disabled="modalType === 1"
          />
        </n-form-item>
        <n-form-item label="参与条件" path="cost">
          <n-input-group>
            <n-input-group-label>每次抽奖消耗</n-input-group-label>
            <n-input-number
              v-model:value="model.cost"
              :min="0"
              :precision="0"
              :disabled="modalType === 1"
              :style="{ width: '150px' }"
            />
            <n-input-group-label>牛金豆</n-input-group-label>
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
        <n-form-item label="奖品设置" path="award">
          <div>
            <n-button mb-10 type="info" :disabled="model.award.length >= 8 || modalType === 1" @click="addPrize"
              >添加奖品 {{ model.award.length }}/8
            </n-button>
            <n-data-table w-1000 :columns="prizeSetColumns" :data="model.award" :pagination="false" />
          </div>
        </n-form-item>
        <n-form-item label="转盘设置" path="reward_rules">
          <n-data-table w-1000 :columns="turntableColumns" :data="model.reward_rules" :pagination="false" />
        </n-form-item>
        <n-form-item w-1100 label="描述" path="describe">
          <n-input v-model:value="model.describe" type="textarea" :disabled="modalType === 1" />
        </n-form-item>
        <div flex justify-center w-1000>
          <n-button mr-10 @click="closeModel"> 关闭 </n-button>
          <n-button v-if="modalType === 2" type="info" @click="handleValidate"> 保存 </n-button>
        </div>
      </n-form>
    </n-drawer-content>
  </n-drawer>
  <!-- 新增奖品 -->
  <operat-prize ref="operatPrizeRef" @refresh="init" />
</template>
<script setup>
import { ref } from 'vue'
import { NImage, NButton, NSelect, NInputNumber, useMessage } from 'naive-ui'
import operatPrize from './operatPrize.vue'
import http from '../../api'
/**弹窗显示控制 */
const showModal = ref(false)
/**抽屉宽度 */
const drawerWidth = window.innerWidth - 220 + 'px'
/**弹窗类型 1.查看 2.修改*/
const modalType = ref(1)
//提示展示
const message = useMessage()
/**表单 */
const formRef = ref(null)
/**新增奖品 */
const operatPrizeRef = ref(null)
//表单数据
const model = ref({
  award: [],
  reward_rules: [],
})
let task_id = ''
//校验数据
const rules = ref({
  cost: [
    {
      required: true,
      validator: function (rule, value) {
        return value >= 0
      },
      trigger: ['blur', 'input'],
      message: '请输入每次抽奖消耗',
    },
  ],
  award: [
    {
      required: true,
      validator: function (rule, value) {
        return value.length > 0
      },
      trigger: ['blur', 'input'],
      message: '请设置最少一个奖品',
    },
  ],
  reward_rules: [
    {
      required: true,
      validator(rule, value) {
        if (
          value.some(function (item) {
            return !item.award_id
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
            if (row.type === 1) {
              return '牛金豆'
            }
            if (row.type === 2) {
              return '优惠券'
            }
            if (row.type === 3) {
              return '未中奖'
            }
          },
        }
      )
    },
  },
  {
    title: '奖品数量',
    align: 'center',
    key: 'credits',
    render(row, index) {
      return h('span', {
        style: 'color:red;',
        innerHTML: row.credits || '<span style="color:#666">-</span>',
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
        innerHTML: row.num || '<span style="color:#666">-</span>',
      })
    },
  },
  {
    title: '剩余份数',
    align: 'center',
    key: 'surplus_num',
    render(row, index) {
      return h('span', {
        style: 'color:red;',
        innerHTML: row.surplus_num || '<span style="color:#666">-</span>',
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
        src: row.image,
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
              console.log('operatPrizeRef')
              operatPrizeRef.value.show(2, row, model.value.device_type)
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
    key: 'award_id',
    align: 'center',
    render(row, index) {
      return h(NSelect, {
        options: model.value.award,
        disabled: modalType.value === 1,
        value: row.award_id,
        onUpdateValue(value) {
          model.value.reward_rules[index].award_id = value
        },
        'label-field': 'title',
        'value-field': 'id',
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
            model.value.reward_rules[index].prob = v
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
  task_id = data.id
  modalType.value = operatType
  init()
}

function init() {
  http.getInfo({ task_id }).then((res) => {
    let {
      id: task_id,
      type,
      title,
      times,
      tag,
      subtitle,
      status,
      reward_rules,
      name,
      describe,
      credits,
      award,
      cost,
      num,
      device_type,
    } = res.data
    // reward_rules = []
    if (reward_rules.length > 0) {
      reward_rules = reward_rules.map(function (item) {
        item.prob *= 100
        return {
          ...item,
        }
      })
    } else {
      reward_rules = Array.from({ length: 8 }, (v, i) => ({ award_id: '', position: i + 1, prob: 0 }))
    }
    model.value = {
      task_id,
      type,
      title,
      times,
      tag,
      subtitle,
      status,
      reward_rules,
      name,
      describe,
      credits: +credits,
      award,
      cost: cost ? +cost : 0,
      num: num ? +num : 0,
      device_type
    }
    showModal.value = true
  })
}

/**关闭弹窗 */
function closeModel() {
  showModal.value = false
}

/**校验表单 */
function handleValidate() {
  formRef.value?.validate((errors) => {
    if (!errors) {
      let reward_rules = model.value.reward_rules
      /**还原数据 */
      reward_rules = reward_rules.map(function (item) {
        return {
          award_id: item.award_id,
          position: item.position,
          prob: item.prob / 100,
        }
      })
      let params = { ...model.value, reward_rules }
      delete params.award
      /**还原数据 */
      http.updateInfo(params).then((res) => {
        if (res.code == 1) {
          message.success(res.msg)
          emit('refresh')
          showModal.value = false
        } else {
          message.error(res.msg)
        }
      })
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
  operatPrizeRef.value.show(1, '', model.value.device_type)
}
</script>

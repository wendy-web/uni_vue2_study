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
        <n-form-item label="分组名称" path="title" w-300>
          <n-input v-model:value="model.title" />
        </n-form-item>
        <n-form-item label="系统类型" path="system" w-400>
          <n-select v-model:value="model.system" :options="systemOptions" />
        </n-form-item>
        <n-form-item label="排序" path="sort" w-300>
          <n-input-number v-model:value="model.sort" />
        </n-form-item>
        <n-form-item label="分组商品" path="gids">
          <div>
            <n-button type="info" mb-15 @click="selectGoods"> 选择商品 </n-button>
            <!-- 对商品进行拖拽的选择 -->
            <n-data-table
              id="dragTable"
              w-1700
              max-height="500px"
              :columns="couponColumns"
              :data="model.goods_list"
              :row-key="(row) => row['id']"
              :pagination="false"
            />
          </div>
        </n-form-item>
        <div flex justify-center w-1000>
          <n-button mr-10 @click="closeModel"> 关闭 </n-button>
          <n-button type="info" @click="handleValidate"> 保存 </n-button>
        </div>
      </n-form>
    </n-drawer-content>
  </n-drawer>
  <selecGoods ref="selecGoodsRef" @selectSave="selectSave" />
</template>
<script setup>
import { ref } from 'vue'
import { useMessage, NButton } from 'naive-ui'
import { renderIcon } from '@/utils'
import selecGoods from './selecGoods.vue'
import { systemOptions } from '../options'
import http from '../api'

/**弹窗显示控制 */
const showModal = ref(false)
/**抽屉宽度 */
const drawerWidth = window.innerWidth - 220 + 'px'
/**弹窗类型 1.修改 2新增*/
const modalType = ref(1)
/**modalTitle */
const modalTitle = ref('')
//提示展示
const message = useMessage()
/**表单 */
const formRef = ref(null)
//表单数据
const model = ref({ goods_list: [] })
//校验数据
const rules = ref({
  title: {
    required: true,
    trigger: ['blur', 'input'],
    message: '分组名称不能为空',
  }
})
//商品cell
const couponColumns = [
  { title: '商品编号', key: 'goods_number', align: 'center' },
  { title: '商品名称', key: 'goods_name', align: 'center' },
  { title: 'spuName', key: 'spuName', align: 'center' },
  { title: '参考名称', key: 'skuName', align: 'center' },
  {
    title: '商品类型',
    key: 'goods_type',
    align: 'center',
    render(row, index) {
      return row.goods_type == 0 ? '直充' : '卡券'
    },
  },
  {
    title: '面值(元)',
    key: 'marketPrice',
    align: 'center',
    render(row, index) {
      return Number(row.price / 100).toFixed(2)
    },
  },
  {
    title: '成本(元)',
    key: 'cost',
    align: 'center',
    render(row, index) {
      return Number(row.cost / 100).toFixed(2)
    },
  },
  {
    title: '差价(元)',
    key: 'price_difference',
    align: 'center',
    render(row, index) {
      return Number(row.price_difference / 100).toFixed(2)
    },
  },
  {
    title: '抵扣金额(元)',
    key: 'deduction_price',
    align: 'center',
    render(row, index) {
      return Number(row.deduction_price / 100).toFixed(2)
    },
  },
  { title: '抵扣积分', key: 'deduction_credits', align: 'center' },
  {
    title: '销售状态',
    key: 'status',
    align: 'center',
    render(row, index) {
      return row.status == 0 ? '下架' : '上架'
    },
  },
  {
    title: '启用状态',
    key: 'status',
    align: 'center',
    render(row, index) {
      return ['停用', '启用', '系统停用'][row.use]
    },
  },
  {
    title: '系统',
    key: 'device_type',
    align: 'center',
    render(row, index) {
      return ['苹果', '公共', '安卓'][row.device_type - 1]
    },
  },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    fixed: 'right',
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            style: { 'margin-right': '10px' },
            secondary: true,
            onClick: () => delGoods(row),
          },
          { default: () => '删除', icon: renderIcon('majesticons:delete-bin-line', { size: 14 }) }
        ),
      ]
    },
  },
]
//删除选择
function delGoods(data) {
  let index = model.value.goods_list.findIndex((item) => item.id === data.id)
  model.value.goods_list.splice(index, 1)
  model.value.gids = model.value.goods_list.map((item) => item.id).join(',')
}

/**展示弹窗 */
function show(operatType, data) {
  modalType.value = operatType
  modalTitle.value = ['编辑', '新增'][operatType - 1]
  init(data?.id)
}

function init(id) {
  if (modalType.value === 1) {
    http.getDetails({ id }).then((res) => {
      let { id, title, gids, goods_list, system, sort } = res.data;
      model.value = { id, title, gids, goods_list: goods_list || [], system, sort }
      showModal.value = true;
      // 拖拽的使用
      registerDrag();
    })
  } else if (modalType.value === 2) {
    model.value = { title: '', goods_list: [], system: 1, sort: 0 }
    showModal.value = true;
  }
}

//拖拽释放时的商品编号 - id
let drag_curr_id = null;
//拖拽释放时的商品编号 - id
let drag_release_id = null;
// 拖拽的使用
function registerDrag() {
  nextTick(function () {
    let list = document.querySelectorAll('#dragTable tbody .n-data-table-tr');
    list.forEach((item, index) => {
      item.draggable = true;
      item.id = model.value.goods_list[index].id;
      // dragstart 拖拽开始时触发,只触发一次
      item.ondragstart = function (e) {
        drag_release_id = null;
        drag_curr_id = e.target.id;
      }

      // dragend 拖拽结束时,触发的事件,只要鼠标一松开就触发
      item.ondragend = function (e) {
        if (drag_release_id && drag_curr_id) {
          let currIndex = model.value.goods_list.findIndex((item) => item.id == drag_curr_id);
          let targetIndex = model.value.goods_list.findIndex((item) => item.id == drag_release_id);
          let currData = { ...model.value.goods_list[currIndex] }
          // let targetData = { ...model.value.goods_list[targetIndex] }
          model.value.goods_list.splice(currIndex, 1)
          model.value.goods_list.splice(targetIndex, 0, { ...currData });
        }
      }
      item.ondragover = function (e) {
        e.preventDefault();
        drag_release_id = e.target.id || e.target.parentElement.id;
      }
    })
  });
}

/**校验表单 */
function handleValidate() {
  formRef.value?.validate((errors) => {
    if (!errors) {
      model.value.gids = model.value.goods_list.map((item) => item.id).join(',');
      /**还原数据 */
      let params = {
        ...model.value,
      }
      delete params.goods_list
      http.dos(params).then((res) => {
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

//选择商品
const selecGoodsRef = ref()
function selectGoods() {
  selecGoodsRef.value.show(model.value.goods_list, model.value.system)
}
function selectSave(data) {
  model.value.goods_list = data;
}
/**关闭弹窗 */
function closeModel() {
  showModal.value = false
}

/**暴露给父组件使用 */
defineExpose({
  show,
})
/**回调父组件函数注册 */
const emit = defineEmits(['refresh'])
</script>

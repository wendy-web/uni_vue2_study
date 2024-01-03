<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    preset="dialog"
    :title="modalTitle"
    style="width: 80%"
    @positive-click="handleValidateButtonClick"
    @negative-click="onNegativeClick"
  >
    <div style="display: flex; align-items: center; justify-content: flex-end; padding: 10px 0">
      <span class="date" :class="num == 7 ? 'active' : ''" @click="dateChange(7)">近7天</span>
      <span class="date" :class="num == 15 ? 'active' : ''" @click="dateChange(15)">近15天</span>
      <span class="date" :class="num == 30 ? 'active' : ''" @click="dateChange(30)">近30天</span>
      <span class="date" :class="num == 60 ? 'active' : ''" @click="dateChange(60)">近60天</span>
      <span class="date" :class="num == 90 ? 'active' : ''" @click="dateChange(90)">近90天</span>
    </div>
    <div ref="chart" style="width: 100%; height: 1000px"></div>
  </n-modal>
</template>
<style>
.date {
  background: rgba(49, 108, 114, 0.16);
  color: #316c72ff;
  height: 34px;
  line-height: 34px;
  padding: 0 14px;
  border-radius: 3px;
  cursor: default;
  margin-right: 15px;
}
.date.active {
  background: #316c72ff;
  color: #fff;
}
.date:last-child {
  margin-right: 0;
}
</style>
<script setup>
import { ref, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import http from './api'
import * as echarts from 'echarts'
/**弹窗显示控制 */
const showModal = ref(false)
/**弹窗取消 */
function onNegativeClick() {}
/**表单 */
const formRef = ref(null)
//提示展示
const message = useMessage()
//表单数据
const model = ref({})
const chart = ref(null)
const modalTitle = ref(null)
onMounted(() => {})
const num = ref(30)
const position_id = ref(0)
async function show(data) {
  num.value = 30
  getCharts(data.position_id)
  position_id.value = data.position_id
  showModal.value = true
}
function dateChange(dateNum) {
  console.log(dateNum)
  num.value = dateNum
  getCharts(position_id.value, dateNum)
}
function getCharts(position_id, num = 30) {
  http.getEcharts({ positionId: position_id, date: num }).then((res) => {
    if (res.code == 1) {
      console.log(res.data)
      modalTitle.value = res.data.title
      const myChart = echarts.init(chart.value)
      // 在这里配置ECharts图表
      myChart.setOption({
        // ECharts配置选项
        title: {
          text: 'Stacked Line',
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: res.data.titleArr,
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: res.data.dateArr,
        },
        yAxis: {
          type: 'value',
        },
        series: res.data.resultArr,
      })
    }
  })
}
/**暴露给父组件使用 */
defineExpose({
  show,
})
/**回调父组件函数注册 */
const emit = defineEmits(['refresh'])
</script>

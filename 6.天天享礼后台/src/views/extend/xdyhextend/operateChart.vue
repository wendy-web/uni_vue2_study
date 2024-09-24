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
      <QueryBarItem label="年份" :label-width="40" :content-width="100" class="dates">
        <n-date-picker
          v-model:formatted-value="year"
          value-format="yyyy"
          format="yyyy"
          type="year"
          clearable
          @update:value="yearChange"
        />
      </QueryBarItem>
      <span class="date" :class="year_type == 1 ? 'active' : ''" @click="dateChanges(1)">按周</span>
      <span class="date" :class="year_type == 2 ? 'active' : ''" @click="dateChanges(2)">按月</span>
      <span class="date" :class="num == 7 ? 'active' : ''" @click="dateChange(7)">近7天</span>
      <span class="date" :class="num == 15 ? 'active' : ''" @click="dateChange(15)">近15天</span>
      <span class="date" :class="num == 30 ? 'active' : ''" @click="dateChange(30)">近30天</span>
      <span class="date" :class="num == 60 ? 'active' : ''" @click="dateChange(60)">近60天</span>
      <span class="date" :class="num == 90 ? 'active' : ''" @click="dateChange(90)">近90天</span>
    </div>
    <div ref="chart" style="width: 100%; height: 1000px"></div>
  </n-modal>
</template>
<script setup>
import * as echarts from 'echarts';
import { useMessage } from 'naive-ui';
import { onMounted, ref } from 'vue';
import http from './api';
/**弹窗显示控制 */
const showModal = ref(false)
/**弹窗取消 */
function onNegativeClick() {}
/**表单 */
const formRef = ref(null)
const year = ref()
const year_type = ref()
//提示展示
const message = useMessage()
//表单数据
const model = ref({})
const chart = ref(null)
const modalTitle = ref(null)
onMounted(() => {})
const num = ref(30)
const position_id = ref(0)
const type = ref(0)
async function show(data, dataType) {
  const getTime = new Date().getTime() //获取到当前时间戳
  const time = new Date(getTime) //创建一个日期对象
  year.value = time.getFullYear().toString() // 年
  num.value = 30
  getCharts(data.position_id, dataType)
  position_id.value = data.position_id
  type.value = dataType
  showModal.value = true
}
function dateChange(dateNum) {
  console.log(dateNum)
  num.value = dateNum
  year_type.value = 0
  getCharts(position_id.value, type.value, dateNum)
}
const years = ref()
function yearChange(value) {
  const date = new Date(value)
  const y = date.getFullYear() // 年份
  if (year_type.value) {
    getCharts(position_id.value, type.value, 0, year_type.value, y)
  }
}
function dateChanges(value) {
  num.value = 0
  year_type.value = value
  years.value = year.value
  if (!years.value) {
    const getTime = new Date().getTime() //获取到当前时间戳
    const time = new Date(getTime) //创建一个日期对象
    years.value = time.getFullYear() // 年
    year.value = time.getFullYear().toString() // 年
  }
  getCharts(position_id.value, type.value, 0, value, years.value)
}
function getCharts(position_id, type = 0, num = 30, year_type = 0, year = 0) {
  http.getEcharts({ positionId: position_id, type, date: num, year_type, year }).then((res) => {
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
<style>
.dates {
  margin-right: 15px;
}
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

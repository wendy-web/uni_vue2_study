<script setup lang="ts">
import dayjs from "dayjs";
import {
  getEqipmentMapApi,
  getShutdownChartDataApi,
  getYearsSelectDataApi,
} from "@/api/device/report-forms/shutdown";
import echarts from "@/types/echarts";

type seriesDataType = { data: number[]; type: string; name: string };

const emits = defineEmits(["setAdaptive"]);

const formData = ref({
  years: [dayjs().year()] as number[], //年份
  equipment_ids: [] as number[], //资产id
  is_stop: undefined as FormNumType, //是否停机
});

/** 折叠面板的数组 */
const activeNames = ref<string[]>(["1"]);

const formColumns: PlusColumnList = [
  {
    label: "年份",
    prop: "years",
    valueType: "select",
    options: async () => {
      const result = await getYearsSelectDataApi();
      return result.data.list.map((item: any, index: number) => {
        return {
          label: item,
          value: item,
          fieldItemProps: {
            disabled: index === 0,
          },
        };
      });
    },
    fieldProps: {
      multiple: true,
      multipleLimit: 3,
      onChange: (value: number) => {
        getData();
      },
    },
  },

  {
    label: "资产名称",
    prop: "equipment_ids",
    valueType: "select",
    options: async () => {
      const result = await getEqipmentMapApi();
      console.log("🚀 ~ options:async ~ result:", result.data.list);
      return result.data.list.map((item: { id: number; bar_title: string }, index: number) => {
        return {
          label: item.bar_title,
          value: item.id,
        };
      });
    },
    fieldProps: {
      multiple: true,
      multipleLimit: 3,
      onChange: (value: number) => {
        console.log("🚀 ~ value:", value);
        getData();
      },
    },
  },
  {
    label: "是否停机",
    prop: "is_stop",
    valueType: "select",
    options: [
      {
        label: "是",
        value: 1,
      },
      {
        label: "否",
        value: 0,
      },
    ],
    fieldProps: {
      onChange: (value: number) => {
        console.log("🚀 ~ value:", value);
        if (typeof value === "string") {
          formData.value.is_stop = undefined;
        }
        getData();
      },
    },
  },
];

const lineChartsRef = ref();
let chartInstance: echarts.ECharts | null = null;

function collapseChange() {
  emits("setAdaptive");
}

onMounted(() => {
  getData();
});

async function getData() {
  let { years, equipment_ids, is_stop } = formData.value;

  let equipmentIds = equipment_ids.length > 0 ? equipment_ids.join(",") : undefined;

  let data = { years: years.join(","), equipment_ids: equipmentIds, is_stop };
  const result = await getShutdownChartDataApi(data);
  let seriesObj = result.data;

  let legendData = Object.keys(seriesObj);
  let seriesData: seriesDataType[] = [];
  for (let key in seriesObj) {
    let series = Object.values(seriesObj[key]) as number[];
    seriesData.push({
      data: series,
      type: "line",
      name: key,
    });
  }

  initChart(seriesData, legendData);
  window.addEventListener("resize", handleResize);
  handleResize();
}

function initChart(seriesData: seriesDataType[], legendData: string[]) {
  console.log("🚀 ~ initChart ~ seriesData:", seriesData);
  let option = {
    legend: {
      // data: ["2024", "2025"], //图例名称
      data: legendData, //图例名称
      right: 10, //调整图例位置
      top: 0, //调整图例位置
      itemHeight: 7, //修改icon图形大小
      icon: "rect", //图例前面的图标形状
      orient: "vertical", // 设置为竖直排列
    },

    xAxis: {
      type: "category",
      axisTick: {
        alignWithLabel: true,
      },
      name: "月份",
      nameTextStyle: {
        // 设置名称的文本样式
        fontWeight: "bold", // 字体粗细
      },
      data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    },
    yAxis: {
      axisLine: {
        show: true,
      },
      type: "value",
      name: "累计误时(分)",
      nameTextStyle: {
        // 设置名称的文本样式
        fontWeight: "bold", // 字体粗细
      },
      min: 0,
      max: 60,
      axisLabel: {
        formatter: "{value}分",
      },
    },
    series: seriesData,
  };

  if (!chartInstance) {
    chartInstance = echarts.init(lineChartsRef.value);
    chartInstance.setOption(option);
  } else {
    chartInstance.setOption(option);
  }
}

function handleResize() {
  if (chartInstance) {
    chartInstance.resize();
  }
}

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose();
    window.removeEventListener("resize", handleResize);
  }
});
</script>
<template>
  <div>
    <el-collapse v-model="activeNames" @change="collapseChange">
      <el-collapse-item name="1">
        <template #title>
          <p class="font-bold text-[14px]">折线图表</p>
        </template>
        <PlusForm
          ref="PlusformRef"
          v-model="formData"
          :columns="formColumns"
          label-position="right"
          :row-props="{ gutter: 20 }"
          :col-props="{
            span: 8,
          }"
          :hasFooter="false"
        ></PlusForm>
        <div ref="lineChartsRef" style="width: 100%; height: 400px"></div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/collapse.scss";
:deep(.el-collapse) {
  padding-bottom: 10px;
}
</style>

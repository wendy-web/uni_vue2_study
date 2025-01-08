export default {
    option: {
        tooltip: {
            show: false, // 显示 y 轴实线
            trigger: "axis",
            formatter: '{b}\r￥{c0}',
            // formatter: function(param) {
            //     return '--';
            // },
            // valueFormatter: (value) => '$' + value.toFixed(2),
            backgroundColor: "#EF2B20",
            axisPointer: {
                type: "line",
                axis: "x",
                label: {
                    backgroundColor: "#FABFBD"
                }
            }
        },
        grid: {
            left: "0%",
            right: "6%",
            top: "6%",
            bottom: "6%",
            containLabel: true
        },
        xAxis: {
            type: "category",
            boundaryGap: false,
            data: [],
            axisLine: {
                lineStyle: {
                    color: "#FABFBD",
                },
            },
            axisTick: {
                // y轴刻度线
                show: false
            },
            splitLine: {
                // 网格线
                show: false
            },
            axisLabel: {
                interval: 0
            }
        },
        yAxis: {
            type: "value",
            axisLine: {
                show: true, // 显示 y 轴实线
                lineStyle: {
                    color: "#666"
                }
            },
            axisTick: {
                // y轴刻度线
                show: false
            },
            splitLine: {
                lineStyle: {
                    // 使用深浅的间隔色
                    color: '#F1F1F1',
                    type: 'dashed'
                }
            }
        },
        series: [{
            name: "浏览量",
            type: "line",
            smooth: true,
            areaStyle: {
                color: {
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                            offset: 0,
                            color: "rgba(239,43,32,0.10)", // 0% 处的颜色
                        },
                        {
                            offset: 1,
                            color: "#fff" // 100% 处的颜色
                        }
                    ],
                    global: false // 缺省为 false
                }
            },
            lineStyle: {
                color: "#EF5959"
            },
            data: []
        }],
        // dataZoom: [{
        //         type: 'slider',
        //         show: false,
        //         start: 0,
        //         end: 100,
        //         handleSize: 8
        //     },
        //     {
        //         type: 'inside',
        //         start: 94,
        //         end: 100
        //     },
        //     {
        //         type: 'slider',
        //         show: false,
        //         yAxisIndex: 0,
        //         filterMode: 'empty',
        //         width: 12,
        //         height: '70%',
        //         handleSize: 8,
        //         showDataShadow: false,
        //         left: '93%'
        //     }
        // ],
    }
}
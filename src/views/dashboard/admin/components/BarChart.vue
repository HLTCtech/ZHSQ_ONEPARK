<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { getEchartMoneyGotWeekly } from '@/api/billOverall'

const animationDuration = 6000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      getEchartMoneyGotWeekly().then(response => {
        this.chart.hideLoading()
        this.chart.setOption({
          series: [{
            name: '电费',
            data: response.data.electric
          },
          {
            name: '物业费',
            data: response.data.property
          },
          {
            name: '停车场管理费',
            data: response.data.car
          }
          ],
          title: {
            text: response.data.dateRange
          }
        })
      })

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        title: {
          show: true,
          text: '',
          x: 'right',
          y: 'top',
          fontSize: 5
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: '物业费',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [],
          animationDuration
        }, {
          name: '停车场管理费',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [],
          animationDuration
        }, {
          name: '电费',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [],
          animationDuration
        }]
      })
    }
  }
}
</script>

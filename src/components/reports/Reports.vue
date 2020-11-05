<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <div id="main" style="width: 750px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'

export default {
  data () {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created () {
  },
  async mounted () {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))
    // 发起请求
    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) {
      return this.$message.error('获取数据图表数据失败!')
    }
    // 递归深度合并方法
    function deepMerge (obj1, obj2) {
      for (var k in obj2) {
        // 如果target(也就是obj1[key])存在，且是对象的话再去调用deepMerge，否则就是obj1[key]里面没这个对象，需要与obj2[key]合并
        // 如果obj2[key]没有值或者值不是对象，此时直接替换obj1[key]
        obj1[k] = obj1[k] && obj1[k].toString() === '[object Object]' &&
          (obj2[k] && obj2[k].toString() === '[object Object]')
          ? deepMerge(obj1[k], obj2[k])
          : (obj1[k] = obj2[k])
      }
      return obj1
    }
    const result = deepMerge(res.data, this.options)
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(result)
  },
  methods: {
  }
}
</script>

<style lang="stylus" scoped></style>

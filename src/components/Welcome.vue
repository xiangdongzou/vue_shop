<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>欢迎页</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row width="50%">
        <el-col>
          <h1>welcome</h1>
        </el-col>
        <el-col>
          <el-avatar>admin </el-avatar>
        </el-col>
        <el-col class="c">
          <span class="demonstration">给个五星好评吧!</span>
          <el-rate v-model="rate" :colors="colors"> </el-rate>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rate: {},
      colors: ['#99A9BF', '#F7BA2A', '#FF9900']
    }
  }
}
</script>
<style lang="less" scoped>
.el-col {
  margin-bottom: 10px;
}
.el-avatar {
  transform: scale(1.5);
  margin-left: 10px;
  font-size: 12px;
}
.c {
  margin-top: 10px;
}
.el-card {
  width: 480px;
}
</style>

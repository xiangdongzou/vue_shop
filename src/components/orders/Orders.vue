<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getOrderList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrderList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表区域 -->
      <el-table :data="orderlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template v-slot="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">
              已付款
            </el-tag>
            <el-tag type="danger" v-else> 未付款 </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template v-slot="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template>
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="showbox"
            ></el-button>
            <!-- 定位按钮 -->
            <el-button
              type="success"
              icon="el-icon-truck"
              circle
              @click="showProgressBox"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[4, 6, 8, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 对话框区域 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressVisible"
      width="50%"
      @close="addressClosed"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区 / 县" prop="address1">
          <el-cascader
            :options="cityData"
            v-model="addressForm.address1"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 展示物流进度对话框区域 -->
    <el-dialog
      title="物流进度"
      :visible.sync="progressVisible"
      width="50%"
      height="100%"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(item, i) in progressInfo"
          :key="i"
          :timestamp="item.time"
          placement="top"
          type="success"
          icon="el-icon-check"
        >
          <el-card>
            <h4>{{ item.context }}</h4>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata.js'
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 6
      },
      total: 0,
      orderlist: [],
      addressVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [
          { required: true, message: '请选择省市区/县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写详细地址!', trigger: 'blur' }
        ]
      },
      cityData,
      progressVisible: false,
      progressInfo: [
        {
          time: '2018-05-10 09:39:00',
          context: '已签收,感谢使用顺丰,期待再次为您服务'
        },
        {
          time: '2018-05-10 08:23:00',
          context: '[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件'
        },
        {
          time: '2018-05-10 07:32:00',
          context: '快件到达 [北京海淀育新小区营业点]'
        },
        {
          time: '2018-05-10 02:03:00',
          context: '快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]'
        },
        {
          time: '2018-05-09 23:05:00',
          context: '快件到达 [北京顺义集散中心]'
        },
        {
          time: '2018-05-09 21:21:00',
          context: '快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]'
        },
        {
          time: '2018-05-09 13:07:00',
          context: '顺丰速运 已收取快件'
        },
        {
          time: '2018-05-09 12:25:03',
          context: '卖家发货'
        },
        {
          time: '2018-05-09 12:22:24',
          context: '您的订单将由HLA（北京海淀区清河中街店）门店安排发货。'
        },
        {
          time: '2018-05-08 21:36:04',
          context: '商品已经下单'
        }
      ]
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    async getOrderList () {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取订单列表失败!')
      this.orderlist = res.data.goods
      this.total = res.data.total
    },
    // 监听页面改变事件
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    // 监听页面值改变事件
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    showbox () {
      this.addressVisible = true
    },
    addressClosed () {
      this.$refs.addressFormRef.resetFields()
    },
    // 展示物流进度对话框事件
    async showProgressBox () {
      // 因为接口问题只能自己手写数据
      //   const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      //   if (res.meta.status !== 200) {
      //     return this.$message.error('获取物流信息失败!')
      //   }
      //   this.progressInfo = res.data
      this.progressVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 50%;
}
</style>

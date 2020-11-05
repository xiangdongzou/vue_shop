<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表区域 -->
      <el-table :data="goodslist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格(元)"
          width="110px"
        ></el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          width="90px"
        ></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="160px">
          <template v-slot="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template v-slot="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="showEditDialog(scope.row.goods_id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="removeGoods(scope.row.goods_id)"
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
    <!-- 编辑商品对话框区域 -->
    <el-dialog title="编辑商品" :visible.sync="editGoodVisible" width="50%">
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="90px"
      >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editForm.goods_name"></el-input>
        </el-form-item>
        <div class="three">
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="editForm.goods_price" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="editForm.goods_number" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="editForm.goods_weight" type="number"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="介绍" prop="goods_introduce">
          <el-input
            v-model="editForm.goods_introduce"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item label="图片路径" prop="pics">
          <el-upload
            :action="uploadURL"
            :on-remove="handleRemove"
            :headers="headerObj"
            :on-success="handleSuccess"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editGoodVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGoods">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 获取商品列表的参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 6
      },
      goodslist: [],
      total: 0,
      editGoodVisible: false,
      GoodsId: '',
      editForm: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_introduce: '',
        pics: []
      },
      editFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ]
      },
      // 上传的url地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传组件的heanders请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      }
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取商品列表失败!')
      this.goodslist = res.data.goods
      this.total = res.data.total
    },
    // 监听页面改变事件
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // 监听页面值改变事件
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 编辑商品事件
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('goods/' + id)
      if (res.meta.status !== 200) return this.$message.error('获取商品信息失败!')
      this.editForm.goods_name = res.data.goods_name
      this.editForm.goods_price = res.data.goods_price
      this.editForm.goods_number = res.data.goods_number
      this.editForm.goods_weight = res.data.goods_weight
      this.editForm.goods_introduce = res.data.goods_introduce
      this.editForm.pics = res.data.pics
      this.editForm.attrs = res.data.attrs
      this.GoodsId = id
      this.editGoodVisible = true
    },
    async editGoods () {
      const { data: res } = await this.$http.put(`goods/${this.GoodsId}`, this.editForm)
      if (res.meta.status === 400) {
        this.getGoodsList()
        this.editGoodVisible = false
        return this.$message.warning(res.meta.msg)
      }
    },
    async removeGoods (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult === 'confirm') {
        const { data: res } = await this.$http.delete(`goods/${id}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除用户信息失败!')
        }
        this.$message.success('删除用户信息成功')
        this.getGoodsList()
      }
    },
    // 删除图片事件
    handleRemove (file) {
      // 得到临时路径(file上面);找到对应索引;然后splice删除
      const filePath = file.response.data.tmp_path
      const index = this.editForm.pics.findIndex(item =>
        item.pic === filePath
      )
      this.editForm.pics.splice(index, 1)
    },
    // 监听图片上传的事件
    handleSuccess (response) {
      // 拼接得到一个图片信息对象;将它push到pics数组
      const picInfo = {
        pic: response.data.tmp_path
      }
      this.editForm.pics.push(picInfo)
    },
    // 跳转页面
    goAddpage () {
      this.$router.push('goods/add')
    }
  }
}
</script>
<style lang="less" scoped>
.three {
  display: flex;
  .el-form-item {
    flex: 1;
  }
}
</style>

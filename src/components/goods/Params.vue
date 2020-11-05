<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告提示区域 -->
      <el-alert
        show-icon
        title="注意:只允许为第三级分类设置相关参数!"
        type="warning"
      >
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>
          <!-- 级联选择框区域 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="catelist"
            :props="cateProps"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加参数
          </el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- 输入文本框区域 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <!-- 修改按钮 -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  round
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <!-- 删除按钮 -->
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  round
                  @click="removeParams(scope.row.attr_id)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- 输入文本框区域 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <!-- 修改按钮 -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  round
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <!-- 删除按钮 -->
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  round
                  @click="removeParams(scope.row.attr_id)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数的对话框区域 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数的对话框区域 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      catelist: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedCateKeys: [],
      // 被激活的页签名称
      activeName: 'many',
      // 获取动态参数数据
      manyTableData: [],
      // 获取静态属性数据
      onlyTableData: [],
      addDialogVisible: false,
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editForm: {
      },
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败!')
      }
      this.catelist = res.data
    },
    // 级联选择框改变触发函数
    handleChange () {
      this.getParamsData()
    },
    // tab页签点击事件
    handleTabClick () {
      this.getParamsData()
    },
    // 获取参数的数据
    async getParamsData () {
      // 只允许为第三级分类设置
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return false
      }
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败!')
      }
      // 循环数组把字符串变成数组
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制文本框的显示隐藏,输入的值为空
        item.inputVisible = false
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 监听添加对话框关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 对话框点击按钮事件
    addParams () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, { attr_name: this.addForm.attr_name, attr_sel: this.activeName })
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败!')
        }
        this.$message.success('添加参数成功')
        this.getParamsData()
        this.addDialogVisible = false
      })
    },
    // 修改按钮事件
    async showEditDialog (attrId) {
      // 查询当前参数的信息
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${attrId}`, { params: { attr_sel: this.activeName } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败!')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 修改对话框点击按钮事件
    editParams () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, { attr_name: this.editForm.attr_name, attr_sel: this.activeName })
        if (res.meta.status !== 200) {
          return this.$message.error('修改参数失败!')
        }
        this.$message.success('修改参数成功')
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    // 删除对话框点击按钮事件
    async removeParams (attrId) {
      // 弹框提示
      const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果用户确认删除,则返回字符串 confirm;点取消则返回字符串cancel
      if (confirmResult === 'confirm') {
        const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attrId}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除参数失败!')
        }
        this.$message.success('删除参数成功')
        this.getParamsData()
      }
    },
    // tag文本框确定事件
    async handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return true
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      // 发起请求
      this.saveAtrrVals(row)
    },
    showInput (row) {
      row.inputVisible = true
      // 文本框自动获得焦点 $nextTick方法作用:当页面上的元素被重新渲染之后,才会指定回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除tag标签事件
    handleClose (i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAtrrVals(row)
    },
    // 发起tag标签请求函数
    async saveAtrrVals (row) {
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, { attr_name: row.attr_name, attr_sel: row.attr_sel, attr_vals: row.attr_vals.join(' ') })
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数失败!')
      }
    }
  },
  computed: {
    // 监控按钮被禁用状态
    isBtnDisabled () {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中的三级分类id
    cateId () {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    // 动态计算标题文本
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>
<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-cascader {
  width: 300px;
  margin-left: 15px;
}
.el-tag {
  margin-right: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>

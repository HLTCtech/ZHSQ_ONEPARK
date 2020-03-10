<template>
  <!-- 垃圾清运费收费 -->
  <div class="app-container">

    <!-- 顶部搜索框 -->
    <div class="filter-container">
      <el-input v-model="listQuery_search.operatorName" type="text" placeholder="输入姓名" style="width: 130px" class="filter-item" clearable />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch()">
        搜索
      </el-button>
    </div>

    <el-button v-waves class="filter-item" type="success" icon="el-icon-coin" @click="handleNewAdminUser">
      新增操作员信息
    </el-button>
    <br>
    <br>

    <!-- 操作员信息表格 -->
    <el-table highlight-current-row stripe border fit :data="tableData" style="width: 100%" height="800">
      <el-table-column label="ID" prop="id" align="center" width="50" fixed />
      <el-table-column label="编号" prop="operatorId" align="center" />
      <el-table-column label="姓名" prop="operatorName" align="center" />
      <el-table-column label="电话" prop="operatorPhone" align="center" />
      <el-table-column label="权限" prop="operatorRole" align="center" />
      <el-table-column label="所属部门" prop="operatorDepartment" align="center" />
      <el-table-column label="职位" prop="operatorPosition" align="center" />
      <el-table-column label="修改信息" align="center" width="80" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleInfoChange(row)">
            修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增操作员信息页面模态框 -->
    <el-dialog :visible.sync="dialogNewOperator" title="新增操作员信息">
      <el-card class="box-card">
        <!-- 定义表单提交项 -->
        <el-form ref="newOperator" :rules="newOperatorFormRules" :model="newOperatorForm" label-width="80px">
          <el-form-item label="姓名" label-width="100px" prop="operatorName">
            <el-input v-model="newOperatorForm.operatorName" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="手机号" label-width="100px" prop="operatorPhone">
            <el-input v-model="newOperatorForm.operatorPhone" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="所属部门" label-width="100px" prop="operatorDepartment">
            <el-select v-model="newOperatorForm.operatorDepartment" placeholder="请选择部门">
              <el-option v-for="item in operatorDepartmentOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="职位" label-width="100px" prop="operatorPosition">
            <el-input v-model="newOperatorForm.operatorPosition" placeholder="请输入职位" />
          </el-form-item>
          <el-form-item label="权限" label-width="100px" prop="operatorRole">
            <el-select v-model="newOperatorForm.operatorRole" placeholder="请选择权限">
              <el-option v-for="item in operatorRoleOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="submitFormPost(newOperatorForm)">提交</el-button>
            <el-button @click="CleanDataForm()">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-dialog>

    <!-- 修改操作员信息页面模态框 -->
    <el-dialog :visible.sync="dialogOperatorInfoChange" title="修改操作员信息">
      <el-card class="box-card">
        <!-- 定义表单提交项 -->
        <el-form ref="operatorInfoChange" :rules="operatorInfoChangeRules" :model="operatorInfoChangeForm" label-width="80px">
          <el-form-item label="姓名" label-width="100px" prop="operatorName">
            <el-input v-model="operatorInfoChangeForm.operatorName" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="手机号" label-width="100px" prop="operatorPhone">
            <el-input v-model="operatorInfoChangeForm.operatorPhone" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="所属部门" label-width="100px" prop="operatorDepartment">
            <el-select v-model="operatorInfoChangeForm.operatorDepartment" placeholder="请选择部门">
              <el-option v-for="item in operatorDepartmentOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="职位" label-width="100px" prop="operatorPosition">
            <el-input v-model="operatorInfoChangeForm.operatorPosition" placeholder="请输入职位" />
          </el-form-item>
          <el-form-item label="权限" label-width="100px" prop="operatorRole">
            <el-select v-model="operatorInfoChangeForm.operatorRole" placeholder="请选择权限">
              <el-option v-for="item in operatorRoleOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="infoChangeSubmitFormPost(operatorInfoChangeForm)">提交</el-button>
            <el-button @click="CleanInfoChangeDataForm()">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-dialog>

    <!-- 分页功能实现标签 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery_all.page" @pagination="getList" />

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchOperatorList, fetchOperatorSearch, newOperatorPost, infoChangeOperatorPost, fetchSearchByOperatorId } from '@/api/user'
import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'PermissionChange',
  directives: { waves },
  components: { Pagination },
  data() {
    const validateUserPhone = (rule, value, callback) => {
      const phone = value
      if (!/^1[3456789]\d{9}$/.test(phone)) {
        callback(new Error('请输入正确的用户名（手机号）'))
      } else {
        callback()
      }
    }
    return {
      show: true,
      count: '',
      payPattern: true,
      dialogNewOperator: false,
      // 声明表格数据源
      tableData: [],
      pvData_all: [],
      // 声明分页变量
      total: 0,
      // search()查询请求变量
      listQuery_search: {
        operatorName: null
      },
      // list()查询请求变量
      listQuery_all: {
        page: 1
      },
      operatorDepartmentOptions: ['财务', '物业'],
      operatorRoleOptions: [{ value: 'admin', label: '管理员' }, { value: 'operator', label: '操作员' }],
      listLoading: true,
      // 新增操作员提交项目
      newOperatorForm: {
        operatorName: null,
        operatorPhone: null,
        operatorDepartment: null,
        operatorPosition: null,
        operatorRole: null,
        adminId: this.$store.getters.adminId
      },
      // 新增操作员规则
      newOperatorFormRules: {
        operatorName: [{ required: true, message: '请输入姓名', trigger: 'change' }],
        operatorPhone: [{ required: true, message: '请输入正确格式的手机号', trigger: 'change', validator: validateUserPhone }],
        operatorRole: [{ required: true, message: '请选择权限', trigger: 'blur' }],
        operatorDepartment: [{ required: true, message: '请选择所属部门', trigger: 'blur' }],
        operatorPosition: [{ required: true, message: '请输入职位', trigger: 'blur' }]
      },
      // 变更操作员规则
      operatorInfoChangeRules: {
        operatorName: [{ required: true, message: '请输入姓名', trigger: 'change' }],
        operatorPhone: [{ required: true, message: '请输入正确格式的手机号', trigger: 'change', validator: validateUserPhone }],
        operatorRole: [{ required: true, message: '请选择权限', trigger: 'blur' }],
        operatorDepartment: [{ required: true, message: '请选择所属部门', trigger: 'blur' }],
        operatorPosition: [{ required: true, message: '请输入职位', trigger: 'blur' }]
      },
      // 修改操作员信息提交项目
      operatorInfoChangeForm: {
        operatorId: null,
        operatorName: null,
        operatorPhone: null,
        operatorDepartment: null,
        operatorPosition: null,
        operatorRole: null,
        adminId: this.$store.getters.adminId
      },
      dialogOperatorInfoChange: false
    }
  },
  computed: {
    ...mapGetters([
      'adminName',
      'adminId',
      'roles'
    ])
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取表格数据
    getList() {
      fetchOperatorList(this.listQuery_all).then(response => {
        this.tableData = response.data.items
        this.total = response.total
      })
    },
    // 搜索记录
    handleSearch() {
      fetchOperatorSearch(this.listQuery_search).then(response => {
        this.tableData = response.data.items
        this.total = response.total
      })
    },
    // 新增操作员信息按钮
    handleNewAdminUser() {
      this.dialogNewOperator = true
    },
    // 新增操作员信息提交
    submitFormPost(newOperatorForm) {
      // 表单项规则验证
      this.$refs['newOperator'].validate((valid) => {
        if (valid) {
          // 操作确认框
          this.$confirm('确定提交么？', '新增操作员信息', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          }).then(() => {
            newOperatorPost(newOperatorForm).then(response => {
              if (response.codeStatus === 200) {
                this.$notify({
                  title: 'Success',
                  message: '提交成功',
                  type: 'success',
                  duration: 2000
                })
                this.$nextTick(() => {
                  this.$refs['newOperator'].resetFields()
                })
                this.dialogNewOperator = false
                // fetchSearchByOperatorId(newOperatorForm.operatorId).then(response => {
                //   this.tableData = response.data.items
                // })
              } else {
                this.$notify({
                  title: 'Failure',
                  message: '提交失败，请联系系统管理员',
                  type: 'error',
                  duration: 3000
                })
              }
            })
          })
        }
      })
    },
    // 变更操作员信息提交
    infoChangeSubmitFormPost(operatorInfoChangeForm) {
      // 表单项规则验证
      this.$refs['operatorInfoChange'].validate((valid) => {
        if (valid) {
          // 操作确认框
          this.$confirm('确定提交么？', '变更操作员信息', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          }).then(() => {
            infoChangeOperatorPost(operatorInfoChangeForm).then(response => {
              if (response.codeStatus === 200) {
                this.$notify({
                  title: 'Success',
                  message: '提交成功',
                  type: 'success',
                  duration: 2000
                })
                this.$nextTick(() => {
                  this.$refs['operatorInfoChange'].resetFields()
                })
                this.dialogOperatorInfoChange = false
                fetchSearchByOperatorId(operatorInfoChangeForm.operatorId).then(response => {
                  this.tableData = response.data.items
                })
              } else {
                this.$notify({
                  title: 'Failure',
                  message: '提交失败，请联系系统管理员',
                  type: 'error',
                  duration: 3000
                })
              }
            })
          })
        }
      })
    },
    // 修改信息按钮模态框
    handleInfoChange(row) {
      this.operatorInfoChangeForm.operatorId = row.operatorId
      this.operatorInfoChangeForm.operatorName = row.operatorName
      this.operatorInfoChangeForm.operatorPhone = row.operatorPhone
      this.operatorInfoChangeForm.operatorRole = row.operatorRole
      this.operatorInfoChangeForm.operatorDepartment = row.operatorDepartment
      this.operatorInfoChangeForm.operatorPosition = row.operatorPosition
      this.dialogOperatorInfoChange = true
    },
    // 取消按钮
    CleanDataForm() {
      if (this.$refs['newOperator'] !== undefined) {
        this.$nextTick(() => {
          this.$refs['newOperator'].resetFields()
        })
      }
      this.dialogNewOperator = false
    },
    CleanInfoChangeDataForm() {
      if (this.$refs['operatorInfoChange'] !== undefined) {
        this.$nextTick(() => {
          this.$refs['operatorInfoChange'].resetFields()
        })
      }
      this.dialogOperatorInfoChange = false
    }
  }
}
</script>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.show-sms {
    position: absolute;
    right: 10px;
    top: 82px;
    font-size: 15px;
    color: $light_gray;
    cursor: pointer;
    user-select: none;
  }

  </style>

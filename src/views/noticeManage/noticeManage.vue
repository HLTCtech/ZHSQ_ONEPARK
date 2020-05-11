<template>
  <!-- 通知公告管理 -->
  <div class="app-container">

    <el-button v-waves class="filter-item" type="success" icon="el-icon-coin" @click="handleNewNoticeContent">
      新增通知公告
    </el-button>
    <br>
    <br>

    <!-- 操作员信息表格 -->
    <el-table highlight-current-row stripe border fit :data="tableData" style="width: 100%" height="800">
      <el-table-column label="ID" prop="id" align="center" width="50" fixed />
      <el-table-column label="通知编号" prop="noticeId" align="center" width="80" fixed />
      <el-table-column label="通知内容" prop="noticeContent" align="center" />
      <el-table-column label="发布时间" prop="publishDate" align="center" width="150" />
      <el-table-column label="修改内容" align="center" width="80" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleContentChange(row)">
            修改
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="删除内容" align="center" width="80" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="{row}">
          <el-button type="danger" size="mini" @click="handledelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增通知公告内容模态框 -->
    <el-dialog :visible.sync="dialogNewNotice" title="新增通知公告">
      <el-card class="box-card">
        <!-- 定义表单提交项 -->
        <el-form ref="newNotice" :rules="newNoticeFormRules" :model="noticeNewForm" label-width="80px">
          <el-form-item label="通知内容" label-width="100px" prop="noticeContent">
            <el-input v-model="noticeNewForm.noticeContent" placeholder="请输入通知内容" />
          </el-form-item>
          <el-form-item label="发布时间" label-width="100px" prop="publishDate">
            <div class="block">
              <el-date-picker v-model="noticeNewForm.publishDate" align="right" type="date" placeholder="请选择发布时间" value-format="yyyy-MM-dd" />
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="newNoticeFormPost(noticeNewForm)">提交</el-button>
            <el-button @click="CleanNewNoticeForm()">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-dialog>

    <!-- 修改通知公告内容模态框 -->
    <el-dialog :visible.sync="dialogContentChange" title="修改公告内容">
      <el-card class="box-card">
        <!-- 定义表单提交项 -->
        <el-form ref="changeNotice" :rules="changeNoticeFormRules" :model="noticeChangeForm" label-width="80px">
          <el-form-item label="id" label-width="100px" prop="id">
            <el-input v-model="noticeChangeForm.id" disabled />
          </el-form-item>
          <el-form-item label="通知编号" label-width="100px" prop="noticeId">
            <el-input v-model="noticeChangeForm.noticeId" disabled />
          </el-form-item>
          <el-form-item label="通知内容" label-width="100px" prop="noticeContent">
            <el-input v-model="noticeChangeForm.noticeContent" placeholder="请输入通知内容" />
          </el-form-item>
          <el-form-item label="发布时间" label-width="100px" prop="publishDate">
            <el-input v-model="noticeChangeForm.publishDate" placeholder="请输入发布时间" />
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="changeNoticeFormPost(noticeChangeForm)">提交</el-button>
            <el-button @click="CleanChangeNoticeForm()">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-dialog>

    <!-- 删除通知公告内容模态框 -->
    <el-dialog :visible.sync="dialogContentDelete" title="删除通知公告">
      <el-card class="box-card">
        <!-- 定义表单提交项 -->
        <el-form ref="deleteNotice" label-width="80px">
          <el-form-item label="id" label-width="100px" prop="id">
            <el-input v-model="noticeDeleteForm.id" disabled />
          </el-form-item>
          <el-form-item label="通知编号" label-width="100px" prop="noticeId">
            <el-input v-model="noticeDeleteForm.noticeId" disabled />
          </el-form-item>
          <el-form-item label="通知内容" label-width="100px" prop="noticeContent">
            <el-input v-model="noticeDeleteForm.noticeContent" placeholder="请输入通知内容" disabled />
          </el-form-item>
          <el-form-item label="发布时间" label-width="100px" prop="publishDate">
            <el-input v-model="noticeDeleteForm.publishDate" placeholder="请输入发布时间" disabled />
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="deleteNoticeFormPost(noticeDeleteForm)">删除</el-button>
            <el-button @click="CleanNoticeDeleteDataForm()">取消</el-button>
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
import { fetchNoticeList, newNotice, changeNotice, deleteNotice } from '@/api/notice'
import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'NoticeManage',
  directives: { waves },
  components: { Pagination },
  data() {
    return {
      show: true,
      count: '',
      payPattern: true,
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
      // 新增通知公告规则
      newNoticeFormRules: {
        noticeContent: [{ required: true, message: '请输入通知公告内容', trigger: 'change' }],
        publishDate: [{ required: true, message: '请输入发布时间', trigger: 'change' }]
      },
      // 变更通知公告规则
      changeNoticeFormRules: {
        noticeContent: [{ required: true, message: '请输入通知公告内容', trigger: 'change' }],
        publishDate: [{ required: true, message: '请输入发布时间', trigger: 'change' }]
      },
      // 新增通知公告
      noticeNewForm: {
        noticeContent: null,
        publishDate: null,
        adminId: this.$store.getters.adminId
      },
      // 修改通知公告
      noticeChangeForm: {
        id: null,
        noticeContent: null,
        publishDate: null,
        adminId: this.$store.getters.adminId
      },
      // 删除通知公告
      noticeDeleteForm: {
        id: null,
        noticeContent: null,
        publishDate: null,
        adminId: this.$store.getters.adminId
      },
      dialogNewNotice: false,
      dialogContentChange: false,
      dialogContentDelete: false
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
      fetchNoticeList(this.listQuery_all).then(response => {
        this.tableData = response.data.items
        this.total = response.total
      })
    },
    // 新增通知公告
    handleNewNoticeContent() {
      this.dialogNewNotice = true
    },
    // 新增通知公告
    newNoticeFormPost(noticeNewForm) {
      // 表单项规则验证
      this.$refs['newNotice'].validate((valid) => {
        if (valid) {
          // 操作确认框
          this.$confirm('确定提交么？', '新增通知公告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          }).then(() => {
            newNotice(noticeNewForm).then(response => {
              if (response.codeStatus === 200) {
                this.$notify({
                  title: 'Success',
                  message: '提交成功',
                  type: 'success',
                  duration: 2000
                })
                this.$nextTick(() => {
                  this.$refs['newNotice'].resetFields()
                })
                this.dialogNewNotice = false
                fetchNoticeList(this.listQuery_all).then(response => {
                  this.tableData = response.data.items
                  this.total = response.total
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
    // 修改通知公告
    changeNoticeFormPost(noticeChangeForm) {
      // 表单项规则验证
      this.$refs['changeNotice'].validate((valid) => {
        if (valid) {
          // 操作确认框
          this.$confirm('确定提交么？', '修改通知公告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          }).then(() => {
            changeNotice(noticeChangeForm).then(response => {
              if (response.codeStatus === 200) {
                this.$notify({
                  title: 'Success',
                  message: '提交成功',
                  type: 'success',
                  duration: 2000
                })
                this.$nextTick(() => {
                  this.$refs['changeNotice'].resetFields()
                })
                this.dialogContentChange = false
                fetchNoticeList(this.listQuery_all).then(response => {
                  this.tableData = response.data.items
                  this.total = response.total
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
    // 删除通知公告
    deleteNoticeFormPost(noticeDeleteForm) {
      // 操作确认框
      this.$confirm('确定删除么？', '删除通知公告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        deleteNotice(noticeDeleteForm).then(response => {
          if (response.codeStatus === 200) {
            this.$notify({
              title: 'Success',
              message: '提交成功',
              type: 'success',
              duration: 2000
            })
            this.dialogContentDelete = false
            fetchNoticeList(this.listQuery_all).then(response => {
              this.tableData = response.data.items
              this.total = response.total
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
    },
    // 修改公告内容模态框
    handleContentChange(row) {
      this.noticeChangeForm.id = row.id
      this.noticeChangeForm.noticeId = row.noticeId
      this.noticeChangeForm.noticeContent = row.noticeContent
      this.noticeChangeForm.publishDate = row.publishDate
      this.dialogContentChange = true
    },
    // 删除公告内容模态框
    handledelete(row) {
      this.noticeDeleteForm.id = row.id
      this.noticeDeleteForm.noticeId = row.noticeId
      this.noticeDeleteForm.noticeContent = row.noticeContent
      this.noticeDeleteForm.publishDate = row.publishDate
      this.dialogContentDelete = true
    },
    // 取消新增按钮
    CleanNewNoticeForm() {
      if (this.$refs['newNotice'] !== undefined) {
        this.$nextTick(() => {
          this.$refs['newNotice'].resetFields()
        })
      }
      this.dialogNewNotice = false
    },
    // 取消修改按钮
    CleanChangeNoticeForm() {
      this.dialogContentChange = false
    },
    // 取消删除
    CleanNoticeDeleteDataForm() {
      this.dialogContentDelete = false
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

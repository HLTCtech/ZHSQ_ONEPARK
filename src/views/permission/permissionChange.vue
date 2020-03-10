<template>
  <!-- 垃圾清运费收费 -->
  <div class="app-container">

    <!-- 顶部搜索框 -->
    <div class="filter-container">
      <el-input v-model="listQuery_search.houseName" type="text" placeholder="输入姓名" style="width: 130px" class="filter-item" clearable />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch()">
        搜索
      </el-button>
    </div>

    <el-button v-waves class="filter-item" type="success" icon="el-icon-coin" @click="handleMoneyGetOutter">
      新增操作员信息
    </el-button>
    <br>
    <br>

    <!-- 缴款记录表格 -->
    <el-table highlight-current-row stripe border fit :data="tableData" style="width: 100%" height="800">
      <el-table-column label="ID" prop="id" align="center" width="50" fixed />
      <el-table-column label="编号" prop="adminId" align="center" />
      <el-table-column label="姓名" prop="adminName" align="center" />
      <el-table-column label="权限" prop="adminRole" align="center" />
      <el-table-column label="所属部门" prop="adminDepartment" align="center" />
      <el-table-column label="职位" prop="adminPosition" align="center" />
      <el-table-column label="修改信息" align="center" width="80" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="{row}">
          <!-- 收费按钮相对应的模态框以及函数暂未开发 -->
          <el-button type="primary" size="mini" @click="handleInfoChange(row.adminId)">
            修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 点击houseId弹出信息变更历史模态框 -->
    <el-dialog :visible.sync="dialogHouseLog" title="房屋信息变更历史">
      <el-table :data="pvData_all" fit highlight-current-row style="width: 100%">
        <el-table-column prop="houseId" label="房间号" />
        <el-table-column prop="houseName" label="业主姓名" />
        <el-table-column prop="housePhone" label="业主手机号" />
        <el-table-column prop="houseArea" label="住宅面积" />
        <el-table-column prop="basementArea" label="地下室面积" />
        <el-table-column prop="changeTime" label="变更时间" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogHouseLog = false">确定</el-button>
      </span>
    </el-dialog>

    <!-- 收费页面模态框 -->
    <el-dialog :visible.sync="dialogMoneyPost" title="费用收缴">
      <el-card class="box-card">
        <!-- 定义表单提交项 -->

        <!-- 选择单一缴费时的提交表单 -->
        <el-form ref="singleDataForm" :rules="singleformRules" :model="singleFormPost" label-width="80px">
          <el-form-item label="房间号" label-width="100px" prop="houseId">
            <el-input v-model="singleFormPost.houseId" placeholder="请输入单一完整房号（不要输入多个房号）" />
          </el-form-item>
          <el-form-item label="缴费方式" label-width="100px" prop="singlePayType">
            <el-select v-model="singleFormPost.singlePayType" placeholder="请选择">
              <el-option v-for="item in singlePayOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="缴费金额" label-width="100px" prop="singlePayMoney">
            <el-input v-model.number="singleFormPost.singlePayMoney" type="number" style="width: 200px" placeholder="请输入金额" />
          </el-form-item>
          <el-form-item label="备注" label-width="100px" prop="remark">
            <el-input v-model="singleFormPost.remark" type="textarea" placeholder="如有需要请输入不多于30字的备注" />
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="singleSubmitFormPost(singleFormPost)">提交</el-button>
            <el-button @click="CleanDataForm()">取消</el-button>
          </el-form-item>
        </el-form>

        <!-- 收费类型为特批时验证码模态框处理 -->
        <el-dialog width="40%" title="领导审批" style="top: 20%" :visible.sync="dialogSMSVisible" append-to-body>
          <el-input
            ref="smsCode"
            v-model="singleFormPost.smsCode"
            placeholder="请输入短信验证码"
            name="smsCode"
            type="number"
            tabindex="1"
            autocomplete="on"
          />
          <el-button class="show-sms" type="primary" :disabled="disabled=!show" style="width:175px;" @click="getSmsCode(singleSMSPost)">
            <span v-show="show">获取验证码</span>
            <span v-show="!show" class="count"> {{ count }} s</span>
          </el-button>
          <br>
          <br>
          <el-button type="success" @click="handleSMSPost(singleFormPost)">确定提交</el-button>
          <el-button @click="handleCleanSMS()">取消</el-button>
        </el-dialog>
      </el-card>
    </el-dialog>

    <!-- 分页功能实现标签 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery_all.page" @pagination="getList" />

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchTrashLogList, fetchTrashLogSearch, singleMoneyPost, fetchSearchByHouseId } from '@/api/payTrash'
import waves from '@/directive/waves' // waves directive
import { getLogByHouseId } from '@/api/operationLog'
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'TrashPay',
  directives: { waves },
  components: { Pagination },
  data() {
    return {
      show: true,
      count: '',
      payPattern: true,
      props: { multiple: true },
      dialogApproveSmsVisible: false,
      // 声明表格数据源
      tableData: [],
      pvData_all: [],
      // 声明分页变量
      total: 0,
      // search()查询请求变量
      listQuery_search: {
        houseId: null,
        houseName: null,
        dateRange: null
      },
      // list()查询请求变量
      listQuery_all: {
        page: 1
      },
      // 单一缴费时的选项
      singlePayOptions: [{ value: '支付宝', label: '支付宝' }, { value: '微信', label: '微信' }, { value: '现金', label: '现金' }, { value: '其他', label: '其他' }, { value: '特批', label: '特批' }],
      listLoading: true,
      // 调取短信验证码提交项目
      singleSMSPost: {
        houseId: null,
        adminId: this.$store.getters.adminId,
        payItem: '垃圾清运费'
      },
      // 单一缴费表单提交项目
      singleFormPost: {
        houseId: null,
        singlePayType: null,
        singlePayMoney: null,
        remark: null,
        payItem: '垃圾清运费',
        adminId: this.$store.getters.adminId,
        smsCode: null
      },
      // 单一收缴表单提交项目规则
      singleformRules: {
        houseId: [{ required: true, message: '请输入单一的完整房间号', trigger: 'change' }],
        singlePayType: [{ required: true, message: '请选择缴费方式', trigger: 'change' }],
        singlePayMoney: [{ required: true, message: '请输入收缴金额（纯数字）', type: 'number', trigger: 'blur' }]
      },
      // 短信验证码模态框
      dialogSMSVisible: false,
      // 收费页面模态框
      dialogMoneyPost: false,
      dialogHouseLog: false
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
      fetchTrashLogList(this.listQuery_all).then(response => {
        this.tableData = response.data.items
        this.total = response.total
      })
    },
    // 搜索记录
    handleSearch() {
      fetchTrashLogSearch(this.listQuery_search).then(response => {
        this.tableData = response.data.items
        this.total = response.total
      })
    },
    // 搜索框下面的收费按钮
    handleMoneyGetOutter() {
      this.singleFormPost.houseId = ''
      this.dialogMoneyPost = true
    },
    // 点击收费按钮
    handleMoneyGet(houseId) {
      console.log(houseId)
      this.singleFormPost.houseId = houseId
      this.dialogMoneyPost = true
    },
    // 单一收费提交收费表单
    singleSubmitFormPost(singleFormPost) {
      // 表单项规则验证
      this.$refs['singleDataForm'].validate((valid) => {
        if (valid) {
          // 收费类型为特批时验证码模态框处理
          if (this.singleFormPost.singlePayType === '特批') {
            this.dialogSMSVisible = true
          } else {
            // 操作确认框
            this.$confirm('确定提交么？', '费用收缴', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'info'
            }).then(() => {
              singleMoneyPost(singleFormPost).then(response => {
                if (response.codeStatus === 200) {
                  this.$notify({
                    title: 'Success',
                    message: '提交成功',
                    type: 'success',
                    duration: 2000
                  })
                  this.$nextTick(() => {
                    this.$refs['singleDataForm'].resetFields()
                    this.singleFormPost.smsCode = ''
                  })
                  this.dialogMoneyPost = false
                  fetchSearchByHouseId(singleFormPost.houseId).then(response => {
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
        }
      })
    },
    // 收费页面取消按钮
    CleanDataForm() {
      if (this.$refs['singleDataForm'] !== undefined) {
        this.$nextTick(() => {
          this.$refs['singleDataForm'].resetFields()
        })
      }
      this.dialogMoneyPost = false
    },
    // 点击houseId获取房间变更历史
    getHouseLog(houseId) {
      getLogByHouseId(houseId).then(response => {
        this.pvData_all = response.data.pvData
        this.dialogHouseLog = true
      })
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

<template>
  <!-- 报修管理 -->
  <div class="app-container">

    <!-- 顶部搜索框 -->
    <div class="filter-container">
      <el-select v-model="listQuery_search.currentStatus" placeholder="选择报修状态" clearable style="width: 250px" class="filter-item">
        <el-option v-for="item in currentStatusOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-input v-model="listQuery_search.houseId" type="text" placeholder="输入房号" style="width: 130px" class="filter-item" clearable />
      <el-date-picker
        v-model="listQuery_search.repairAddDate"
        class="filter-item"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
        value-format="yyyy-MM-dd"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch(listQuery_search.page = 1)">
        搜索
      </el-button>
    </div>

    <!-- 缴款记录表格 -->
    <el-table v-loading="listLoading" highlight-current-row stripe border fit :data="tableData" style="width: 100%" height="800">
      <el-table-column label="ID" prop="id" align="center" width="50" fixed />
      <el-table-column label="房号" prop="houseId" align="center" fixed>
        <template slot-scope="scope">
          <el-tag @click="getHouseLog(scope.row.houseId)">{{ scope.row.houseId }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="业主姓名" prop="houseName" align="center" fixed />
      <el-table-column label="业主手机号" prop="housePhone" align="center" fixed />
      <el-table-column label="报修图片" prop="repairPic" align="center" fixed />
      <el-table-column label="报修内容" prop="repairContent" align="center" width="200px" fixed>
        <template slot-scope="scope">
          <el-tag @click="getContentAll(scope.row.houseId, scope.row.repairAddDate)">{{ scope.row.repairContent }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="期望上门时间" prop="repairWishDate" align="center" fixed />
      <el-table-column label="提交报修时间" prop="repairAddDate" align="center" fixed />
      <el-table-column label="报修状态" prop="currentStatus" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.currentStatus === '业主已确认' ? 'success' : 'danger'" disable-transitions>{{ scope.row.currentStatus }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态变更" align="center" width="80" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleStatusChange(row.houseId, row.houseName, row.housePhone, row.repairContent, row.repairWishDate, row.repairAddDate, row.currentStatus)">
            变更
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 状态变更模态框 -->
    <el-dialog :visible.sync="dialogRepairStatus" width="20%" title="客户状态变更">
      <el-form ref="repairStatusForm" :model="repairStatusForm" label-width="80px">
        <el-form-item label="房号" label-width="100px" prop="houseId">
          <el-input v-model="repairStatusForm.houseId" disabled />
        </el-form-item>
        <el-form-item label="业主姓名" label-width="100px" prop="houseName">
          <el-input v-model="repairStatusForm.houseName" disabled />
        </el-form-item>
        <el-form-item label="	业主手机号" label-width="100px" prop="housePhone">
          <el-input v-model="repairStatusForm.housePhone" disabled />
        </el-form-item>
        <el-form-item label="报修内容" label-width="100px" prop="repairContent">
          <el-input v-model="repairStatusForm.repairContent" disabled />
        </el-form-item>
        <el-form-item label="期望上门时间" label-width="100px" prop="repairWishDate">
          <el-input v-model="repairStatusForm.repairWishDate" disabled />
        </el-form-item>
        <el-form-item label="	提交报修时间" label-width="100px" prop="repairAddDate">
          <el-input v-model="repairStatusForm.repairAddDate" disabled />
        </el-form-item>
        <el-form-item label="报修状态" label-width="100px" prop="currentStatus">
          <el-select v-model="repairStatusForm.currentStatus" placeholder="请选择">
            <el-option v-for="item in currentStatusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="repairStatusChangePost(repairStatusForm)">确定</el-button>
          <el-button @click="cancelStatusChange()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

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

    <!-- 点击报修详情模态框 -->
    <el-dialog :visible.sync="dialogRepairContent" title="报修详情">
      <span>{{ repairContent }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogRepairContent = false">确定</el-button>
      </span>
    </el-dialog>

    <!-- 分页功能实现标签 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery_search.page" @pagination="handleSearch" />

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchrepairList, repairSearch, getRepairContent, repairStatusChange } from '@/api/repairManage'
import waves from '@/directive/waves' // waves directive
import { getLogByHouseId } from '@/api/operationLog'
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'RepairManage',
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
        currentStatus: null,
        houseId: null,
        repairAddDate: null,
        page: null
      },
      // list()查询请求变量
      listQuery_all: {
        page: 1
      },
      overallRateOptions: ['5分', '4分', '3分', '2分', '1分'],
      // 时间选择器返回数据
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      listLoading: true,
      // 调取短信验证码提交项目
      singleSMSPost: {
        houseId: null,
        adminId: this.$store.getters.adminId,
        payItem: '住宅水费'
      },
      // 单一缴费表单提交项目
      singleFormPost: {
        houseId: null,
        singlePayType: null,
        singlePayMoney: null,
        remark: null,
        payItem: '住宅水费',
        adminId: this.$store.getters.adminId,
        smsCode: null
      },
      // 复合缴费表单提交项目
      mixFormPost: {
        houseId: null,
        mixPayType: [{
          name: 'mixPayAlipay', value: null
        },
        { name: 'mixPayWechat', value: null
        },
        { name: 'mixPayCash', value: null
        },
        { name: 'mixPayOther', value: null
        }],
        mixPayTotalNum: null,
        remark: null,
        payItem: '住宅水费',
        adminId: this.$store.getters.adminId
      },
      // 单一收缴表单提交项目规则
      singleformRules: {
        houseId: [{ required: true, message: '请输入单一的完整房间号', trigger: 'change' }],
        singlePayType: [{ required: true, message: '请选择缴费方式', trigger: 'change' }],
        singlePayMoney: [{ required: true, message: '请输入收缴金额（纯数字）', type: 'number', trigger: 'blur' }]
      },
      // 复合收缴表单提交项目规则
      mixformRules: {
        houseId: [{ required: true, message: '请输入单一的完整房间号', trigger: 'change' }]
        // singlePayType: [{ required: true, message: '请选择收费类型', trigger: 'change' }],
        // singlePayMoney: [{ required: true, message: '请输入收缴金额（纯数字）', type: 'number', trigger: 'blur' }]
      },
      // 短信验证码模态框
      dialogSMSVisible: false,
      // 收费页面模态框
      dialogMoneyPost: false,
      dialogHouseLog: false,
      dialogRepairContent: false,
      suggestDetail: '',
      dialogRepairStatus: false,
      currentStatusOptions: ['已提交报修', '已分配维修员', '已维修完成', '业主已确认'],
      repairStatusForm: {
        houseId: null,
        houseName: null,
        housePhone: null,
        repairContent: null,
        repairWishDate: null,
        repairAddDate: null,
        currentStatus: null
      }
    }
  },
  computed: {
    ...mapGetters([
      'adminName',
      'adminId',
      'roles'
    ]),
    mixPayTotal: function() {
      var sum = 0
      this.mixFormPost.mixPayType.forEach((v, i) => {
        if (v.value === '') {
          v.value = 0
        }
        parseInt(v.value)
        sum += v.value
      })
      parseInt(sum)
      return sum
    },
    payPatternChange() {
      return this.payPattern
    }
  },
  watch: {
    payPatternChange(val) {
      if (this.$refs['singleDataForm'] !== undefined) {
        this.$refs['singleDataForm'].clearValidate()
      }
      if (this.$refs['mixDataForm'] !== undefined) {
        this.$refs['mixDataForm'].clearValidate()
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取表格数据
    getList() {
      this.listLoading = true
      fetchrepairList(this.listQuery_all).then(response => {
        this.tableData = response.data.items
        this.total = response.total
        this.listLoading = false
      })
    },
    // 搜索记录
    handleSearch() {
      this.listLoading = true
      repairSearch(this.listQuery_search).then(response => {
        this.tableData = response.data.items
        this.total = response.total
        this.listLoading = false
      })
    },
    // 点击houseId获取房间变更历史
    getHouseLog(houseId) {
      getLogByHouseId(houseId).then(response => {
        this.pvData_all = response.data.pvData
        this.dialogHouseLog = true
      })
    },
    // 点击报修内容获取详情
    getContentAll(houseId, repairAddDate) {
      getRepairContent(houseId, repairAddDate).then(response => {
        this.repairContent = response.data.repairContent
        this.dialogRepairContent = true
      })
    },
    // 报修状态变更
    handleStatusChange(houseId, houseName, housePhone, repairContent, repairWishDate, repairAddDate, currentStatus) {
      this.repairStatusForm.houseId = houseId
      this.repairStatusForm.houseName = houseName
      this.repairStatusForm.housePhone = housePhone
      this.repairStatusForm.repairContent = repairContent
      this.repairStatusForm.repairWishDate = repairWishDate
      this.repairStatusForm.repairAddDate = repairAddDate
      this.repairStatusForm.currentStatus = currentStatus
      this.dialogRepairStatus = true
    },
    cancelStatusChange() {
      this.dialogRepairStatus = false
    },
    repairStatusChangePost(repairStatusForm) {
      console.log(repairStatusForm)
      repairStatusChange(repairStatusForm).then(response => {
        if (response.codeStatus === 200) {
          this.$notify({
            title: 'Success',
            message: '提交成功',
            type: 'success',
            duration: 2000
          })
          this.dialogRepairStatus = false
          this.getList()
        } else {
          this.$notify({
            title: 'Failure',
            message: '提交失败，请联系系统管理员',
            type: 'error',
            duration: 3000
          })
        }
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

<template>
  <!-- 住宅装修保证金收费界面 -->
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery_search.houseId" type="text" placeholder="输入房间号" style="width: 130px" class="filter-item" clearable />
      <el-input v-model="listQuery_search.houseName" type="text" placeholder="输入业主姓名" style="width: 130px" class="filter-item" clearable />
      <el-select v-model="listQuery_search.year" placeholder="选择年份" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in yearOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <!-- 时间选择器 -->
      <el-date-picker
        v-model="listQuery_search.datePicker"
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
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <el-button v-waves class="filter-item" type="success" icon="el-icon-coin" @click="handleMoneyGet">
      费用收缴
    </el-button>

    <br>
    <br>

    <!-- 表格 -->
    <el-table highlight-current-row stripe border fit :data="tableData" style="width: 100%" height="800">
      <el-table-column label="ID" prop="id" align="center" width="50" fixed />
      <el-table-column label="房号" prop="houseId" align="center" fixed />
      <el-table-column label="业主姓名" prop="houseName" align="center" fixed />
      <el-table-column label="交款日期" prop="paidDate" align="center" />
      <el-table-column label="实收金额" prop="moneyGet" align="center" />
      <el-table-column label="退款日期" prop="moneyReturnDate" align="center" />
      <el-table-column label="退款金额" prop="moneyReturnNum" align="center" />
      <el-table-column label="差额" prop="gap" align="center" />
      <el-table-column label="备注" prop="remark" align="center" />
      <el-table-column label="退款" align="center" width="80" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="{row}">
          <!-- 收费按钮相对应的模态框以及函数暂未开发 -->
          <el-button type="primary" size="mini" @click="handleMoneyReturn(row.houseId)">
            退款
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 费用收缴按钮的模态框 -->
    <el-dialog :visible.sync="dialogMoneyGetFormVisible" title="费用收缴">

      <!-- 定义表单提交项 -->
      <el-card class="box-card">
        <el-form ref="dataForm" :rules="formRules" :model="formPost" label-width="80px">
          <el-form-item label="房号" prop="houseId">
            <el-input v-model="formPost.houseId" placeholder="请输入房号（多个房间请用'/'间隔；如16-101/16-102" />
          </el-form-item>
          <el-form-item label="客户姓名" prop="houseName">
            <el-input v-model="formPost.houseName" />
          </el-form-item>
          <el-form-item label="实收金额" prop="moneyGet">
            <el-input v-model.number="formPost.moneyGet" />
          </el-form-item>
          <el-form-item label="差额" prop="gap">
            <el-input v-model="formPost.moneyGet" disabled />
          </el-form-item>
          <el-form-item label="交款方式" prop="payType">
            <el-radio-group v-model="formPost.payType">
              <el-radio label="支付宝" />
              <el-radio label="微信" />
              <el-radio label="现金" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="交款日期" prop="paidDate">
            <div class="block">
              <el-date-picker v-model="formPost.paidDate" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions" value-format="yyyy-MM-dd" />
            </div>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="formPost.remark" type="textarea" placeholder="如有需要请输入不多于30字的备注" />
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="handleSubmitForm(formPost)">提交</el-button>
            <el-button @click="handleCleanDataForm()">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-dialog>

    <!-- 分页功能实现标签 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery_all.page" @pagination="getList" />
  </div>
</template>

<script>
import { fetchHouseDecorationDepositListAll, fetchHouseDecorationDepositSearch, postMoney, fetchSearchByHouseId } from '@/api/payDecorationDeposit'
import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'DecorationDepositPay',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      listLoading: true,
      total: 0,
      // 定义搜索按钮的query字段
      listQuery_search: {
        page: 1,
        houseId: undefined,
        year: undefined,
        houseName: undefined,
        datePicker: undefined
      },
      titles: [{ 'ID': 'id' }, { '房号': 'houseId' }, { '业主姓名': 'houseName' }],
      // 年份选择
      yearOptions: ['2020', '2019', '2018', '2017', '2016', '2015'],
      // list接口请求参数
      listQuery_all: {
        page: 1,
        year: 2020
      },
      formPost: {
        houseId: undefined,
        houseName: '',
        paidDate: '',
        moneyGet: '',
        payType: '',
        remark: '',
        gap: ''
      },
      // 定义表单提交项目规则
      formRules: {
        houseId: [{ required: true, message: '请输入房号（多个房间请用"/"间隔；如16-101/16-102）', trigger: 'blur' }],
        houseName: [{ required: true, message: '请输入客户姓名' }],
        moneyGet: [{ required: true, message: '请输入实收金额(纯数字)', type: 'number', trigger: 'blur' }],
        paidDate: [{ required: true, message: '请选择交款日期', trigger: 'blur' }],
        payType: [{ required: true, message: '请选择费用收缴方式', trigger: 'blur' }]
      },
      dialogMoneyGetFormVisible: false,
      // 声明下api变量
      tableData: [],
      // 时间选择器返回数据
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      }
    //   date_picker: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      fetchHouseDecorationDepositListAll(this.listQuery_all).then(response => {
        this.tableData = response.data.items
        this.total = response.total
      })
    },
    // 根据选定信息搜索
    fetchListSearch() {
      fetchHouseDecorationDepositSearch(this.listQuery_search).then(response => {
        this.tableData = response.data.items
      })
    },
    handleFilter() {
      // 搜索功能调用
      this.fetchListSearch()
    },
    handleMoneyGet() {
      this.dialogMoneyGetFormVisible = true
    },
    handleMoneyReturn(houseId) {
      this.formPost.houseId = houseId
      console.log(this.formPost.houseId)
      this.dialogMoneyGetFormVisible = true
    },
    handleSubmitForm(formPost) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$confirm('确定提交么？', '费用收缴', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          }).then(() => {
            console.log('formPost-----')
            console.log(formPost)
            postMoney(formPost).then(response => {
              if (response.codeStatus === 200) {
                this.$notify({
                  title: 'Success',
                  message: '提交成功',
                  type: 'success',
                  duration: 2000
                })
                this.dialogMoneyGetFormVisible = false
                this.$nextTick(() => {
                  this.$refs['dataForm'].resetFields()
                })
                // 逻辑可能存在问题，比如id如何传到页面上
                // 暂未测试
                // 提交表单成功后跳转到指定houseid的搜索页面，返回提交房间表单的所有状态信息
                fetchSearchByHouseId(formPost.houseId).then(response => {
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
    handleCleanDataForm() {
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
      this.dialogMoneyGetFormVisible = false
    }
  }
}
</script>

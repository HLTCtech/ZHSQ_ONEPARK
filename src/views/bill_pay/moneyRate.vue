<template>
  <!-- 费率变更 -->
  <div class="app-container">

    <!-- 顶部搜索框 -->
    <div class="filter-container">
      <el-input v-model="listQuery_search.houseId" type="text" placeholder="输入房号" style="width: 130px" class="filter-item" clearable />
      <el-input v-model="listQuery_search.houseName" type="text" placeholder="输入业主姓名" style="width: 130px" class="filter-item" clearable />
      <el-select v-model="listQuery_search.houseType" placeholder="选择房屋类型" clearable style="width: 150px" class="filter-item">
        <el-option v-for="item in houseTypeOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <el-button v-waves class="filter-item" type="success" icon="el-icon-coin" @click="foreignRateChange">
      洋房费率变更
    </el-button>
    <el-button v-waves class="filter-item" type="success" icon="el-icon-coin" @click="quintaRateChange">
      合院费率变更
    </el-button>
    <br>
    <br>

    <!-- 缴款记录表格 -->
    <el-table v-loading="listLoading" highlight-current-row stripe border fit :data="tableData" style="width: 100%" height="800">
      <el-table-column label="ID" prop="id" align="center" width="50" fixed />
      <el-table-column label="房号" prop="houseId" align="center" fixed>
        <template slot-scope="scope">
          <el-tag @click="getHouseLog(scope.row.houseId)">{{ scope.row.houseId }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="业主姓名" prop="houseName" align="center" fixed />
      <el-table-column label="业主电话" prop="housePhone" align="center" fixed />
      <el-table-column label="房间类型" prop="houseType" align="center" fixed />
      <el-table-column label="房间状态" prop="houseStatus" align="center" fixed />
      <el-table-column label="物业费" prop="propertyRate" align="center" />
      <el-table-column label="停车管理费" prop="parkingRate" align="center" />
      <el-table-column label="电费" prop="electricRate" align="center" />
      <el-table-column label="水费" prop="waterRate" align="center" />
      <el-table-column label="暖气费" prop="heatRate" align="center" />
      <el-table-column label="装修保证金" prop="decorationRate" align="center" />
      <el-table-column label="垃圾清运费" prop="trashRate" align="center" />
      <el-table-column label="出入证押金" prop="passRate" align="center" />
      <el-table-column label="出入证工本费" prop="passMadeRate" align="center" />
      <el-table-column label="有限电视" prop="tvRate" align="center" />
      <el-table-column label="智能卡工本费" prop="smartCardRate" align="center" />
      <el-table-column label="蓝牙卡工本费" prop="btCardRate" align="center" />
      <el-table-column label="对外保洁" prop="cleanRate" align="center" />
      <el-table-column label="电动车充电" prop="evBikeRate" align="center" />
      <el-table-column label="温泉水卡补卡" prop="hotWaterRate" align="center" />
      <el-table-column label="车位锁工本费" prop="parkingLockRate" align="center" />
      <el-table-column label="室内开荒" prop="indoorCleanRate" align="center" />
      <el-table-column label="蓝牙卡电池" prop="btCardRate" align="center" />
      <el-table-column label="营业外收入" prop="outerIncomeRate" align="center" />
      <el-table-column label="电梯广告费" prop="liftRate" align="center" />
      <el-table-column label="自动售货机" prop="automatRate" align="center" />
      <el-table-column label="费率变更" align="center" width="80" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="{row}">
          <!-- 收费按钮相对应的模态框以及函数暂未开发 -->
          <el-button type="primary" size="mini" @click="handleMoneyGet(row)">
            变更费率
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

    <!-- 洋房费率变更模态框 -->
    <el-dialog :visible.sync="dialogForeignRateChange" title="洋房费率变更">
      <el-card class="box-card">

        <el-form ref="foreignRateChangeFormPost" :rules="foreignRateChangeFormRules" :model="foreignRateChangeForm" label-width="80px">
          <el-form-item label="费用类型" label-width="100px" prop="moneyType">
            <el-select v-model="foreignRateChangeForm.moneyType" placeholder="请选择">
              <el-option v-for="item in moneyTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="变更后费率" label-width="100px" prop="changedRate">
            <el-input v-model.number="foreignRateChangeForm.changedRate" type="number" style="width: 200px" placeholder="请输入金额" />
          </el-form-item>
          <el-form-item label="备注" label-width="100px" prop="remark">
            <el-input v-model="foreignRateChangeForm.remark" type="textarea" placeholder="如有需要请输入不多于30字的备注" />
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="foreignRateChangeFormPost(foreignRateChangeForm)">提交</el-button>
            <el-button @click="CleanDataForm()">取消</el-button>
          </el-form-item>
        </el-form>

      </el-card>
    </el-dialog>

    <!-- 合院费率变更模态框 -->
    <el-dialog :visible.sync="dialogQuintaRateChange" title="合院费率变更">
      <el-card class="box-card">

        <el-form ref="quintaChangeFormPost" :rules="quintaChangeFormRules" :model="quintaRateChangeForm" label-width="80px">
          <el-form-item label="费用类型" label-width="100px" prop="moneyType">
            <el-select v-model="quintaRateChangeForm.moneyType" placeholder="请选择">
              <el-option v-for="item in moneyTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="变更后费率" label-width="100px" prop="changedRate">
            <el-input v-model.number="quintaRateChangeForm.changedRate" type="number" style="width: 200px" placeholder="请输入金额" />
          </el-form-item>
          <el-form-item label="备注" label-width="100px" prop="remark">
            <el-input v-model="quintaRateChangeForm.remark" type="textarea" placeholder="如有需要请输入不多于30字的备注" />
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="quintaRateChangeFormPost(quintaRateChangeForm)">提交</el-button>
            <el-button @click="CleanDataForm()">取消</el-button>
          </el-form-item>
        </el-form>

      </el-card>
    </el-dialog>

    <!-- 指定房间费率变更模态框 -->
    <el-dialog :visible.sync="dialogMoneyRateChange" title="费率变更">
      <el-card class="box-card">

        <el-form ref="rateChangeFormPost" :rules="rateChangeFormRules" :model="rateChangeForm" label-width="80px">
          <el-form-item label="房间号" label-width="100px" prop="houseId">
            <el-input v-model="rateChangeForm.houseId" placeholder="请输入单一完整房号（不要输入多个房号）" />
          </el-form-item>
          <el-form-item label="业主姓名" label-width="100px" prop="houseName">
            <el-input v-model="rateChangeForm.houseName" placeholder="请输入业主姓名" />
          </el-form-item>
          <el-form-item label="费用类型" label-width="100px" prop="moneyType">
            <el-select v-model="rateChangeForm.moneyType" placeholder="请选择">
              <el-option v-for="item in moneyTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="变更后费率" label-width="100px" prop="changedRate">
            <el-input v-model.number="rateChangeForm.changedRate" type="number" style="width: 200px" placeholder="请输入金额" />
          </el-form-item>
          <el-form-item label="备注" label-width="100px" prop="remark">
            <el-input v-model="rateChangeForm.remark" type="textarea" placeholder="如有需要请输入不多于30字的备注" />
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="rateChangeFormPost(rateChangeForm)">提交</el-button>
            <el-button @click="CleanDataForm()">取消</el-button>
          </el-form-item>
        </el-form>

      </el-card>
    </el-dialog>

    <!-- 分页功能实现标签 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery_search.page" @pagination="fetchListSearch" />
  </div>
</template>

<script>
import { fetchMoneyRateList, rateChangePost, foreignRateChangePost, quintaRateChangePost, fetchMoneyRateSearch } from '@/api/moneyRateChange'
import waves from '@/directive/waves' // waves directive
import { getLogByHouseId } from '@/api/operationLog'
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import permission from '@/directive/permission/index.js' // 权限判断指令

export default {
  name: 'RateChange',
  directives: { waves, permission },
  components: { Pagination },
  data() {
    return {
      show: true,
      count: '',
      searchByHouseId: null,
      moneyPayHouseName: null,
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
        houseType: null,
        page: 1
      },
      // list()查询请求变量
      listQuery_all: {
        houseId: null,
        houseName: null,
        page: 1
      },
      houseTypeOptions: ['洋房', '合院'],
      payOptionsReturn: [{ value: '支付宝', label: '支付宝' }, { value: '微信', label: '微信' }, { value: '现金', label: '现金' }, { value: '其他', label: '其他' }],
      moneyStatusOptions: ['申请中', '核对通过', '申请驳回', '已退款'],
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
      moneyTypeOptions: [{ value: '物业费', label: '物业费' }, { value: '停车管理费', label: '停车管理费' }, { value: '电费', label: '电费' }, { value: '水费', label: '水费' }, { value: '暖气费', label: '暖气费' }, { value: '装修保证金', label: '装修保证金' }, { value: '垃圾清运费', label: '垃圾清运费' }, { value: '出入证押金', label: '出入证押金' }, { value: '出入证工本费', label: '出入证工本费' }, { value: '有限电视', label: '有限电视' }, { value: '智能卡工本费', label: '智能卡工本费' }, { value: '蓝牙卡工本费', label: '蓝牙卡工本费' }, { value: '对外保洁', label: '对外保洁' }, { value: '电动车充电', label: '电动车充电' }, { value: '温泉水卡补卡', label: '温泉水卡补卡' }, { value: '车位锁工本费', label: '车位锁工本费' }, { value: '室内开荒', label: '室内开荒' }, { value: '蓝牙卡电池', label: '蓝牙卡电池' }, { value: '营业外收入', label: '营业外收入' }, { value: '电梯广告费', label: '电梯广告费' }, { value: '自动售货机', label: '自动售货机' }],
      listLoading: true,
      // 调取短信验证码提交项目
      singleSMSPost: {
        houseId: null,
        adminId: this.$store.getters.adminId,
        payItem: '住宅暖气'
      },
      // 费率变更表单提交项目
      rateChangeForm: {
        houseId: null,
        houseName: null,
        moneyType: null,
        changedRate: null,
        remark: null,
        adminId: this.$store.getters.adminId
      },
      // 洋房费率变更表单提交
      foreignRateChangeForm: {
        moneyType: null,
        changedRate: null,
        remark: null,
        adminId: this.$store.getters.adminId
      },
      // 合院费率变更表单提交
      quintaRateChangeForm: {
        moneyType: null,
        changedRate: null,
        remark: null,
        adminId: this.$store.getters.adminId
      },
      // 费率变更表单提交规则
      rateChangeFormRules: {
        houseId: [{ required: true, message: '请输入单一的完整房间号', trigger: 'change' }],
        moneyType: [{ required: true, message: '请选择变更的费用类型', trigger: 'change' }],
        changedRate: [{ required: true, message: '请输入变更后的费率', type: 'number', trigger: 'blur' }]
      },
      // 洋房变更规则
      foreignRateChangeFormRules: {
        moneyType: [{ required: true, message: '请选择变更的费用类型', trigger: 'change' }],
        changedRate: [{ required: true, message: '请输入变更后的费率', type: 'number', trigger: 'blur' }]
      },
      // 合院变更规则
      quintaChangeFormRules: {
        moneyType: [{ required: true, message: '请选择变更的费用类型', trigger: 'change' }],
        changedRate: [{ required: true, message: '请输入变更后的费率', type: 'number', trigger: 'blur' }]
      },
      // 短信验证码模态框
      dialogSMSVisible: false,
      // 收费页面模态框
      dialogMoneyRateChange: false,
      dialogHouseLog: false,
      dialogForeignRateChange: false,
      dialogQuintaRateChange: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取表格数据
    getList() {
      this.listLoading = true
      fetchMoneyRateList(this.listQuery_all).then(response => {
        this.tableData = response.data.items
        this.total = response.total
        this.listLoading = false
      })
    },
    // 根据选定信息搜索
    fetchListSearch() {
      this.listLoading = true
      fetchMoneyRateSearch(this.listQuery_search).then(response => {
        this.tableData = response.data.items
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listLoading = true
      // 搜索功能调用
      this.listQuery_search.page = 1
      fetchMoneyRateSearch(this.listQuery_search).then(response => {
        this.tableData = response.data.items
        this.listLoading = false
      })
    },
    // 费率变更按钮
    handleMoneyGet(row) {
      this.rateChangeForm.houseId = row.houseId
      this.rateChangeForm.houseName = row.houseName
      this.dialogMoneyRateChange = true
    },
    // 洋房费率变更
    foreignRateChange() {
      this.dialogForeignRateChange = true
    },
    // 合院费率变更
    quintaRateChange() {
      this.dialogQuintaRateChange = true
    },
    // 洋房费率变更提交
    foreignRateChangeFormPost(foreignRateChangeForm) {
      // 表单项规则验证
      this.$refs['foreignRateChangeFormPost'].validate((valid) => {
        if (valid) {
          // 操作确认框
          this.$confirm('确定提交么？', '费用收缴', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          }).then(() => {
            foreignRateChangePost(foreignRateChangeForm).then(response => {
              if (response.codeStatus === 200) {
                this.$notify({
                  title: 'Success',
                  message: '提交成功',
                  type: 'success',
                  duration: 2000
                })
                this.$nextTick(() => {
                  this.$refs['foreignRateChangeFormPost'].resetFields()
                })
                // 同时清空表单
                this.foreignRateChangeForm.moneyType = null
                this.foreignRateChangeForm.changedRate = null
                this.foreignRateChangeForm.remark = null
                this.dialogForeignRateChange = false
                fetchMoneyRateList(this.listQuery_all).then(response => {
                  this.tableData = response.data.items
                  this.total = response.total
                  this.listLoading = false
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
    // 合院费率变更提交
    quintaRateChangeFormPost(quintaRateChangeForm) {
      // 表单项规则验证
      this.$refs['quintaChangeFormPost'].validate((valid) => {
        if (valid) {
          // 操作确认框
          this.$confirm('确定提交么？', '费用收缴', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          }).then(() => {
            quintaRateChangePost(quintaRateChangeForm).then(response => {
              if (response.codeStatus === 200) {
                this.$notify({
                  title: 'Success',
                  message: '提交成功',
                  type: 'success',
                  duration: 2000
                })
                this.$nextTick(() => {
                  this.$refs['quintaChangeFormPost'].resetFields()
                })
                // 同时清空表单
                this.quintaRateChangeForm.moneyType = null
                this.quintaRateChangeForm.changedRate = null
                this.quintaRateChangeForm.remark = null
                this.dialogQuintaRateChange = false
                fetchMoneyRateList(this.listQuery_all).then(response => {
                  this.tableData = response.data.items
                  this.total = response.total
                  this.listLoading = false
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
    // 费率变更表单提交
    rateChangeFormPost(rateChangeForm) {
      // 表单项规则验证
      this.$refs['rateChangeFormPost'].validate((valid) => {
        if (valid) {
          // 操作确认框
          this.$confirm('确定提交么？', '费用收缴', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          }).then(() => {
            rateChangePost(rateChangeForm).then(response => {
              if (response.codeStatus === 200) {
                this.$notify({
                  title: 'Success',
                  message: '提交成功',
                  type: 'success',
                  duration: 2000
                })
                this.$nextTick(() => {
                  this.$refs['rateChangeFormPost'].resetFields()
                })
                // 同时清空表单
                this.rateChangeForm.houseId = null
                this.rateChangeForm.moneyType = null
                this.rateChangeForm.changedRate = null
                this.rateChangeForm.remark = null
                this.dialogMoneyRateChange = false
                fetchMoneyRateList(this.listQuery_all).then(response => {
                  this.tableData = response.data.items
                  this.total = response.total
                  this.listLoading = false
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
    // 收费页面取消按钮
    CleanDataForm() {
      if (this.$refs['rateChangeFormPost'] !== undefined) {
        this.$nextTick(() => {
          this.$refs['rateChangeFormPost'].resetFields()
        })
      }
      this.rateChangeForm.houseId = null
      this.rateChangeForm.moneyType = null
      this.rateChangeForm.changedRate = null
      this.rateChangeForm.remark = null
      this.foreignRateChangeForm.moneyType = null
      this.foreignRateChangeForm.changedRate = null
      this.foreignRateChangeForm.remark = null
      this.quintaRateChangeForm.moneyType = null
      this.quintaRateChangeForm.changedRate = null
      this.quintaRateChangeForm.remark = null
      this.dialogMoneyRateChange = false
      this.dialogForeignRateChange = false
      this.dialogQuintaRateChange = false
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
